
const Safepay = require("@sfpy/node-core");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

/* =========================================================
   HELPERS
========================================================= */

const generateOrderNumber = () => {
  return `MAMTA-${Date.now()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
};

const getSafepayClient = () => {
  const secretKey = process.env.SAFE_PAY_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      "SAFE_PAY_SECRET_KEY is missing from .env"
    );
  }

  return Safepay(secretKey, {
    authType: "secret",
    host:
      process.env.SAFE_PAY_HOST ||
      "https://sandbox.api.getsafepay.com",
  });
};

/* =========================================================
   CREATE ONLINE PAYMENT
========================================================= */

const createPayment = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city,
      paymentMethod,
    } = req.body;

    /* -----------------------------------------------------
       VALIDATION
    ----------------------------------------------------- */

    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !address?.trim() ||
      !city?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all delivery details.",
      });
    }

    if (paymentMethod !== "Online Payment") {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method.",
      });
    }

    /* -----------------------------------------------------
       LOAD CART
    ----------------------------------------------------- */

    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart || !cart.items?.length) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    /* -----------------------------------------------------
       ORDER ITEMS
    ----------------------------------------------------- */

    const orderItems = cart.items.map((item) => ({
      productId: String(item.productId),
      name: item.name,
      image: item.image || "",
      price: Number(item.price),
      quantity: Number(item.quantity),
      total:
        Number(item.price) *
        Number(item.quantity),
    }));

    /* -----------------------------------------------------
       TOTALS
    ----------------------------------------------------- */

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

    const shipping =
      subtotal >= 5000 ? 0 : 250;

    const total = subtotal + shipping;

    /* -----------------------------------------------------
       CREATE ORDER FIRST
    ----------------------------------------------------- */

    const order = await Order.create({
      userId: req.user.id,

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

      paymentMethod: "Online Payment",
      paymentStatus: "Pending",
      paymentProvider: "Safepay",
      paymentReference: "",

      orderStatus: "Pending",
    });

    /* -----------------------------------------------------
       SAFEPAY
    ----------------------------------------------------- */

    const safepay = getSafepayClient();

    const merchantApiKey =
      process.env.SAFE_PAY_API_KEY;

    if (!merchantApiKey) {
      await Order.findByIdAndDelete(
        order._id
      );

      return res.status(500).json({
        success: false,
        message:
          "Safepay API key is not configured.",
      });
    }

    /* -----------------------------------------------------
       CREATE SAFEPAY TRACKER
    ----------------------------------------------------- */

const session = await safepay.payments.session.setup({
  merchant_api_key: merchantApiKey,

  intent: "CYBERSOURCE",

  mode: "payment",

  currency: "PKR",

  amount: Math.round(total * 100),

  metadata: {
    order_id: String(order._id),
    source: "mamta-circle",
  },
});

    const tracker =
      session?.data?.tracker?.token ||
      session?.data?.tracker?.id ||
      session?.data?.tracker;

    if (!tracker) {
      await Order.findByIdAndDelete(
        order._id
      );

      console.error(
        "SAFEPAy TRACKER RESPONSE:",
        session
      );

      return res.status(500).json({
        success: false,
        message:
          "Safepay did not return a payment tracker.",
      });
    }

    /* -----------------------------------------------------
       SAVE TRACKER
    ----------------------------------------------------- */

    order.paymentReference =
      String(tracker);

    await order.save();

    /* -----------------------------------------------------
       CREATE SAFEPAY AUTH TOKEN
    ----------------------------------------------------- */

    const authResponse =
      await safepay.client.passport.create();

    const authToken =
      authResponse?.data;

    if (!authToken) {
      console.error(
        "SAFEPAy AUTH RESPONSE:",
        authResponse
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to initialize Safepay checkout.",
      });
    }

    /* -----------------------------------------------------
       CHECKOUT URL
    ----------------------------------------------------- */

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:5174";

    const checkoutUrl =
      safepay.checkout.createCheckoutUrl({
        tracker: String(tracker),

        tbt: authToken,

        env:
          process.env.SAFE_PAY_ENVIRONMENT ||
          "sandbox",

        source: "hosted",

        redirect_url:
          `${frontendUrl}/payment-success` +
          `?order=${order._id}` +
          `&tracker=${tracker}`,

        cancel_url:
          `${frontendUrl}/checkout`,
      });

    if (!checkoutUrl) {
      return res.status(500).json({
        success: false,
        message:
          "Safepay checkout URL could not be generated.",
      });
    }

    /* -----------------------------------------------------
       RESPONSE
    ----------------------------------------------------- */

    return res.status(200).json({
      success: true,

      message:
        "Safepay checkout created successfully.",

      checkoutUrl,

      orderId: order._id,

      orderNumber:
        order.orderNumber,

      tracker: String(tracker),

      amount: total,
    });
  } catch (error) {
    console.error(
      "CREATE PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to create payment.",
    });
  }
};

/* =========================================================
   GET PAYMENT STATUS
========================================================= */

const getPaymentStatus = async (
  req,
  res
) => {
  try {
    const { tracker } = req.params;

    if (!tracker) {
      return res.status(400).json({
        success: false,
        message:
          "Payment tracker is required.",
      });
    }

    /* -----------------------------------------------------
       FIND ORDER
    ----------------------------------------------------- */

    const order = await Order.findOne({
      paymentReference: tracker,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Payment order not found.",
      });
    }

    /* -----------------------------------------------------
       SAFEPAY STATUS
    ----------------------------------------------------- */

    let trackerState = null;

    try {
      const safepay =
        getSafepayClient();

      const response =
        await safepay.reporter.payments.fetch(
          tracker
        );

      trackerState =
        response?.data?.tracker?.state ||
        response?.data?.state ||
        null;
    } catch (statusError) {
      console.error(
        "SAFEPAy STATUS ERROR:",
        statusError?.message ||
          statusError
      );
    }

    /* -----------------------------------------------------
       IMPORTANT

       Do NOT mark an order Paid here.

       The webhook is the trusted source that
       changes paymentStatus to Paid.
    ----------------------------------------------------- */

    return res.status(200).json({
      success: true,

      paid:
        order.paymentStatus ===
        "Paid",

      state: trackerState,

      tracker,

      orderId: order._id,

      orderNumber:
        order.orderNumber,

      paymentStatus:
        order.paymentStatus,

      orderStatus:
        order.orderStatus,
    });
  } catch (error) {
    console.error(
      "GET PAYMENT STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to check payment status.",
    });
  }
};

module.exports = {
  createPayment,
  getPaymentStatus,
};

