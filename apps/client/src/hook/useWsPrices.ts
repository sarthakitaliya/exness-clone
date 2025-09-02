import { useEffect, useRef, useState } from "react";

export const useWsPrices = (
  symbol: string,
  onPrice?: (price: number, ts: number) => void
) => {
  const [tick, setTick] = useState<any | null>(null);
  const [bidAsk, setBidAsk] = useState<Record<string, any>>({});
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080"); // your backend WS
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "subscribe", symbol }));
    };

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.symbol === symbol && data.type === "trade") {
        setTick(data);
        if (onPrice) onPrice(data.price, data.timestamp);
      }
      if (data.type === "bid-ask") {
        setBidAsk((prev) => ({
          ...prev,
          [data.symbol]: data,
        }));
      }
    };

    ws.onclose = () => console.log("WS disconnected");
    ws.onerror = (err) => console.error("WS error", err);

    return () => ws.close();
  }, [symbol]);

  return { tick, bidAsk };
};
