const express = require("express");

const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/* =========================================================
   ADMIN - GET ALL PRODUCTS
   IMPORTANT: Keep this BEFORE /:id
========================================================= */

router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAdminProducts
);

/* =========================================================
   PUBLIC - GET ACTIVE PRODUCTS
========================================================= */

router.get(
  "/",
  getProducts
);

/* =========================================================
   PUBLIC - GET SINGLE PRODUCT
========================================================= */

router.get(
  "/:id",
  getProductById
);

/* =========================================================
   ADMIN - ADD PRODUCT
========================================================= */

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createProduct
);

/* =========================================================
   ADMIN - UPDATE PRODUCT
========================================================= */

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateProduct
);

/* =========================================================
   ADMIN - DELETE PRODUCT
========================================================= */

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

module.exports = router;