const Order = require("../models/Order");


/* =========================================================
   GET ALL ORDERS
   GET /api/admin/orders
========================================================= */

const getAllOrders = async (req, res) => {
  try {
    const orders =
      await Order.find({})
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "GET ALL ORDERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load orders.",
      error:
        error.message,
    });
  }
};


/* =========================================================
   GET SINGLE ORDER
   GET /api/admin/orders/:id
========================================================= */

const getOrderById = async (req, res) => {
  try {
    const {
      id,
    } = req.params;

    const order =
      await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "GET ADMIN ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load order.",
      error:
        error.message,
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
    const {
      id,
    } = req.params;

    const {
      status,
    } = req.body;

    console.log(
      "ADMIN STATUS UPDATE"
    );

    console.log(
      "Order ID:",
      id
    );

    console.log(
      "Received status:",
      status
    );


    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (!status) {
      return res.status(400).json({
        success: false,
        message:
          "Order status is required.",
      });
    }


    /* -----------------------------------------------------
       ALLOWED STATUSES
    ----------------------------------------------------- */

    const statusMap = {
      pending: "Pending",
      confirmed: "Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };


    const normalizedStatus =
      String(status)
        .trim()
        .toLowerCase();


    const finalStatus =
      statusMap[
        normalizedStatus
      ];


    if (!finalStatus) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid order status.",

        receivedStatus:
          status,

        allowedStatuses: [
          "Pending",
          "Confirmed",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ],
      });
    }


    /* -----------------------------------------------------
       UPDATE orderStatus
    ----------------------------------------------------- */

    const order =
      await Order.findByIdAndUpdate(
        id,

        {
          $set: {
            orderStatus:
              finalStatus,
          },
        },

        {
          new: true,
          runValidators: true,
        }
      );


    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }


    console.log(
      "STATUS UPDATED:",
      order.orderStatus
    );


    return res.status(200).json({
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

    return res.status(500).json({
      success: false,

      message:
        "Failed to update order status.",

      error:
        error.message,
    });
  }
};


/* =========================================================
   DELETE ORDER
   DELETE /api/admin/orders/:id
========================================================= */

const deleteOrder = async (
  req,
  res
) => {
  try {
    const {
      id,
    } = req.params;

    console.log(
      "ADMIN DELETE ORDER"
    );

    console.log(
      "Order ID:",
      id
    );


    /* -----------------------------------------------------
       FIND ORDER
    ----------------------------------------------------- */

    const order =
      await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }


    /* -----------------------------------------------------
       DELETE ORDER
    ----------------------------------------------------- */

    await Order.findByIdAndDelete(id);


    console.log(
      "ORDER DELETED:",
      id
    );


    return res.status(200).json({
      success: true,

      message:
        "Order deleted successfully.",

      orderId: id,
    });

  } catch (error) {
    console.error(
      "DELETE ORDER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to delete order.",

      error:
        error.message,
    });
  }
};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};