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

/* =========================================================
   GET CURRENT USER'S CART
   GET /api/cart
========================================================= */

router.get(
  "/",
  authMiddleware,
  getCart
);

/* =========================================================
   ADD PRODUCT TO CART
   POST /api/cart/add
========================================================= */

router.post(
  "/add",
  authMiddleware,
  addToCart
);

/* =========================================================
   UPDATE QUANTITY
   PUT /api/cart/update/:productId
========================================================= */

router.put(
  "/update/:productId",
  authMiddleware,
  updateCartItem
);

/* =========================================================
   REMOVE PRODUCT
   DELETE /api/cart/remove/:productId
========================================================= */

router.delete(
  "/remove/:productId",
  authMiddleware,
  removeFromCart
);

/* =========================================================
   CLEAR CART
   DELETE /api/cart/clear
========================================================= */

router.delete(
  "/clear",
  authMiddleware,
  clearCart
);

module.exports = router;