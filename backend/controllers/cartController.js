const Cart = require("../models/Cart");

/* =========================================================
   GET CART
========================================================= */

const getCart = async (req, res) => {
  try {
    const userId =
      req.user._id ||
      req.user.id ||
      req.user.userId;

    let cart = await Cart.findOne({
      userId,
    });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error(
      "GET CART ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch cart.",
    });
  }
};


/* =========================================================
   ADD TO CART
========================================================= */

const addToCart = async (req, res) => {
  try {
    const {
      productId,
      name,
      image,
      price,
      quantity,
      color,
      colorCode,
      colorImage,
    } = req.body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!productId) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required.",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message:
          "Product name is required.",
      });
    }

    if (
      price === undefined ||
      price === null ||
      Number.isNaN(Number(price))
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid product price is required.",
      });
    }

    const requestedQuantity =
      Number(quantity || 1);

    if (
      Number.isNaN(
        requestedQuantity
      ) ||
      requestedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be at least 1.",
      });
    }

    /* =====================================================
       COLOR
    ===================================================== */

    const selectedColor =
      typeof color === "string"
        ? color.trim()
        : "";

    const selectedColorCode =
      typeof colorCode === "string"
        ? colorCode.trim()
        : "";

    const selectedColorImage =
      typeof colorImage === "string"
        ? colorImage.trim()
        : "";

    /* =====================================================
       USER
    ===================================================== */

    const userId =
      req.user._id ||
      req.user.id ||
      req.user.userId;

    /* =====================================================
       FIND CART
    ===================================================== */

    let cart = await Cart.findOne({
      userId,
    });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    /* =====================================================
       SAME PRODUCT + SAME COLOR
    ===================================================== */

    const existingItem =
      cart.items.find(
        (item) =>
          String(
            item.productId
          ) ===
            String(productId) &&
          String(
            item.color || ""
          ).trim() ===
            selectedColor
      );

    /* =====================================================
       EXISTING ITEM
    ===================================================== */

    if (existingItem) {
      existingItem.quantity +=
        requestedQuantity;

      if (selectedColorImage) {
        existingItem.image =
          selectedColorImage;

        existingItem.colorImage =
          selectedColorImage;
      } else if (image) {
        existingItem.image =
          image;
      }

      if (selectedColorCode) {
        existingItem.colorCode =
          selectedColorCode;
      }

      existingItem.color =
        selectedColor;
    }

    /* =====================================================
       NEW ITEM
    ===================================================== */

    else {
      cart.items.push({
        productId:
          String(productId),

        name:
          String(name).trim(),

        image:
          selectedColorImage ||
          image ||
          "",

        price:
          Number(price),

        quantity:
          requestedQuantity,

        color:
          selectedColor,

        colorCode:
          selectedColorCode,

        colorImage:
          selectedColorImage,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message:
        "Product added to cart.",
      cart,
    });

  } catch (error) {
    console.error(
      "ADD TO CART ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to add product to cart.",
    });
  }
};


/* =========================================================
   UPDATE CART ITEM
========================================================= */

