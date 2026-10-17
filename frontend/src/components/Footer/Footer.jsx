import { Link } from "react-router-dom";
import { Mail, ArrowUp } from "lucide-react";

import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaPinterestP,
} from "react-icons/fa";

import "./Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="mamta-footer">

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div className="mamta-footer-content">

        {/* =================================================
            BRAND
        ================================================= */}

        <div className="footer-brand-area">

          <Link to="/" className="footer-logo">
            <img
              src="https://res.cloudinary.com/iysbraru/image/upload/v1791674408/Mamta_Circle_Mother_and_Baby_Emblem_1.png"
              alt="Mamta"
            />
            <h2>Maamta Circle</h2>
          </Link>

          <p className="brand-description">
            Thoughtfully designed for mothers, babies, and little ones.
            Maamta brings comfort, softness, and care into every product,
            creating a beautiful experience for every family.
          </p>


          {/* =================================================
              SOCIALS
          ================================================= */}

          <div className="footer-socials">

            {/* INSTAGRAM */}

            <a
              href="https://www.instagram.com/maamtacircle/
"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Instagram"
            >
              <FaInstagram size={17} />
            </a>


            {/* FACEBOOK */}

            <a
              href="https://www.facebook.com/maamtacircle"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Facebook"
            >
              <FaFacebookF size={16} />
            </a>


            {/* TIKTOK */}

            <a
              href="https://www.tiktok.com/@maamtacircle
"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="TikTok"
            >
              <FaTiktok size={17} />
            </a>


            {/* PINTEREST */}

            <a
              href="https://www.pinterest.com/maamtacircle"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Pinterest"
            >
              <FaPinterestP size={17} />
            </a>


            {/* EMAIL */}

            <a
              href="mailto:maamtacircle@gmail.com"
              className="social-link"
              aria-label="Email"
            >
              <Mail size={17} />
            </a>

          </div>

        </div>


        {/* =================================================
            FOOTER NAVIGATION
        ================================================= */}

        <div className="footer-navigation">

          {/* ================= EXPLORE ================= */}

          <div className="footer-nav-group">

            <span className="footer-nav-title">
              EXPLORE
            </span>

            <Link to="/">
              Home
            </Link>

            <Link to="/shop">
              Shop
            </Link>

            <Link to="/about">
              About Us
            </Link>

            <Link to="/contact">
              Contact
            </Link>

          </div>


          {/* ================= CUSTOMER CARE ================= */}

          <div className="footer-nav-group">

            <span className="footer-nav-title">
              CUSTOMER CARE
            </span>

          <Link to="/contact#faq">
  FAQ
</Link>

            <Link to="/return-policy">
              Return Policy
            </Link>

            <Link to="/shipping-policy">
              Shipping Policy
            </Link>

            <Link to="/contact">
              Contact Us
            </Link>

          </div>


          {/* ================= LEGAL ================= */}

          <div className="footer-nav-group">

            <span className="footer-nav-title">
              LEGAL
            </span>

            <Link to="/privacy-policy">
              Privacy Policy
            </Link>

            <Link to="/terms-of-sale">
              Terms of Sale
            </Link>

            <Link to="/return-policy">
              Returns
            </Link>

            <Link to="/shipping-policy">
              Shipping
            </Link>

          </div>


          {/* ================= MY ACCOUNT ================= */}

          <div className="footer-nav-group">

            <span className="footer-nav-title">
              MY ACCOUNT
            </span>

            <Link to="/account">
              My Account
            </Link>

            <Link to="/orders">
              My Orders
            </Link>

            <Link to="/wishlist">
              Wishlist
            </Link>

            <Link to="/cart">
              Shopping Cart
            </Link>

          </div>

        </div>

      </div>


      {/* =====================================================
          BOTTOM BAR
      ===================================================== */}

      <div className="footer-bottom">

        {/* COPYRIGHT */}

        <div className="footer-copyright">

          <span className="footer-copyright-symbol">
            ©
          </span>

          <span>
            {new Date().getFullYear()} Maamta. All rights reserved.
          </span>

        </div>


        {/* LEGAL */}

        <div className="footer-legal">

          <Link to="/privacy-policy">
            Privacy Policy
          </Link>

          <span className="footer-legal-divider">
            •
          </span>

          <Link to="/terms-of-sale">
            Terms of Sale
          </Link>

          <span className="footer-legal-divider">
            •
          </span>

          <Link to="/return-policy">
            Returns
          </Link>

          <span className="footer-legal-divider">
            •
          </span>

          <Link to="/shipping-policy">
            Shipping
          </Link>

        </div>


        {/* BACK TO TOP */}

        <button
          type="button"
          className="footer-top-button"
          onClick={scrollToTop}
        >

          <span>
            Back to top
          </span>

          <span className="footer-top-arrow">
            <ArrowUp size={15} />
          </span>

        </button>

      </div>

    </footer>
  );
};

export default Footer;