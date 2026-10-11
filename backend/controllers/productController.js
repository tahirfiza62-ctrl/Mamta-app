
const Product = require("../models/Product");

/* =========================================================
   VALID PRODUCT CATEGORIES
========================================================= */

const ALLOWED_CATEGORIES = [
  "Maternity Pillows",
  "Baby Pillows",
  "Nursing Products",
  "Elders Pillows",
  "Accessories",
];

/* =========================================================
   NORMALIZE PRODUCT CATEGORY
========================================================= */

const normalizeCategory = (category) => {
  if (typeof category !== "string") {
    return "";
  }

  const value = category.trim().toLowerCase();

  const categoryMap = {
    "maternity pillows": "Maternity Pillows",
    "maternity pillow": "Maternity Pillows",

    "baby pillows": "Baby Pillows",
    "baby pillow": "Baby Pillows",

    "nursing products": "Nursing Products",
    "nursing product": "Nursing Products",
    "nursing pillow": "Nursing Products",
    "nursing pillows": "Nursing Products",
    "newborn & kids": "Nursing Products",

    "elders pillows": "Elders Pillows",
    "elder pillows": "Elders Pillows",
    "elder pillow": "Elders Pillows",

    accessories: "Accessories",
  };

  return categoryMap[value] || "";
};

/* =========================================================
   NORMALIZE COLORS
========================================================= */

