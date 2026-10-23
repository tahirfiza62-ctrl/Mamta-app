
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  LoaderCircle,
  Mail,
} from "lucide-react";
import axios from "axios";

import "./VerifyEmail.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mamta-app-8.onrender.com/api";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleCodeChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setCode(value);
    setMessage("");
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      setStatus("error");
      setMessage("Please enter the 6-digit verification code.");
      return;
    }

    if (!email) {
      setStatus("error");
      setMessage(
        "Email address is missing. Please register again."
      );
      return;
    }

    try {
      setStatus("loading");
      setMessage("");

      const response = await axios.post(
        `${API_URL}/auth/verify-email`,
        {
          email,
          code,
        }
      );

      setStatus("success");
      setMessage(
        response.data.message ||
          "Your email has been verified successfully."
      );

    } catch (error) {
      console.error(
        "EMAIL VERIFICATION ERROR:",
        error
      );

      setStatus("error");

      setMessage(
        error.response?.data?.message ||
          "Unable to verify your email."
      );
    }
  };

  return (
    <main className="verify-email-page">

      <div className="verify-email-card">

        {/* SUCCESS */}

        {status === "success" ? (
          <>
            <div className="verify-success-icon">
              <CheckCircle size={34} />
            </div>

            <span className="verify-email-label">
              EMAIL VERIFIED
            </span>

            <h1>
              You're all <em>set.</em>
            </h1>

            <p className="verify-description">
              {message}
            </p>

            <button
              type="button"
              className="verify-button"
              onClick={() => navigate("/login")}
            >
              CONTINUE TO LOGIN
            </button>
          </>
        ) : (
          <>
            {/* ICON */}

            <div className="verify-mail-icon">
              <Mail size={30} />
            </div>

            {/* LABEL */}

            <span className="verify-email-label">
              EMAIL VERIFICATION
            </span>

            {/* TITLE */}

            <h1>
              Enter your <em>code.</em>
            </h1>

            {/* DESCRIPTION */}

            <p className="verify-description">
              We've sent a 6-digit verification code to
            </p>

            <strong className="verify-email-address">
              {email || "your email address"}
            </strong>

            {/* FORM */}

            <form
              className="verify-form"
              onSubmit={handleVerify}
            >

              <label
                htmlFor="verification-code"
                className="verify-code-label"
              >
                VERIFICATION CODE
              </label>

              <input
                id="verification-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                className={`verify-code-input ${
                  status === "error" && message
                    ? "input-error"
                    : ""
                }`}
                disabled={status === "loading"}
              />

              <div className="verify-code-count">
                {code.length}/6
              </div>

              {/* ERROR */}

              {status === "error" && message && (
                <div className="verify-error-message">
                  <XCircle size={17} />
                  <span>{message}</span>
                </div>
              )}

              {/* BUTTON */}

              <button
                type="submit"
                className="verify-button"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="verify-spinner"
                    />
                    VERIFYING...
                  </>
                ) : (
                  "VERIFY EMAIL"
                )}
              </button>

            </form>

            {/* EXPIRY */}

            <div className="verify-note">
              Your verification code expires in
              <strong> 24 hours.</strong>
            </div>

            {/* BACK */}

            <Link
              to="/"
              className="verify-back"
            >
              Back to MAMTA
            </Link>
          </>
        )}

      </div>

    </main>
  );
};

export default VerifyEmail;

