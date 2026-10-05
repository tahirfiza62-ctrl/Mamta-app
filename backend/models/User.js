const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // =====================================================
    // BASIC USER INFORMATION
    // =====================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // =====================================================
    // ROLE
    // =====================================================

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    // =====================================================
    // ACCOUNT STATUS
    // =====================================================

    active: {
      type: Boolean,
      default: true,
    },

    // =====================================================
    // EMAIL VERIFICATION
    // =====================================================

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationCode: {
      type: String,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);