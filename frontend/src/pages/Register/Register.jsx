import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import axios from "axios";
import "./Register.css";
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mamta-app-8.onrender.com/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     HANDLE INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  /* =========================================================
     HANDLE REGISTER
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    /* =======================================================
       REQUIRED FIELDS
    ======================================================= */

    if (!name || !email || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    /* =======================================================
       EMAIL FORMAT
    ======================================================= */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    /* =======================================================
       PASSWORD LENGTH
    ======================================================= */

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    /* =======================================================
       PASSWORD MATCH
    ======================================================= */

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      /* =====================================================
         REGISTER CUSTOMER
      ===================================================== */

      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("REGISTER SUCCESS:", response.data);

      /*
        IMPORTANT:

        We do NOT save a JWT here.

        The customer must verify their email first.
      */

      /* =====================================================
         GO TO EMAIL SENT PAGE
      ===================================================== */

      navigate("/email-sent", {
        state: {
          email,
        },
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      console.error("SERVER RESPONSE:", error.response?.data);

      setError(
        error.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mamta-register-page">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="register-bg-circle register-bg-one"></div>

      <div className="register-bg-circle register-bg-two"></div>

      <div className="mamta-register-container">

        {/* ===================================================
            LEFT VISUAL
        =================================================== */}

        <section className="register-visual">

          <div className="register-visual-inner">

            <div className="register-logo">
              <Heart size={17} fill="currentColor" />
              <span>MAMTA</span>
            </div>

            <div className="register-number">
              <span>02</span>
              <div></div>
              <small>YOUR JOURNEY</small>
            </div>

            <div className="register-visual-copy">

              <span>MADE FOR LITTLE MOMENTS</span>

              <h1>
                A softer
                <br />
                <em>way to care.</em>
              </h1>

              <p>
                Create your MAMTA account and keep your
                favourite comfort essentials close.
              </p>

            </div>

            <div className="register-orbit"></div>

          </div>

        </section>

        {/* ===================================================
            REGISTER FORM
        =================================================== */}

        <section className="register-form-panel">

          <div className="register-form-wrapper">

            {/* =================================================
                HEADING
            ================================================= */}

            <div className="register-heading">

              <span>CREATE ACCOUNT</span>

              <h2>
                Welcome to <em>MAMTA</em>
              </h2>

              <p>
                Join us for thoughtful comfort made for
                mothers, babies and growing families.
              </p>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div
                className="register-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}

            <form
              className="mamta-register-form"
              onSubmit={handleSubmit}
            >

              {/* =================================================
                  NAME
              ================================================= */}

              <div className="register-field">

                <label htmlFor="name">
                  FULL NAME
                </label>

                <div className="register-input">

                  <UserRound size={17} />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    disabled={loading}
                  />

                </div>

              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="register-field">

                <label htmlFor="email">
                  EMAIL ADDRESS
                </label>

                <div className="register-input">

                  <Mail size={17} />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={loading}
                  />

                </div>

              </div>

              {/* =================================================
                  PASSWORD ROW
              ================================================= */}

              <div className="register-password-row">

                {/* PASSWORD */}

                <div className="register-field">

                  <label htmlFor="password">
                    PASSWORD
                  </label>

                  <div className="register-input">

                    <LockKeyhole size={17} />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="register-eye"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      disabled={loading}
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                  </div>

                </div>

                {/* CONFIRM PASSWORD */}

                <div className="register-field">

                  <label htmlFor="confirmPassword">
                    CONFIRM PASSWORD
                  </label>

                  <div className="register-input">

                    <LockKeyhole size={17} />

                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      placeholder="Confirm"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="register-eye"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      disabled={loading}
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                  </div>

                </div>

              </div>

              {/* =================================================
                  SUBMIT
              ================================================= */}

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >

                <span>
                  {loading
                    ? "CREATING ACCOUNT..."
                    : "CREATE ACCOUNT"}
                </span>

                {!loading && (
                  <ArrowRight size={18} />
                )}

              </button>

            </form>

            {/* =================================================
                LOGIN LINK
            ================================================= */}

            <p className="register-switch">
              Already have an account?

              <Link to="/login">
                Sign in
              </Link>
            </p>

            {/* =================================================
                BACK HOME
            ================================================= */}

            <Link
              to="/"
              className="register-back-home"
            >
              ← Back to MAMTA
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
};

export default Register;