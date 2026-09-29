
const jwt = require("jsonwebtoken");

/* =========================================================
   ADMIN LOGIN
   Credentials are taken from .env
========================================================= */

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("================================");
    console.log("ADMIN LOGIN ROUTE HIT");
    console.log("EMAIL RECEIVED:", email);
    console.log(
      "PASSWORD RECEIVED:",
      password ? "YES" : "NO"
    );
    console.log(
      "ADMIN EMAIL FROM ENV:",
      process.env.ADMIN_EMAIL
    );
    console.log(
      "ADMIN PASSWORD LOADED:",
      Boolean(process.env.ADMIN_PASSWORD)
    );
    console.log("================================");

    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    /* -------------------------------------------------------
       GET ADMIN CREDENTIALS
    ------------------------------------------------------- */

    const adminEmail =
      (process.env.ADMIN_EMAIL || "").trim();

    const adminPassword =
      process.env.ADMIN_PASSWORD || "";

    const adminName =
      process.env.ADMIN_NAME || "MAMTA Admin";

    /* -------------------------------------------------------
       CHECK ENV
    ------------------------------------------------------- */

    if (!adminEmail || !adminPassword) {
      console.error(
        "ADMIN_EMAIL or ADMIN_PASSWORD is missing from .env"
      );

      return res.status(500).json({
        success: false,
        message:
          "Admin credentials are not configured on the server.",
      });
    }

    /* -------------------------------------------------------
       CHECK EMAIL
    ------------------------------------------------------- */

    if (
      email.trim().toLowerCase() !==
      adminEmail.toLowerCase()
    ) {
      console.log("ADMIN EMAIL DOES NOT MATCH");

      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    /* -------------------------------------------------------
       CHECK PASSWORD
    ------------------------------------------------------- */

    if (password !== adminPassword) {
      console.log("ADMIN PASSWORD DOES NOT MATCH");

      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    /* -------------------------------------------------------
       CREATE JWT
    ------------------------------------------------------- */

    const token = jwt.sign(
      {
        id: "mamta-admin",
        email: adminEmail,
        role: "admin",
      },
      process.env.JWT_SECRET || "mamta_secret_key",
      {
        expiresIn: "7d",
      }
    );

    /* -------------------------------------------------------
       SUCCESS
    ------------------------------------------------------- */

    console.log("ADMIN LOGIN SUCCESSFUL");

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",

      token,

      admin: {
        id: "mamta-admin",
        name: adminName,
        email: adminEmail,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during admin login.",
    });
  }
};

module.exports = {
  adminLogin,
};

