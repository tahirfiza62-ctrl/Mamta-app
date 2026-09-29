const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    oldPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },

    features: {
      type: [String],
      default: [],
    },

    /* =====================================================
       PRODUCT COLORS
    ===================================================== */

    colors: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },

          value: {
            type: String,
            required: true,
            trim: true,
          },

          code: {
            type: String,
            required: true,
            trim: true,
          },

          image: {
            type: String,
            default: "",
            trim: true,
          },
        },
      ],

      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);