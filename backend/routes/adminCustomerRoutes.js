
const express = require("express");

const {
  getAdminCustomers,
  getAdminCustomerById,
  updateCustomerStatus,
  deleteCustomer,
} = require("../controllers/adminCustomerController");

const router = express.Router();

/* =========================================================
   CUSTOMER ROUTES
========================================================= */

// Get all customers
router.get("/", getAdminCustomers);

// Get customer by ID
router.get("/:id", getAdminCustomerById);

// Activate / deactivate customer
router.patch("/:id/status", updateCustomerStatus);

// Delete customer
router.delete("/:id", deleteCustomer);

module.exports = router;

