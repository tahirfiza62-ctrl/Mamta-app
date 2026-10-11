const mongoose = require("mongoose");

const pushSubscriptionSchema = new mongoose.Schema(
  {
    endpoint: {
      type: String,
      required: true,
      unique: true,
    },

    expirationTime: {
      type: Number,
      default: null,
    },

    keys: {
      p256dh: {
        type: String,
        required: true,
      },

      auth: {
        type: String,
        required: true,
      },
    },

    role: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PushSubscription",
  pushSubscriptionSchema
);