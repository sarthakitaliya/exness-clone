import type { Response, Request } from "express";
import { Signup, Signin, CONFIG } from "@exness/shared";
import bcrypt from "bcryptjs";
import prisma from "@exness/db";
import jwt from "jsonwebtoken";
import { userManager } from "../classes/UserManager";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = Signup.safeParse(req.body);

    if (!result.success) {
      const msg = result.error.issues.map((issue) => issue.message);
      return res.status(400).json({ error: msg });
    }
    const hashedPassword = bcrypt.hashSync(result.data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id, email: user.email }, CONFIG.jwt.secret, {
      expiresIn: "1h",
    });
    userManager.createUser(user.id);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error: Error | any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const result = Signin.safeParse(req.body);
    if (!result.success) {
      const msg = result.error.issues.map((issue) => issue.message);
      return res.status(400).json({ error: msg });
    }

    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (!user || !bcrypt.compareSync(result.data.password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, CONFIG.jwt.secret, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "User signed in successfully",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error: Error | any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const check = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ message: "User is not authenticated" });
    }
    res.status(200).json({ message: "User is authenticated" });
  } catch (error: Error | any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getBalance = (req: Request, res: Response) => {
  try {
    const balance = userManager.getBalance(req.user?.id);
    res.status(200).json({ balance });
  } catch (error: Error | any) {
    console.log("Error: ", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
