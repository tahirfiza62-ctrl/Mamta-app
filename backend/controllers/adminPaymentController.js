
const Order = require("../models/Order");


/* =========================================================
   GET ALL PAYMENTS
========================================================= */

const getAdminPayments = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .select(
        "orderNumber userId customer total paymentMethod paymentStatus paymentReference paymentProvider orderStatus createdAt items"
      )
      .lean();

    /* -------------------------------------------------------
       PAYMENT STATISTICS
    ------------------------------------------------------- */

    const totalPayments = orders.length;

    const paidPayments = orders.filter(
      (order) => order.paymentStatus === "Paid"
    ).length;

    const pendingPayments = orders.filter(
      (order) => order.paymentStatus === "Pending"
    ).length;

    const failedPayments = orders.filter(
      (order) => order.paymentStatus === "Failed"
    ).length;

    const cancelledPayments = orders.filter(
      (order) => order.paymentStatus === "Cancelled"
    ).length;


    /* -------------------------------------------------------
       TOTAL PAID REVENUE
    ------------------------------------------------------- */

    const totalRevenue = orders
      .filter(
        (order) =>
          order.paymentStatus === "Paid"
      )
      .reduce(
        (sum, order) =>
          sum + Number(order.total || 0),
        0
      );


    /* -------------------------------------------------------
       TOTAL PENDING AMOUNT
    ------------------------------------------------------- */

    const pendingAmount = orders
      .filter(
        (order) =>
          order.paymentStatus === "Pending"
      )
      .reduce(
        (sum, order) =>
          sum + Number(order.total || 0),
        0
      );


    /* -------------------------------------------------------
       RESPONSE
    ------------------------------------------------------- */

    res.status(200).json({
      success: true,

      payments: orders,

      stats: {
        totalPayments,
        paidPayments,
        pendingPayments,
        failedPayments,
        cancelledPayments,
        totalRevenue,
        pendingAmount,
      },
    });

  } catch (error) {

    console.error(
      "ADMIN PAYMENTS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load payments.",
      error: error.message,
    });
  }
};


/* =========================================================
   GET SINGLE PAYMENT / ORDER
========================================================= */

const getAdminPaymentById = async (req, res) => {
  try {

    const payment = await Order.findById(
      req.params.id
    )
      .select(
        "orderNumber userId customer total subtotal shipping paymentMethod paymentStatus paymentReference paymentProvider orderStatus createdAt items"
      )
      .lean();


    if (!payment) {

      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });

    }


    res.status(200).json({
      success: true,
      payment,
    });

  } catch (error) {

    console.error(
      "ADMIN PAYMENT DETAILS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load payment details.",
      error: error.message,
    });
  }
};


module.exports = {
  getAdminPayments,
  getAdminPaymentById,
};

