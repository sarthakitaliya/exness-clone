"use client";
import { useEffect, useState } from "react";
import {
  CandlestickSeries,
  Chart,
  TimeScale,
  TimeScaleFitContentTrigger,
} from "lightweight-charts-react-components";
import type { CandlestickData, UTCTimestamp } from "lightweight-charts";
import { useCandleData } from "@/hook/useCandleData";
import { useWsPrices } from "@/hook/useWsPrices";

const ChartC = ({ symbol, interval, width, height }: { symbol: string; interval: string; width: number; height: number }) => {
  const [data, setData] = useState<CandlestickData[]>([]);
  const { loading, candleData } = useCandleData({ asset: symbol, interval });
  const { tick } = useWsPrices(symbol);

  useEffect(() => {
    if (!loading) {
      setData(candleData);
    }
  }, [loading, candleData]);

  useEffect(() => {
    if (!tick) return;

    const price = parseFloat(tick.price);
    const ts = tick.time; 
    const date = new Date(ts);

    let bucket: number;
    if (interval === "1m") {
      bucket = Math.floor(ts / 1000 / 60) * 60;
    } else if (interval === "15m") {
      bucket = Math.floor(ts / 1000 / (15 * 60)) * (15 * 60);
    } else if (interval === "1d") {
      date.setUTCHours(0, 0, 0, 0);
      bucket = Math.floor(date.getTime() / 1000);
    } else {
      bucket = Math.floor(ts / 1000);
    }

    setData((prev) => {
      if (!prev.length) {
        return [
          {
            time: bucket as UTCTimestamp,
            open: price,
            high: price,
            low: price,
            close: price,
          },
        ];
      }

      const last = prev[prev.length - 1];

      if (last.time === bucket) {
        // update ongoing candle
        const updated: CandlestickData = {
          ...last,
          high: Math.max(last.high, price),
          low: Math.min(last.low, price),
          close: price,
        };
        return [...prev.slice(0, -1), updated];
      }

      const newCandle: CandlestickData = {
        time: bucket as UTCTimestamp,
        open: price,
        high: price,
        low: price,
        close: price,
      };
      return [...prev, newCandle];
    });
  }, [tick, interval]);

  return (
    <Chart
      options={{
        width,
        height,
        layout: { background: { color: "#101820" }, textColor: "#E6E6E6" },
        grid: {
          vertLines: { color: "#2d3e50", style: 1 },
          horzLines: { color: "#2d3e50", style: 1 },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: true,
          borderColor: "#3a506b",
          tickMarkFormatter: (time: number) => {
            const d = new Date(time * 1000);
            return d.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
          },
        },
      }}
    >
      <CandlestickSeries
        alwaysReplaceData
        data={data}
        options={{
          upColor: "#00b894",
          borderUpColor: "#00cec9",
          wickUpColor: "#00cec9",
          downColor: "#fd6e6e",
          borderDownColor: "#e17055",
          wickDownColor: "#e17055",
        }}
      />
      <TimeScale>
        <TimeScaleFitContentTrigger deps={[data]} />
      </TimeScale>
    </Chart>
  );
};

export default ChartC;