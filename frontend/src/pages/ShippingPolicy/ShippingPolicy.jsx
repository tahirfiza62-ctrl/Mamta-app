
import { Link } from "react-router-dom";
import "./ShippingPolicy.css";

const ShippingPolicy = () => {
  return (
    <main className="policy-page">

      <div className="policy-container">

        <span className="policy-eyebrow">
          MAMTA DELIVERY
        </span>

        <h1>
          Shipping Policy
        </h1>

        <p className="policy-intro">
          We carefully prepare every Mamta order and work to make
          your delivery experience simple and reliable.
        </p>

        <section>
          <h2>Order Processing</h2>
          <p>
            Orders are processed after they are successfully placed.
            Processing time may vary depending on product availability,
            order volume, and other circumstances.
          </p>
        </section>

        <section>
          <h2>Delivery Time</h2>
          <p>
            Delivery time depends on your location and the selected
            shipping service. Estimated delivery information will be
            provided where applicable during checkout.
          </p>
        </section>

        <section>
          <h2>Shipping Charges</h2>
          <p>
            Shipping charges, if applicable, will be displayed during
            checkout before you complete your order.
          </p>
        </section>

        <section>
          <h2>Delivery Delays</h2>
          <p>
            Delivery may occasionally take longer because of weather,
            holidays, high order volumes, courier delays, or other
            circumstances outside our control.
          </p>
        </section>

        <section>
          <h2>Order Tracking</h2>
          <p>
            If tracking information is available for your order,
            it will be shared through the contact information
            associated with your purchase.
          </p>
        </section>

        <section>
          <h2>Need Help?</h2>
          <p>
            If you have questions about your shipment or delivery,
            please contact Mamta customer support.
          </p>
        </section>

        <Link to="/shop" className="policy-back">
          Continue Shopping
        </Link>

      </div>

    </main>
  );
};

export default ShippingPolicy;
