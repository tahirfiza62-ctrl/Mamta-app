
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  registerPushNotifications,
} from "../../utils/pushNotifications";
import axios from "axios";
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import "./AdminLogin.css";


const ADMIN_LOGIN_URL =
  "http://localhost:3000/api/auth/admin";

const AdminLogin = () => {
  const navigate = useNavigate();

  /* =========================================================
     FORM
  ========================================================= */

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* =========================================================
     STATE
  ========================================================= */

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    /* VALIDATION */

    if (!formData.email.trim()) {
      setError("Please enter your admin email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        ADMIN_LOGIN_URL,
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      console.log(
        "ADMIN LOGIN RESPONSE:",
        response.data
      );

      /* =====================================================
         GET RESPONSE DATA
      ===================================================== */

      const data = response.data;

      const token =
        data.token ||
        data.accessToken ||
        data.data?.token;

      const admin =
        data.admin ||
        data.user ||
        data.data?.admin ||
        data.data?.user;

      /* =====================================================
         TOKEN CHECK
      ===================================================== */

      if (!token) {
        setError(
          data.message ||
            "Admin login succeeded, but no authentication token was received."
        );

        return;
      }

      /* =====================================================
         SAVE ADMIN SESSION
      ===================================================== */

      localStorage.setItem(
        "mamta_admin_token",
        token
      );
await registerPushNotifications();
      if (admin) {
        localStorage.setItem(
          "mamta_admin",
          JSON.stringify(admin)
        );
      }

      localStorage.setItem(
        "mamta_admin_logged_in",
        "true"
      );

      /* =====================================================
         REDIRECT
      ===================================================== */

    navigate("/admin/dashboard", {
  replace: true,
});
    } catch (err) {
      console.error(
        "ADMIN LOGIN ERROR:",
        err
      );

      /* =====================================================
         ERROR MESSAGE
      ===================================================== */

      if (err.response) {
        setError(
          err.response.data?.message ||
            "Invalid admin email or password."
        );
      } else if (err.request) {
        setError(
          "Could not connect to the server. Please make sure your backend is running."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="mamta-admin-login">

      {/* =====================================================
          LEFT SIDE
      ===================================================== */}

      <div className="admin-login-brand">

        <div className="admin-login-brand-content">

          <div className="admin-login-logo">
            MAMTA
          </div>

          <span className="admin-login-label">
            ADMINISTRATION
          </span>

          <h1>
            Welcome to
            <br />
            MAMTA Admin
          </h1>

          <p>
            Manage your maternity and baby
            pillow collection from one secure
            dashboard.
          </p>

          <div className="admin-login-security">

            <ShieldCheck size={20} />

            <div>
              <strong>
                Secure Admin Access
              </strong>

              <span>
                Authorized administrators only
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="admin-login-form-section">

        <div className="admin-login-form-wrapper">

          {/* HEADER */}

          <div className="admin-login-header">

            <div className="admin-login-mobile-logo">
              MAMTA
            </div>

            <span>
              ADMIN LOGIN
            </span>

            <h2>
              Sign in to your account
            </h2>

            <p>
              Enter your admin credentials
              to continue.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          {/* FORM */}

          <form
            className="admin-login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="admin-login-field">

              <label htmlFor="admin-email">
                Email Address
              </label>

              <div className="admin-login-input">

                <Mail size={18} />

                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="admin-login-field">

              <label htmlFor="admin-password">
                Password
              </label>

              <div className="admin-login-input">

                <LockKeyhole size={18} />

                <input
                  id="admin-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
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
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <RefreshCw
                    size={18}
                    className="admin-login-spinner"
                  />

                  Signing in...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />

                  Sign In
                </>
              )}

            </button>

          </form>

          {/* FOOTER */}

          <div className="admin-login-footer">
            <span>
              MAMTA Administration
            </span>

            <small>
              Secure access for authorized administrators
            </small>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;