const normalizeColors = (colors) => {
  if (!Array.isArray(colors)) {
    return [];
  }

  const normalized = [];

  colors.forEach((item) => {
    /* ---------------------------------------------
       NEW COLOR OBJECT
    --------------------------------------------- */

    if (
      item &&
      typeof item === "object" &&
      !Array.isArray(item)
    ) {
      const name =
        typeof item.name === "string"
          ? item.name.trim()
          : "";

      const value =
        typeof item.value === "string"
          ? item.value.trim()
          : "";

      const code =
        typeof item.code === "string"
          ? item.code.trim()
          : "";

      const image =
        typeof item.image === "string"
          ? item.image.trim()
          : "";

      if (name && value && code) {
        normalized.push({
          name,
          value,
          code,
          image,
        });
      }

      return;
    }

    /* ---------------------------------------------
       OLD STRING COLOR
    --------------------------------------------- */

    if (
      typeof item === "string" &&
      item.trim() !== ""
    ) {
      const name = item.trim();

      normalized.push({
        name,
        value: name
          .toLowerCase()
          .replace(/\s+/g, "-"),
        code: "#D8C3A5",
        image: "",
      });
    }
  });

  /* ---------------------------------------------
     REMOVE DUPLICATES
  --------------------------------------------- */

  const unique = [];
  const usedValues = new Set();

  normalized.forEach((color) => {
    if (!usedValues.has(color.value)) {
      usedValues.add(color.value);
      unique.push(color);
    }
  });

  return unique;
};

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
      colors,
    } = req.body;

    /* ---------------------------------------------
       NAME VALIDATION
    --------------------------------------------- */

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Product name is required.",
      });
    }

    /* ---------------------------------------------
       CATEGORY VALIDATION
    --------------------------------------------- */

    const normalizedCategory =
      normalizeCategory(category);

    if (!normalizedCategory) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a valid product category.",
        allowedCategories: ALLOWED_CATEGORIES,
      });
    }

    /* ---------------------------------------------
       PRICE VALIDATION
    --------------------------------------------- */

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

    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product price must be a valid non-negative number.",
      });
    }

    /* ---------------------------------------------
       OLD PRICE VALIDATION
    --------------------------------------------- */

    let numericOldPrice = null;

    if (
      oldPrice !== undefined &&
      oldPrice !== null &&
      oldPrice !== ""
    ) {
      numericOldPrice = Number(oldPrice);

      if (
        !Number.isFinite(numericOldPrice) ||
        numericOldPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Old price must be a valid non-negative number.",
        });
      }
    }

    /* ---------------------------------------------
       STOCK VALIDATION
    --------------------------------------------- */

    let numericStock = 0;

    if (
      stock !== undefined &&
      stock !== null &&
      stock !== ""
    ) {
      numericStock = Number(stock);

      if (
        !Number.isFinite(numericStock) ||
        numericStock < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Stock must be a valid non-negative number.",
        });
      }
    }

    /* ---------------------------------------------
       ACTIVE VALIDATION
    --------------------------------------------- */

    let productActive = true;

    if (active !== undefined) {
      if (typeof active === "boolean") {
        productActive = active;
      } else if (active === "true") {
        productActive = true;
      } else if (active === "false") {
        productActive = false;
      } else {
        return res.status(400).json({
          success: false,
          message: "Active must be true or false.",
        });
      }
    }

    /* ---------------------------------------------
       IMAGE VALIDATION
    --------------------------------------------- */

    if (
      images !== undefined &&
      !Array.isArray(images)
    ) {
      return res.status(400).json({
        success: false,
        message: "Images must be an array.",
      });
    }

    const productImages = Array.isArray(images)
      ? images
          .filter(
            (item) =>
              typeof item === "string" &&
              item.trim() !== ""
          )
          .map((item) => item.trim())
      : [];

    const mainImage =
      typeof image === "string"
        ? image.trim()
        : "";

    /* ---------------------------------------------
       FEATURES VALIDATION
    --------------------------------------------- */

    if (
      features !== undefined &&
      !Array.isArray(features)
    ) {
      return res.status(400).json({
        success: false,
        message: "Features must be an array.",
      });
    }

    const productFeatures = Array.isArray(features)
      ? features
          .filter(
            (item) =>
              typeof item === "string" &&
              item.trim() !== ""
          )
          .map((item) => item.trim())
      : [];

    /* ---------------------------------------------
       COLORS
    --------------------------------------------- */

    if (
      colors !== undefined &&
      !Array.isArray(colors)
    ) {
      return res.status(400).json({
        success: false,
        message: "Colors must be an array.",
      });
    }

    const productColors = normalizeColors(colors);

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

      category: normalizedCategory,

      image: mainImage,

      images: productImages,

      stock: numericStock,

      active: productActive,

      features: productFeatures,

      colors: productColors,
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
      colors,
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
        !Number.isFinite(numericPrice) ||
        numericPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Price must be a valid non-negative number.",
        });
      }

      product.price = numericPrice;
    }

    /* ---------------------------------------------
       OLD PRICE
    --------------------------------------------- */

    if (oldPrice !== undefined) {
      if (
        oldPrice === null ||
        oldPrice === ""
      ) {
        product.oldPrice = null;
      } else {
        const numericOldPrice = Number(oldPrice);

        if (
          !Number.isFinite(numericOldPrice) ||
          numericOldPrice < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Old price must be a valid non-negative number.",
          });
        }

        product.oldPrice = numericOldPrice;
      }
    }

    /* ---------------------------------------------
       CATEGORY
    --------------------------------------------- */

    if (category !== undefined) {
      const normalizedCategory =
        normalizeCategory(category);

      if (!normalizedCategory) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a valid product category.",
          allowedCategories: ALLOWED_CATEGORIES,
        });
      }

      product.category = normalizedCategory;
    }

    /* ---------------------------------------------
       MAIN IMAGE
    --------------------------------------------- */

    if (image !== undefined) {
      if (typeof image !== "string") {
        return res.status(400).json({
          success: false,
          message: "Image must be a string.",
        });
      }

      product.image = image.trim();
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

      product.images = images
        .filter(
          (item) =>
            typeof item === "string" &&
            item.trim() !== ""
        )
        .map((item) => item.trim());
    }

    /* ---------------------------------------------
       STOCK
    --------------------------------------------- */

    if (
      stock !== undefined &&
      stock !== null &&
      stock !== ""
    ) {
      const numericStock = Number(stock);

      if (
        !Number.isFinite(numericStock) ||
        numericStock < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Stock must be a valid non-negative number.",
        });
      }

      product.stock = numericStock;
    }

    /* ---------------------------------------------
       ACTIVE
    --------------------------------------------- */

    if (active !== undefined) {
      if (typeof active === "boolean") {
        product.active = active;
      } else if (active === "true") {
        product.active = true;
      } else if (active === "false") {
        product.active = false;
      } else {
        return res.status(400).json({
          success: false,
          message: "Active must be true or false.",
        });
      }
    }

    /* ---------------------------------------------
       FEATURES
    --------------------------------------------- */

    if (features !== undefined) {
      if (!Array.isArray(features)) {
        return res.status(400).json({
          success: false,
          message: "Features must be an array.",
        });
      }

      product.features = features
        .filter(
          (item) =>
            typeof item === "string" &&
            item.trim() !== ""
        )
        .map((item) => item.trim());
    }

    /* ---------------------------------------------
       COLORS
    --------------------------------------------- */

    if (colors !== undefined) {
      if (!Array.isArray(colors)) {
        return res.status(400).json({
          success: false,
          message: "Colors must be an array.",
        });
      }

      product.colors = normalizeColors(colors);
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
========================================================= */

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

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
