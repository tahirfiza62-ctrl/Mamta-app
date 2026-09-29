
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  LoaderCircle,
} from "lucide-react";
import axios from "axios";

import "./VerifyEmail.css";

const API_URL = "http://localhost:3000/api";

const VerifyEmail = () => {
  const [searchParams] =
    useSearchParams();

  const [status, setStatus] =
    useState("loading");

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const verify = async () => {
      const token =
        searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage(
          "Verification token is missing."
        );
        return;
      }

      try {
        const response =
          await axios.get(
            `${API_URL}/auth/verify-email`,
            {
              params: {
                token,
              },
            }
          );

        setStatus("success");

        setMessage(
          response.data.message
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

    verify();
  }, [searchParams]);

  return (
    <main className="verify-email-page">

      <div className="verify-email-card">

        {status === "loading" && (
          <>
            <LoaderCircle
              className="verify-icon spinning"
            />

            <span className="verify-label">
              VERIFYING EMAIL
            </span>

            <h1>
              Please wait...
            </h1>

            <p>
              We're verifying your MAMTA
              email address.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle
              className="verify-icon success"
            />

            <span className="verify-label">
              EMAIL VERIFIED
            </span>

            <h1>
              You're all set.
            </h1>

            <p>
              {message}
            </p>

            <Link
              to="/login"
              className="verify-button"
            >
              CONTINUE TO LOGIN
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle
              className="verify-icon error"
            />

            <span className="verify-label">
              VERIFICATION FAILED
            </span>

            <h1>
              Link unavailable.
            </h1>

            <p>
              {message}
            </p>

            <Link
              to="/register"
              className="verify-button"
            >
              BACK TO REGISTER
            </Link>
          </>
        )}

      </div>

    </main>
  );
};

export default VerifyEmail;

