
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
// GENERATE 6-DIGIT VERIFICATION CODE
// =========================================================

const generateVerificationCode = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};


// =========================================================
// REGISTER
// =========================================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;


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

    const cleanEmail =
      email.trim().toLowerCase();


    if (!cleanName) {
      return res.status(400).json({
        message:
          "Name is required.",
      });
    }


    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters.",
      });
    }


    // =====================================================
    // CHECK EXISTING USER
    // =====================================================

    const existingUser =
      await User.findOne({
        email: cleanEmail,
      });


    if (existingUser) {

      // ---------------------------------------------------
      // EXISTING BUT NOT VERIFIED
      // ---------------------------------------------------

      if (!existingUser.isVerified) {

        const verificationCode =
          generateVerificationCode();


        const verificationExpires =
          new Date(
            Date.now() +
            24 * 60 * 60 * 1000
          );


        existingUser.emailVerificationCode =
          verificationCode;


        existingUser.emailVerificationExpires =
          verificationExpires;


        await existingUser.save();


        // Send fresh code

        try {

          await sendVerificationEmail(
            existingUser.email,
            existingUser.name,
            verificationCode
          );

        } catch (emailError) {

          console.error(
            "RESEND VERIFICATION EMAIL ERROR:",
            emailError
          );

          return res.status(500).json({
            message:
              "Account exists but verification code could not be sent. Please try again.",
          });
        }


        return res.status(200).json({

          message:
            "This email is already registered but not verified. A new verification code has been sent.",

          needsVerification: true,

          email: existingUser.email,

        });
      }


      // ---------------------------------------------------
      // EXISTING AND VERIFIED
      // ---------------------------------------------------

      return res.status(400).json({
        message:
          "Email already registered.",
      });
    }


    // =====================================================
    // HASH PASSWORD
    // =====================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );


    // =====================================================
    // GENERATE 6-DIGIT CODE
    // =====================================================

    const verificationCode =
      generateVerificationCode();


    const verificationExpires =
      new Date(
        Date.now() +
        24 * 60 * 60 * 1000
      );


    // =====================================================
    // CREATE USER
    // =====================================================

    const user = await User.create({

      name: cleanName,

      email: cleanEmail,

      password: hashedPassword,

      isVerified: false,

      emailVerificationCode:
        verificationCode,

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
        verificationCode
      );

    } catch (emailError) {

      console.error(
        "VERIFICATION EMAIL ERROR:",
        emailError
      );


      // Remove account if email could
      // not be sent

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
        "Registration successful. Please check your email for the 6-digit verification code.",

      needsVerification: true,

      email: user.email,

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
// VERIFY EMAIL USING 6-DIGIT CODE
// =========================================================

const verifyEmail = async (req, res) => {
  try {

    const {
      email,
      code,
    } = req.body;


    // -------------------------
    // VALIDATION
    // -------------------------

    if (!email || !code) {
      return res.status(400).json({
        message:
          "Email and verification code are required.",
      });
    }


    const cleanEmail =
      email.trim().toLowerCase();


    const cleanCode =
      code.toString().trim();


    // Make sure code is exactly 6 digits

    if (!/^\d{6}$/.test(cleanCode)) {

      return res.status(400).json({
        message:
          "Verification code must be exactly 6 digits.",
      });

    }


    // =====================================================
    // FIND USER
    // =====================================================

    const user =
      await User.findOne({
        email: cleanEmail,
      });


    if (!user) {

      return res.status(404).json({
        message:
          "User not found.",
      });

    }


    // =====================================================
    // ALREADY VERIFIED
    // =====================================================

    if (user.isVerified) {

      return res.status(400).json({
        message:
          "Email is already verified.",
      });

    }


    // =====================================================
    // CHECK CODE EXISTS
    // =====================================================

    if (!user.emailVerificationCode) {

      return res.status(400).json({
        message:
          "No verification code found. Please request a new code.",
      });

    }


    // =====================================================
    // CHECK EXPIRY
    // =====================================================

    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires < new Date()
    ) {

      return res.status(400).json({
        message:
          "Verification code has expired. Please request a new code.",
      });

    }


    // =====================================================
    // CHECK CODE
    // =====================================================

    if (
      user.emailVerificationCode !==
      cleanCode
    ) {

      return res.status(400).json({
        message:
          "Invalid verification code.",
      });

    }


    // =====================================================
    // VERIFY USER
    // =====================================================

    user.isVerified = true;

    user.emailVerificationCode = null;

    user.emailVerificationExpires = null;


    await user.save();


    // =====================================================
    // SUCCESS
    // =====================================================

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
// RESEND VERIFICATION CODE
// =========================================================

const resendVerificationEmail = async (
  req,
  res
) => {

  try {

    const {
      email,
    } = req.body;


    // -------------------------
    // VALIDATION
    // -------------------------

    if (!email) {

      return res.status(400).json({
        message:
          "Email address is required.",
      });

    }


    const cleanEmail =
      email.trim().toLowerCase();


    // =====================================================
    // FIND USER
    // =====================================================

    const user =
      await User.findOne({
        email: cleanEmail,
      });


    // Don't reveal whether account exists

    if (!user) {

      return res.status(200).json({

        message:
          "If an account exists with this email, a verification code has been sent.",

      });

    }


    // =====================================================
    // ALREADY VERIFIED
    // =====================================================

    if (user.isVerified) {

      return res.status(400).json({

        message:
          "This email is already verified. You can log in.",

        alreadyVerified: true,

      });

    }


    // =====================================================
    // GENERATE NEW 6-DIGIT CODE
    // =====================================================

    const verificationCode =
      generateVerificationCode();


    const verificationExpires =
      new Date(
        Date.now() +
        24 * 60 * 60 * 1000
      );


    // =====================================================
    // SAVE NEW CODE
    // =====================================================

    user.emailVerificationCode =
      verificationCode;


    user.emailVerificationExpires =
      verificationExpires;


    await user.save();


    // =====================================================
    // SEND EMAIL
    // =====================================================

    await sendVerificationEmail(
      user.email,
      user.name,
      verificationCode
    );


    // =====================================================
    // SUCCESS
    // =====================================================

    return res.status(200).json({

      message:
        "A new 6-digit verification code has been sent.",

      email: user.email,

    });

  } catch (error) {

    console.error(
      "RESEND VERIFICATION ERROR:",
      error
    );

    return res.status(500).json({

      message:
        "Unable to resend verification code. Please try again.",

    });

  }
};


// =========================================================
// LOGIN
// =========================================================

const login = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    if (!email || !password) {

      return res.status(400).json({
        message:
          "Email and password are required.",
      });

    }


    const user =
      await User.findOne({
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


    // =====================================================
    // EMAIL VERIFICATION REQUIRED
    // =====================================================

    if (!user.isVerified) {

      return res.status(403).json({

        message:
          "Please verify your email before logging in.",

        needsVerification: true,

        email: user.email,

      });

    }


    // =====================================================
    // COMPARE PASSWORD
    // =====================================================

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


    // =====================================================
    // GENERATE JWT
    // =====================================================

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

