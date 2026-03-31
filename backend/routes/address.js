import express from "express";
import {
  addAddress,
  getAddresses,
  getSingleAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";

const router = express.Router();


// ✅ ADD ADDRESS
router.post("/add", addAddress);

// ✅ GET ALL ADDRESSES OF USER
router.get("/:userId", getAddresses);

// ✅ GET SINGLE ADDRESS
router.get("/single/:id", getSingleAddress);

// ✅ UPDATE ADDRESS
router.put("/update/:id", updateAddress);

// ✅ DELETE ADDRESS
router.delete("/delete/:id", deleteAddress);


export default router;