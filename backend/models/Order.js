const mongoose = require("mongoose");

/* =========================================================
   ORDER ITEM
========================================================= */

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    /* -------------------------------------------------------
       SELECTED COLOR
    ------------------------------------------------------- */

    color: {
      type: String,
      default: "",
      trim: true,
    },

    colorCode: {
      type: String,
      default: "",
      trim: true,
    },

    colorImage: {
      type: String,
      default: "",
      trim: true,
    },

    /* -------------------------------------------------------
       ITEM TOTAL
    ------------------------------------------------------- */

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   ORDER
========================================================= */

const orderSchema = new mongoose.Schema(
  {
    /* -------------------------------------------------------
       USER
    ------------------------------------------------------- */

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* -------------------------------------------------------
       ORDER NUMBER
    ------------------------------------------------------- */

    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    /* -------------------------------------------------------
       PRODUCTS
    ------------------------------------------------------- */

    items: {
      type: [orderItemSchema],
      default: [],
    },

    /* -------------------------------------------------------
       CUSTOMER
    ------------------------------------------------------- */

    customer: {
      name: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        default: "",
      },
    },

    /* -------------------------------------------------------
       PRICING
    ------------------------------------------------------- */

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    /* -------------------------------------------------------
       PAYMENT
    ------------------------------------------------------- */

    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },

    paymentStatus: {
      type: String,
      default: "Pending",
    },

    /* -------------------------------------------------------
       ORDER STATUS
    ------------------------------------------------------- */

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);