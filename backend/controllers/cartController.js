const Cart = require("../models/Cart");


// =========================================================
// GET CART
// =========================================================

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [],
      });
    }

    res.json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    res.status(500).json({
      message: "Unable to load cart.",
    });
  }
};


// =========================================================
// ADD TO CART
// =========================================================

const addToCart = async (req, res) => {
  try {
    const {
      productId,
      name,
      image,
      price,
      quantity = 1,
    } = req.body;

    if (!productId || !name || price === undefined) {
      return res.status(400).json({
        message: "Product information is incomplete.",
      });
    }

    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        message: "Invalid product price.",
      });
    }

    if (
      Number.isNaN(numericQuantity) ||
      numericQuantity < 1
    ) {
      return res.status(400).json({
        message: "Invalid quantity.",
      });
    }

    let cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId === String(productId)
    );

    if (existingItem) {
      existingItem.quantity += numericQuantity;
    } else {
      cart.items.push({
        productId: String(productId),
        name,
        image: image || "",
        price: numericPrice,
        quantity: numericQuantity,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart.",
      cart,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    res.status(500).json({
      message: "Unable to add product to cart.",
    });
  }
};


// =========================================================
// UPDATE QUANTITY
// =========================================================

const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const numericQuantity = Number(quantity);

    if (
      Number.isNaN(numericQuantity) ||
      numericQuantity < 1
    ) {
      return res.status(400).json({
        message: "Quantity must be at least 1.",
      });
    }

    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }

    const item = cart.items.find(
      (item) => item.productId === String(productId)
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not found in cart.",
      });
    }

    item.quantity = numericQuantity;

    await cart.save();

    res.json({
      success: true,
      message: "Cart updated.",
      cart,
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);

    res.status(500).json({
      message: "Unable to update cart.",
    });
  }
};


// =========================================================
// REMOVE FROM CART
// =========================================================

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId !== String(productId)
    );

    await cart.save();

    res.json({
      success: true,
      message: "Product removed from cart.",
      cart,
    });
  } catch (error) {
    console.error("REMOVE CART ITEM ERROR:", error);

    res.status(500).json({
      message: "Unable to remove product.",
    });
  }
};


// =========================================================
// CLEAR CART
// =========================================================

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      return res.json({
        success: true,
        message: "Cart already empty.",
      });
    }

    cart.items = [];

    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared.",
      cart,
    });
  } catch (error) {
    console.error("CLEAR CART ERROR:", error);

    res.status(500).json({
      message: "Unable to clear cart.",
    });
  }
};


module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};