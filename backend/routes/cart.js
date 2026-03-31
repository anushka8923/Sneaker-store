import express from "express";
import {
    addToCart,
    getCart,
    removeFromCart,
    clearCart,
    updateCartItem
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", addToCart);

// 👇 user based
router.get("/:userId", getCart);

router.delete("/remove/:userId/:productId", removeFromCart);

router.delete("/clear/:userId", clearCart);

router.put("/update", updateCartItem);

export default router;