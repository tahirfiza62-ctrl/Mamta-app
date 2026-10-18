import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Package,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Truck,
  Eye,
  MapPin,
  CreditCard,
  Banknote,
} from "lucide-react";

import "./MyOrders.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

const MyOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  useEffect(() => {
    const fetchOrders = async () => {
      const token =
        localStorage.getItem("mamta_user_token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(response.data.orders || []);
      } catch (err) {
        console.error("MY ORDERS ERROR:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem(
            "mamta_user_token"
          );

          localStorage.removeItem(
            "mamta_user"
          );

          window.dispatchEvent(
            new Event("authChanged")
          );

          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // =====================================================
  // PRICE FORMAT
  // =====================================================

  const formatPrice = (price) => {
    return `Rs. ${Number(
      price || 0
    ).toLocaleString()}`;
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 size={16} />;

      case "Cancelled":
        return <XCircle size={16} />;

      case "Shipped":
        return <Truck size={16} />;

      case "Processing":
        return <Package size={16} />;

      case "Confirmed":
        return <CheckCircle2 size={16} />;

      default:
        return <Clock3 size={16} />;
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "status-delivered";

      case "Cancelled":
        return "status-cancelled";

      case "Shipped":
        return "status-shipped";

      case "Processing":
        return "status-processing";

      case "Confirmed":
        return "status-confirmed";

      default:
        return "status-pending";
    }
  };

  // =====================================================
  // PAYMENT CLASS
  // =====================================================

  const getPaymentClass = (status) => {
    switch (status) {
      case "Paid":
        return "payment-paid";

      case "Failed":
        return "payment-failed";

      case "Cancelled":
        return "payment-cancelled";

      default:
        return "payment-pending";
    }
  };

  // =====================================================
  // TOTAL ITEMS
  // =====================================================

  const getTotalItems = (items = []) => {
    return items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0),
      0
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="my-orders-page">

        <section className="orders-loading">

          <div className="loading-circle">
            <ShoppingBag size={28} />
          </div>

          <h2>
            Loading Your Orders
          </h2>

          <p>
            We're getting your MAMTA orders ready.
          </p>

        </section>

      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="my-orders-page">

        <section className="orders-error">

          <div className="error-circle">
            <XCircle size={30} />
          </div>

          <span>
            ORDER HISTORY
          </span>

          <h2>
            We couldn't load your orders
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="retry-button"
            onClick={() =>
              window.location.reload()
            }
          >
            TRY AGAIN
          </button>

        </section>

      </main>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <main className="my-orders-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="orders-hero">

        <div className="hero-decoration hero-decoration-one" />
        <div className="hero-decoration hero-decoration-two" />

        <div className="orders-hero-inner">

          {/* BACK */}

          <Link
            to="/profile"
            className="back-account-link"
          >
            <ArrowLeft size={16} />
            <span>
              BACK TO ACCOUNT
            </span>
          </Link>

          {/* HERO CONTENT */}

          <div className="orders-hero-content">

            <div className="orders-eyebrow">
              <span />
              MY MAMTA
              <span />
            </div>

            <h1>
              My <em>Orders</em>
            </h1>

            <p>
              A beautiful little record of everything
              you've chosen from MAMTA.
            </p>

          </div>

          {/* COUNT */}

          <div className="orders-count-card">

            <div className="count-icon">
              <Package size={22} />
            </div>

            <div className="count-content">

              <strong>
                {orders.length}
              </strong>

              <span>
                {orders.length === 1
                  ? "Total Order"
                  : "Total Orders"}
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="orders-container">

        {/* =================================================
            EMPTY
        ================================================= */}

        {orders.length === 0 ? (

          <div className="empty-orders">

            <div className="empty-icon">
              <ShoppingBag size={34} />
            </div>

            <span className="empty-eyebrow">
              YOUR MAMTA JOURNEY
            </span>

            <h2>
              No Orders Yet
            </h2>

            <p>
              You haven't placed an order with MAMTA
              yet. Explore our collection and discover
              something made with comfort in mind.
            </p>

            <Link
              to="/shop"
              className="shop-button"
            >
              START SHOPPING
              <ArrowRight size={17} />
            </Link>

          </div>

        ) : (

          <>

            {/* =================================================
                PAGE TITLE
            ================================================= */}

            <div className="orders-page-heading">

              <div>

                <span>
                  ORDER HISTORY
                </span>

                <h2>
                  Your Purchases
                </h2>

              </div>

              <div className="order-heading-line" />

            </div>

            {/* =================================================
                ORDER LIST
            ================================================= */}

            <div className="orders-list">

              {orders.map((order) => (

                <article
                  className="order-card"
                  key={order._id}
                >

                  {/* =========================================
                      ORDER TOP
                  ========================================= */}

                  <div className="order-top">

                    <div className="order-reference">

                      <span>
                        ORDER NUMBER
                      </span>

                      <strong>
                        {order.orderNumber}
                      </strong>

                    </div>

                    <div
                      className={`order-status ${getStatusClass(
                        order.orderStatus
                      )}`}
                    >

                      {getStatusIcon(
                        order.orderStatus
                      )}

                      <span>
                        {order.orderStatus}
                      </span>

                    </div>

                  </div>

                  {/* =========================================
                      ORDER INFORMATION
                  ========================================= */}

                  <div className="order-information">

                    <div className="information-item">

                      <div className="information-icon">
                        <CalendarDays size={16} />
                      </div>

                      <div>

                        <span>
                          ORDER DATE
                        </span>

                        <strong>
                          {formatDate(
                            order.createdAt
                          )}
                        </strong>

                      </div>

                    </div>

                    <div className="information-item">

                      <div className="information-icon">
                        <Package size={16} />
                      </div>

                      <div>

                        <span>
                          ITEMS
                        </span>

                        <strong>
                          {getTotalItems(
                            order.items
                          )}
                        </strong>

                      </div>

                    </div>

                    <div className="information-item">

                      <div className="information-icon">
                        {order.paymentMethod ===
                        "Online Payment" ? (
                          <CreditCard size={16} />
                        ) : (
                          <Banknote size={16} />
                        )}
                      </div>

                      <div>

                        <span>
                          PAYMENT
                        </span>

                        <strong>
                          {order.paymentMethod ===
                          "Online Payment"
                            ? "Online Payment"
                            : "Cash on Delivery"}
                        </strong>

                        {order.paymentMethod ===
                          "Online Payment" && (
                          <small
                            className={`payment-status ${getPaymentClass(
                              order.paymentStatus
                            )}`}
                          >
                            {order.paymentStatus ||
                              "Pending"}
                          </small>
                        )}

                      </div>

                    </div>

                    <div className="information-item">

                      <div className="information-icon">
                        <MapPin size={16} />
                      </div>

                      <div>

                        <span>
                          DELIVERY
                        </span>

                        <strong>
                          {order.customer?.city ||
                            "Pakistan"}
                        </strong>

                      </div>

                    </div>

                  </div>

                  {/* =========================================
                      PRODUCTS
                  ========================================= */}

                  <div className="order-items">

                    <div className="items-heading">

                      <span>
                        ORDER ITEMS
                      </span>

                      <span>
                        {getTotalItems(
                          order.items
                        )}{" "}
                        {getTotalItems(
                          order.items
                        ) === 1
                          ? "item"
                          : "items"}
                      </span>

                    </div>

                    {order.items?.map(
                      (item, index) => (

                        <div
                          className="order-item"
                          key={`${item.productId}-${index}`}
                        >

                          {/* IMAGE */}

                          <div className="item-image">

                            {item.image ? (

                              <img
                                src={item.image}
                                alt={item.name}
                              />

                            ) : (

                              <Package
                                size={26}
                              />

                            )}

                          </div>

                          {/* INFO */}

                          <div className="item-details">

                            <h3>
                              {item.name}
                            </h3>

                            <p>
                              Quantity:{" "}
                              <strong>
                                {item.quantity}
                              </strong>
                            </p>

                          </div>

                          {/* PRICE */}

                          <div className="item-price">

                            <span>
                              ITEM TOTAL
                            </span>

                            <strong>
                              {formatPrice(
                                item.total ||
                                  item.price *
                                    item.quantity
                              )}
                            </strong>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                  {/* =========================================
                      BOTTOM
                  ========================================= */}

                  <div className="order-bottom">

                    <div className="order-total">

                      <span>
                        ORDER TOTAL
                      </span>

                      <strong>
                        {formatPrice(
                          order.total
                        )}
                      </strong>

                    </div>

                    {/* =====================================
                        VIEW ORDER DETAILS
                    ===================================== */}

                    <Link
                      to={`/orders/${order._id}`}
                      className="view-details-button"
                    >

                      <Eye size={17} />

                      <span>
                        VIEW DETAILS
                      </span>

                      <ChevronRight size={17} />

                    </Link>

                  </div>

                </article>

              ))}

            </div>

          </>

        )}

      </section>

    </main>
  );
};

export default MyOrders;