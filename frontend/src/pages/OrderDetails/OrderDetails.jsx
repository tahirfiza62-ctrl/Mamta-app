import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock3,
  Truck,
  XCircle,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import "./OrderDetails.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mamta-app-8.onrender.com/api";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // =====================================================
  // FETCH ORDER
  // =====================================================

  useEffect(() => {
    const fetchOrder = async () => {
      const token =
        localStorage.getItem("mamta_user_token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!id) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedOrder =
          response.data.order ||
          response.data;

        setOrder(fetchedOrder);
      } catch (err) {
        console.error(
          "ORDER DETAILS ERROR:",
          err
        );

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
            "Unable to load this order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return `Rs. ${Number(
      price || 0
    ).toLocaleString()}`;
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle2 size={19} />;

      case "Processing":
        return <Package size={19} />;

      case "Shipped":
        return <Truck size={19} />;

      case "Delivered":
        return <CheckCircle2 size={19} />;

      case "Cancelled":
        return <XCircle size={19} />;

      default:
        return <Clock3 size={19} />;
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "detail-confirmed";

      case "Processing":
        return "detail-processing";

      case "Shipped":
        return "detail-shipped";

      case "Delivered":
        return "detail-delivered";

      case "Cancelled":
        return "detail-cancelled";

      default:
        return "detail-pending";
    }
  };

  // =====================================================
  // CANCEL ORDER
  // =====================================================

  const handleCancelOrder = async () => {
    if (!order) return;

    const token =
      localStorage.getItem("mamta_user_token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (
      order.orderStatus !== "Pending" &&
      order.orderStatus !== "Confirmed"
    ) {
      toast.error(
        "This order can no longer be cancelled."
      );

      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);

      const response = await axios.put(
        `${API_URL}/orders/${order._id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOrder =
        response.data.order ||
        response.data;

      setOrder(updatedOrder);

      toast.success(
        "Your order has been cancelled."
      );

      window.dispatchEvent(
        new Event("cartChanged")
      );
    } catch (error) {
      console.error(
        "CANCEL ORDER ERROR:",
        error
      );

      if (error.response?.status === 401) {
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

      toast.error(
        error.response?.data?.message ||
          "Unable to cancel the order."
      );
    } finally {
      setCancelling(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="order-details-page">
        <section className="order-details-loading">
          <div className="details-loading-icon">
            <ShoppingBag size={30} />
          </div>

          <h2>
            Loading Order Details
          </h2>

          <p>
            We're preparing your MAMTA order information.
          </p>
        </section>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !order) {
    return (
      <main className="order-details-page">
        <section className="order-details-error">
          <div className="details-error-icon">
            <XCircle size={32} />
          </div>

          <span>
            ORDER DETAILS
          </span>

          <h2>
            We couldn't find this order
          </h2>

          <p>
            {error ||
              "The order you're looking for is unavailable."}
          </p>

          <Link
            to="/orders"
            className="back-orders-button"
          >
            <ArrowLeft size={17} />
            BACK TO ORDERS
          </Link>
        </section>
      </main>
    );
  }

  // =====================================================
  // STATUS DATA
  // =====================================================

  const isCancelled =
    order.orderStatus === "Cancelled";

  const isPaid =
    order.paymentStatus === "Paid";

  const canCancel =
    order.orderStatus === "Pending" ||
    order.orderStatus === "Confirmed";

  const statusSteps = [
    {
      key: "Pending",
      label: "Order Placed",
      icon: <Clock3 size={18} />,
    },
    {
      key: "Confirmed",
      label: "Confirmed",
      icon: <CheckCircle2 size={18} />,
    },
    {
      key: "Processing",
      label: "Processing",
      icon: <Package size={18} />,
    },
    {
      key: "Shipped",
      label: "Shipped",
      icon: <Truck size={18} />,
    },
    {
      key: "Delivered",
      label: "Delivered",
      icon: <CheckCircle2 size={18} />,
    },
  ];

  const statusIndex =
    statusSteps.findIndex(
      (step) =>
        step.key === order.orderStatus
    );

  return (
    <main className="order-details-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="order-details-hero">

        <div className="details-decoration details-decoration-one" />

        <div className="details-decoration details-decoration-two" />

        <div className="order-details-hero-inner">

          <Link
            to="/orders"
            className="details-back-link"
          >
            <ArrowLeft size={16} />
            BACK TO ORDERS
          </Link>

          <div className="details-hero-content">

            <span>
              MAMTA ORDER
            </span>

            <h1>
              Order <em>Details</em>
            </h1>

            <p>
              Everything you need to know about your
              MAMTA purchase.
            </p>

          </div>

          <div
            className={`details-status-badge ${getStatusClass(
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

      </section>

      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <section className="order-details-container">

        {/* =================================================
            ORDER SUMMARY HEADER
        ================================================= */}

        <div className="order-summary-header">

          <div>

            <span>
              ORDER NUMBER
            </span>

            <h2>
              {order.orderNumber}
            </h2>

          </div>

          <div className="order-date-box">

            <CalendarDays size={18} />

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

        </div>

        {/* =================================================
            ORDER STATUS TIMELINE
        ================================================= */}

        {!isCancelled ? (

          <section className="order-status-section">

            <div className="section-heading">

              <span>
                ORDER PROGRESS
              </span>

              <h2>
                Track Your Order
              </h2>

            </div>

            <div className="status-timeline">

              {statusSteps.map(
                (step, index) => {

                  const completed =
                    statusIndex >= index;

                  return (
                    <div
                      className={`timeline-step ${
                        completed
                          ? "completed"
                          : ""
                      }`}
                      key={step.key}
                    >

                      <div className="timeline-icon">
                        {step.icon}
                      </div>

                      <div className="timeline-label">

                        <strong>
                          {step.label}
                        </strong>

                        {completed &&
                          index ===
                            statusIndex && (
                            <span>
                              Current
                            </span>
                          )}

                      </div>

                      {index <
                        statusSteps.length -
                          1 && (
                        <div
                          className={`timeline-line ${
                            statusIndex >
                            index
                              ? "line-completed"
                              : ""
                          }`}
                        />
                      )}

                    </div>
                  );
                }
              )}

            </div>

          </section>

        ) : (

          <section className="cancelled-order-banner">

            <div className="cancelled-icon">
              <XCircle size={25} />
            </div>

            <div>

              <strong>
                This order has been cancelled
              </strong>

              <p>
                This order is no longer being processed.
              </p>

            </div>

          </section>

        )}

        {/* =================================================
            CONTENT GRID
        ================================================= */}

        <div className="details-grid">

          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="details-main-column">

            {/* =============================================
                ORDER ITEMS
            ============================================= */}

            <section className="details-card">

              <div className="card-heading">

                <div>

                  <span>
                    YOUR PURCHASE
                  </span>

                  <h2>
                    Order Items
                  </h2>

                </div>

                <div className="items-count">

                  {order.items?.length || 0}{" "}

                  {order.items?.length === 1
                    ? "Product"
                    : "Products"}

                </div>

              </div>

              <div className="details-items">

                {order.items?.map(
                  (item, index) => (

                    <div
                      className="details-item"
                      key={`${item.productId}-${index}`}
                    >

                      <div className="details-item-image">

                        {item.image ? (

                          <img
                            src={item.image}
                            alt={item.name}
                          />

                        ) : (

                          <Package size={30} />

                        )}

                      </div>

                      <div className="details-item-info">

                        <h3>
                          {item.name}
                        </h3>

                        <p>
                          Quantity:{" "}
                          <strong>
                            {item.quantity}
                          </strong>
                        </p>

                        <span>
                          {formatPrice(
                            item.price
                          )}{" "}
                          each
                        </span>

                      </div>

                      <div className="details-item-total">

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

            </section>

            {/* =============================================
                DELIVERY INFORMATION
            ============================================= */}

            <section className="details-card">

              <div className="card-heading">

                <div>

                  <span>
                    DELIVERY INFORMATION
                  </span>

                  <h2>
                    Shipping Details
                  </h2>

                </div>

              </div>

              <div className="delivery-grid">

                {/* CUSTOMER */}

                <div className="delivery-person">

                  <div className="delivery-avatar">

                    {order.customer?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "M"}

                  </div>

                  <div>

                    <span>
                      CUSTOMER
                    </span>

                    <strong>
                      {order.customer?.name ||
                        "N/A"}
                    </strong>

                  </div>

                </div>

                {/* EMAIL */}

                <div className="delivery-detail">

                  <Mail size={17} />

                  <div>

                    <span>
                      EMAIL
                    </span>

                    <strong>
                      {order.customer?.email ||
                        "N/A"}
                    </strong>

                  </div>

                </div>

                {/* PHONE */}

                <div className="delivery-detail">

                  <Phone size={17} />

                  <div>

                    <span>
                      PHONE
                    </span>

                    <strong>
                      {order.customer?.phone ||
                        "N/A"}
                    </strong>

                  </div>

                </div>

                {/* ADDRESS */}

                <div className="delivery-detail delivery-address">

                  <MapPin size={17} />

                  <div>

                    <span>
                      DELIVERY ADDRESS
                    </span>

                    <strong>
                      {order.customer?.address ||
                        "N/A"}
                    </strong>

                    <small>
                      {order.customer?.city ||
                        "Pakistan"}
                    </small>

                  </div>

                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <aside className="details-sidebar">

            {/* =============================================
                PAYMENT
            ============================================= */}

            <section className="details-card payment-card">

              <div className="card-heading">

                <div>

                  <span>
                    PAYMENT
                  </span>

                  <h2>
                    Payment Summary
                  </h2>

                </div>

              </div>

              {/* PAYMENT METHOD */}

              <div className="payment-method-box">

                <div className="payment-method-icon">

                  {order.paymentMethod ===
                  "Online Payment" ? (
                    <CreditCard size={21} />
                  ) : (
                    <Banknote size={21} />
                  )}

                </div>

                <div>

                  <span>
                    PAYMENT METHOD
                  </span>

                  <strong>
                    {order.paymentMethod ||
                      "Cash on Delivery"}
                  </strong>

                </div>

              </div>

              {/* PAYMENT STATUS */}

              <div className="payment-status-box">

                <div
                  className={`payment-status-indicator ${
                    isPaid
                      ? "paid"
                      : "pending"
                  }`}
                >

                  {isPaid ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <Clock3 size={17} />
                  )}

                </div>

                <div>

                  <span>
                    PAYMENT STATUS
                  </span>

                  <strong>
                    {order.paymentStatus ||
                      "Pending"}
                  </strong>

                </div>

              </div>

            </section>

            {/* =============================================
                ORDER TOTAL
            ============================================= */}

            <section className="details-card total-card">

              <div className="card-heading">

                <div>

                  <span>
                    ORDER SUMMARY
                  </span>

                  <h2>
                    Total
                  </h2>

                </div>

              </div>

              <div className="price-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  {formatPrice(
                    order.subtotal
                  )}
                </strong>

              </div>

              <div className="price-row">

                <span>
                  Delivery
                </span>

                <strong>
                  {Number(
                    order.shipping || 0
                  ) === 0
                    ? "FREE"
                    : formatPrice(
                        order.shipping
                      )}
                </strong>

              </div>

              <div className="price-divider" />

              <div className="grand-total">

                <span>
                  GRAND TOTAL
                </span>

                <strong>
                  {formatPrice(
                    order.total
                  )}
                </strong>

              </div>

            </section>

            {/* =============================================
                TRUST BOX
            ============================================= */}

            <div className="details-trust">

              <ShieldCheck size={20} />

              <div>

                <strong>
                  MAMTA Care
                </strong>

                <p>
                  Your order information is securely
                  stored with us.
                </p>

              </div>

            </div>

          </aside>

        </div>

        {/* =================================================
            FOOTER ACTIONS
        ================================================= */}

        <div className="details-footer-action">

          <Link
            to="/orders"
            className="return-orders-button"
          >
            <ArrowLeft size={17} />
            BACK TO MY ORDERS
          </Link>

          <div className="details-footer-buttons">

            {canCancel && (
              <button
                type="button"
                className="cancel-order-button"
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                <XCircle size={17} />

                {cancelling
                  ? "CANCELLING..."
                  : "CANCEL ORDER"}
              </button>
            )}

            <Link
              to="/shop"
              className="continue-shopping-button"
            >
              CONTINUE SHOPPING
              <ChevronRight size={17} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
};

export default OrderDetails;