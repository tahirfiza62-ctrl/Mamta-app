const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    /* =====================================================
       GET AUTHORIZATION HEADER
    ===================================================== */

    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required",
      });
    }

    /* =====================================================
       GET TOKEN
    ===================================================== */

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token is missing.",
      });
    }

    /* =====================================================
       VERIFY TOKEN
    ===================================================== */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      "🔐 AUTH DECODED TOKEN:",
      decoded
    );

    /* =====================================================
       NORMALIZE USER ID

       Different parts of the application may use:

       id
       _id
       userId

       We normalize them so the rest of the
       backend can consistently use:

       req.user._id
    ===================================================== */

    const userId =
      decoded._id ||
      decoded.id ||
      decoded.userId;

    if (!userId) {
      console.error(
        "❌ AUTH ERROR: No user ID found in JWT"
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });
    }

    /* =====================================================
       CREATE NORMALIZED USER OBJECT
    ===================================================== */

    req.user = {
      ...decoded,

      /*
         IMPORTANT:
         Cart controller uses req.user._id
      */

      _id: userId,

      /*
         Keep id available too
      */

      id:
        decoded.id ||
        userId,

      /*
         Keep userId available too
      */

      userId:
        decoded.userId ||
        userId,
    };

    console.log(
      "✅ AUTH USER:",
      req.user
    );

    /* =====================================================
       CONTINUE
    ===================================================== */

    next();

  } catch (error) {
    console.error(
      "❌ AUTH MIDDLEWARE ERROR:",
      error
    );

    /* =====================================================
       JWT EXPIRED
    ===================================================== */

    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Your session has expired. Please login again.",
      });
    }

    /* =====================================================
       INVALID TOKEN
    ===================================================== */

    if (
      error.name ===
      "JsonWebTokenError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });
    }

    /* =====================================================
       OTHER AUTH ERROR
    ===================================================== */

    return res.status(401).json({
      success: false,
      message:
        "Authentication failed.",
    });
  }
};

module.exports = authMiddleware;