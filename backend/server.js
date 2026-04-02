import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productsRoutes.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js";

dotenv.config({ path: "./.env" });

const app = express();

// =====================
// ✅ CORS CONFIG (FINAL - STABLE)
// =====================
const allowedOrigins = [
  "http://localhost:5173",
  "https://sneaker-store-frontend.onrender.com" // ⚠️ replace with your real frontend URL
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Debug logs (optional but helpful)
  console.log("Origin:", origin);

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());

console.log("🚀 Server file is running");

// =====================
// ROUTES
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// =====================
// DB CHECK
// =====================
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found!");
  process.exit(1);
}

// Connect DB
connectDB();

// =====================
// SERVER START
// =====================
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});