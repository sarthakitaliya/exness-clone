import express from 'express';
import { checkAuth } from '../middleware/checkAuth';
import { closedOrder, closeOrder, createOrder, openOrder } from '../controllers/trade.controller';

const router = express.Router();

//create order
router.post("/", checkAuth, createOrder)

//get order
router.get("/open", checkAuth, openOrder)

//get closed orders
router.get("/closed", checkAuth, closedOrder)

//close order
router.post("/closed", checkAuth, closeOrder)

export default router;