import type { Response, Request } from "express";
import { Signup, Signin, CONFIG } from "@exness/shared";
import bcrypt from "bcryptjs";
import prisma from "@exness/db";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = Signup.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json({ errors: result.error.flatten().fieldErrors });
    }
    const hashedPassword = bcrypt.hashSync(result.data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: result.data.email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ id: user.id }, CONFIG.jwt.secret, {
      expiresIn: "1h",
    });

    return res
      .status(201)
      .json({
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
      return res
        .status(400)
        .json({ errors: result.error.flatten().fieldErrors });
    }

    const user = await prisma.user.findUnique({
      where: { email: result.data.email },
    });

    if (!user || !bcrypt.compareSync(result.data.password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, CONFIG.jwt.secret, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json({
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
