const express = require("express");

const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/adminOrderController");

const router = express.Router();


/* =========================================================
   GET ALL ORDERS
========================================================= */

router.get(
  "/",
  getAllOrders
);


/* =========================================================
   GET SINGLE ORDER
========================================================= */

router.get(
  "/:id",
  getOrderById
);


/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

router.put(
  "/:id/status",
  updateOrderStatus
);


module.exports = router;