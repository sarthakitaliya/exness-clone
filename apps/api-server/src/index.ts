import express from 'express';
import userRouter from "./routes/user.route"
import candlesRouter from "./routes/candles.route"
import tradeRouter from "./routes/trade.route"
import cors from 'cors';
import cookieParser from "cookie-parser"

const app = express();
  
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}))

app.use("/api/v1/user", userRouter);
app.use("/api/v1/candles", candlesRouter);
app.use("/api/v1/trade", tradeRouter);

app.listen(3001, () => {
  console.log('API server listening on port 3001');
});