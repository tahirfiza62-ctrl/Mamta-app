
const Product = require("../models/Product");

/* =========================================================
   ADD PRODUCT
========================================================= */

const addProduct = async (req, res) => {
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

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required.",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative.",
      });
    }

    if (Number(stock || 0) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be negative.",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description || "",

      price: Number(price),

      oldPrice:
        oldPrice === "" ||
        oldPrice === null ||
        oldPrice === undefined
          ? null
          : Number(oldPrice),

      category: category.trim(),

      image: image || "",

      images: Array.isArray(images)
        ? images
        : [],

      stock: Number(stock || 0),

      active: active !== false,

      features: Array.isArray(features)
        ? features
        : [],
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product,
    });

  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product.",
      error: error.message,
    });
  }
};


/* =========================================================
   GET ALL ADMIN PRODUCTS
========================================================= */

const getAdminProducts = async (req, res) => {
  try {
    const products = await Product
      .find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    console.error("GET ADMIN PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load products.",
      error: error.message,
    });
  }
};


/* =========================================================
   GET SINGLE PRODUCT
========================================================= */

const getAdminProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

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
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load product.",
      error: error.message,
    });
  }
};


/* =========================================================
   UPDATE PRODUCT
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

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required.",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative.",
      });
    }

    if (Number(stock || 0) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be negative.",
      });
    }

    product.name = name.trim();

    product.description =
      description || "";

    product.price =
      Number(price);

    product.oldPrice =
      oldPrice === "" ||
      oldPrice === null ||
      oldPrice === undefined
        ? null
        : Number(oldPrice);

    product.category =
      category.trim();

    product.image =
      image || "";

    product.images =
      Array.isArray(images)
        ? images
        : [];

    product.stock =
      Number(stock || 0);

    product.active =
      active !== false;

    product.features =
      Array.isArray(features)
        ? features
        : [];

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
      message: "Failed to update product.",
      error: error.message,
    });
  }
};


/* =========================================================
   DELETE PRODUCT
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
      message: "Failed to delete product.",
      error: error.message,
    });
  }
};


/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  addProduct,
  getAdminProducts,
  getAdminProductById,
  updateProduct,
  deleteProduct,
};

