import express from "express";
import { createOrder, getUserOrders } from "../controllers/orderController.js";

const router = express.Router();

// ✅ PLACE ORDER
router.post("/place", createOrder);

// ✅ GET USER ORDERS
router.get("/user/:userId", getUserOrders);

export default router;