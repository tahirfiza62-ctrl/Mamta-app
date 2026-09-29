import { Link } from "react-router-dom";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <main className="privacy-page">

      <div className="privacy-container">

        <span className="privacy-eyebrow">
          MAMTA • YOUR PRIVACY
        </span>

        <h1>
          Privacy Policy
        </h1>

        <p className="privacy-intro">
          At Mamta, we respect your privacy and are committed to
          handling your personal information responsibly. This
          policy explains what information we collect and how it
          may be used when you use our website.
        </p>

        <section>
          <h2>Information We Collect</h2>
          <p>
            When you create an account, place an order, contact us,
            or use certain features of our website, we may collect
            information such as your name, email address, phone
            number, delivery details, and order information.
          </p>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>
            Your information may be used to process and deliver
            orders, manage your account, provide customer support,
            communicate with you about your purchases, and improve
            our products and website experience.
          </p>
        </section>

        <section>
          <h2>Account Information</h2>
          <p>
            If you create a Mamta account, information associated
            with your account may be used to provide account
            features such as order history, profile management,
            wishlist, and shopping cart functionality.
          </p>
        </section>

        <section>
          <h2>Payment Information</h2>
          <p>
            Payment information is handled through the payment
            methods and services made available during checkout.
            Mamta does not need to store sensitive payment details
            when they are processed directly by an authorized
            payment service.
          </p>
        </section>

        <section>
          <h2>Cookies & Website Technologies</h2>
          <p>
            Our website may use cookies, local storage, or similar
            technologies to support features such as account
            sessions, shopping carts, wishlists, preferences, and
            website functionality.
          </p>
        </section>

        <section>
          <h2>Information Sharing</h2>
          <p>
            We may share necessary information with trusted service
            providers, such as delivery or payment services, when
            required to complete an order or provide requested
            services. We do not intend to sell your personal
            information to third parties.
          </p>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            We take reasonable steps to protect information
            associated with your account and orders. However, no
            online service can guarantee complete security of
            information transmitted or stored electronically.
          </p>
        </section>

        <section>
          <h2>Your Choices</h2>
          <p>
            You may contact Mamta if you have questions about your
            personal information, wish to update account details,
            or need assistance regarding information associated
            with your orders.
          </p>
        </section>

        <section>
          <h2>Policy Updates</h2>
          <p>
            We may update this Privacy Policy when our website,
            services, or practices change. Any updated version
            will be published on this page.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have questions or concerns about this Privacy
            Policy, please contact Mamta customer support.
          </p>
        </section>

        <Link to="/shop" className="privacy-back">
          Continue Shopping
        </Link>

      </div>

    </main>
  );
};

export default PrivacyPolicy;