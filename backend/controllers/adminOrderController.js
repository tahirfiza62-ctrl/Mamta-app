
const Order = require("../models/Order");


/* =========================================================
   GET ALL ORDERS
   GET /api/admin/orders
========================================================= */

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate(
        "userId",
        "name email"
      )
      .lean();

    res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error(
      "GET ALL ORDERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load orders.",
      error: error.message,
    });
  }
};


/* =========================================================
   GET SINGLE ORDER
   GET /api/admin/orders/:id
========================================================= */

const getAdminOrderById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate(
        "userId",
        "name email"
      )
      .lean();

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
      "GET ORDER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load order.",
      error: error.message,
    });
  }
};


/* =========================================================
   UPDATE ORDER STATUS
   PUT /api/admin/orders/:id/status
========================================================= */

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { orderStatus } =
      req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (
      !orderStatus ||
      !allowedStatuses.includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order status.",
      });
    }

    const order =
      await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.orderStatus =
      orderStatus;

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
        "Failed to update order status.",
      error: error.message,
    });
  }
};


module.exports = {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
};

