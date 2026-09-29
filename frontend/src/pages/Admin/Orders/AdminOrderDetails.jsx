
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  CalendarDays,
  Save,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import "./AdminOrderDetails.css";

const API_URL =
  "http://localhost:3000/api/admin/orders";

const AdminOrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  /* =========================================================
     STATE
  ========================================================= */

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Pending");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     ORDER STATUSES
  ========================================================= */

  const statuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  /* =========================================================
     TOKEN
  ========================================================= */

  const getToken = () => {
    return localStorage.getItem(
      "mamta_admin_token"
    );
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      try {
        const token = getToken();

        if (!token) {
          navigate("/admin");
          return;
        }

        const response = await axios.get(
          `${API_URL}/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        if (cancelled) {
          return;
        }

        const fetchedOrder =
          response.data?.order;

        if (!fetchedOrder) {
          setError("Order not found.");
          setOrder(null);
          return;
        }

        setOrder(fetchedOrder);

        setStatus(
          fetchedOrder.orderStatus ||
            "Pending"
        );

        setError("");
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "GET ADMIN ORDER ERROR:",
          err
        );

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          localStorage.removeItem(
            "mamta_admin_token"
          );

          navigate("/admin");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Failed to load order."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  /* =========================================================
     UPDATE STATUS
  ========================================================= */

  const handleStatusUpdate = async () => {
    try {
      setSaving(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/admin");
        return;
      }

      const response = await axios.put(
        `${API_URL}/${id}/status`,
        {
          orderStatus: status,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const updatedOrder =
        response.data?.order;

      if (updatedOrder) {
        setOrder(updatedOrder);

        setStatus(
          updatedOrder.orderStatus ||
            status
        );
      }

      alert(
        "Order status updated successfully."
      );
    } catch (err) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem(
          "mamta_admin_token"
        );

        navigate("/admin");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     DATE + TIME
  ========================================================= */

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="admin-order-details-loading">
        Loading order...
      </div>
    );
  }

  /* =========================================================
     ERROR WITHOUT ORDER
  ========================================================= */

  if (error && !order) {
    return (
      <div className="admin-order-details-page">

        <div className="admin-order-details-error">
          {error}
        </div>

        <button
          className="admin-order-details-back"
          onClick={() =>
            navigate("/admin/orders")
          }
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

      </div>
    );
  }

  /* =========================================================
     NO ORDER
  ========================================================= */

  if (!order) {
    return null;
  }

  /* =========================================================
     CUSTOMER
  ========================================================= */

  const customer =
    order.customer || {};

  /* =========================================================
     ITEMS
  ========================================================= */

  const items =
    Array.isArray(order.items)
      ? order.items
      : [];

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="admin-order-details-page">

      {/* =====================================================
          TOP
      ===================================================== */}

      <div className="admin-order-details-top">

        <button
          className="admin-order-details-back"
          onClick={() =>
            navigate("/admin/orders")
          }
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        <div className="admin-order-details-heading">

          <div>

            <p className="admin-order-details-eyebrow">
              MAMTA ADMIN
            </p>

            <h1>
              Order #
              {order.orderNumber ||
                String(order._id).slice(-8)}
            </h1>

            <p>
              Placed on{" "}
              {formatDateTime(
                order.createdAt
              )}
            </p>

          </div>

          <span
            className={`admin-order-details-status ${String(
              order.orderStatus ||
                "Pending"
            )
              .toLowerCase()
              .replace(
                /\s+/g,
                "-"
              )}`}
          >
            {order.orderStatus ||
              "Pending"}
          </span>

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="admin-order-details-error">
          {error}
        </div>
      )}

      {/* =====================================================
          CONTENT LAYOUT
      ===================================================== */}

      <div className="admin-order-details-layout">

        {/* ===================================================
            MAIN
        =================================================== */}

        <div className="admin-order-details-main">

          {/* =================================================
              CUSTOMER INFORMATION
          ================================================= */}

          <section className="admin-order-details-card">

            <div className="admin-order-details-card-title">

              <div className="admin-order-details-card-icon">
                <User size={18} />
              </div>

              <div>

                <h2>
                  Customer Information
                </h2>

                <p>
                  Customer details for this order
                </p>

              </div>

            </div>

            <div className="admin-order-customer-grid">

              <div>

                <span>
                  Name
                </span>

                <strong>
                  {customer.name ||
                    order.userId?.name ||
                    "-"}
                </strong>

              </div>

              <div>

                <span>
                  Email
                </span>

                <strong>
                  {customer.email ||
                    order.userId?.email ||
                    "-"}
                </strong>

              </div>

              <div>

                <span>
                  Phone
                </span>

                <strong>
                  {customer.phone ||
                    "-"}
                </strong>

              </div>

            </div>

          </section>

          {/* =================================================
              DELIVERY ADDRESS
          ================================================= */}

          <section className="admin-order-details-card">

            <div className="admin-order-details-card-title">

              <div className="admin-order-details-card-icon">
                <MapPin size={18} />
              </div>

              <div>

                <h2>
                  Delivery Address
                </h2>

                <p>
                  Shipping information
                </p>

              </div>

            </div>

            <div className="admin-order-address">

              <strong>
                {customer.name ||
                  order.userId?.name ||
                  "-"}
              </strong>

              <span>
                {customer.address ||
                  "-"}
              </span>

              <span>
                {customer.city ||
                  "-"}
              </span>

              {customer.phone && (
                <span>
                  Phone:{" "}
                  {customer.phone}
                </span>
              )}

            </div>

          </section>

          {/* =================================================
              ORDERED PRODUCTS
          ================================================= */}

          <section className="admin-order-details-card">

            <div className="admin-order-details-card-title">

              <div className="admin-order-details-card-icon">
                <Package size={18} />
              </div>

              <div>

                <h2>
                  Ordered Products
                </h2>

                <p>
                  Products included in this order
                </p>

              </div>

            </div>

            <div className="admin-order-items-list">

              {items.length === 0 ? (

                <div className="admin-order-empty-items">
                  No products found in this order.
                </div>

              ) : (

                items.map(
                  (item, index) => (

                    <div
                      className="admin-order-item"
                      key={
                        item._id ||
                        item.productId ||
                        index
                      }
                    >

                      {/* IMAGE */}

                      <div className="admin-order-item-image">

                        {item.image ? (

                          <img
                            src={item.image}
                            alt={
                              item.name ||
                              "Product"
                            }
                          />

                        ) : (

                          <Package
                            size={24}
                          />

                        )}

                      </div>

                      {/* INFO */}

                      <div className="admin-order-item-info">

                        <strong>
                          {item.name ||
                            "Product"}
                        </strong>

                        <span>
                          Quantity:{" "}
                          {Number(
                            item.quantity || 0
                          )}
                        </span>

                      </div>

                      {/* PRICE */}

                      <div className="admin-order-item-price">

                        <span>
                          Rs.{" "}
                          {Number(
                            item.price || 0
                          ).toLocaleString()}
                        </span>

                        <strong>
                          Rs.{" "}
                          {Number(
                            item.total ??
                              (
                                Number(
                                  item.price || 0
                                ) *
                                Number(
                                  item.quantity || 0
                                )
                              )
                          ).toLocaleString()}
                        </strong>

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </section>

        </div>

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="admin-order-details-sidebar">

          {/* =================================================
              ORDER STATUS
          ================================================= */}

          <section className="admin-order-details-card">

            <div className="admin-order-details-card-title">

              <div className="admin-order-details-card-icon">
                <Save size={18} />
              </div>

              <div>

                <h2>
                  Order Status
                </h2>

                <p>
                  Update order progress
                </p>

              </div>

            </div>

            <select
              className="admin-order-status-select"
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
            >

              {statuses.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

            <button
              className="admin-order-save-status"
              onClick={
                handleStatusUpdate
              }
              disabled={saving}
            >

              <Save size={17} />

              {saving
                ? "Updating..."
                : "Update Status"}

            </button>

          </section>

          {/* =================================================
              PAYMENT
          ================================================= */}

          <section className="admin-order-details-card">

            <div className="admin-order-details-card-title">

              <div className="admin-order-details-card-icon">
                <CreditCard size={18} />
              </div>

              <div>

                <h2>
                  Payment
                </h2>

                <p>
                  Payment information
                </p>

              </div>

            </div>

            <div className="admin-order-payment-info">

              <div>

                <span>
                  Method
                </span>

                <strong>
                  {order.paymentMethod ||
                    "-"}
                </strong>

              </div>

              <div>

                <span>
                  Status
                </span>

                <strong
                  className={`payment-${String(
                    order.paymentStatus ||
                      "Pending"
                  ).toLowerCase()}`}
                >
                  {order.paymentStatus ||
                    "Pending"}
                </strong>

              </div>

              {order.paymentReference && (

                <div>

                  <span>
                    Reference
                  </span>

                  <strong>
                    {
                      order.paymentReference
                    }
                  </strong>

                </div>

              )}

              {order.paymentProvider && (

                <div>

                  <span>
                    Provider
                  </span>

                  <strong>
                    {
                      order.paymentProvider
                    }
                  </strong>

                </div>

              )}

            </div>

          </section>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <section className="admin-order-details-card">

            <div className="admin-order-details-card-title">

              <div className="admin-order-details-card-icon">
                <CalendarDays size={18} />
              </div>

              <div>

                <h2>
                  Order Summary
                </h2>

                <p>
                  Price breakdown
                </p>

              </div>

            </div>

            <div className="admin-order-summary">

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
                  Shipping
                </span>

                <strong>
                  Rs.{" "}
                  {Number(
                    order.shipping || 0
                  ).toLocaleString()}
                </strong>

              </div>

              <div className="admin-order-summary-total">

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

            </div>

          </section>

        </aside>

      </div>

    </section>
  );
};

export default AdminOrderDetails;
