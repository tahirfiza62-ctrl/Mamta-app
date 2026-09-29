const Cart = require("../models/Cart");
const Order = require("../models/Order");


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
      paymentMethod,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required.",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer phone is required.",
      });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required.",
      });
    }


    /* =====================================================
       GET CART
    ===================================================== */

    const cart = await Cart.findOne({
      userId: req.user._id,
    });

    if (
      !cart ||
      !Array.isArray(cart.items) ||
      cart.items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }


    /* =====================================================
       SUBTOTAL
    ===================================================== */

    const subtotal = cart.items.reduce(
      (total, item) => {
        return (
          total +
          Number(item.price || 0) *
            Number(item.quantity || 0)
        );
      },
      0
    );


    /* =====================================================
       SHIPPING
    ===================================================== */

    const shipping =
      subtotal >= 5000
        ? 0
        : 250;


    /* =====================================================
       TOTAL
    ===================================================== */

    const total =
      subtotal + shipping;


    /* =====================================================
       ORDER NUMBER
    ===================================================== */

    const orderNumber =
      `MAMTA-${Date.now()}`;


    /* =====================================================
       ORDER ITEMS

       IMPORTANT:
       Keep selected color + exact color code +
       selected color image.
    ===================================================== */

    const orderItems =
      cart.items.map((item) => {
        const itemPrice =
          Number(item.price || 0);

        const itemQuantity =
          Number(item.quantity || 0);

        return {
          productId:
            String(item.productId),

          name:
            String(item.name || "").trim(),

          image:
            item.image || "",

          price:
            itemPrice,

          quantity:
            itemQuantity,

          color:
            typeof item.color === "string"
              ? item.color.trim()
              : "",

          colorCode:
            typeof item.colorCode === "string"
              ? item.colorCode.trim()
              : "",

          colorImage:
            typeof item.colorImage === "string"
              ? item.colorImage.trim()
              : "",

          total:
            itemPrice * itemQuantity,
        };
      });


    /* =====================================================
       CREATE ORDER
    ===================================================== */

    const order =
      await Order.create({
        userId: req.user._id,

        orderNumber,

        items: orderItems,

        customer: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },

        subtotal,

        shipping,

        total,

        paymentMethod:
          paymentMethod ||
          "Cash on Delivery",

        paymentStatus:
          "Pending",

        orderStatus:
          "Pending",
      });


    /* =====================================================
       CLEAR CART
    ===================================================== */

    cart.items = [];

    await cart.save();


    /* =====================================================
       RESPONSE
    ===================================================== */

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });

  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to create order.",
    });
  }
};


/* =========================================================
   GET MY ORDERS
========================================================= */

const getMyOrders = async (req, res) => {
  try {
    const orders =
      await Order.find({
        userId: req.user._id,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error(
      "GET MY ORDERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
};


/* =========================================================
   GET ORDER BY ID
========================================================= */

const getOrderById = async (req, res) => {
  try {
    const order =
      await Order.findOne({
        _id: req.params.id,
        userId: req.user._id,
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error(
      "GET ORDER BY ID ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch order.",
    });
  }
};


/* =========================================================
   CANCEL ORDER
========================================================= */

const cancelOrder = async (req, res) => {
  try {
    const order =
      await Order.findOne({
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
      ["Shipped", "Delivered", "Cancelled"]
        .includes(order.orderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This order cannot be cancelled.",
      });
    }

    order.orderStatus =
      "Cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled.",
      order,
    });

  } catch (error) {
    console.error(
      "CANCEL ORDER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to cancel order.",
    });
  }
};


/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const {
      status,
    } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order =
      await Order.findById(
        req.params.id
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus =
      status;

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully.",
      order,
    });

  } catch (error) {
    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update order status.",
    });
  }
};


module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
};