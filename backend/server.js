import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from './routes/productsRoutes.js';
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log(" Server file is running");

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/products', productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// DB
connectDB();

// Server
app.listen(8000, () => {
  console.log(" Server running on port 8000");
});