import { CONFIG, publish } from "@exness/shared";
import WebSocket from "ws";
import { insertBulkTrade } from "./db/db";

export interface Data {
  time: string;
  symbol: string;
  trade_id: string;
  price: number;
  quantity: number;
}

export class PricePoller {
  private ws?: WebSocket;
  private dataArr: Data[] = [];

  start() {
    const streams = CONFIG.binance.symbols
      .map((s) => `${s.binance}@trade`)
      .join("/");
    const url = `${CONFIG.binance.baseUrl}?streams=${streams}`;
    this.ws = new WebSocket(url);
    console.log(`Connecting to Binance WebSocket: ${url}`);

    this.ws.on("open", () => console.log("Price Poller connected"));
    this.ws.on("message", (data: any) => this.onMessage(data));
    this.ws.on("error", (error: any) => {
      console.error("WebSocket error:", error);
      this.reconnect();
    });
    this.ws.on("close", () => this.reconnect());
  }

  private onMessage(buff: WebSocket.RawData) {
    const msg = JSON.parse(buff.toString());
      
    if (msg && msg.data) {
      const { E, s, t, p, q } = msg.data;
      const data = { time: E, symbol: s, trade_id: t, price: p, quantity: q };
      this.dataArr.push(data);

      publish(CONFIG.redis.pubSubChannel, JSON.stringify(data));
      if (this.dataArr.length >= 500) {
        insertBulkTrade(this.dataArr);
        this.dataArr = [];
        console.log("done");
        
      }
    }
  
  }

  private reconnect() {
    console.log("Price Poller reconnecting in 2s...");
    setTimeout(() => this.start(), 2000);
  }
}