const updateCartItem = async (
  req,
  res
) => {
  try {

    /* =====================================================
       IMPORTANT FIX

       Product ID comes from:

       /update/:productId

       Therefore use req.params.productId
    ===================================================== */

    const productId =
      req.params.productId;

    const {
      quantity,
      color,
    } = req.body;

    console.log(
      "===================================="
    );

    console.log(
      "🛒 UPDATE CART ITEM"
    );

    console.log(
      "PRODUCT ID:",
      productId
    );

    console.log(
      "QUANTITY:",
      quantity
    );

    console.log(
      "COLOR:",
      color
    );

    console.log(
      "===================================="
    );

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!productId) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required.",
      });
    }

    const requestedQuantity =
      Number(quantity);

    if (
      Number.isNaN(
        requestedQuantity
      ) ||
      requestedQuantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be at least 1.",
      });
    }

    /* =====================================================
       COLOR

       The cart page sends the color
       so different colors of the same
       product remain separate.
    ===================================================== */

    const selectedColor =
      typeof color === "string"
        ? color.trim()
        : "";

    /* =====================================================
       USER
    ===================================================== */

    const userId =
      req.user._id ||
      req.user.id ||
      req.user.userId;

    /* =====================================================
       FIND CART
    ===================================================== */

    const cart =
      await Cart.findOne({
        userId,
      });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message:
          "Cart not found.",
      });
    }

    /* =====================================================
       FIND EXACT ITEM

       PRODUCT + COLOR
    ===================================================== */

    const item =
      cart.items.find(
        (cartItem) =>
          String(
            cartItem.productId
          ) ===
            String(productId) &&
          String(
            cartItem.color || ""
          ).trim() ===
            selectedColor
      );

    if (!item) {
      console.error(
        "❌ CART ITEM NOT FOUND",
        {
          productId,
          color:
            selectedColor,
        }
      );

      return res.status(404).json({
        success: false,
        message:
          "Cart item not found.",
      });
    }

    /* =====================================================
       UPDATE QUANTITY
    ===================================================== */

    item.quantity =
      requestedQuantity;

    await cart.save();

    console.log(
      "✅ QUANTITY UPDATED:",
      item.quantity
    );

    res.status(200).json({
      success: true,
      message:
        "Cart updated.",
      cart,
    });

  } catch (error) {
    console.error(
      "UPDATE CART ITEM ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update cart.",
    });
  }
};


/* =========================================================
   REMOVE FROM CART
========================================================= */

const removeFromCart = async (
  req,
  res
) => {
  try {

    /* =====================================================
       IMPORTANT FIX

       Product ID comes from:

       /remove/:productId
    ===================================================== */

    const productId =
      req.params.productId;

    const {
      color,
    } = req.body || {};

    console.log(
      "===================================="
    );

    console.log(
      "🗑️ REMOVE CART ITEM"
    );

    console.log(
      "PRODUCT ID:",
      productId
    );

    console.log(
      "COLOR:",
      color
    );

    console.log(
      "===================================="
    );

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!productId) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required.",
      });
    }

    const selectedColor =
      typeof color === "string"
        ? color.trim()
        : "";

    /* =====================================================
       USER
    ===================================================== */

    const userId =
      req.user._id ||
      req.user.id ||
      req.user.userId;

    /* =====================================================
       FIND CART
    ===================================================== */

    const cart =
      await Cart.findOne({
        userId,
      });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message:
          "Cart not found.",
      });
    }

    /* =====================================================
       REMOVE EXACT PRODUCT + COLOR
    ===================================================== */

    const oldLength =
      cart.items.length;

    cart.items =
      cart.items.filter(
        (item) =>
          !(
            String(
              item.productId
            ) ===
              String(productId) &&
            String(
              item.color || ""
            ).trim() ===
              selectedColor
          )
      );

    /* =====================================================
       CHECK WHETHER ITEM EXISTED
    ===================================================== */

    if (
      cart.items.length ===
      oldLength
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Cart item not found.",
      });
    }

    /* =====================================================
       SAVE
    ===================================================== */

    await cart.save();

    console.log(
      "✅ CART ITEM REMOVED"
    );

    res.status(200).json({
      success: true,
      message:
        "Product removed from cart.",
      cart,
    });

  } catch (error) {
    console.error(
      "REMOVE FROM CART ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to remove product from cart.",
    });
  }
};


/* =========================================================
   CLEAR CART
========================================================= */

const clearCart = async (
  req,
  res
) => {
  try {

    const userId =
      req.user._id ||
      req.user.id ||
      req.user.userId;

    const cart =
      await Cart.findOne({
        userId,
      });

    if (!cart) {
      return res.status(200).json({
        success: true,
        message:
          "Cart already empty.",
        cart: {
          items: [],
        },
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message:
        "Cart cleared.",
      cart,
    });

  } catch (error) {
    console.error(
      "CLEAR CART ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to clear cart.",
    });
  }
};


/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};