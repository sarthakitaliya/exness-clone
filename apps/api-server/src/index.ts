import express from 'express';
import authRouter from "./routes/auth.route"
import candlesRouter from "./routes/candles.route"
import cors from 'cors';

const app = express();


app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}))

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/candles", candlesRouter);

app.listen(3001, () => {
  console.log('API server listening on port 3001');
});