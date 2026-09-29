
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

const getAdminDashboard = async (req, res) => {
  try {
    /* =====================================================
       PRODUCT COUNTS
    ===================================================== */

    const totalProducts = await Product.countDocuments();

    const activeProducts = await Product.countDocuments({
      active: true,
    });

    const inactiveProducts = await Product.countDocuments({
      active: false,
    });

    /* =====================================================
       CUSTOMER COUNT
    ===================================================== */

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const activeCustomers = await User.countDocuments({
      role: "customer",
      active: true,
    });

    /* =====================================================
       ORDER COUNTS
    ===================================================== */

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });

    const confirmedOrders = await Order.countDocuments({
      orderStatus: "Confirmed",
    });

    const processingOrders = await Order.countDocuments({
      orderStatus: "Processing",
    });

    const shippedOrders = await Order.countDocuments({
      orderStatus: "Shipped",
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      orderStatus: "Cancelled",
    });

    /* =====================================================
       REVENUE
       Only delivered orders are counted
    ===================================================== */

    const revenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$total",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    /* =====================================================
       PAYMENT COUNTS
    ===================================================== */

    const pendingPayments = await Order.countDocuments({
      paymentStatus: "Pending",
    });

    const paidPayments = await Order.countDocuments({
      paymentStatus: "Paid",
    });

    const failedPayments = await Order.countDocuments({
      paymentStatus: "Failed",
    });

    const cancelledPayments = await Order.countDocuments({
      paymentStatus: "Cancelled",
    });

    /* =====================================================
       RECENT ORDERS
    ===================================================== */

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .lean();

    /* =====================================================
       RECENT CUSTOMERS
    ===================================================== */

    const recentCustomers = await User.find({
      role: "customer",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email active createdAt")
      .lean();

    /* =====================================================
       RESPONSE
    ===================================================== */

    res.status(200).json({
      success: true,

      stats: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        totalCustomers,
        activeCustomers,
        totalOrders,
        totalRevenue,
      },

      orderStatus: {
        pending: pendingOrders,
        confirmed: confirmedOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },

      payments: {
        pending: pendingPayments,
        paid: paidPayments,
        failed: failedPayments,
        cancelled: cancelledPayments,
      },

      recentOrders,
      recentCustomers,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load admin dashboard.",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
};

