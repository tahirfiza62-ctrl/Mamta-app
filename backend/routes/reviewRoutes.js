
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

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Please sign in to the admin panel.",
      });
    }

    const token = authorization.split(" ")[1];

    if (!token || !process.env.JWT_SECRET) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication is unavailable.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
   FORMAT REVIEW
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
   PUBLIC: GET APPROVED REVIEWS
   GET /api/reviews
   GET /api/reviews?productId=...
========================================================= */

router.get("/", async (req, res) => {
  try {
    const { productId } = req.query;

    const filter = {
      // Also includes older reviews created before the
      // approved field was added to the schema.
      approved: { $ne: false },
    };

    if (productId) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID.",
        });
      }

      filter.productId = new mongoose.Types.ObjectId(productId);
    } else {
      // Homepage testimonials are general reviews only.
      filter.productId = null;
    }
const reviews = await Review.find()
  .populate("productId", "name")
  .sort({ createdAt: -1 })
  .lean();

return res.json({
  success: true,
  reviews,
});
  } catch (error) {
    console.error("GET PUBLIC REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
});

/* =========================================================
   ADMIN: GET ALL REVIEWS
   GET /api/reviews/admin/all
========================================================= */

router.get("/admin/all", adminOnly, async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      reviews: reviews.map(formatReview),
    });
  } catch (error) {
    console.error("GET ADMIN REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin reviews.",
    });
  }
});

/* =========================================================
   CREATE REVIEW
   POST /api/reviews

   productId is optional for homepage testimonials.
========================================================= */

router.post("/", async (req, res) => {
  try {
    const {
      name,
      city,
      email,
      rating,
      message,
      text,
      productId,
    } = req.body;

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

    const cleanEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (
      cleanEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
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

    let cleanProductId = null;

    if (productId) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID.",
        });
      }

      cleanProductId = new mongoose.Types.ObjectId(productId);
    }

    const review = await Review.create({
      name: name.trim(),
      city: city.trim(),
      email: cleanEmail,
      rating: numericRating,
      message: reviewMessage.trim(),
      productId: cleanProductId,
      approved: true,
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! Your review has been submitted.",
      review: formatReview(review),
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit review. Please try again.",
    });
  }
});

/* =========================================================
   ADMIN: UPDATE REVIEW
   PUT /api/reviews/:id
========================================================= */

router.put("/:id", adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, rating, message, text, approved } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const reviewMessage = message ?? text;
    const numericRating = Number(rating);

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

    review.name = name.trim();
    review.city = city.trim();
    review.rating = numericRating;
    review.message = reviewMessage.trim();

    if (typeof approved === "boolean") {
      review.approved = approved;
    }

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
   ADMIN: DELETE REVIEW
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

router.get("/", async (req, res) => {
  try {
    const { productId } = req.query;

    if (
      !productId ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid product ID is required.",
      });
    }

    const reviews = await Review.find({
      productId,
      approved: true,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("GET PRODUCT REVIEWS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch reviews.",
    });
  }
});

module.exports = router;
