const Product = require("../models/Product");

/* =========================================================
   GET ALL ACTIVE PRODUCTS
   PUBLIC
   GET /api/products
========================================================= */

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      active: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch products.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ALL PRODUCTS
   ADMIN
   GET /api/products/admin/all
========================================================= */

const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET ADMIN PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch admin products.",
      error: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE PRODUCT
   PUBLIC
   GET /api/products/:id
========================================================= */

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      active: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch product.",
      error: error.message,
    });
  }
};

/* =========================================================
   CREATE PRODUCT
   ADMIN
   POST /api/products
========================================================= */

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      category,
      image,
      images,
      stock,
      active,
      features,
    } = req.body;

    /* ---------------------------------------------
       REQUIRED FIELDS
    --------------------------------------------- */

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    if (!category || !category.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product category is required.",
      });
    }

    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Product price is required.",
      });
    }

    /* ---------------------------------------------
       PRICE VALIDATION
    --------------------------------------------- */

    const numericPrice = Number(price);

    if (
      Number.isNaN(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Product price must be a valid number.",
      });
    }

    /* ---------------------------------------------
       OLD PRICE
    --------------------------------------------- */

    let numericOldPrice = null;

    if (
      oldPrice !== undefined &&
      oldPrice !== null &&
      oldPrice !== ""
    ) {
      numericOldPrice = Number(oldPrice);

      if (
        Number.isNaN(numericOldPrice) ||
        numericOldPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Old price must be a valid number.",
        });
      }
    }

    /* ---------------------------------------------
       STOCK
    --------------------------------------------- */

    let numericStock = 0;

    if (
      stock !== undefined &&
      stock !== null &&
      stock !== ""
    ) {
      numericStock = Number(stock);

      if (
        Number.isNaN(numericStock) ||
        numericStock < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a valid number.",
        });
      }
    }

    /* ---------------------------------------------
       IMAGES
    --------------------------------------------- */

    let productImages = [];

    if (Array.isArray(images)) {
      productImages = images.filter(
        (item) =>
          typeof item === "string" &&
          item.trim() !== ""
      );
    }

    /* ---------------------------------------------
       FEATURES
    --------------------------------------------- */

    let productFeatures = [];

    if (Array.isArray(features)) {
      productFeatures = features.filter(
        (item) =>
          typeof item === "string" &&
          item.trim() !== ""
      );
    }

    /* ---------------------------------------------
       CREATE PRODUCT
    --------------------------------------------- */

    const product = await Product.create({
      name: name.trim(),

      description:
        typeof description === "string"
          ? description.trim()
          : "",

      price: numericPrice,

      oldPrice: numericOldPrice,

      category: category.trim(),

      image:
        typeof image === "string"
          ? image.trim()
          : "",

      images: productImages,

      stock: numericStock,

      active:
        active === undefined
          ? true
          : Boolean(active),

      features: productFeatures,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create product.",
      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE PRODUCT
   ADMIN
   PUT /api/products/:id
========================================================= */

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      oldPrice,
      category,
      image,
      images,
      stock,
      active,
      features,
    } = req.body;

    /* ---------------------------------------------
       FIND PRODUCT
    --------------------------------------------- */

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    /* ---------------------------------------------
       NAME
    --------------------------------------------- */

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Product name cannot be empty.",
        });
      }

      product.name = name.trim();
    }

    /* ---------------------------------------------
       DESCRIPTION
    --------------------------------------------- */

    if (description !== undefined) {
      product.description =
        typeof description === "string"
          ? description.trim()
          : "";
    }

    /* ---------------------------------------------
       PRICE
    --------------------------------------------- */

    if (
      price !== undefined &&
      price !== null &&
      price !== ""
    ) {
      const numericPrice = Number(price);

      if (
        Number.isNaN(numericPrice) ||
        numericPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid number.",
        });
      }

      product.price = numericPrice;
    }

    /* ---------------------------------------------
       OLD PRICE
    --------------------------------------------- */

    if (
      oldPrice !== undefined
    ) {
      if (
        oldPrice === null ||
        oldPrice === ""
      ) {
        product.oldPrice = null;
      } else {
        const numericOldPrice =
          Number(oldPrice);

        if (
          Number.isNaN(numericOldPrice) ||
          numericOldPrice < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Old price must be a valid number.",
          });
        }

        product.oldPrice =
          numericOldPrice;
      }
    }

    /* ---------------------------------------------
       CATEGORY
    --------------------------------------------- */

    if (category !== undefined) {
      if (
        typeof category !== "string" ||
        !category.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Product category cannot be empty.",
        });
      }

      product.category =
        category.trim();
    }

    /* ---------------------------------------------
       MAIN IMAGE
    --------------------------------------------- */

    if (image !== undefined) {
      product.image =
        typeof image === "string"
          ? image.trim()
          : "";
    }

    /* ---------------------------------------------
       MULTIPLE IMAGES
    --------------------------------------------- */

    if (images !== undefined) {
      if (!Array.isArray(images)) {
        return res.status(400).json({
          success: false,
          message: "Images must be an array.",
        });
      }

      product.images =
        images.filter(
          (item) =>
            typeof item === "string" &&
            item.trim() !== ""
        );
    }

    /* ---------------------------------------------
       STOCK
    --------------------------------------------- */

    if (
      stock !== undefined &&
      stock !== null &&
      stock !== ""
    ) {
      const numericStock =
        Number(stock);

      if (
        Number.isNaN(numericStock) ||
        numericStock < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Stock must be a valid number.",
        });
      }

      product.stock =
        numericStock;
    }

    /* ---------------------------------------------
       ACTIVE STATUS
    --------------------------------------------- */

    if (active !== undefined) {
      product.active =
        Boolean(active);
    }

    /* ---------------------------------------------
       FEATURES
    --------------------------------------------- */

    if (features !== undefined) {
      if (!Array.isArray(features)) {
        return res.status(400).json({
          success: false,
          message:
            "Features must be an array.",
        });
      }

      product.features =
        features.filter(
          (item) =>
            typeof item === "string" &&
            item.trim() !== ""
        );
    }

    /* ---------------------------------------------
       SAVE
    --------------------------------------------- */

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update product.",
      error: error.message,
    });
  }
};

/* =========================================================
   DELETE PRODUCT
   ADMIN
   DELETE /api/products/:id
========================================================= */

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product =
      await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete product.",
      error: error.message,
    });
  }
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
