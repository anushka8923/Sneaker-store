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
// PORT
// =====================
const PORT = process.env.PORT || 8000;

// =====================
// ✅ CORS CONFIG (FIXED)
// =====================
const allowedOrigins = [
  "https://sneaker-store-black.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options("*", cors());

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
// const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
