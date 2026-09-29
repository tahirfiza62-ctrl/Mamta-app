import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="mamta-footer">

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}
      <section className="mamta-footer-content">

        {/* BRAND */}
        <div className="footer-brand-area">

          <Link to="/" className="footer-logo" aria-label="MAMTA Home">
            <img src="/logo.jpg" alt="MAMTA" />
            <img src="/logo2.jpg" alt="" />
          </Link>

          <p className="brand-description">
            Comfort designed with intention.
            Soft essentials made for mothers, babies
            and every beautiful little moment.
          </p>

          {/* SOCIAL MEDIA */}
          <div className="footer-socials">

            <a
              href="#"
              aria-label="Instagram"
              className="social-link"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="social-link"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              aria-label="WhatsApp"
              className="social-link"
            >
              <FaWhatsapp />
            </a>

            <a
              href="mailto:hello@mamta.pk"
              aria-label="Email"
              className="social-link"
            >
              <Mail size={17} strokeWidth={1.6} />
            </a>

          </div>

        </div>

        {/* ===================================================
            FOOTER NAVIGATION
        ==================================================== */}

        <div className="footer-navigation">

          {/* SHOP */}
          <div className="footer-nav-group">
            <span className="footer-nav-title">
              SHOP
            </span>

            <Link to="/shop">
              All Products
            </Link>

            <Link to="/maternity-pillows">
              Maternity Pillows
            </Link>

            <Link to="/baby-pillows">
              Baby Pillows
            </Link>

            <Link to="/nursing-pillows">
              Nursing Pillows
            </Link>
          </div>

          {/* DISCOVER */}
          <div className="footer-nav-group">
            <span className="footer-nav-title">
              DISCOVER
            </span>

            <Link to="/categories">
              Categories
            </Link>

            <Link to="/about">
              Our Story
            </Link>

            <Link to="/faq">
              FAQs
            </Link>

            <Link to="/contact">
              Contact
            </Link>
          </div>

          {/* ACCOUNT */}
          <div className="footer-nav-group">
            <span className="footer-nav-title">
              ACCOUNT
            </span>

            <Link to="/login">
              Sign In
            </Link>

            <Link to="/profile">
              My Profile
            </Link>

            <Link to="/wishlist">
              Wishlist
            </Link>

            <Link to="/my-orders">
              My Orders
            </Link>
          </div>

        </div>

      </section>

      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}

    {/* ===================================================== FOOTER BOTTOM ===================================================== */} <div className="footer-bottom"> {/* COPYRIGHT */} <div className="footer-copyright"> <span className="footer-copyright-symbol">©</span> <span> {new Date().getFullYear()} MAMTA CIRCLE </span> </div> {/* LEGAL LINKS */} <nav className="footer-legal" aria-label="Legal"> <Link to="/privacy-policy"> Privacy Policy </Link> <span className="footer-legal-divider"> • </span> <Link to="/terms"> Terms & Conditions </Link> </nav> {/* BACK TO TOP */} <button type="button" className="footer-top-button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth", }) } > <span className="footer-top-arrow"> ↑ </span> <span> Back to top </span> </button> </div>

    </footer>
  );
};

export default Footer;