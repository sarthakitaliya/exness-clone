import express from "express";
import { check, getBalance, signin, signup } from "../controllers/user.controller";
import { checkAuth } from "../middleware/checkAuth";

const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/check-auth", checkAuth, check);

router.get("/balances", checkAuth, getBalance)

export default router;
