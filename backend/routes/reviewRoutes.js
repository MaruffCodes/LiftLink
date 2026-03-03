import express from "express";
import Review from "../models/Review.js";
import mongoose from "mongoose";

const router = express.Router();

// Create review
router.post("/", async (req, res) => {
  try {
    const { vendorId, userName, rating, comment } = req.body;

    if (!vendorId || !userName || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newReview = new Review({
      vendor: vendorId,
      userName,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Get all reviews for a vendor
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    const reviews = await Review.find({ vendor: vendorId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
