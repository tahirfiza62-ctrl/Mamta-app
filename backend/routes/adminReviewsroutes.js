import express from "express";
import mongoose from "mongoose";
import Review from "../models/Review.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// IMPORTANT: requireAdmin must validate your real admin session/token.
// Never expose these management routes without authentication.

// GET /api/admin/reviews
router.get("/", requireAdmin, async (req, res) => {
  try {
    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .populate("productId", "name title")
      .lean();

    const normalized = reviews.map((review) => ({
      ...review,
      product: review.productId && typeof review.productId === "object"
        ? review.productId
        : undefined,
      productId: review.productId?._id || review.productId,
    }));

    res.json({ success: true, reviews: normalized });
  } catch (error) {
    console.error("Admin list reviews error:", error);
    res.status(500).json({ success: false, message: "Unable to load reviews." });
  }
});

// PATCH /api/admin/reviews/:id
router.patch("/:id", requireAdmin, async (req, res) => {
  try {
    const { name, city, email = "", rating, message } = req.body;
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid review ID." });
    }
    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 50 ||
        typeof city !== "string" || city.trim().length < 2 || city.trim().length > 50 ||
        typeof message !== "string" || message.trim().length < 10 || message.trim().length > 500 ||
        !Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5 ||
        (email && (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))) {
      return res.status(400).json({ success: false, message: "Please provide valid review fields." });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: { name: name.trim(), city: city.trim(), email: email.trim(), rating: Number(rating), message: message.trim() } },
      { new: true, runValidators: true }
    );

    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    res.json({ success: true, review });
  } catch (error) {
    console.error("Admin update review error:", error);
    res.status(500).json({ success: false, message: "Unable to update review." });
  }
});

// DELETE /api/admin/reviews/:id
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid review ID." });
    }
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    res.json({ success: true, message: "Review deleted." });
  } catch (error) {
    console.error("Admin delete review error:", error);
    res.status(500).json({ success: false, message: "Unable to delete review." });
  }
});

export default router;
