
const express = require("express");

const {
  createContact,
  getAdminContacts,
  getAdminContactById,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

/* =========================================================
   CUSTOMER
========================================================= */

router.post("/", createContact);

/* =========================================================
   ADMIN
========================================================= */

router.get("/", getAdminContacts);

router.get(
  "/:id",
  getAdminContactById
);

router.patch(
  "/:id/status",
  updateContactStatus
);

router.delete(
  "/:id",
  deleteContact
);

module.exports = router;

