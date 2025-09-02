import api from "@/lib/api";
import { useEffect, useState } from "react";
import type { openOrder, closedOrder } from "@exness/api-server";

const Order = () => {
  const [orderStatus, setOrderStatus] = useState<"open" | "closed">("open");
  const [orders, setOrders] = useState<openOrder[] | closedOrder[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({}); // live prices

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/trade/${orderStatus}`);
        setOrders(response.data.order || []);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };
    fetchOrders();
  }, [orderStatus]);
  console.log(orders);

  const handleCloseOrder = async (orderId: string) => {
    try {
      await api.post(`/trade/close`, { orderId });
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    } catch (error) {
      console.error("Failed to close order", error);
    }
  };

  const calcPnL = (order: openOrder) => {
    const currentPrice = prices[order.symbol] ?? order.entryPrice; // fallback
    if (order.type === "buy") {
      return (currentPrice - order.entryPrice) * order.leverage;
    } else {
      return (order.entryPrice - currentPrice) * order.leverage;
    }
  };

  return (
    <div className="w-full p-4 border border-gray-700 rounded-md bg-gray-900 m-1 text-gray-200">
      <h2 className="text-lg font-semibold mb-3">Order Details</h2>
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-4">
        <button
          onClick={() => setOrderStatus("open")}
          className={`px-4 py-2 cursor-pointer ${
            orderStatus === "open"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400"
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setOrderStatus("closed")}
          className={`px-4 py-2 cursor-pointer ${
            orderStatus === "closed"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400"
          }`}
        >
          Closed
        </button>
      </div>
      {/* Orders Table */}
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            {" "}
            {/* ✅ table-fixed enforces equal alignment */}
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="text-left p-2 w-[120px]">Symbol</th>
                <th className="text-left p-2 w-[80px]">Type</th>
                <th className="text-left p-2 w-[80px]">Leverage</th>
                <th className="text-left p-2 w-[120px]">Open Price</th>
                <th className="text-left p-2 w-[120px]">Current Price</th>
                <th className="text-left p-2 w-[100px]">P/L (USD)</th>
                <th className="text-center p-2 w-[90px]">Action</th>{" "}
                {/* ✅ always rendered */}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const currentPrice = prices[order.symbol] ?? order.entryPrice;
                const pnl = calcPnL(order as openOrder);
                const baseSymbol = order.symbol.split("USDT")[0];
                let icon;

                if (baseSymbol === "BTC") icon= "/BTC.png"
                if (baseSymbol === "ETH") icon= "/ETH.png"
                if (baseSymbol === "SOL") icon= "/SOL.png"

                return (
                  <tr
                    key={order.orderId}
                    className="border-b border-gray-700 hover:bg-gray-800"
                  >
                    <td className="p-2 font-semibold flex items-center gap-2">
                      {icon && <img src={icon} alt={baseSymbol} className="w-6 h-6" />} {baseSymbol}
                    </td>
                    <td className="p-2">
                      <span
                        className={
                          order.type === "buy"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {order.type}
                      </span>
                    </td>
                    <td className="p-2">{order.leverage}x</td>
                    <td className="p-2">{order.entryPrice.toFixed(2)}</td>
                    <td className="p-2">{currentPrice.toFixed(2)}</td>
                    <td
                      className={`p-2 font-semibold ${
                        pnl >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {pnl.toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                      {orderStatus === "open" ? (
                        <button
                          onClick={() => handleCloseOrder(order.orderId)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-xs cursor-pointer"
                        >
                          Close
                        </button>
                      ) : (
                        <span className="text-gray-500">–</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 text-gray-400">
          {orderStatus === "open" ? (
            <p>No open orders</p>
          ) : (
            <p>No closed orders</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Order;
