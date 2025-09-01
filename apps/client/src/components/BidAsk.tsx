"use client";

import { useWsPrices } from "@/hook/useWsPrices";
import { SOL, BTC, ETH } from "./icon/icon";

const BidAsk = ({ symbol }: { symbol: string }) => {
  const bidAsks = useWsPrices(symbol);

  if (!bidAsks) return <p>Loading...</p>;
  const formatPrice = (value: number, decimals: number) =>
    (value / Math.pow(10, decimals)).toFixed(decimals);

  return (
    <div className="p-4 rounded-md border border-gray-700 bg-gray-900">
      {/* Header */}
      <div className="grid grid-cols-3 gap-4 font-semibold border-b border-gray-400 pb-2 mb-2">
        <span>Symbol</span>
        <span className="text-green-600">Bid</span>
        <span className="text-red-600">Ask</span>
      </div>

      {/* Rows */}
      {Object.values(bidAsks.bidAsk).map((data: any) => {
        const baseSymbol = data.symbol.replace("USDT", "");

        const Color =
          data.direction === "up"
            ? "text-green-500 font-bold"
            : "text-red-500 font-bold";

        return (
          <div
            key={data.symbol}
            className="grid grid-cols-3 gap-4 py-2 border-b border-gray-400 text-sm"
          >
            <div className="flex items-center gap-2">
              {baseSymbol === "BTC" && <BTC />}
              {baseSymbol === "ETH" && <ETH />}
              {baseSymbol === "SOL" && <SOL />}
              <span className="font-medium">{baseSymbol}</span>
            </div>

            <span className={`${Color} font-bold`}>{formatPrice(data.bid, 2)}</span>
            <span className={`${Color} font-bold`}>{formatPrice(data.ask, 2)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BidAsk;
