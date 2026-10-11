
require("dotenv").config({
  path: __dirname + "/.env",
});

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

/* =========================================================
   CORS
========================================================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

/* =========================================================
   BODY PARSER
========================================================= */
const newsletterRoutes = require("./routes/newsletterRoutes");
app.use(express.json());
app.use("/api/newsletter", newsletterRoutes);
/* =========================================================
   WEBHOOK ROUTES
========================================================= */

const paymentWebhookRoutes = require("./routes/paymentWebhookRoutes");

app.use(
  "/api/payments/webhook",
  paymentWebhookRoutes
);

/* =========================================================
   NORMAL ROUTES
========================================================= */

const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

/* =========================================================
   ADMIN ROUTES
========================================================= */

const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminProductRoutes = require("./routes/adminProductRoutes");
const adminCustomerRoutes = require("./routes/adminCustomerRoutes");
const adminPaymentRoutes = require("./routes/adminPaymentRoutes");
const pushRoutes = require("./routes/pushRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
/* =========================================================
   API ROUTES
========================================================= */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/contact",
  contactRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

/* =========================================================
   ADMIN ROUTES
========================================================= */

app.use(
  "/api/admin/dashboard",
  adminDashboardRoutes
);

app.use(
  "/api/admin/orders",
  adminOrderRoutes
);
app.use("/api/push", pushRoutes);
app.use(
  "/api/admin/products",
  adminProductRoutes
);

app.use(
  "/api/admin/customers",
  adminCustomerRoutes
);

app.use(
  "/api/admin/payments",
  adminPaymentRoutes
);
app.use("/api/reviews", reviewRoutes);
/* =========================================================
   ROOT
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MAMTA Backend is running",
  });
});

/* =========================================================
   404 ROUTE
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

/* =========================================================
   SERVER START
========================================================= */

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    /* ---------------------------------------------
       CHECK MONGO URI
    --------------------------------------------- */

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from backend/.env"
      );
    }

    /* ---------------------------------------------
       CONNECT DATABASE FIRST
    --------------------------------------------- */

    await connectDB();

    /* ---------------------------------------------
       START SERVER
    --------------------------------------------- */

    app.listen(PORT, () => {
      console.log("");
      console.log("========================================");
      console.log("       MAMTA BACKEND STARTED");
      console.log("========================================");
      console.log(
        `Server: http://localhost:${PORT}`
      );
      console.log(
        `Products: http://localhost:${PORT}/api/products`
      );
      console.log("========================================");
      console.log("");
    });

  } catch (error) {
    console.error("");
    console.error(
      "========================================"
    );
    console.error(
      "       BACKEND STARTUP FAILED"
    );
    console.error(
      "========================================"
    );
    console.error(error.message);
    console.error(
      "========================================"
    );
    console.error("");

    process.exit(1);
  }
};

startServer();
