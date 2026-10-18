import { useState } from "react";
import {
  ArrowUpRight,
  Mail,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";

import ScrollReveal from "../ScrollReveal/ScrollReveal";
import "./Newsletter.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  /* =========================================================
     SUBSCRIBE
  ========================================================= */

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/newsletter/subscribe`,
        {
          email: cleanEmail,
        }
      );

      if (response.data.success) {
        setEmail("");
        setSubscribed(true);

        setMessage(
          response.data.message ||
            "You have successfully joined the MAAMTA Circle!"
        );
      }
    } catch (err) {
      console.error("NEWSLETTER SUBSCRIBE ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to subscribe right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleSubscribeAgain = () => {
    setSubscribed(false);
    setMessage("");
    setError("");
    setEmail("");
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="mamta-newsletter-section">

      {/* Decorative Elements */}
      <div className="newsletter-glow newsletter-glow-one"></div>
      <div className="newsletter-glow newsletter-glow-two"></div>

      <div className="newsletter-inner">

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}

        <ScrollReveal direction="up">

          <div className="newsletter-content">

            <div className="newsletter-label">

              <span className="newsletter-line"></span>

              <Sparkles size={14} />

              <span>THE MAAMTA CIRCLE</span>

              <span className="newsletter-line"></span>

            </div>

            <h2>
              A little more
              <br />
              <em>care, delivered.</em>
            </h2>

            <p>
              Join our little circle for new collections,
              thoughtful offers, motherhood essentials and
              beautiful moments from MAAMTA.
            </p>

          </div>

        </ScrollReveal>


        {/* =====================================================
            RIGHT FORM
        ===================================================== */}

        <ScrollReveal
          direction="up"
          className="newsletter-form-reveal"
        >

          <div className="newsletter-form-wrapper">

            {/* =================================================
                SUCCESS STATE
            ================================================= */}

            {subscribed ? (

              <div className="newsletter-success-state">

                <div className="newsletter-success-icon">
                  <CheckCircle2 size={34} />
                </div>

                <span className="newsletter-success-label">
                  WELCOME TO THE MAAMTA CIRCLE
                </span>

                <h3>
                  You're officially
                  <br />
                  <em>part of the circle.</em>
                </h3>

                <p>
                  Thank you for joining MAAMTA. We'll send you
                  thoughtful updates, new collections and
                  special moments straight to your inbox.
                </p>

                <button
                  type="button"
                  className="newsletter-subscribe-again"
                  onClick={handleSubscribeAgain}
                >
                  Subscribe another email
                  <ArrowUpRight size={17} />
                </button>

              </div>

            ) : (

              <>
                {/* =============================================
                    FORM HEADING
                ============================================= */}

                <div className="newsletter-form-heading">

                  <div className="mail-icon">
                    <Mail size={20} />
                  </div>

                  <div>
                    <span>STAY CONNECTED</span>

                    <p>
                      Receive MAAMTA in your inbox.
                    </p>
                  </div>

                </div>


                {/* =============================================
                    EMAIL FORM
                ============================================= */}

                <form
                  className="mamta-newsletter-form"
                  onSubmit={handleSubscribe}
                >

                  <div className="newsletter-input-wrapper">

                    <input
                      type="email"
                      placeholder="Enter your email address"
                      aria-label="Email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                        setMessage("");
                      }}
                      required
                      disabled={loading}
                    />

                  </div>


                  <button
                    type="submit"
                    disabled={loading}
                  >

                    <span>
                      {loading
                        ? "Joining..."
                        : "Join the circle"}
                    </span>

                    {!loading && (
                      <ArrowUpRight size={18} />
                    )}

                  </button>

                </form>


                {/* =============================================
                    MESSAGE
                ============================================= */}

                {error && (
                  <p className="newsletter-error">
                    {error}
                  </p>
                )}

                {message && !error && (
                  <p className="newsletter-success">
                    {message}
                  </p>
                )}

                {!error && !message && (
                  <p className="newsletter-note">
                    No clutter. Just thoughtful updates from MAAMTA.
                  </p>
                )}

              </>
            )}

          </div>

        </ScrollReveal>

      </div>

    </section>
  );
};

export default Newsletter;