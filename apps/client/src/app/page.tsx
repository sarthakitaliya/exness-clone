"use client";
import ChartC from "@/components/Chart";
import DropDown from "@/components/DropDown";
import IntervalButtons from "@/components/Intervals";
import { useState } from "react";

export default function Home() {
  const [symbol, setSymbol] = useState<string>("BTCUSDT");
  const [interval, setInterval] = useState<string>("1m");

  return (
    <div>
      <div className="flex justify-between">
        <DropDown value={symbol} onChange={setSymbol} />
        <IntervalButtons value={interval} onChange={setInterval} />
      </div>
      <ChartC symbol={symbol} interval={interval} />
    </div>
  );
}
