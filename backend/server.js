
require("dotenv").config({
  path: __dirname + "/.env",
});

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const app = express();

/* =========================================================
   DATABASE CONNECTION — REUSE BETWEEN REQUESTS
========================================================= */

let dbConnectionPromise = null;

const ensureDatabaseConnected = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from environment variables");
  }

  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB().catch((error) => {
      dbConnectionPromise = null;
      throw error;
    });
  }

  return dbConnectionPromise;
};

/* =========================================================
   CORS
   Add your deployed frontend URL in Vercel:
   FRONTEND_URL=https://your-frontend.vercel.app
========================================================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://mamta-frontend.vercel.app",
  "https://mamta-frontend.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

/* =========================================================
   BODY PARSER
========================================================= */

app.use(express.json());

/* =========================================================
   DATABASE MIDDLEWARE FOR API REQUESTS
========================================================= */

app.use("/api", async (req, res, next) => {
  try {
    await ensureDatabaseConnected();
    next();
  } catch (error) {
    console.error("DATABASE CONNECTION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
    });
  }
});

/* =========================================================
   ROUTE IMPORTS
========================================================= */

const newsletterRoutes = require("./routes/newsletterRoutes");
const paymentWebhookRoutes = require("./routes/paymentWebhookRoutes");

const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

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

app.use("/api/newsletter", newsletterRoutes);

app.use("/api/payments/webhook", paymentWebhookRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payments", paymentRoutes);

app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/customers", adminCustomerRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);

app.use("/api/push", pushRoutes);
app.use("/api/reviews", reviewRoutes);

/* =========================================================
   ROOT — HEALTH CHECK
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

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

/* =========================================================
   LOCAL DEVELOPMENT SERVER
========================================================= */

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await ensureDatabaseConnected();

    app.listen(PORT, () => {
      console.log("========================================");
      console.log("MAMTA BACKEND STARTED");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Products: http://localhost:${PORT}/api/products`);
      console.log("========================================");
    });
  } catch (error) {
    console.error("BACKEND STARTUP FAILED:", error.message);
    process.exitCode = 1;
  }
};

/* =========================================================
   EXPORT EXPRESS APP FOR VERCEL
========================================================= */

module.exports = app;

if (require.main === module && !process.env.VERCEL) {
  startServer();
}
