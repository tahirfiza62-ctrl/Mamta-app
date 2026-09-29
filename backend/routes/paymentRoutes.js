
const express = require("express");

const {
  createPayment,
  getPaymentStatus,
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================================
   CREATE PAYMENT
========================================================= */

router.post(
  "/create",
  authMiddleware,
  createPayment
);

/* =========================================================
   PAYMENT STATUS
========================================================= */

router.get(
  "/status/:tracker",
  authMiddleware,
  getPaymentStatus
);

module.exports = router;

