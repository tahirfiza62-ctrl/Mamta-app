
const express = require("express");

const {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
} = require(
  "../controllers/adminOrderController"
);

const router =
  express.Router();


/* =========================================================
   ALL ORDERS
   GET /api/admin/orders
========================================================= */

router.get(
  "/",
  getAllOrders
);


/* =========================================================
   SINGLE ORDER
   GET /api/admin/orders/:id
========================================================= */

router.get(
  "/:id",
  getAdminOrderById
);


/* =========================================================
   UPDATE ORDER STATUS
   PUT /api/admin/orders/:id/status
========================================================= */

router.put(
  "/:id/status",
  updateOrderStatus
);


module.exports = router;

