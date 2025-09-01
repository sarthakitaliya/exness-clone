import type { Request, Response } from "express";
import { pool } from "../db/pool";

export const getCandles = async (req: Request, res: Response) => {
  try {
    const { asset, ts } = req.query;

    let table;
    if (ts === "1m") table = "candles_1m";
    if (ts === "5m") table = "candles_5m";
    if (ts === "15m") table = "candles_15m";
    if (ts === "30m") table = "candles_30m";
    if (ts === "1h") table = "candles_1h";
    if (ts === "1d") table = "candles_1d";
    if (!table) {
      return res.status(400).json({ error: "Invalid time interval" });
    }
    const result = await pool.query(
      `SELECT EXTRACT(EPOCH FROM bucket)::int AS time,
        open, high, low, close
        FROM ${table}
        WHERE symbol = $1
        ORDER BY bucket ASC
        LIMIT 100`,
      [asset]
    );

    const candles = result.rows.map((row: any) => ({
      time: row.time,
      open: row.open / Math.pow(10, 4),
      high: row.high / Math.pow(10, 4),
      low: row.low / Math.pow(10, 4),
      close: row.close / Math.pow(10, 4),
    }));
    res.json({ candles });
  } catch (error: Error | any) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
