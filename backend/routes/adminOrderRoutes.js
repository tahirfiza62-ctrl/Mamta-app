const express = require("express");

const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/adminOrderController");

const router = express.Router();


/* =========================================================
   GET ALL ORDERS
   GET /api/admin/orders
========================================================= */

router.get(
  "/",
  getAllOrders
);


/* =========================================================
   GET SINGLE ORDER
   GET /api/admin/orders/:id
========================================================= */

router.get(
  "/:id",
  getOrderById
);


/* =========================================================
   UPDATE ORDER STATUS
   PUT /api/admin/orders/:id/status
========================================================= */

router.put(
  "/:id/status",
  updateOrderStatus
);


/* =========================================================
   DELETE ORDER
   DELETE /api/admin/orders/:id
========================================================= */

router.delete(
  "/:id",
  deleteOrder
);


module.exports = router;