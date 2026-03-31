import express from "express";
import { signupUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

console.log(" AUTH ROUTES LOADED");

// Signup route
router.post("/signup", signupUser);
router.post("/login", loginUser);



export default router;