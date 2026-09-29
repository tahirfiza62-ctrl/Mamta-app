
const User = require("../models/User");
const Order = require("../models/Order");

/* =========================================================
   GET ALL CUSTOMERS
========================================================= */

const getAdminCustomers = async (req, res) => {
  try {
    const customers = await User.find({
      role: "customer",
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("ADMIN CUSTOMERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load customers.",
      error: error.message,
    });
  }
};


/* =========================================================
   GET CUSTOMER BY ID + ORDERS
========================================================= */

const getAdminCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;

    console.log("-----------------------------------------");
    console.log("ADMIN CUSTOMER DETAILS");
    console.log("Customer ID:", customerId);

    /* -------------------------------------------------------
       FIND CUSTOMER
    ------------------------------------------------------- */

    const customer = await User.findOne({
      _id: customerId,
      role: "customer",
    })
      .select("-password")
      .lean();

    if (!customer) {
      console.log("Customer not found.");

      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    console.log(
      "Customer found:",
      customer.name,
      customer.email
    );

    /* -------------------------------------------------------
       FIND ORDERS USING USER ID
    ------------------------------------------------------- */

    const orders = await Order.find({
      userId: customer._id,
    })
      .sort({
        createdAt: -1,
      })
      .select(
        "orderNumber total orderStatus paymentStatus paymentMethod paymentReference paymentProvider createdAt items userId"
      )
      .lean();

    console.log(
      "Orders found:",
      orders.length
    );

    console.log(
      "Order IDs:",
      orders.map((order) => order._id)
    );

    console.log("-----------------------------------------");

    /* -------------------------------------------------------
       RESPONSE
    ------------------------------------------------------- */

    res.status(200).json({
      success: true,
      customer,
      orders,
      totalOrders: orders.length,
    });

  } catch (error) {
    console.error(
      "ADMIN CUSTOMER DETAILS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load customer.",
      error: error.message,
    });
  }
};


/* =========================================================
   UPDATE CUSTOMER STATUS
========================================================= */

const updateCustomerStatus = async (req, res) => {
  try {
    const { active } = req.body;

    if (typeof active !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "Active status must be true or false.",
      });
    }

    const customer = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        role: "customer",
      },
      {
        active,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-password")
      .lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: active
        ? "Customer activated successfully."
        : "Customer deactivated successfully.",
      customer,
    });

  } catch (error) {
    console.error(
      "UPDATE CUSTOMER STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update customer status.",
      error: error.message,
    });
  }
};


/* =========================================================
   DELETE CUSTOMER
========================================================= */

const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findOneAndDelete({
      _id: req.params.id,
      role: "customer",
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully.",
    });

  } catch (error) {
    console.error(
      "DELETE CUSTOMER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete customer.",
      error: error.message,
    });
  }
};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  getAdminCustomers,
  getAdminCustomerById,
  updateCustomerStatus,
  deleteCustomer,
};
