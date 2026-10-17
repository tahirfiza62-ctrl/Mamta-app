import { Link } from "react-router-dom";

import "./TermsOfSale.css";

const TermsOfSale = () => {
  return (
    <main className="terms-page">
      <div className="terms-container">

        <span className="terms-eyebrow">
          MAAMTA • CUSTOMER TERMS
        </span>

        <h1>
          Terms of Sale
        </h1>

        <p className="terms-intro">
          These terms explain the conditions that apply when you
          purchase products from Maamta. By placing an order,
          you agree to the terms described below.
        </p>

        <section>
          <h2>Orders & Purchases</h2>
          <p>
            When you place an order through Maamta, you are making
            a request to purchase the selected products. Order
            confirmation details will be provided after your order
            has been successfully submitted.Our Sales Team will contact for confirmation.
          </p>
        </section>

        <section>
          <h2>Product Information</h2>
          <p>
            We make reasonable efforts to display product names,
            descriptions, images, prices, and other information
            accurately. Actual product colors or appearance may
            vary slightly depending on your device or screen.
          </p>
        </section>

        <section>
          <h2>Prices & Payments</h2>
          <p>
            Product prices are displayed on the website and may
            change from time to time. Applicable shipping charges
            will be shown during checkout. Payment must be completed
            using the payment options available at checkout.
          </p>
        </section>

        <section>
          <h2>Order Changes & Cancellation</h2>
          <p>
            If you need to change or cancel an order, please contact
            on Maamta email as soon as possible. Requests
            may not be possible once an order has entered processing
            or shipment.
          </p>
        </section>

        <section>
          <h2>Shipping & Delivery</h2>
          <p>
            Orders are prepared and delivered according to the
            shipping information provided at checkout. Delivery
            times may vary depending on location, courier service,
            holidays, weather, and other circumstances.
          </p>
        </section>



<section>
  <h2>Returns & Refunds</h2>
  <p>
    Returns and refunds are handled according to our{" "}
    <Link to="/return-policy" className="policy-link">
      Return Policy
    </Link>
    . Products may need to meet specific eligibility
    requirements before a return or refund can be approved.
  </p>
</section>

        <section>
          <h2>Damaged or Incorrect Orders</h2>
          <p>
            If you receive a damaged, defective, or incorrect
            product, please contact on Maamta email as soon
            as possible with your order details so the issue can
            be reviewed.
          </p>
        </section>

        <section>
          <h2>Website Use</h2>
          <p>
            Customers are expected to provide accurate information
            when placing an order and to use the Maamta website
            responsibly and in accordance with applicable laws.
          </p>
        </section>

        <section>
          <h2>Changes to These Terms</h2>
          <p>
            Maamta may update these terms from time to time to
            reflect changes to our services, products, or business
            practices. Updated terms will be published on this page.
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

        <Link to="/shop" className="terms-back">
          Continue Shopping
        </Link>

      </div>
    </main>
  );
};

export default TermsOfSale;