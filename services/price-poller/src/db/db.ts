import { Pool } from 'pg';
import { toInt } from '../handlers';
import type { Data } from '../poller';

interface tradedata{
  E: number; 
  s: string; 
  t: number; 
  p: number; 
  q: number; 
}

const dbConfig = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'trading',
};

const dbpool = new Pool(dbConfig);

const table_name = 'trades';

const candle_intervals = [
  { name: 'candles_1m', interval: '1 minute' },
  { name: 'candles_5m', interval: '5 minutes' },
  { name: 'candles_15m', interval: '15 minutes' },
  { name: 'candles_30m', interval: '30 minutes' },
  { name: 'candles_1h', interval: '1 hour' },
  { name: 'candles_1d', interval: '1 day' },
];

export async function setupdatabase() {
  const client = await dbpool.connect();
  console.log('Connected to PostgreSQL.');

  try {
    await client.query('CREATE EXTENSION IF NOT EXISTS timescaledb;');

    // drop old cagg + table
    for (const { name } of candle_intervals) {
      await client.query(`DROP MATERIALIZED VIEW IF EXISTS ${name} CASCADE;`);
    }
    await client.query(`DROP TABLE IF EXISTS ${table_name} CASCADE;`);

    // reinitialize table
    await client.query(`
      CREATE TABLE ${table_name} (
        time        timestamptz NOT NULL,
        symbol      varchar(20) NOT NULL,
        trade_id    bigint      NOT NULL,
        price       bigint      NOT NULL,
        quantity    bigint      NOT NULL,
        PRIMARY KEY (time, symbol, trade_id)
      );
    `);

    await client.query(`
      SELECT create_hypertable(
        '${table_name}',
        'time',
        chunk_time_interval => INTERVAL '1 minute',
        if_not_exists => TRUE
      );
    `);

    // create continuous aggregates
    for (const { name, interval } of candle_intervals) {
      console.log(`creating cagg: ${name}`);

      await client.query(`
        CREATE MATERIALIZED VIEW ${name}
        WITH (timescaledb.continuous) AS
        SELECT
          time_bucket('${interval}', time) AS bucket,
          symbol,
          first(price, time) AS open,
          max(price) AS high,
          min(price) AS low,
          last(price, time) AS close,
          sum(quantity) AS volume
        FROM ${table_name}
        GROUP BY bucket, symbol;
      `);

      await client.query(`
        SELECT add_continuous_aggregate_policy('${name}',
          start_offset => INTERVAL '7 days',
          end_offset   => INTERVAL '1 minute',
          schedule_interval => INTERVAL '1 minute'
        );
      `);
    }

    console.log('completed.');
  } catch (err: any) {
    console.log('error in db setup:', err.message);
  } finally {
    client.release();
  }
}

export async function inserttrade(tradedata: tradedata) {
  const { E, s, t, p, q } = tradedata;
  try {
    const time = new Date(E);

    await dbpool.query(
      `INSERT INTO ${table_name} (time, symbol, trade_id, price, quantity)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (time, symbol, trade_id) DO NOTHING;`,
      [time, s, t, toInt(p, 6), toInt(q, 2)]
    );
  } catch (err: any) {
    console.log('error in insertion', err.message);
  }
}

export async function insertBulkTrade(tradeData: Data []) {
  if (tradeData.length === 0) return;

  const values: any[] = [];
  const placeholders: string[] = [];

  tradeData.forEach((trade, i) => {
    const idx = i * 5;
    placeholders.push(
      `($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5})`
    );
    values.push(
      new Date(trade.time),
      trade.symbol,
      trade.trade_id,
      toInt(trade.price, 4),
      toInt(trade.quantity, 4)
    );
  });

  const query = `
      INSERT INTO ${table_name} (time, symbol, trade_id, price, quantity)
      VALUES ${placeholders.join(', ')}
      ON CONFLICT (time, symbol, trade_id) DO NOTHING;
    `;

  try {
    await dbpool.query(query, values);
  } catch (err) {
    console.error('error in bulk save', err);
  }
} 