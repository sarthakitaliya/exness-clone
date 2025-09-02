import { userManager } from "./UserManager";
import {v4 as uuid} from "uuid";

export interface openOrder {
  orderId: string;
  userId: string;
  symbol: string;
  type: "buy" | "sell";
  margin: number;
  leverage: number;
  entryPrice: number;
  quantity: number;
  timestamp: number;
}

export interface closedOrder extends openOrder {
  pnl: number;
}

class TradeManager {
  private openOrders: Record<string, openOrder[]> = {};
  private closedOrders: Record<string, closedOrder[]> = {};

  placeOrder(
    userId: string,
    symbol: string,
    type: "buy" | "sell",
    margin: number,
    leverage: number,
    entryPrice: number
  ) {
    const balance = userManager.getBalance(userId);

    if (balance < margin) throw new Error("Insufficient balance");

    userManager.updateBalance(userId, -margin);

    const order: openOrder = {
      orderId: uuid(),
      userId,
      symbol,
      type,
      margin,
      leverage,
      entryPrice,
      quantity: (margin * leverage) / entryPrice,
      timestamp: Date.now(),
    };

    if (!this.openOrders[userId]) this.openOrders[userId] = [];
    this.openOrders[userId].push(order);

    return order;
  }

  getOpenOrders(userId: string) {
    return this.openOrders[userId] || [];
  }

  getClosedOrders(userId: string) {
    return this.closedOrders[userId] || [];
  }

  closeOrder(userId: string, orderId: string, closePrice: number) {
    const orders = this.openOrders[userId] || [];
    const order = orders.find((o) => o.orderId == orderId);
    if (!order) throw new Error("Order not found");

    let pnl = 0;
    if (order.type === "buy") {
      pnl = (closePrice - order.entryPrice) * order.quantity;
    } else {
      pnl = (order.entryPrice - closePrice) * order.quantity;
    }

    userManager.updateBalance(userId, order.margin + pnl);

    this.openOrders[userId] = orders.filter((o) => o.orderId !== orderId);
    this.closedOrders[userId] = this.closedOrders[userId] || [];
    this.closedOrders[userId].push({ ...order, pnl });

    return { pnl, balance: userManager.getBalance(userId) };
  }
}

export const tradeManager = new TradeManager();
