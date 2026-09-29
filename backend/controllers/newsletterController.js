const mongoose = require("mongoose");
const nodemailer = require("nodemailer");


// =========================================================
// NEWSLETTER MODEL
// =========================================================

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Newsletter =
  mongoose.models.Newsletter ||
  mongoose.model("Newsletter", newsletterSchema);


// =========================================================
// NODEMAILER
// =========================================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// =========================================================
// SUBSCRIBE
// =========================================================

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter your email address.",
      });
    }

    const cleanEmail =
      email.trim().toLowerCase();


    // -------------------------------------------------------
    // EMAIL VALIDATION
    // -------------------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address.",
      });
    }


    // -------------------------------------------------------
    // CHECK EXISTING SUBSCRIBER
    // -------------------------------------------------------

    const existingSubscriber =
      await Newsletter.findOne({
        email: cleanEmail,
      });

    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message:
          "This email is already subscribed to the MAMTA Circle.",
      });
    }


    // -------------------------------------------------------
    // SAVE SUBSCRIBER
    // -------------------------------------------------------

    const subscriber =
      await Newsletter.create({
        email: cleanEmail,
      });


    // -------------------------------------------------------
    // SEND EMAIL TO MAMTA CIRCLE
    // -------------------------------------------------------

    const mailOptions = {
      from: `"MAMTA Newsletter" <${process.env.EMAIL_USER}>`,

      to: process.env.NEWSLETTER_EMAIL,

      subject:
        "New MAMTA Circle Subscriber",

      html: `
        <!DOCTYPE html>

        <html>

          <head>
            <meta charset="UTF-8" />

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </head>


          <body
            style="
              margin:0;
              padding:0;
              background:#fff9f4;
              font-family:Arial,Helvetica,sans-serif;
              color:#4a3032;
            "
          >

            <div
              style="
                max-width:600px;
                margin:40px auto;
                background:#ffffff;
                border-radius:22px;
                overflow:hidden;
                box-shadow:0 15px 50px rgba(74,48,50,.08);
              "
            >

              <!-- HEADER -->

              <div
                style="
                  padding:38px 25px;
                  text-align:center;
                  background:#4a3032;
                "
              >

                <div
                  style="
                    color:#ffffff;
                    font-size:28px;
                    font-weight:700;
                    letter-spacing:5px;
                  "
                >
                  MAMTA
                </div>

                <div
                  style="
                    margin-top:10px;
                    color:#f4ddd6;
                    font-size:11px;
                    letter-spacing:2px;
                  "
                >
                  THE MAMTA CIRCLE
                </div>

              </div>


              <!-- CONTENT -->

              <div
                style="
                  padding:45px 40px;
                "
              >

                <div
                  style="
                    width:64px;
                    height:64px;
                    margin-bottom:24px;
                    border-radius:50%;
                    background:#f8ebe5;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:28px;
                  "
                >
                  ♡
                </div>


                <h1
                  style="
                    margin:0 0 15px;
                    color:#4a3032;
                    font-size:27px;
                    font-weight:600;
                  "
                >
                  New Circle Subscriber
                </h1>


                <p
                  style="
                    margin:0 0 25px;
                    color:#806a6e;
                    font-size:14px;
                    line-height:1.8;
                  "
                >
                  Someone has just joined the
                  MAMTA Circle.
                </p>


                <div
                  style="
                    padding:20px;
                    background:#fcf5f1;
                    border-radius:14px;
                    margin-bottom:25px;
                  "
                >

                  <div
                    style="
                      color:#9a8588;
                      font-size:10px;
                      letter-spacing:1.5px;
                      margin-bottom:8px;
                    "
                  >
                    SUBSCRIBER EMAIL
                  </div>

                  <div
                    style="
                      color:#4a3032;
                      font-size:16px;
                      font-weight:600;
                      word-break:break-word;
                    "
                  >
                    ${cleanEmail}
                  </div>

                </div>


                <div
                  style="
                    color:#9a8588;
                    font-size:12px;
                    line-height:1.8;
                  "
                >
                  <strong>
                    Subscription date:
                  </strong>

                  ${new Date().toLocaleString()}
                </div>

              </div>


              <!-- FOOTER -->

              <div
                style="
                  padding:22px;
                  text-align:center;
                  background:#fcf5f1;
                  color:#9a8588;
                  font-size:11px;
                "
              >
                © ${new Date().getFullYear()}
                MAMTA. All rights reserved.
              </div>

            </div>

          </body>

        </html>
      `,
    };


    // -------------------------------------------------------
    // SEND EMAIL
    // -------------------------------------------------------

    try {
      await transporter.sendMail(
        mailOptions
      );
    } catch (emailError) {

      console.error(
        "NEWSLETTER EMAIL ERROR:",
        emailError
      );

      // Remove subscriber if notification
      // email couldn't be sent.

      await Newsletter.findByIdAndDelete(
        subscriber._id
      );

      return res.status(500).json({
        success: false,
        message:
          "Subscription could not be completed. Please try again.",
      });
    }


    // -------------------------------------------------------
    // SUCCESS
    // -------------------------------------------------------

    return res.status(201).json({
      success: true,

      message:
        "You have successfully joined the MAMTA Circle!",
    });

  } catch (error) {

    console.error(
      "NEWSLETTER SUBSCRIBE ERROR:",
      error
    );


    // Duplicate email protection

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "This email is already subscribed to the MAMTA Circle.",
      });
    }


    return res.status(500).json({
      success: false,
      message:
        "Unable to subscribe right now. Please try again.",
    });
  }
};


module.exports = {
  subscribe,
};