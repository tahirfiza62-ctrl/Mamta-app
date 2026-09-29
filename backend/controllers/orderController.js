const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");

// =====================================================
// GENERATE ORDER NUMBER
// =====================================================

const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);

  return `MAMTA-${timestamp}-${random}`;
};

// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      name,
      email,
      phone,
      address,
      city,
      paymentMethod = "Cash on Delivery",
    } = req.body;

    // -----------------------------
    // Validate customer information
    // -----------------------------

    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !city
    ) {
      return res.status(400).json({
        message: "Please provide all customer details.",
      });
    }

    // -----------------------------
    // Validate payment method
    // -----------------------------

    if (paymentMethod !== "Cash on Delivery") {
      return res.status(400).json({
        message: "Invalid payment method.",
      });
    }

    // -----------------------------
    // Get user's cart
    // -----------------------------

    const cart = await Cart.findOne({
      userId,
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    // -----------------------------
    // Calculate order items
    // -----------------------------

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image || "",
      price: Number(item.price),
      quantity: Number(item.quantity),
      total:
        Number(item.price) *
        Number(item.quantity),
    }));

    // -----------------------------
    // Calculate subtotal
    // -----------------------------

    const subtotal = orderItems.reduce(
      (total, item) => total + item.total,
      0
    );

    // -----------------------------
    // Shipping
    // -----------------------------

    const shipping = subtotal >= 5000 ? 0 : 250;

    // -----------------------------
    // Final total
    // -----------------------------

    const total = subtotal + shipping;

    // -----------------------------
    // Create order
    // -----------------------------

    const order = await Order.create({
      userId,

      orderNumber: generateOrderNumber(),

      items: orderItems,

      customer: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
      },

      subtotal,

      shipping,

      total,

      paymentMethod,

      paymentStatus: "Pending",

      orderStatus: "Pending",
    });

    // -----------------------------
    // Clear cart
    // -----------------------------

    cart.items = [];

    await cart.save();

    // -----------------------------
    // Response
    // -----------------------------

    res.status(201).json({
      success: true,

      message: "Order placed successfully.",

      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      message: "Unable to place order.",
    });
  }
};

// =====================================================
// GET MY ORDERS
// =====================================================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);

    res.status(500).json({
      message: "Unable to load orders.",
    });
  }
};

// =====================================================
// GET SINGLE ORDER
// =====================================================

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);

    res.status(500).json({
      message: "Unable to load order.",
    });
  }
};

// =====================================================
// CANCEL ORDER
// =====================================================

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    // Only pending/confirmed orders can be cancelled
    if (
      order.orderStatus !== "Pending" &&
      order.orderStatus !== "Confirmed"
    ) {
      return res.status(400).json({
        message:
          "This order can no longer be cancelled.",
      });
    }

    order.orderStatus = "Cancelled";

    await order.save();

    res.json({
      success: true,

      message: "Order cancelled successfully.",

      order,
    });
  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);

    res.status(500).json({
      message: "Unable to cancel order.",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};