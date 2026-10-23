
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  Mail,
} from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import "./Login.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mamta-app-8.onrender.com/api";
const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
  "6LfRtPYtAAAAAJ3_2BhKNA9HbniWJJhJWb6HgE5B";

const Login = () => {
  const navigate = useNavigate();
  const captchaRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!RECAPTCHA_SITE_KEY) {
      setError(
        "CAPTCHA is not configured. Please add your reCAPTCHA site key to the frontend .env file."
      );
      return;
    }

    if (!captchaToken) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: formData.email.trim(),
          password: formData.password,
          captchaToken,
        }
      );

      const { token, user, needsVerification } = response.data;

      // Handle accounts that require email verification.
      if (needsVerification) {
        navigate("/verify-email", {
          state: { email: formData.email.trim() },
        });
        return;
      }

      if (!token || !user) {
        setError("Login response is incomplete. Please try again.");
        return;
      }

      // Save customer session.
      localStorage.setItem("mamta_user_token", token);
      localStorage.setItem("mamta_user", JSON.stringify(user));

      // Maintain compatibility with existing frontend code.
      localStorage.setItem("mamta_token", token);
      localStorage.setItem("mamta_user_data", JSON.stringify(user));

      window.dispatchEvent(new Event("authChanged"));

      navigate("/");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );

      // CAPTCHA tokens should be refreshed after a failed attempt.
      setCaptchaToken(null);
      captchaRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mamta-auth-page">
      <div className="auth-background-shape auth-shape-one" />
      <div className="auth-background-shape auth-shape-two" />

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

            <div className="auth-brand-line" />

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
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}

            <form
              className="mamta-auth-form"
              onSubmit={handleSubmit}
              noValidate
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
                    maxLength={100}
                    required
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
                    required
                  />

               
<button
  type="button"
  className="password-toggle"
  onClick={() => setShowPassword((current) => !current)}
  aria-label={
    showPassword ? "Hide password" : "Show password"
  }
>
  {showPassword ? (
    <Eye size={19} />
  ) : (
    <EyeOff size={19} />
  )}
</button>


                </div>
              </div>

              {/* GOOGLE RECAPTCHA */}
              <div className="auth-captcha">
                {RECAPTCHA_SITE_KEY ? (
                  <ReCAPTCHA
                    ref={captchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={handleCaptchaChange}
                    onExpired={() => setCaptchaToken(null)}
                    onErrored={() => {
                      setCaptchaToken(null);
                      setError(
                        "CAPTCHA could not load. Please check your internet connection and site key."
                      );
                    }}
                  />
                ) : (
                  <p className="auth-captcha-error">
                    CAPTCHA site key is missing. Configure
                    VITE_RECAPTCHA_SITE_KEY in your frontend .env file.
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="auth-submit"
                disabled={loading || !captchaToken}
              >
                <span>
                  {loading ? "SIGNING IN..." : "SIGN IN"}
                </span>

                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="auth-divider">
              <span />
              <small>OR</small>
              <span />
            </div>

            <p className="auth-switch">
              Don't have an account?
              <Link to="/register">Create one</Link>
            </p>

            <Link to="/" className="auth-back-home">
              ← Back to MAMTA
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;