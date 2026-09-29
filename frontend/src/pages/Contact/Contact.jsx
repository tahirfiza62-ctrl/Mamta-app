import { useState } from "react";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import "./Contact.css";

const API_URL = "http://localhost:3000/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      subject,
      message,
    } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      toast.error(
        "Please fill in all required fields."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/contact`,
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
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
      console.error(
        "CONTACT FORM ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mamta-contact">

      {/* HERO */}
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
              <span>CONTACT MAMTA</span>

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

      {/* CONTACT INFORMATION */}
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
              href="mailto:hello@mamta.pk"
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
                Rawalpindi,Pakistan
              </h3>

              <p>
                Proudly serving mothers and families.
              </p>

              <ArrowUpRight size={16} />
            </div>

          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
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

      {/* FINAL DARK SECTION */}
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
            <span>Shop Collection</span>
            <ArrowUpRight size={17} />
          </Link>

        </div>

      </section>

    </main>
  );
};

export default Contact;