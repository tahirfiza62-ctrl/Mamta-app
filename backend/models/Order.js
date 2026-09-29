const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
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

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item.",
      },
    },

    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shipping: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    /* =====================================================
       PAYMENT
    ===================================================== */

    paymentMethod: {
      type: String,
      enum: [
        "Cash on Delivery",
        "Online Payment",
      ],
      default: "Cash on Delivery",
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Cancelled",
      ],
      default: "Pending",
    },

    paymentReference: {
      type: String,
      default: "",
    },

    paymentProvider: {
      type: String,
      default: "",
    },

    /* =====================================================
       ORDER STATUS
    ===================================================== */

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

module.exports = mongoose.model("Order", orderSchema);