

import { Link } from "react-router-dom";
import "./ReturnPolicy.css";

const ReturnPolicy = () => {
  return (
    <main className="policy-page">

      <div className="policy-container">

        <span className="policy-eyebrow">
          MAMTA CARE
        </span>

        <h1>
          Return Policy
        </h1>

        <p className="policy-intro">
          At Mamta, we want you to feel happy and comfortable with
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
            Return requests should be submitted within the return
            period specified with your order. Please provide your
            order number and explain the reason for the return.
          </p>
        </section>

        <section>
          <h2>Damaged or Incorrect Items</h2>
          <p>
            If you receive a damaged, defective, or incorrect item,
            contact Mamta as soon as possible so our team can review
            the issue and assist you.
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
            For return-related questions, please contact our customer
            support team.
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

