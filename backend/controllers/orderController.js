const Cart = require("../models/Cart");
const Order = require("../models/Order");
const sendPushNotification = require("../utils/sendPushNotification");
const sendOrderEmail = require("../utils/sendOrderEmail");

/* =========================================================
   CREATE ORDER
========================================================= */

const createOrder = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      paymentMethod,
    } = req.body;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        message: "Phone number is required.",
      });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({
        message: "Address is required.",
      });
    }

    if (!city || !city.trim()) {
      return res.status(400).json({
        message: "City is required.",
      });
    }

    /* =====================================================
       EMAIL VALIDATION
    ===================================================== */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    /* =====================================================
       PHONE VALIDATION
    ===================================================== */

    const phoneRegex = /^03\d{9}$/;

    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({
        message:
          "Please enter a valid Pakistani phone number.",
      });
    }

    /* =====================================================
       FIND USER CART
    ===================================================== */

    const cart = await Cart.findOne({
      userId: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }

    if (!cart.items || cart.items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    /* =====================================================
       CALCULATE SUBTOTAL
    ===================================================== */

    const subtotal = cart.items.reduce(
      (sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;

        return sum + price * quantity;
      },
      0
    );

    /* =====================================================
       SHIPPING
    ===================================================== */

    const shipping = subtotal >= 5000 ? 0 : 250;

    const total = subtotal + shipping;

    /* =====================================================
       ORDER NUMBER
    ===================================================== */

    const orderNumber = `MAMTA-${Date.now()}`;

    /* =====================================================
       ORDER ITEMS
    ===================================================== */

    const orderItems = cart.items.map((item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;

      return {
        productId: String(item.productId),

        name: item.name || "Product",

        image: item.image || "",

        price,

        quantity,

        color: item.color || "",

        colorCode: item.colorCode || "",

        colorImage: item.colorImage || "",

        total: price * quantity,
      };
    });

    /* =====================================================
       CREATE ORDER
    ===================================================== */

    const order = await Order.create({
      userId: req.user._id,

      orderNumber,

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

      paymentMethod:
        paymentMethod || "Cash on Delivery",

      paymentStatus: "Pending",

      orderStatus: "Pending",
    });

    console.log(
      `✅ ORDER CREATED: ${order.orderNumber}`
    );

    /* =====================================================
       SEND EMAIL IN BACKGROUND
       
       IMPORTANT:
       Do NOT use await here.
       
       This prevents Gmail/Nodemailer from delaying
       the customer's order confirmation.
    ===================================================== */

    sendOrderEmail(order)
      .then(() => {
        console.log(
          `📧 ORDER EMAIL SENT: ${order.orderNumber}`
        );
      })
      .catch((error) => {
        console.error(
          `❌ ORDER EMAIL FAILED: ${order.orderNumber}`
        );

        console.error(error);
      });

    /* =====================================================
       PUSH NOTIFICATION
       
       Also runs in background so it cannot delay
       the customer's order response.
    ===================================================== */

    if (req.user._id) {
      Promise.resolve(
        sendPushNotification({
          userId: req.user._id,
          title: "Order Placed Successfully",
          body: `Your MAMTA order ${order.orderNumber} has been placed successfully.`,
          data: {
            orderId: order._id.toString(),
            orderNumber: order.orderNumber,
          },
        })
      )
        .then(() => {
          console.log(
            `🔔 PUSH NOTIFICATION SENT: ${order.orderNumber}`
          );
        })
        .catch((error) => {
          console.error(
            "❌ PUSH NOTIFICATION FAILED:",
            error
          );
        });
    }

    /* =====================================================
       CLEAR CART
       
       Clear immediately after order creation.
       We do NOT wait for email or notification.
    ===================================================== */

    await Cart.findOneAndUpdate(
      {
        userId: req.user._id,
      },
      {
        $set: {
          items: [],
        },
      }
    );

    console.log(
      `🛒 CART CLEARED: ${order.orderNumber}`
    );

    /* =====================================================
       RETURN SUCCESS IMMEDIATELY
    ===================================================== */

    return res.status(201).json({
      success: true,

      message: "Order placed successfully.",

      order: {
        _id: order._id,

        orderNumber: order.orderNumber,

        customer: order.customer,

        items: order.items,

        subtotal: order.subtotal,

        shipping: order.shipping,

        total: order.total,

        paymentMethod: order.paymentMethod,

        paymentStatus: order.paymentStatus,

        orderStatus: order.orderStatus,

        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "❌ CREATE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to create order.",
    });
  }
};


/* =========================================================
   GET MY ORDERS
========================================================= */

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "❌ GET MY ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};


/* =========================================================
   GET SINGLE ORDER
========================================================= */

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "❌ GET ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order.",
    });
  }
};


/* =========================================================
   CANCEL ORDER
========================================================= */

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This order cannot be cancelled.",
      });
    }

    order.orderStatus = "Cancelled";

    await order.save();

    return res.status(200).json({
      success: true,

      message: "Order cancelled successfully.",

      order,
    });
  } catch (error) {
    console.error(
      "❌ CANCEL ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to cancel order.",
    });
  }
};


/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Order status is required.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus = status;

    await order.save();

    return res.status(200).json({
      success: true,

      message:
        "Order status updated successfully.",

      order,
    });
  } catch (error) {
    console.error(
      "❌ UPDATE ORDER STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update order status.",
    });
  }
};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
};