

import { Link } from "react-router-dom";
import "./ReturnPolicy.css";

const ReturnPolicy = () => {
  return (
    <main className="policy-page">

      <div className="policy-container">

        <span className="policy-eyebrow">
          MAAMTA CARE
        </span>

        <h1>
          Return Policy
        </h1>

        <p className="policy-intro">
          At Maamta, we want you to feel happy and comfortable with
          every purchase. If there is an issue with your order,
          please review our return guidelines below.
        </p>

        <section>
          <h2>Eligibility</h2>
          <p>
            Items must be unused, clean, and in their original
            condition. Products that have been used, washed, damaged,
            or altered may not be eligible for return.
          </p>
        </section>

       
<section>
  <h2>Return Request</h2>
  <p>
    Return requests must be submitted within 7 days of receiving
    your order. Please provide your order number and a brief
    explanation of the reason for the return. Products must meet
    the eligibility requirements outlined in our Return Policy.
  </p>
</section>


        <section>
  <h2>Damaged or Incorrect Items</h2>
  <p>
    If you receive a damaged, defective, or incorrect item, please
    contact MAMTA as soon as possible. To help our team verify the
    issue and resolve your complaint, please provide a clear video
    of the package and product opening, recorded when you receive
    your order. Our team will review the evidence and assist you
    with the appropriate resolution.
  </p>
</section>
{/* Review and Approval */}
<section className="policy-section">
  <h2>Review and Approval</h2>

  <p>
    Our team aims to review return or exchange requests within{" "}
    <strong>3 business days</strong>. All requests must be verified and
    approved before a return, replacement, or reorder is arranged.
    We will inform customers once their request has been reviewed
    and provide the next steps accordingly.
  </p>
</section>
{/* Shipping Charges and Taxes */}
<section className="policy-section">
  <h2>Shipping Charges and Taxes</h2>

  <p>
    For verified damaged, defective, or incorrect products, Mamata Circle
    will cover the applicable return shipping charges and related taxes.
    For eligible exchanges requested due to personal preference, such as
    color or size, the customer will bear the applicable shipping charges
    and taxes.
  </p>
</section>
        <section>
          <h2>Refunds</h2>
          <p>
            Once an approved return is received and inspected, the
            applicable refund will be processed according to the
            payment method and applicable terms.
          </p>
        </section>
<section>
  <h2>Contact Us</h2>

  <p>
    If you have questions or concerns about this Privacy Policy,
    please contact us using the details below:
  </p>

  <p>
    <strong>Email: </strong>
    <a
      href="mailto:maamtacircle@gmail.com"
      className="privacy-email-link"
    >
      maamtacircle@gmail.com
    </a>
  </p>

  <p>
    <strong>Phone: </strong>
    <a href="tel:+923431516875" className="privacy-email-link">
      +92 343 1516875
    </a>
  </p>

  <p>
    <strong>WhatsApp: </strong>
    <a
      href="https://wa.me/923431516875"
      target="_blank"
      rel="noopener noreferrer"
      className="privacy-email-link"
    >
      Chat with us on WhatsApp
    </a>
  </p>
</section>

        <Link to="/shop" className="policy-back">
          Continue Shopping
        </Link>

      </div>

    </main>
  );
};

export default ReturnPolicy;

