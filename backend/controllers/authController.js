const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const {
  sendVerificationEmail,
} = require("../utils/sendEmail");


// =========================================================
// GENERATE JWT
// =========================================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};


// =========================================================
// REGISTER
// =========================================================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // -------------------------
    // VALIDATION
    // -------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      return res.status(400).json({
        message: "Name is required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters.",
      });
    }


    // -------------------------
    // CHECK EXISTING USER
    // -------------------------

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {

      // Existing but NOT verified
      // Send a fresh verification email

      if (!existingUser.isVerified) {

        const verificationToken =
          crypto.randomBytes(32).toString("hex");

        const hashedVerificationToken =
          crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        existingUser.emailVerificationToken =
          hashedVerificationToken;

        existingUser.emailVerificationExpires =
          new Date(
            Date.now() + 24 * 60 * 60 * 1000
          );

        await existingUser.save();

        try {

          await sendVerificationEmail(
            existingUser.email,
            existingUser.name,
            verificationToken
          );

        } catch (emailError) {

          console.error(
            "RESEND VERIFICATION EMAIL ERROR:",
            emailError
          );

          return res.status(500).json({
            message:
              "Account exists but verification email could not be sent. Please try again.",
          });
        }

        return res.status(200).json({
          message:
            "This email is already registered but not verified. A new verification email has been sent.",
          needsVerification: true,
        });
      }


      // Existing AND verified

      return res.status(400).json({
        message:
          "Email already registered.",
      });
    }


    // =====================================================
    // HASH PASSWORD
    // =====================================================

    const hashedPassword =
      await bcrypt.hash(password, 10);


    // =====================================================
    // CREATE VERIFICATION TOKEN
    // =====================================================

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const hashedVerificationToken =
      crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

    const verificationExpires =
      new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );


    // =====================================================
    // CREATE USER
    // =====================================================

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,

      isVerified: false,

      emailVerificationToken:
        hashedVerificationToken,

      emailVerificationExpires:
        verificationExpires,
    });


    // =====================================================
    // SEND VERIFICATION EMAIL
    // =====================================================

    try {

      await sendVerificationEmail(
        user.email,
        user.name,
        verificationToken
      );

    } catch (emailError) {

      console.error(
        "VERIFICATION EMAIL ERROR:",
        emailError
      );

      // Remove account if email couldn't be sent

      await User.findByIdAndDelete(
        user._id
      );

      return res.status(500).json({
        message:
          "Account could not be created because the verification email could not be sent.",
      });
    }


    // =====================================================
    // SUCCESS
    // =====================================================

    return res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",

      needsVerification: true,
    });

  } catch (error) {

    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to create account.",
    });
  }
};


// =========================================================
// VERIFY EMAIL
// =========================================================

const verifyEmail = async (req, res) => {
  try {

    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message:
          "Verification token is missing.",
      });
    }


    // Hash token received from email

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");


    // Find matching user

    const user = await User.findOne({
      emailVerificationToken:
        hashedToken,

      emailVerificationExpires: {
        $gt: new Date(),
      },
    });


    if (!user) {
      return res.status(400).json({
        message:
          "This verification link is invalid or has expired.",
      });
    }


    // Mark verified

    user.isVerified = true;

    user.emailVerificationToken = null;

    user.emailVerificationExpires = null;

    await user.save();


    return res.status(200).json({
      message:
        "Email verified successfully. You can now log in.",
    });

  } catch (error) {

    console.error(
      "VERIFY EMAIL ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to verify email.",
    });
  }
};


// =========================================================
// RESEND VERIFICATION EMAIL
// =========================================================

const resendVerificationEmail = async (
  req,
  res
) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message:
          "Email address is required.",
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();


    const user = await User.findOne({
      email: cleanEmail,
    });


    // Don't reveal whether an email exists

    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a verification email has been sent.",
      });
    }


    // Already verified

    if (user.isVerified) {
      return res.status(400).json({
        message:
          "This email is already verified. You can log in.",

        alreadyVerified: true,
      });
    }


    // Generate new token

    const verificationToken =
      crypto.randomBytes(32).toString("hex");


    const hashedVerificationToken =
      crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");


    user.emailVerificationToken =
      hashedVerificationToken;


    user.emailVerificationExpires =
      new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );


    await user.save();


    // Send email

    await sendVerificationEmail(
      user.email,
      user.name,
      verificationToken
    );


    return res.status(200).json({
      message:
        "A new verification email has been sent.",
    });

  } catch (error) {

    console.error(
      "RESEND VERIFICATION ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to resend verification email. Please try again.",
    });
  }
};


// =========================================================
// LOGIN
// =========================================================

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required.",
      });
    }


    const user = await User.findOne({
      email:
        email.trim().toLowerCase(),
    });


    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }


    if (!user.active) {
      return res.status(403).json({
        message:
          "Account is inactive.",
      });
    }


    // Email verification required

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Please verify your email before logging in.",

        needsVerification: true,

        email: user.email,
      });
    }


    // Compare password

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }


    // Generate JWT

    const token =
      generateToken(user);


    return res.json({
      message:
        "Login successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error.",
    });
  }
};


// =========================================================
// GET CURRENT USER
// =========================================================

const getMe = async (req, res) => {
  try {

    const user =
      await User.findById(
        req.user.id
      ).select("-password");


    if (!user) {
      return res.status(404).json({
        message:
          "User not found.",
      });
    }


    return res.json({
      user,
    });

  } catch (error) {

    console.error(
      "GET ME ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Server error.",
    });
  }
};


// =========================================================
// CHANGE PASSWORD
// =========================================================

const changePassword = async (
  req,
  res
) => {
  try {

    const {
      currentPassword,
      newPassword,
    } = req.body;


    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        message:
          "Current password and new password are required.",
      });
    }


    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters.",
      });
    }


    const user =
      await User.findById(
        req.user.id
      );


    if (!user) {
      return res.status(404).json({
        message:
          "User not found.",
      });
    }


    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );


    if (!passwordMatch) {
      return res.status(400).json({
        message:
          "Current password is incorrect.",
      });
    }


    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );


    user.password =
      hashedPassword;


    await user.save();


    return res.json({
      message:
        "Password changed successfully.",
    });

  } catch (error) {

    console.error(
      "CHANGE PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to change password.",
    });
  }
};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerificationEmail,
  getMe,
  changePassword,
};