
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Review = require("../models/Review");

const router = express.Router();

/* =========================================================
   ADMIN AUTHENTICATION
========================================================= */

const adminOnly = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to the admin panel.",
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin token is missing.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Match these checks to the claims used by your admin login.
    const isAdmin =
      decoded.role === "admin" ||
      decoded.isAdmin === true ||
      decoded.admin === true;

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token. Please sign in again.",
    });
  }
};

/* =========================================================
   NORMALIZE REVIEW RESPONSE
========================================================= */

const formatReview = (review) => {
  const item =
    typeof review.toObject === "function"
      ? review.toObject()
      : review;

  return {
    ...item,
    city: item.city || item.place || "",
    message: item.message || item.text || item.review || "",
    text: item.message || item.text || item.review || "",
  };
};

/* =========================================================
   GET ALL REVIEWS
   GET /api/reviews
========================================================= */

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      reviews: reviews.map(formatReview),
    });
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
});

/* =========================================================
   CREATE REVIEW
   POST /api/reviews

   Email is optional. If supplied, validate it.
========================================================= */

router.post("/", async (req, res) => {
  try {
    const { name, city, email, rating, message, text } = req.body;

    const reviewMessage = message || text;

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "Name must contain 2–50 characters.",
      });
    }

    if (
      typeof city !== "string" ||
      city.trim().length < 2 ||
      city.trim().length > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "City must contain 2–50 characters.",
      });
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    if (
      typeof reviewMessage !== "string" ||
      reviewMessage.trim().length < 10 ||
      reviewMessage.trim().length > 500
    ) {
      return res.status(400).json({
        success: false,
        message: "Review text must contain 10–500 characters.",
      });
    }

    const review = await Review.create({
      name: name.trim(),
      city: city.trim(),
      ...(email ? { email: email.trim() } : {}),
      rating: numericRating,
      message: reviewMessage.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: formatReview(review),
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit review.",
    });
  }
});

/* =========================================================
   UPDATE REVIEW
   PUT /api/reviews/:id

   Does not validate, change, or require email.
========================================================= */

router.put("/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, rating, message, text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const reviewMessage = message ?? text;

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "Name must contain 2–50 characters.",
      });
    }

    if (
      typeof city !== "string" ||
      city.trim().length < 2 ||
      city.trim().length > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "City must contain 2–50 characters.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    if (
      typeof reviewMessage !== "string" ||
      reviewMessage.trim().length < 10 ||
      reviewMessage.trim().length > 500
    ) {
      return res.status(400).json({
        success: false,
        message: "Review text must contain 10–500 characters.",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    // Update only these fields. Preserve the existing email.
    review.name = name.trim();
    review.city = city.trim();
    review.rating = numericRating;
    review.message = reviewMessage.trim();

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      review: formatReview(review),
    });
  } catch (error) {
    console.error("UPDATE REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update review.",
    });
  }
});

/* =========================================================
   DELETE REVIEW
   DELETE /api/reviews/:id
========================================================= */

router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete review.",
    });
  }
});

module.exports = router;
