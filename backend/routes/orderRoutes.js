const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


/* =========================================================
   CREATE NEW ORDER
   POST /api/orders
========================================================= */

router.post(
  "/",
  authMiddleware,
  createOrder
);


/* =========================================================
   GET LOGGED-IN CUSTOMER ORDERS
   GET /api/orders
========================================================= */

router.get(
  "/",
  authMiddleware,
  getMyOrders
);


/* =========================================================
   GET SINGLE ORDER
   GET /api/orders/:id
========================================================= */

router.get(
  "/:id",
  authMiddleware,
  getOrderById
);


/* =========================================================
   CANCEL ORDER
   PUT /api/orders/:id/cancel
========================================================= */

router.put(
  "/:id/cancel",
  authMiddleware,
  cancelOrder
);


module.exports = router;