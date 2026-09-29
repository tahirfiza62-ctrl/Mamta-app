import { ArrowUpRight, Mail, Sparkles } from "lucide-react";
import ScrollReveal from "../ScrollReveal/ScrollReveal";
import "./Newsletter.css";

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="mamta-newsletter-section">

      {/* Decorative Elements */}
      <div className="newsletter-glow newsletter-glow-one"></div>
      <div className="newsletter-glow newsletter-glow-two"></div>

      <div className="newsletter-inner">

        {/* LEFT CONTENT */}
        <ScrollReveal direction="up">
          <div className="newsletter-content">

            <div className="newsletter-label">
              <span className="newsletter-line"></span>

              <Sparkles size={14} />

              <span>THE MAMTA CIRCLE</span>

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
              beautiful moments from MAMTA.
            </p>

          </div>
        </ScrollReveal>


        {/* RIGHT FORM */}
        <ScrollReveal
          direction="up"
          className="newsletter-form-reveal"
        >
          <div className="newsletter-form-wrapper">

            <div className="newsletter-form-heading">

              <div className="mail-icon">
                <Mail size={20} />
              </div>

              <div>
                <span>STAY CONNECTED</span>
                <p>Receive MAMTA in your inbox.</p>
              </div>

            </div>


            <form
              className="mamta-newsletter-form"
              onSubmit={handleSubmit}
            >

              <div className="newsletter-input-wrapper">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  required
                />
              </div>

              <button type="submit">
                <span>Join the circle</span>
                <ArrowUpRight size={18} />
              </button>

            </form>


            <p className="newsletter-note">
              No clutter. Just thoughtful updates from MAMTA.
            </p>

          </div>
        </ScrollReveal>

      </div>

    </section>
  );
};

export default Newsletter;