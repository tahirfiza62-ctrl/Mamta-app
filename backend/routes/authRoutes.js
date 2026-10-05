
const express = require("express");

const {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  getMe,
  changePassword,
} = require("../controllers/authController");

const {
  adminLogin,
} = require("../controllers/adminController");

const authMiddleware =
  require("../middleware/authMiddleware");

const router = express.Router();


// =========================================================
// CUSTOMER AUTH
// =========================================================

router.post(
  "/register",
  register
);


router.post(
  "/login",
  login
);


// =========================================================
// EMAIL VERIFICATION
// =========================================================

router.post(
  "/verify-email",
  verifyEmail
);


router.post(
  "/resend-verification",
  resendVerificationEmail
);


// =========================================================
// USER
// =========================================================

router.get(
  "/me",
  authMiddleware,
  getMe
);


router.put(
  "/change-password",
  authMiddleware,
  changePassword
);


// =========================================================
// ADMIN AUTH
// =========================================================

router.post(
  "/admin",
  adminLogin
);


module.exports = router;

