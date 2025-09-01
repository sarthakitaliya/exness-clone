"use client";
import BidAsk from "@/components/BidAsk";
import ChartC from "@/components/Chart";
import IntervalButtons from "@/components/Intervals";
import SymbolSelector from "@/components/SymbolSelector";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [symbol, setSymbol] = useState<string>("BTCUSDT");
  const [interval, setInterval] = useState<string>("1m");

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="w-full flex items-center justify-between px-6 py-3 border-b border-gray-700 shadow-md m-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-wide">Exness</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-left">
            <div className="bg-[#2C4B44] text-[#73D99D] rounded-md px-2 py-1 text-xs font-medium inline-block">
              Demo
            </div>
            <p className="text-sm font-semibold flex items-center gap-2 cursor-pointer">0.00 USD <ChevronDown size={16} className="text-gray-400" /></p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 transition rounded-md px-4 py-2 font-medium cursor-pointer">
            Deposit
          </button>
        </div>
      </nav>

      <div className="flex gap-2 rounded-xl p-4">
        <BidAsk symbol={symbol} />
        <div className="ml-1 border border-gray-700 rounded-md p-3">
          <div className="flex justify-between items-center mb-2">
            <SymbolSelector value={symbol} onChange={setSymbol} />
            <IntervalButtons value={interval} onChange={setInterval} />
          </div>
          <ChartC
            symbol={symbol}
            interval={interval}
            width={800}
            height={560}
          />
        </div>
      </div>
    </div>
  );
}
