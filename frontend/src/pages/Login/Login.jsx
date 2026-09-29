import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  Mail,
} from "lucide-react";
import axios from "axios";
import "./Login.css";

const API_URL = "http://localhost:3000/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/auth/login`,
        formData
      );

      const { token, user } = response.data;

      // Customer session
      localStorage.setItem("mamta_user_token", token);
      localStorage.setItem(
        "mamta_user",
        JSON.stringify(user)
      );

      // Keep compatibility with existing MAMTA frontend
      localStorage.setItem("mamta_token", token);
      localStorage.setItem(
        "mamta_user_data",
        JSON.stringify(user)
      );

      // Notify other components
      window.dispatchEvent(new Event("authChanged"));

      navigate("/");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mamta-auth-page">
      <div className="auth-background-shape auth-shape-one"></div>
      <div className="auth-background-shape auth-shape-two"></div>

      <div className="mamta-auth-container">

        {/* LEFT SIDE */}
        <section className="auth-brand-panel">
          <div className="auth-brand-content">

            <div className="auth-brand-mark">
              <Heart size={18} fill="currentColor" />
              <span>MAMTA</span>
            </div>

            <span className="auth-small-label">
              WELCOME BACK
            </span>

            <h1>
              Comfort begins
              <br />
              <em>with care.</em>
            </h1>

            <p>
              Sign in to continue your MAMTA journey and
              discover thoughtful comfort for mothers,
              babies and every little moment.
            </p>

            <div className="auth-brand-line"></div>

            <div className="auth-brand-note">
              <span>01</span>
              <div>
                <strong>Made with intention</strong>
                <small>
                  Soft essentials designed around you.
                </small>
              </div>
            </div>

          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="auth-form-panel">

          <div className="auth-form-wrapper">

            <div className="auth-form-heading">
              <span>HELLO AGAIN</span>

              <h2>
                Sign in to <em>MAMTA</em>
              </h2>

              <p>
                Enter your details below to access your account.
              </p>
            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            <form
              className="mamta-auth-form"
              onSubmit={handleSubmit}
            >

              {/* EMAIL */}
              <div className="auth-field">
                <label htmlFor="email">
                  EMAIL ADDRESS
                </label>

                <div className="auth-input-wrapper">
                  <Mail size={18} />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="auth-field">
                <div className="auth-label-row">
                  <label htmlFor="password">
                    PASSWORD
                  </label>

                  <Link
                    to="/forgot-password"
                    className="forgot-password"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="auth-input-wrapper">
                  <LockKeyhole size={18} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
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
                className="auth-submit"
                disabled={loading}
              >
                <span>
                  {loading ? "SIGNING IN..." : "SIGN IN"}
                </span>

                {!loading && <ArrowRight size={18} />}
              </button>

            </form>

            <div className="auth-divider">
              <span></span>
              <small>OR</small>
              <span></span>
            </div>

            <p className="auth-switch">
              Don't have an account?
              <Link to="/register">
                Create one
              </Link>
            </p>

            <Link
              to="/"
              className="auth-back-home"
            >
              ← Back to MAMTA
            </Link>

          </div>

        </section>
      </div>
    </main>
  );
};

export default Login;