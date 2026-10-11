import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import "./Contact.css";

const API_URL = "http://localhost:3000/api";

const Contact = () => {
  /* =========================================================
     CONTACT FORM
  ========================================================= */

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  /* =========================================================
     REVIEW FORM
  ========================================================= */

  const [reviewData, setReviewData] = useState({
    name: "",
    city: "",
    email: "",
    rating: 5,
    message: "",
  });

  const [reviewLoading, setReviewLoading] = useState(false);

  /* =========================================================
     CONTACT FORM CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  /* =========================================================
     REVIEW FORM CHANGE
  ========================================================= */

  const handleReviewChange = (e) => {
    const { id, value } = e.target;

    const fieldMap = {
      reviewName: "name",
      reviewCity: "city",
      reviewEmail: "email",
      reviewMessage: "message",
    };

    const fieldName = fieldMap[id];

    if (!fieldName) return;

    setReviewData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  /* =========================================================
     CONTACT FORM SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    if (!name || !email || !subject || !message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (name.length < 2) {
      toast.error("Please enter a valid name.");
      return;
    }

    if (subject.length < 3) {
      toast.error("Please enter a valid subject.");
      return;
    }

    if (message.length < 10) {
      toast.error(
        "Your message should contain at least 10 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/contact`,
        {
          name,
          email,
          phone,
          subject,
          message,
        }
      );

      toast.success(
        response.data.message ||
          "Your message has been sent successfully."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("CONTACT FORM ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     REVIEW FORM SUBMIT
  ========================================================= */

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const name = reviewData.name.trim();
    const city = reviewData.city.trim();
    const email = reviewData.email.trim();
    const message = reviewData.message.trim();
    const rating = Number(reviewData.rating);

    /* -------------------------------------------------------
       REQUIRED VALIDATION
    ------------------------------------------------------- */

    if (!name || !city || !email || !message) {
      toast.error("Please fill in all review fields.");
      return;
    }

    /* -------------------------------------------------------
       NAME VALIDATION
    ------------------------------------------------------- */

    if (name.length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    if (name.length > 50) {
      toast.error("Name cannot exceed 50 characters.");
      return;
    }

    /* -------------------------------------------------------
       CITY VALIDATION
    ------------------------------------------------------- */

    if (city.length < 2) {
      toast.error("Please enter a valid city.");
      return;
    }

    if (city.length > 50) {
      toast.error("City cannot exceed 50 characters.");
      return;
    }

    /* -------------------------------------------------------
       EMAIL VALIDATION
    ------------------------------------------------------- */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    /* -------------------------------------------------------
       RATING VALIDATION
    ------------------------------------------------------- */

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }

    /* -------------------------------------------------------
       REVIEW VALIDATION
    ------------------------------------------------------- */

    if (message.length < 10) {
      toast.error(
        "Your review should contain at least 10 characters."
      );
      return;
    }

    if (message.length > 500) {
      toast.error(
        "Your review cannot exceed 500 characters."
      );
      return;
    }

    try {
      setReviewLoading(true);

      const response = await axios.post(
        `${API_URL}/reviews`,
        {
          name,
          city,
          email,
          rating,
          message,
        }
      );

      toast.success(
        response.data.message ||
          "Thank you for sharing your experience!"
      );

      /* -----------------------------------------------------
         RESET REVIEW FORM
      ----------------------------------------------------- */

      setReviewData({
        name: "",
        city: "",
        email: "",
        rating: 5,
        message: "",
      });
    } catch (error) {
      console.error("REVIEW FORM ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to submit your review. Please try again."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <main className="mamta-contact">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="contact-hero">

        <div className="contact-hero-container">

          <div className="contact-hero-content">

            <span className="contact-eyebrow">
              GET IN TOUCH
            </span>

            <h1>
              We'd love to
              <span>hear from you.</span>
            </h1>

            <p>
              Have a question about our products, your
              order, or simply want to say hello? We're
              always happy to hear from you.
            </p>

            <Link
              to="/shop"
              className="contact-hero-button"
            >
              <span>Explore Collection</span>
              <ArrowUpRight size={17} />
            </Link>

          </div>

          <div className="contact-hero-image">

            <div className="contact-circle"></div>

            <div className="contact-image-frame">

              <img
                src="https://res.cloudinary.com/iysbraru/image/upload/v1790515817/cooo.jpg"
                alt="MAMTA comfort collection"
              />

            </div>

            <div className="contact-floating-card">

              <span>
                CONTACT MAMTA
              </span>

              <strong>
                We're here for you.
              </strong>

              <small>
                Softness • Care • Comfort
              </small>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT INFORMATION
      ===================================================== */}

      <section className="contact-information">

        <div className="contact-container">

          <div className="contact-heading">

            <span className="contact-label">
              REACH OUT
            </span>

            <h2>
              Let's make
              <span>things easier.</span>
            </h2>

            <p>
              Whether you need help choosing a product
              or have a question about an order, feel
              free to contact us.
            </p>

          </div>


          <div className="contact-info-grid">

            <a
              href="mailto:maamtacircle@gmail.com"
              className="contact-info-card"
            >

              <div className="contact-icon">
                <Mail size={20} />
              </div>

              <span>EMAIL</span>

              <h3>
                maamtacircle@gmail.com
              </h3>

              <p>
                Send us your questions anytime.
              </p>

              <ArrowUpRight size={16} />

            </a>


            <a
              href="tel:+923431516875"
              className="contact-info-card"
            >

              <div className="contact-icon">
                <Phone size={20} />
              </div>

              <span>PHONE</span>

              <h3>
                +92 3431516875
              </h3>

              <p>
                We're happy to help.
              </p>

              <ArrowUpRight size={16} />

            </a>


            <div className="contact-info-card">

              <div className="contact-icon">
                <MapPin size={20} />
              </div>

              <span>LOCATION</span>

              <h3>
                Rawalpindi, Pakistan
              </h3>

              <p>
                Proudly serving mothers and families.
              </p>

              <ArrowUpRight size={16} />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CONTACT FORM
      ===================================================== */}

      <section className="contact-form-section">

        <div className="contact-form-container">

          <div className="contact-form-content">

            <span className="contact-label">
              SEND A MESSAGE
            </span>

            <h2>
              Tell us
              <span>what you need.</span>
            </h2>

            <p>
              Fill in the form and our team will get
              back to you as soon as possible.
            </p>

            <div className="contact-form-details">

              <div>
                <strong>
                  Soft Support
                </strong>

                <span>
                  We're here to help.
                </span>
              </div>

              <div>
                <strong>
                  Quick Response
                </strong>

                <span>
                  We value every message.
                </span>
              </div>

            </div>

          </div>


          <form
            className="mamta-contact-form"
            onSubmit={handleSubmit}
          >

            {/* NAME + EMAIL */}

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="name">
                  YOUR NAME
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  minLength={2}
                  maxLength={50}
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="email">
                  EMAIL ADDRESS
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* PHONE */}

            <div className="form-group">

              <label htmlFor="phone">
                PHONE NUMBER
              </label>

              <input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>


            {/* SUBJECT */}

            <div className="form-group">

              <label htmlFor="subject">
                SUBJECT
              </label>

              <input
                id="subject"
                type="text"
                placeholder="What can we help with?"
                value={formData.subject}
                onChange={handleChange}
                minLength={3}
                maxLength={100}
                required
              />

            </div>


            {/* MESSAGE */}

            <div className="form-group">

              <label htmlFor="message">
                MESSAGE
              </label>

              <textarea
                id="message"
                rows="6"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                minLength={10}
                maxLength={1000}
                required
              ></textarea>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="contact-submit"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Sending..."
                  : "Send Message"}
              </span>

              {!loading && (
                <ArrowUpRight size={17} />
              )}

            </button>

          </form>

        </div>

      </section>


      {/* =====================================================
          CUSTOMER REVIEW
      ===================================================== */}

      <section className="customer-review-section">

        <div className="customer-review-container">

          {/* REVIEW INTRO */}

          <div className="customer-review-heading">

            <span className="contact-label">
              CUSTOMER LOVE
            </span>

            <h2>
              Share your
              <span>experience.</span>
            </h2>

            <p>
              Have you purchased from MAMTA?
              We'd love to hear what you think.
              Your words may inspire another mother
              to find her perfect comfort.
            </p>

          </div>


          {/* REVIEW FORM */}

          <form
            className="customer-review-form"
            onSubmit={handleReviewSubmit}
          >

            {/* NAME + CITY */}

            <div className="form-row">

              <div className="form-group">

                <label htmlFor="reviewName">
                  YOUR NAME
                </label>

                <input
                  id="reviewName"
                  type="text"
                  placeholder="Enter your name"
                  value={reviewData.name}
                  onChange={handleReviewChange}
                  minLength={2}
                  maxLength={50}
                  required
                />

              </div>


              <div className="form-group">

                <label htmlFor="reviewCity">
                  CITY
                </label>

                <input
                  id="reviewCity"
                  type="text"
                  placeholder="e.g. Islamabad"
                  value={reviewData.city}
                  onChange={handleReviewChange}
                  minLength={2}
                  maxLength={50}
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="reviewEmail">
                EMAIL ADDRESS
              </label>

              <input
                id="reviewEmail"
                type="email"
                placeholder="Enter your email"
                value={reviewData.email}
                onChange={handleReviewChange}
                required
              />

            </div>


            {/* RATING */}

            <div className="review-rating-group">

              <label>
                YOUR RATING
              </label>

              <div className="review-stars">

                {[1, 2, 3, 4, 5].map((star) => (

                  <button
                    key={star}
                    type="button"
                    className={
                      star <= Number(reviewData.rating)
                        ? "review-star active"
                        : "review-star"
                    }
                    onClick={() =>
                      setReviewData((prev) => ({
                        ...prev,
                        rating: star,
                      }))
                    }
                    aria-label={`${star} star rating`}
                  >

                    <Star
                      size={25}
                      fill={
                        star <= Number(reviewData.rating)
                          ? "currentColor"
                          : "none"
                      }
                    />

                  </button>

                ))}

              </div>

              <span className="rating-text">
                {reviewData.rating} out of 5
              </span>

            </div>


            {/* REVIEW MESSAGE */}

            <div className="form-group">

              <label htmlFor="reviewMessage">
                YOUR REVIEW
              </label>

              <textarea
                id="reviewMessage"
                rows="6"
                placeholder="Tell us about your MAMTA experience..."
                value={reviewData.message}
                onChange={handleReviewChange}
                minLength={10}
                maxLength={500}
                required
              ></textarea>

              <small className="review-character-count">
                {reviewData.message.length}/500
              </small>

            </div>


            {/* REVIEW SUBMIT */}

            <button
              type="submit"
              className="contact-submit review-submit"
              disabled={reviewLoading}
            >

              <span>
                {reviewLoading
                  ? "Sharing..."
                  : "Share My Review"}
              </span>

              {!reviewLoading && (
                <ArrowUpRight size={17} />
              )}

            </button>

          </form>

        </div>

      </section>


      {/* =====================================================
          FINAL SECTION
      ===================================================== */}

      <section className="contact-final">

        <div className="contact-final-content">

          <span>MAMTA</span>

          <h2>
            Comfort is always
            <strong>close by.</strong>
          </h2>

          <p>
            Thoughtfully selected comfort essentials
            for mothers, babies and every beautiful
            little moment.
          </p>

          <Link
            to="/shop"
            className="contact-final-button"
          >

            <span>
              Shop Collection
            </span>

            <ArrowUpRight size={17} />

          </Link>

        </div>

      </section>

    </main>
  );
};

export default Contact;