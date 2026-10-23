
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import {
  Check,
  CheckCircle2,
  Package,
  MapPin,
  Phone,
  ArrowRight,
  ShoppingBag,
  Truck,
} from "lucide-react";

import "./OrderSuccess.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mamta-app-8.onrender.com/api";

const OrderSuccess = () => {
  const location = useLocation();
  const { id } = useParams();

  /* =========================================================
     INITIAL ORDER
  ========================================================= */

  const initialOrder = location.state?.order || null;

  const token =
    localStorage.getItem("mamta_user_token");

  /* =========================================================
     ORDER STATE
  ========================================================= */

  const [order, setOrder] = useState(initialOrder);

  const [fetchError, setFetchError] = useState("");

  /* =========================================================
     LOADING STATE
     
     We derive loading instead of calling setLoading()
     synchronously inside useEffect.
  ========================================================= */

  const loading =
    !order &&
    !fetchError &&
    Boolean(token) &&
    Boolean(id);

  /* =========================================================
     INITIAL ERROR
     
     This is derived from the current URL/auth state.
     No setState is needed.
  ========================================================= */

  const missingOrderInfo =
    !initialOrder && (!token || !id);

  /* =========================================================
     LOAD ORDER IF PAGE IS REFRESHED
  ========================================================= */

  useEffect(() => {
    // Order was already passed from checkout
    if (initialOrder) {
      return;
    }

    // No ID or token
    if (!token || !id) {
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(response.data.order);
      } catch (error) {
        console.error(
          "ORDER SUCCESS ERROR:",
          error
        );

        setFetchError(
          error.response?.data?.message ||
            "Unable to load order details."
        );
      }
    };

    fetchOrder();
  }, [id, initialOrder, token]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="order-success-page order-success-loading">

        <div className="order-success-spinner"></div>

        <p>
          Loading your order details...
        </p>

      </main>
    );
  }

  /* =========================================================
     ERROR / ORDER NOT FOUND
  ========================================================= */

  if (
    missingOrderInfo ||
    fetchError ||
    !order
  ) {
    return (
      <main className="order-success-page">

        <div className="order-success-error">

          <div className="success-error-icon">
            <Package size={30} />
          </div>

          <h1>
            Order Not Found
          </h1>

          <p>
            {fetchError ||
              "We couldn't load this order. Please check your orders page."}
          </p>

          <Link
            to="/orders"
            className="success-primary-button"
          >
            View My Orders
            <ArrowRight size={16} />
          </Link>

        </div>

      </main>
    );
  }

  /* =========================================================
     ORDER DATE
  ========================================================= */

  const orderDate = new Date(
    order.createdAt
  ).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="order-success-page">

      {/* =====================================================
          SUCCESS HERO
      ===================================================== */}

      <section className="order-success-hero">

        <div className="success-decoration success-decoration-one"></div>

        <div className="success-decoration success-decoration-two"></div>

        <div className="success-check-wrapper">

          <div className="success-check-circle">

            <Check
              size={42}
              strokeWidth={2.5}
            />

          </div>

        </div>

        <span className="success-eyebrow">
          ORDER CONFIRMED
        </span>

        <h1>
          Thank You for <em>Choosing MAMTA</em>
        </h1>

        <p>
          Your order has been placed successfully.
          We're getting your little package ready.
        </p>

        <div className="success-order-number">

          <span>
            ORDER NUMBER
          </span>

          <strong>
            {order.orderNumber}
          </strong>

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="order-success-content">

        <div className="order-success-container">


          {/* =================================================
              ORDER STATUS
          ================================================= */}

          <div className="success-status-card">

            <div className="status-step active">

              <div className="status-icon">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <strong>
                  Order Placed
                </strong>

                <span>
                  Just now
                </span>
              </div>

            </div>


            <div className="status-line"></div>


            <div className="status-step">

              <div className="status-icon">
                <Package size={18} />
              </div>

              <div>
                <strong>
                  Processing
                </strong>

                <span>
                  Coming soon
                </span>
              </div>

            </div>


            <div className="status-line"></div>


            <div className="status-step">

              <div className="status-icon">
                <Truck size={18} />
              </div>

              <div>
                <strong>
                  Delivered
                </strong>

                <span>
                  On its way
                </span>
              </div>

            </div>

          </div>


          {/* =================================================
              TWO COLUMNS
          ================================================= */}

          <div className="success-main-grid">


            {/* =================================================
                LEFT
            ================================================= */}

            <div className="success-left">


              {/* =================================================
                  ORDER ITEMS
              ================================================= */}

              <div className="success-card">

                <div className="success-card-header">

                  <div>

                    <span>
                      YOUR PURCHASE
                    </span>

                    <h2>
                      Order Items
                    </h2>

                  </div>

                  <strong>
                    {order.items.length}{" "}
                    {order.items.length === 1
                      ? "Item"
                      : "Items"}
                  </strong>

                </div>


                <div className="success-items">

                  {order.items.map((item, index) => (

                    <div
                      className="success-item"
                      key={
                        item.productId ||
                        item._id ||
                        index
                      }
                    >

                      <div className="success-item-image">

                        <img
                          src={
                            item.image ||
                            "https://placehold.co/140x140/F4D9DC/4A3032?text=MAMTA"
                          }
                          alt={
                            item.name ||
                            "MAMTA Product"
                          }
                        />

                        <span>
                          {item.quantity}
                        </span>

                      </div>


                      <div className="success-item-info">

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          Rs.{" "}
                          {Number(
                            item.price || 0
                          ).toLocaleString()}{" "}
                          × {item.quantity}
                        </p>

                      </div>


                      <strong>
                        Rs.{" "}
                        {Number(
                          item.total || 0
                        ).toLocaleString()}
                      </strong>

                    </div>

                  ))}

                </div>

              </div>


              {/* =================================================
                  DELIVERY
              ================================================= */}

              <div className="success-card">

                <div className="success-card-header">

                  <div>

                    <span>
                      DELIVERY
                    </span>

                    <h2>
                      Shipping Details
                    </h2>

                  </div>

                  <MapPin
                    size={21}
                    className="shipping-header-icon"
                  />

                </div>


                <div className="shipping-details">

                  <div>

                    <strong>
                      {order.customer?.name}
                    </strong>

                    <p>
                      {order.customer?.address}
                    </p>

                    <p>
                      {order.customer?.city}
                    </p>

                  </div>


                  <div className="shipping-phone">

                    <Phone size={15} />

                    <span>
                      {order.customer?.phone}
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                RIGHT
            ================================================= */}

            <aside className="success-right">

              <div className="success-summary-card">

                <span className="summary-label">
                  ORDER SUMMARY
                </span>

                <h2>
                  Your MAMTA Order
                </h2>


                <div className="success-summary-rows">

                  <div>

                    <span>
                      Order Date
                    </span>

                    <strong>
                      {orderDate}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Payment
                    </span>

                    <strong>
                      {order.paymentMethod}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Payment Status
                    </span>

                    <strong className="pending-text">
                      {order.paymentStatus}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Order Status
                    </span>

                    <strong className="status-text">
                      {order.orderStatus}
                    </strong>

                  </div>

                </div>


                <div className="success-price-breakdown">

                  <div>

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      Rs.{" "}
                      {Number(
                        order.subtotal || 0
                      ).toLocaleString()}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Delivery
                    </span>

                    <strong>
                      {Number(
                        order.shipping || 0
                      ) === 0
                        ? "FREE"
                        : `Rs. ${Number(
                            order.shipping
                          ).toLocaleString()}`}
                    </strong>

                  </div>

                </div>


                <div className="success-final-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    Rs.{" "}
                    {Number(
                      order.total || 0
                    ).toLocaleString()}
                  </strong>

                </div>


                <div className="cod-message">

                  <CheckCircle2 size={17} />

                  <div>

                    <strong>
                      Cash on Delivery
                    </strong>

                    <p>
                      Please keep the exact amount
                      ready when your order arrives.
                    </p>

                  </div>

                </div>

              </div>

            </aside>

          </div>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="success-actions">

            <Link
              to="/orders"
              className="success-primary-button"
            >
              View My Orders
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/shop"
              className="success-secondary-button"
            >
              <ShoppingBag size={16} />
              Continue Shopping
            </Link>

          </div>


          <p className="success-thank-note">
            Thank you for being a part of the MAMTA
            family.
          </p>

        </div>

      </section>

    </main>
  );
};

export default OrderSuccess;
