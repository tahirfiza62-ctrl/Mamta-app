
const express = require("express");

const {
  addProduct,
  getAdminProducts,
  getAdminProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminProductController");

const router = express.Router();


/* =========================================================
   GET ALL PRODUCTS
   GET /api/admin/products/all
========================================================= */

router.get(
  "/all",
  getAdminProducts
);


/* =========================================================
   ADD PRODUCT
   POST /api/admin/products
========================================================= */

router.post(
  "/",
  addProduct
);


/* =========================================================
   GET SINGLE PRODUCT
   GET /api/admin/products/:id
========================================================= */

router.get(
  "/:id",
  getAdminProductById
);


/* =========================================================
   UPDATE PRODUCT
   PUT /api/admin/products/:id
========================================================= */

router.put(
  "/:id",
  updateProduct
);


/* =========================================================
   DELETE PRODUCT
   DELETE /api/admin/products/:id
========================================================= */

router.delete(
  "/:id",
  deleteProduct
);


module.exports = router;
