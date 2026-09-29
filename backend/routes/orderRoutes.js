const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create new order
router.post(
  "/",
  authMiddleware,
  createOrder
);

// Get logged-in customer's orders
router.get(
  "/",
  authMiddleware,
  getMyOrders
);

// Get single order
router.get(
  "/:id",
  authMiddleware,
  getOrderById
);

// Cancel order
router.put(
  "/:id/cancel",
  authMiddleware,
  cancelOrder
);

module.exports = router;