import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";

import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";

import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero" id="home">

      {/* =========================
          LEFT CONTENT
      ========================= */}

      <ScrollReveal direction="left">

        <div className="hero-content">

          <span className="hero-small">
            MADE WITH LOVE FOR MOTHERS & LITTLE ONES
          </span>

          <h1>
            Comfort Made
            <br />
            <span>With Love</span>
          </h1>

          <p>
            Thoughtfully designed pillows and soft essentials
            made to bring comfort, warmth and care to mothers,
            babies and little ones.
          </p>


          {/* =========================
              BUTTONS
          ========================= */}

          <div className="hero-buttons">

            <Link
              to="/shop"
              className="primary-btn"
            >
              <span>Shop Collection</span>

              <ArrowRight
                size={17}
                strokeWidth={1.7}
              />
            </Link>


            <Link
              to="/maternity-pillows"
              className="secondary-btn"
            >
              Explore Maternity
            </Link>

          </div>


          {/* =========================
              TRUST INFO
          ========================= */}

          <div className="hero-trust">

            <div className="trust-item">

              <Heart
                size={16}
                strokeWidth={1.5}
              />

              <div>
                <strong>Made with Love</strong>
                <span>For every beautiful moment</span>
              </div>

            </div>


            <div className="trust-line"></div>


            <div className="trust-item">

              <div className="trust-dot"></div>

              <div>
                <strong>Soft & Gentle</strong>
                <span>Designed for everyday comfort</span>
              </div>

            </div>

          </div>

        </div>

      </ScrollReveal>


      {/* =========================
          RIGHT IMAGE
      ========================= */}

      <ScrollReveal direction="right">

        <div className="hero-image">

          <div className="image-frame">

            <img
              src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=85"
              alt="Mother and baby"
            />

          </div>


          {/* =========================
              FLOATING CARD
          ========================= */}

          <div className="floating-card">

            <div className="floating-icon">

              <Heart
                size={18}
                strokeWidth={1.5}
                fill="currentColor"
              />

            </div>

            <div className="floating-text">

              <strong>Made for Comfort</strong>

              <small>
                Soft • Gentle • Cozy
              </small>

            </div>

          </div>


          {/* Decorative Number */}

          <span className="image-number">
            01
          </span>

        </div>

      </ScrollReveal>

    </section>
  );
};

export default Hero;