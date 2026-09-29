const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl =
    `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"MAMTA" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your MAMTA account",

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Verify your MAMTA account</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background: #fff9f4;
            font-family: Arial, Helvetica, sans-serif;
            color: #4a3032;
          "
        >

          <div
            style="
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 22px;
              overflow: hidden;
              box-shadow: 0 15px 50px rgba(74, 48, 50, 0.08);
            "
          >

            <!-- HEADER -->

            <div
              style="
                padding: 38px 25px;
                text-align: center;
                background: #4a3032;
              "
            >
              <div
                style="
                  color: #ffffff;
                  font-size: 28px;
                  font-weight: 700;
                  letter-spacing: 5px;
                "
              >
                MAMTA
              </div>

              <div
                style="
                  margin-top: 10px;
                  color: #f4ddd6;
                  font-size: 11px;
                  letter-spacing: 2px;
                "
              >
                THOUGHTFUL COMFORT
              </div>
            </div>

            <!-- CONTENT -->

            <div
              style="
                padding: 45px 40px;
                text-align: center;
              "
            >

              <div
                style="
                  width: 70px;
                  height: 70px;
                  margin: 0 auto 25px;
                  border-radius: 50%;
                  background: #f8ebe5;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 30px;
                "
              >
                ♡
              </div>

              <h1
                style="
                  margin: 0 0 15px;
                  color: #4a3032;
                  font-size: 28px;
                  font-weight: 600;
                "
              >
                Welcome to MAMTA
              </h1>

              <p
                style="
                  margin: 0 0 15px;
                  color: #806a6e;
                  font-size: 15px;
                "
              >
                Hi ${name},
              </p>

              <p
                style="
                  margin: 0 auto 30px;
                  max-width: 440px;
                  color: #806a6e;
                  font-size: 14px;
                  line-height: 1.8;
                "
              >
                Thank you for creating your MAMTA account.
                Please verify your email address to complete
                your registration.
              </p>

              <a
                href="${verificationUrl}"
                style="
                  display: inline-block;
                  padding: 15px 30px;
                  background: #4a3032;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 10px;
                  font-size: 12px;
                  font-weight: 600;
                  letter-spacing: 1px;
                "
              >
                VERIFY MY EMAIL
              </a>

              <p
                style="
                  margin: 30px 0 0;
                  color: #9a8588;
                  font-size: 12px;
                  line-height: 1.7;
                "
              >
                This verification link expires in 24 hours.
              </p>

              <p
                style="
                  margin: 15px 0 0;
                  color: #9a8588;
                  font-size: 12px;
                  line-height: 1.7;
                "
              >
                If you did not create a MAMTA account,
                you can safely ignore this email.
              </p>

            </div>

            <!-- FOOTER -->

            <div
              style="
                padding: 22px;
                text-align: center;
                background: #fcf5f1;
                color: #9a8588;
                font-size: 11px;
              "
            >
              © ${new Date().getFullYear()} MAMTA.
              All rights reserved.
            </div>

          </div>

        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
};