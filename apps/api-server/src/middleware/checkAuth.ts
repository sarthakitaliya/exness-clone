import { CONFIG } from "@exness/shared";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {

    const token = req.headers.cookie?.split("=")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const decoded = jwt.verify(token, CONFIG.jwt.secret);
    if (typeof decoded !== "string" && "email" in decoded) {
      req.user = { id: decoded.id, email: decoded.email };
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
