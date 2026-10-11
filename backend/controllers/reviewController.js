const Review = require("../models/Review");

/* =========================================================
   CREATE REVIEW
========================================================= */

const createReview = async (req, res) => {
  try {
    const {
      name,
      city,
      email,
      rating,
      message,
    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (
      !name ||
      !city ||
      !email ||
      !rating ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const cleanName = name.trim();
    const cleanCity = city.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must contain at least 2 characters.",
      });
    }

    if (cleanCity.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid city.",
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
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
        message: "Rating must be between 1 and 5 stars.",
      });
    }

    if (cleanMessage.length < 10) {
      return res.status(400).json({
        success: false,
        message:
          "Review must contain at least 10 characters.",
      });
    }

    if (cleanMessage.length > 500) {
      return res.status(400).json({
        success: false,
        message:
          "Review cannot be longer than 500 characters.",
      });
    }

    /* =========================
       CREATE REVIEW
    ========================= */

    const review = await Review.create({
      name: cleanName,
      city: cleanCity,
      email: cleanEmail,
      rating: numericRating,
      message: cleanMessage,
      approved: true,
    });

    return res.status(201).json({
      success: true,
      message:
        "Thank you! Your review has been shared successfully.",
      review,
    });
  } catch (error) {
    console.error(
      "CREATE REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to submit your review. Please try again.",
    });
  }
};


/* =========================================================
   GET REVIEWS
========================================================= */

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      approved: true,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error(
      "GET REVIEWS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load customer reviews.",
    });
  }
};


/* =========================================================
   DELETE REVIEW
   Optional admin functionality
========================================================= */

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

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
    console.error(
      "DELETE REVIEW ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete the review.",
    });
  }
};


module.exports = {
  createReview,
  getReviews,
  deleteReview,
};