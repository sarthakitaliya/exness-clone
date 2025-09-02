"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useWsPrices } from "@/hook/useWsPrices";

interface TradePanelProps {
  symbol: string;
  user: {
    id: string;
    email: string;
  };
}

const TradePanel = ({ symbol, user }: TradePanelProps) => {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState<string>("");
  const [leverage, setLeverage] = useState<string>("10");

  const { tick } = useWsPrices(symbol);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) toast.message("Please log in to trade.");

      console.log("Order submitted:", {
        symbol,
        side,
        amount: parseFloat(amount),
        leverage: parseInt(leverage),
      });
      const order = api.post("/trade", {
        symbol,
        type: side,
        amount: parseFloat(amount),
        leverage: parseInt(leverage),
        entryPrice: parseFloat(tick?.price),
      });
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.message("Error submitting order");
    }
  };

  const calculatePositionValue = () => {
    if (!amount) return 0;
    return parseFloat(amount) * parseInt(leverage);
  };
  const baseSymbol = symbol.replace("USDT", "");

  return (
    <div className="w-full px-3  py-2 rounded-md border border-gray-700 bg-gray-900">
      <div className="mb-4">
        {baseSymbol === "BTC" && (
          <div className="flex items-center gap-2 mb-2 size-19">
            <img src="/btc.png" alt="BTC" className="w-6 h-6" />
            <span className="text-gray-400">BTC</span>
          </div>
        )}
        {baseSymbol === "ETH" && (
          <div className="flex items-center gap-2 mb-2 size-19">
            <img src="/eth.png" alt="ETH" className="w-6 h-6" />
            <span className="text-gray-400">ETH</span>
          </div>
        )}
        {baseSymbol === "SOL" && (
          <div className="flex items-center gap-2 mb-2 size-19">
            <img src="/sol.png" alt="SOL" className="w-6 h-6" />
            <span className="text-gray-400">SOL</span>
          </div>
        )}
      </div>

      <div className="flex mb-4">
        <button
          onClick={() => setSide("buy")}
          className={`flex-1 py-3 px-4 rounded-l-md font-medium transition cursor-pointer ${
            side === "buy"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide("sell")}
          className={`flex-1 py-3 px-4 rounded-r-md font-medium transition cursor-pointer ${
            side === "sell"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount (Margin) - USD
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Leverage
          </label>
          <div className="grid grid-cols-4 gap-2">
            {["1x", "5x", "10x", "20x", "100x"].map((lev) => (
              <button
                key={lev}
                type="button"
                onClick={() => setLeverage(lev.replace("x", ""))}
                className={`py-2 px-3 rounded-md text-sm font-medium transition ${
                  leverage === lev.replace("x", "")
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {lev}
              </button>
            ))}
          </div>
        </div>

        {amount && (
          <div className="bg-gray-800 rounded-md p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Position Value:</span>
              <span className="font-medium">
                ${calculatePositionValue().toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Required Margin:</span>
              <span className="font-medium">
                ${parseFloat(amount || "0").toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Est. Liquidation Price:</span>
              <span className="font-medium text-red-400">--</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-md font-medium transition cursor-pointer ${
            side === "buy"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          Confirm {side === "buy" ? "Buy" : "Sell"} {symbol.replace("USDT", "")}
        </button>
      </form>
    </div>
  );
};

export default TradePanel;
