const express = require("express");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Get current user's cart
router.get("/", authMiddleware, getCart);


// Add product
router.post("/add", authMiddleware, addToCart);


// Update quantity
router.put(
  "/update/:productId",
  authMiddleware,
  updateCartItem
);


// Remove product
router.delete(
  "/remove/:productId",
  authMiddleware,
  removeFromCart
);


// Clear cart
router.delete(
  "/clear",
  authMiddleware,
  clearCart
);


module.exports = router;