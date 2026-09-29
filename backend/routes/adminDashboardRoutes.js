
const express = require("express");

const {
  getAdminDashboard,
} = require("../controllers/adminDashboardController");

const router = express.Router();

/* =========================================================
   GET ADMIN DASHBOARD
   GET /api/admin/dashboard
========================================================= */

router.get(
  "/",
  getAdminDashboard
);

module.exports = router;

