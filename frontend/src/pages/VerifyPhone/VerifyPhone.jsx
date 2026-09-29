import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Phone,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

import "./VerifyPhone.css";

const VerifyPhone = () => {

  const navigate =
    useNavigate();

  const [searchParams] =
    useSearchParams();

  const phone =
    searchParams.get("phone") || "";

  const [otp, setOtp] =
    useState("");

  const [verifying, setVerifying] =
    useState(false);

  /* =========================================================
     VERIFY OTP
  ========================================================= */

  const handleVerify = async (e) => {

    e.preventDefault();

    /* ---------------------------------------------------------
       Phone missing
    --------------------------------------------------------- */

    if (!phone) {

      alert(
        "Phone number is missing. Please return to checkout."
      );

      navigate(
        "/checkout"
      );

      return;
    }

    /* ---------------------------------------------------------
       OTP validation
    --------------------------------------------------------- */

    if (!otp.trim()) {

      alert(
        "Please enter the verification code."
      );

      return;
    }

    if (
      otp.length !== 6
    ) {

      alert(
        "Please enter the 6-digit verification code."
      );

      return;
    }

    try {

      setVerifying(true);

      /*
       * -------------------------------------------------------
       * REAL BACKEND OTP
       * -------------------------------------------------------
       *
       * When your backend OTP endpoint is ready,
       * replace the temporary section below with:
       *
       * const response = await axios.post(
       *   "http://localhost:3000/api/auth/verify-phone",
       *   {
       *     phone,
       *     otp,
       *   }
       * );
       *
       * Then check response.data.success.
       *
       * -------------------------------------------------------
       */

      /*
       * TEMPORARY DEVELOPMENT VERIFICATION
       *
       * This accepts a 6-digit OTP so you can test
       * the complete checkout navigation right now.
       *
       * IMPORTANT:
       * This is NOT real SMS verification.
       */

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            700
          )
      );

      /* ---------------------------------------------------------
         Store only the verified phone number for this session.
      --------------------------------------------------------- */

      sessionStorage.setItem(
        "mamta_phone_verified",
        phone
      );

      /* ---------------------------------------------------------
         Return to checkout
      --------------------------------------------------------- */

      navigate(
        "/checkout"
      );

    } catch (error) {

      console.error(
        "PHONE VERIFICATION ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Unable to verify phone number. Please try again."
      );

    } finally {

      setVerifying(false);

    }

  };

  /* =========================================================
     CHANGE PHONE
  ========================================================= */

  const handleChangePhone = () => {

    sessionStorage.removeItem(
      "mamta_phone_verified"
    );

    navigate(
      "/checkout"
    );

  };

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="verify-phone-page">

      <div className="verify-phone-card">

        {/* =================================================
            BACK
        ================================================== */}

        <button
          type="button"
          className="verify-phone-back"
          onClick={() =>
            navigate(
              "/checkout"
            )
          }
        >

          <ArrowLeft
            size={17}
          />

          Back to Checkout

        </button>

        {/* =================================================
            ICON
        ================================================== */}

        <div className="verify-phone-icon">

          <Phone
            size={30}
          />

        </div>

        {/* =================================================
            HEADING
        ================================================== */}

        <span className="verify-phone-eyebrow">

          MAMTA SECURITY

        </span>

        <h1>
          Verify Your Phone
        </h1>

        <p>
          Enter the 6-digit verification code
          sent to your mobile number.
        </p>

        {/* =================================================
            PHONE NUMBER
        ================================================== */}

        <div className="verify-phone-number">

          <Phone
            size={17}
          />

          <strong>
            {phone}
          </strong>

          <button
            type="button"
            onClick={
              handleChangePhone
            }
          >
            Change
          </button>

        </div>

        {/* =================================================
            FORM
        ================================================== */}

        <form
          onSubmit={
            handleVerify
          }
          className="verify-phone-form"
        >

          <label>
            Verification Code
          </label>

          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value
                  .replace(
                    /\D/g,
                    ""
                  )
                  .slice(
                    0,
                    6
                  )
              )
            }
            placeholder="000000"
            autoFocus
          />

          <span className="verify-phone-code-hint">

            Enter the 6-digit code to continue.

          </span>

          {/* =================================================
              VERIFY
          ================================================== */}

          <button
            type="submit"
            disabled={
              verifying ||
              otp.length !== 6
            }
            className="verify-phone-submit"
          >

            {verifying ? (
              <>
                <RefreshCw
                  size={18}
                  className="verify-phone-spinner"
                />

                VERIFYING...
              </>
            ) : (
              <>
                <CheckCircle2
                  size={18}
                />

                VERIFY PHONE NUMBER
              </>
            )}

          </button>

        </form>

        {/* =================================================
            SECURITY
        ================================================== */}

        <div className="verify-phone-secure">

          <ShieldCheck
            size={18}
          />

          <span>
            Your phone number is securely verified
            before placing your order.
          </span>

        </div>

      </div>

    </main>
  );
};

export default VerifyPhone;