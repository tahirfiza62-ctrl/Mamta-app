
import { useState } from "react";
import { useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Star,
  Plus,
  Minus,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import "./Contact.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

const faqs = [
  {
    question: "How can I place an order?",
    answer:
      "Browse our collection, select your desired products, add them to your cart, and proceed to checkout. After submitting your order, our Sales Team will contact you to confirm your order details.",
  },
  {
    question: "What payment methods does MAAMTA accept?",
    answer:
      "Available payment methods are displayed during checkout. Depending on the options offered, you can choose Cash on Delivery or online payment.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery typically takes 3–4 working days. Delivery times may vary depending on your location and courier service.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Please contact our team as soon as possible if you want to cancel your order. Cancellation depends on the order's processing and dispatch status.",
  },
  {
    question: "What is MAAMTA's return policy?",
    answer:
      "Eligible products can be returned within 7 days of receiving your order, subject to the conditions and eligibility requirements in our Return Policy.",
  },
  {
    question: "What should I do if I receive a damaged or incorrect product?",
    answer:
      "Contact our team as soon as possible. Please record a clear video while opening your package when you receive it, showing the package and product. Share the video and your order number with us so we can review the issue and assist you.",
  },
  {
    question: "Can I return a used or washed product?",
    answer:
      "Return eligibility depends on the product's condition and the terms in our Return Policy. Please review the policy or contact our team for guidance.",
  },
{
  question: "How can I contact MAAMTA customer support?",
  answer: (
    <>
      You can email us at{" "}
      <a href="mailto:maamtacircle@gmail.com">
        maamtacircle@gmail.com
      </a>{" "}
      or call{" "}
     <a
  href="https://wa.me/923431516875"
  target="_blank"
  rel="noopener noreferrer"
>
+923431516875
</a>{" "}
      for assistance with your products, orders, delivery, or returns.
    </>
  ),
},
];

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
     FAQ
  ========================================================= */

  const [openFaqIndex, setOpenFaqIndex] = useState(-1);

  const toggleFaq = (index) => {
    setOpenFaqIndex((currentIndex) =>
      currentIndex === index ? -1 : index
    );
  };
useEffect(() => {
  if (window.location.hash === "#faq") {
    const timer = setTimeout(() => {
      document.getElementById("faq")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);

    return () => clearTimeout(timer);
  }
}, []);
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

    if (!name || !city || !email || !message) {
      toast.error("Please fill in all review fields.");
      return;
    }

    if (name.length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    if (name.length > 50) {
      toast.error("Name cannot exceed 50 characters.");
      return;
    }

    if (city.length < 2) {
      toast.error("Please enter a valid city.");
      return;
    }

    if (city.length > 50) {
      toast.error("City cannot exceed 50 characters.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }

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
              <span>CONTACT MAAMTA</span>
              <strong>We're here for you.</strong>
              <small>Softness • Care • Comfort</small>
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

              <h3>maamtacircle@gmail.com</h3>

              <p>Send us your questions anytime.</p>

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

              <h3>+92 343 1516875</h3>

              <p>We're happy to help.</p>

              <ArrowUpRight size={16} />
            </a>

            <div className="contact-info-card">
              <div className="contact-icon">
                <MapPin size={20} />
              </div>

              <span>LOCATION</span>

              <h3>Rawalpindi, Pakistan</h3>

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
                <strong>Soft Support</strong>
                <span>We're here to help.</span>
              </div>

              <div>
                <strong>Quick Response</strong>
                <span>We value every message.</span>
              </div>
            </div>
          </div>

          <form
            className="mamta-contact-form"
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">YOUR NAME</label>

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

            <div className="form-group">
              <label htmlFor="phone">PHONE NUMBER</label>

              <input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">SUBJECT</label>

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

            <div className="form-group">
              <label htmlFor="message">MESSAGE</label>

              <textarea
                id="message"
                rows="6"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                minLength={10}
                maxLength={1000}
                required
              />
            </div>

            <button
              type="submit"
              className="contact-submit"
              disabled={loading}
            >
              <span>
                {loading ? "Sending..." : "Send Message"}
              </span>

              {!loading && <ArrowUpRight size={17} />}
            </button>
          </form>
        </div>
      </section>

      {/* =====================================================
          CUSTOMER REVIEW
      ===================================================== */}

      <section className="customer-review-section">
        <div className="customer-review-container">
          <div className="customer-review-heading">
            <span className="contact-label">
              CUSTOMER LOVE
            </span>

            <h2>
              Share your
              <span>experience.</span>
            </h2>

            <p>
              Have you purchased from MAAMTA?
              We'd love to hear what you think.
              Your words may inspire another mother
              to find her perfect comfort.
            </p>
          </div>

          <form
            className="customer-review-form"
            onSubmit={handleReviewSubmit}
          >
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
                <label htmlFor="reviewCity">CITY</label>

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

            <div className="review-rating-group">
              <label>YOUR RATING</label>

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
                    aria-pressed={
                      Number(reviewData.rating) === star
                    }
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

            <div className="form-group">
              <label htmlFor="reviewMessage">
                YOUR REVIEW
              </label>

              <textarea
                id="reviewMessage"
                rows="6"
                placeholder="Tell us about your MAAMTA experience..."
                value={reviewData.message}
                onChange={handleReviewChange}
                minLength={10}
                maxLength={500}
                required
              />

              <small className="review-character-count">
                {reviewData.message.length}/500
              </small>
            </div>

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
          FREQUENTLY ASKED QUESTIONS
          ADDED BELOW CUSTOMER REVIEW
      ===================================================== */}

      <section className="mamta-faq-section" id="faq">
        <div className="mamta-faq-container">
          <div className="mamta-faq-heading">
            <span className="contact-label">
              HERE TO HELP
            </span>

            <h2>
              Frequently Asked
              <span> Questions.</span>
            </h2>

            <p>
              Find answers to common questions about
              MAAMTA products, orders, delivery, and returns.
            </p>
          </div>

          <div className="mamta-faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              const answerId = `mamta-faq-answer-${index}`;

              return (
                <div
                  className={`mamta-faq-item ${
                    isOpen ? "active" : ""
                  }`}
                  key={faq.question}
                >
                  <button
                    type="button"
                    className="mamta-faq-question"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <span>{faq.question}</span>

                    <span className="mamta-faq-icon">
                      {isOpen ? (
                        <Minus size={19} />
                      ) : (
                        <Plus size={19} />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      className="mamta-faq-answer"
                      id={answerId}
                    >
                      <p>{faq.answer}</p>

                      {index === 4 && (
                        <Link
                          to="/return-policy"
                          className="mamta-faq-policy-link"
                        >
                          Read our Return Policy
                          <ArrowUpRight size={15} />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mamta-faq-contact">
            <div className="mamta-faq-contact-content">
              <span>NEED A LITTLE MORE HELP?</span>

              <h3>We're always happy to help.</h3>

              <p>
                Can't find the answer you're looking for?
                Get in touch with our team.
              </p>
            </div>

            <a
              href="mailto:maamtacircle@gmail.com"
              className="mamta-faq-contact-button"
            >
              <Mail size={17} />
              <span>Contact Our Team</span>
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL SECTION
      ===================================================== */}

      <section className="contact-final">
        <div className="contact-final-content">
          <span>MAAMTA</span>

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
            <span>Shop Collection</span>
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Contact;
