
const express = require("express");

const {
  getAdminPayments,
  getAdminPaymentById,
} = require("../controllers/adminPaymentController");

const router = express.Router();


/* =========================================================
   GET ALL PAYMENTS
   GET /api/admin/payments
========================================================= */

router.get(
  "/",
  getAdminPayments
);


/* =========================================================
   GET PAYMENT DETAILS
   GET /api/admin/payments/:id
========================================================= */

router.get(
  "/:id",
  getAdminPaymentById
);


module.exports = router;

