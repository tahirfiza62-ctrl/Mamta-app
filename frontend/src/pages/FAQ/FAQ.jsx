import { useState } from "react";
import { ChevronDown, MessageCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";

import "./FAQ.css";

const faqData = [
  {
    question: "What makes Mamta pillows special?",
    answer:
      "Mamta pillows are designed with comfort, softness, and everyday support in mind. Our maternity and baby pillow collections are created to provide a cozy and relaxing experience for mothers and little ones.",
  },
  {
    question: "How do I choose the right pillow?",
    answer:
      "You can choose your pillow based on its purpose, shape, size, and the level of support you prefer. Our product pages include detailed descriptions to help you find the right option.",
  },
  {
    question: "Are Mamta pillows suitable for everyday use?",
    answer:
      "Yes. Our pillows are designed for regular use and comfort. However, always follow the care and usage instructions provided with your specific product.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are usually processed before being dispatched. Delivery time may vary depending on your location and other circumstances. Please check our Shipping Policy for more information.",
  },
  {
    question: "Do you offer cash on delivery?",
    answer:
      "Cash on delivery availability depends on the payment and delivery options currently offered by Mamta. Available payment methods will be shown during checkout.",
  },
  {
    question: "Can I cancel or change my order?",
    answer:
      "Order changes or cancellations may be possible if your order has not yet been processed or dispatched. Please contact us as soon as possible with your order details.",
  },
  {
    question: "What should I do if I receive a damaged or incorrect product?",
    answer:
      "Please contact Mamta customer support as soon as possible after receiving your order. Include your order details and relevant photos so we can review the issue and guide you through the next steps.",
  },
  {
    question: "Can I return my order?",
    answer:
      "Returns are subject to Mamta's return policy and the condition of the product. Please review our Return Policy for the applicable requirements and process.",
  },
  {
    question: "How should I care for my Mamta pillow?",
    answer:
      "Care instructions can vary by product. We recommend checking the product description or care instructions provided with your pillow before washing or cleaning it.",
  },
  {
    question: "How can I contact Mamta?",
    answer:
      "You can contact us through the contact information provided on our website. We're happy to help with questions about products, orders, delivery, or anything else related to your Mamta experience.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="faq-page">
      {/* Decorative Background */}
      <div className="faq-decoration faq-decoration-one"></div>
      <div className="faq-decoration faq-decoration-two"></div>

      {/* Hero */}
      <section className="faq-hero">
        <div className="faq-hero-content">
          <span className="faq-eyebrow">
            <Heart size={14} />
            MAMTA CARE
          </span>

          <h1>Frequently Asked Questions</h1>

          <p>
            Everything you need to know about Mamta products, orders,
            delivery, returns, and your shopping experience.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="faq-section">
        <div className="faq-container">
          <div className="faq-heading">
            <span>WE'RE HERE TO HELP</span>
            <h2>Your Questions, Answered</h2>
            <p>
              Find quick answers to some of the most common questions from
              Mamta customers.
            </p>
          </div>

          <div className="faq-list">
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  className={`faq-item ${isOpen ? "faq-item-open" : ""}`}
                  key={index}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                  >
                    <span>
                      <strong>{String(index + 1).padStart(2, "0")}</strong>
                      {faq.question}
                    </span>

                    <div className="faq-icon">
                      <ChevronDown
                        size={19}
                        strokeWidth={1.8}
                      />
                    </div>
                  </button>

                  <div
                    className={`faq-answer ${
                      isOpen ? "faq-answer-open" : ""
                    }`}
                  >
                    <div className="faq-answer-inner">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="faq-help">
        <div className="faq-help-card">
          <div className="faq-help-icon">
            <MessageCircle size={25} strokeWidth={1.6} />
          </div>

          <div className="faq-help-content">
            <span>STILL HAVE A QUESTION?</span>

            <h2>We'd Love to Help</h2>

            <p>
              If you couldn't find the answer you were looking for,
              feel free to reach out to our team.
            </p>
          </div>

          <Link to="/contact" className="faq-help-button">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="faq-bottom">
        <Link to="/shop" className="faq-back">
          Continue Shopping
        </Link>

        <Link to="/return-policy" className="faq-policy-link">
          Return Policy
        </Link>
      </div>
    </main>
  );
};

export default FAQ;