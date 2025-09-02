import type { Request, Response } from "express";
import { tradeManager } from "../classes/TradeManager";

export const createOrder = (req: Request, res: Response) => {
  try {
    const { symbol, type, margin, leverage, entryPrice } = req.body;
    const userId = req.user.id;
    const order = tradeManager.placeOrder(
      userId,
      symbol,
      type,
      margin,
      leverage,
      entryPrice
    );
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.log("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const openOrder = (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const order = tradeManager.getOpenOrders(userId);
    res
      .status(200)
      .json({ message: "Open order retrieved successfully", order });
  } catch (error) {
    console.log("Error retrieving open orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const closedOrder = (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const order = tradeManager.getClosedOrders(userId);
    res
      .status(200)
      .json({ message: "Closed order retrieved successfully", order });
  } catch (error) {
    console.log("Error retrieving closed orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const closeOrder = (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { orderId, closePrice } = req.body;
    const order = tradeManager.closeOrder(userId, orderId, closePrice);
    res
      .status(200)
      .json({ message: "Closed order retrieved successfully", order });
  } catch (error) {
    console.log("Error retrieving closed orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
