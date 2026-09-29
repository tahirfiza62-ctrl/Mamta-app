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

const API_URL = "http://localhost:3000/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      const { token, user } = response.data;

      // Customer session
      localStorage.setItem("mamta_user_token", token);
      localStorage.setItem(
        "mamta_user",
        JSON.stringify(user)
      );

      // Compatibility with existing frontend
      localStorage.setItem("mamta_token", token);
      localStorage.setItem(
        "mamta_user_data",
        JSON.stringify(user)
      );

      window.dispatchEvent(new Event("authChanged"));

      navigate("/login");
    } catch (error) {
      console.error("REGISTER ERROR:", error);

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

      <div className="register-bg-circle register-bg-one"></div>
      <div className="register-bg-circle register-bg-two"></div>

      <div className="mamta-register-container">

        {/* LEFT VISUAL */}
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

        {/* FORM */}
        <section className="register-form-panel">

          <div className="register-form-wrapper">

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

            {error && (
              <div className="register-error">
                {error}
              </div>
            )}

            <form
              className="mamta-register-form"
              onSubmit={handleSubmit}
            >

              {/* NAME */}
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
                  />
                </div>
              </div>

              {/* EMAIL */}
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
                  />
                </div>
              </div>

              {/* PASSWORDS */}
              <div className="register-password-row">

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
                    />

                    <button
                      type="button"
                      className="register-eye"
                      onClick={() =>
                        setShowPassword(!showPassword)
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
                    />

                    <button
                      type="button"
                      className="register-eye"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
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

              {/* SUBMIT */}
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

                {!loading && <ArrowRight size={18} />}
              </button>

            </form>

            <p className="register-switch">
              Already have an account?
              <Link to="/login">
                Sign in
              </Link>
            </p>

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