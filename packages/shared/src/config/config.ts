import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  binance: {
    baseUrl: "wss://stream.binance.com:9443/stream",
    symbols: [
      { binance: "btcusdt", symbol: "BTC", decimals: 4 },
      { binance: "ethusdt", symbol: "ETH", decimals: 4 },
      { binance: "solusdt", symbol: "SOL", decimals: 6 },
    ],
  },
  backend: {
    apiUrl: process.env.BACKEND_API_URL || "http://localhost:3001/api/v1",
  },
  ws: {
    port: process.env.WS_PORT || 8080,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your_jwt_secret",
  },
  db: {
    timeScaleUrl:
      process.env.TIMESCALE_URL ||
      "postgresql://postgres:postgres@localhost:5432/trading",
  },
  redis: {
    redisUrl: process.env.REDIS_URL,
    redisStream: "price:tick",
    pubSubChannel: "price:updates",
  },
};
