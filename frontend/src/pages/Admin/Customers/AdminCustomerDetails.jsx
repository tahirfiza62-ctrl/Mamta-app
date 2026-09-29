import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  UserRound,
  Mail,
  CalendarDays,
  ShieldCheck,
  ShieldOff,
  ShoppingBag,
  RefreshCw,
  MapPin,
  Phone,
  Package,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";

import "./AdminCustomerDetails.css";

const API_URL =
  "http://localhost:3000/api/admin/customers";

const AdminCustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =======================================================
     TOKEN
  ======================================================= */

  const getToken = () => {
    return localStorage.getItem("mamta_admin_token");
  };

  /* =======================================================
     FETCH CUSTOMER - USED BY REFRESH BUTTON
  ======================================================= */

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/admin");
        return;
      }

      const response = await axios.get(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "CUSTOMER DETAILS RESPONSE:",
        response.data
      );

      setCustomer(
        response.data?.customer || null
      );

      setOrders(
        response.data?.orders || []
      );

      setTotalOrders(
        response.data?.totalOrders ??
          response.data?.orders?.length ??
          0
      );
    } catch (err) {
      console.error(
        "FETCH CUSTOMER DETAILS ERROR:",
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
          "Failed to load customer details."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL CUSTOMER LOAD
     React 19 SAFE
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadCustomer = async () => {
      const token = getToken();

      if (!token) {
        if (!cancelled) {
          navigate("/admin");
        }

        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (cancelled) {
          return;
        }

        console.log(
          "CUSTOMER DETAILS RESPONSE:",
          response.data
        );

        setCustomer(
          response.data?.customer || null
        );

        setOrders(
          response.data?.orders || []
        );

        setTotalOrders(
          response.data?.totalOrders ??
            response.data?.orders?.length ??
            0
        );

        setError("");
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "FETCH CUSTOMER DETAILS ERROR:",
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
            "Failed to load customer details."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCustomer();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  /* =======================================================
     DATE FORMAT
  ======================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatShortDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =======================================================
     ORDER STATUS ICON
  ======================================================= */

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 size={14} />;

      case "Shipped":
        return <Truck size={14} />;

      case "Processing":
        return <Package size={14} />;

      case "Cancelled":
        return <XCircle size={14} />;

      default:
        return <Clock3 size={14} />;
    }
  };

  /* =======================================================
     ORDER STATUS CLASS
  ======================================================= */

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "delivered";

      case "Shipped":
        return "shipped";

      case "Processing":
        return "processing";

      case "Cancelled":
        return "cancelled";

      case "Confirmed":
        return "confirmed";

      default:
        return "pending";
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="admin-customer-details-page">
        <div className="customer-details-loading">
          <div className="customer-details-loader"></div>

          <p>
            Loading customer details...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !customer) {
    return (
      <div className="admin-customer-details-page">
        <button
          type="button"
          className="customer-details-back-btn"
          onClick={() =>
            navigate("/admin/customers")
          }
        >
          <ArrowLeft size={17} />

          Back to Customers
        </button>

        <div className="customer-details-error">
          <UserRound size={34} />

          <h2>
            Customer Not Found
          </h2>

          <p>
            {error ||
              "The requested customer could not be found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/customers")
            }
          >
            View Customers
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="admin-customer-details-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="customer-details-header">

        <div>
          <button
            type="button"
            className="customer-details-back-btn"
            onClick={() =>
              navigate("/admin/customers")
            }
          >
            <ArrowLeft size={17} />

            Back to Customers
          </button>

          <div className="customer-details-title">

            <div className="customer-details-title-icon">
              <UserRound size={23} />
            </div>

            <div>
              <span>
                MAMTA ADMIN
              </span>

              <h1>
                Customer Details
              </h1>

              <p>
                View customer account information.
              </p>
            </div>

          </div>
        </div>

        <button
          type="button"
          className="customer-details-refresh-btn"
          onClick={fetchCustomer}
          disabled={loading}
        >
          <RefreshCw size={17} />

          Refresh
        </button>

      </div>

      {/* ===================================================
          CUSTOMER PROFILE
      =================================================== */}

      <div className="customer-profile-card">

        <div className="customer-profile-top">

          <div className="customer-large-avatar">
            {customer.name
              ?.charAt(0)
              ?.toUpperCase() || "C"}
          </div>

          <div className="customer-profile-main">

            <h2>
              {customer.name ||
                "Unnamed Customer"}
            </h2>

            <p>
              <Mail size={15} />

              {customer.email ||
                "No email available"}
            </p>

            <span
              className={`customer-details-status ${
                customer.active
                  ? "active"
                  : "inactive"
              }`}
            >
              {customer.active ? (
                <>
                  <ShieldCheck size={14} />
                  Active Account
                </>
              ) : (
                <>
                  <ShieldOff size={14} />
                  Inactive Account
                </>
              )}
            </span>

          </div>

        </div>

        <div className="customer-information-grid">

          <div className="customer-information-item">

            <div className="information-icon">
              <UserRound size={17} />
            </div>

            <div>
              <span>
                Customer Name
              </span>

              <strong>
                {customer.name || "N/A"}
              </strong>
            </div>

          </div>

          <div className="customer-information-item">

            <div className="information-icon">
              <Mail size={17} />
            </div>

            <div>
              <span>
                Email Address
              </span>

              <strong>
                {customer.email || "N/A"}
              </strong>
            </div>

          </div>

          <div className="customer-information-item">

            <div className="information-icon">
              <CalendarDays size={17} />
            </div>

            <div>
              <span>
                Registered On
              </span>

              <strong>
                {formatDate(
                  customer.createdAt
                )}
              </strong>
            </div>

          </div>

          <div className="customer-information-item">

            <div className="information-icon">
              {customer.active ? (
                <ShieldCheck size={17} />
              ) : (
                <ShieldOff size={17} />
              )}
            </div>

            <div>
              <span>
                Account Status
              </span>

              <strong>
                {customer.active
                  ? "Active"
                  : "Inactive"}
              </strong>
            </div>

          </div>

        </div>

      </div>

      {/* ===================================================
          SUMMARY
      =================================================== */}

      <div className="customer-summary-grid">

        <div className="customer-summary-card">

          <div className="customer-summary-icon">
            <ShoppingBag size={21} />
          </div>

          <div>
            <span>
              Total Orders
            </span>

            <strong>
              {totalOrders}
            </strong>

            <p>
              Orders placed by this customer
            </p>
          </div>

        </div>

        <div className="customer-summary-card">

          <div className="customer-summary-icon">
            <MapPin size={21} />
          </div>

          <div>
            <span>
              Customer ID
            </span>

            <strong>
              {customer._id
                ? customer._id
                    .slice(-8)
                    .toUpperCase()
                : "N/A"}
            </strong>

            <p>
              Registered MAMTA customer
            </p>
          </div>

        </div>

        <div className="customer-summary-card">

          <div className="customer-summary-icon">
            <Phone size={21} />
          </div>

          <div>
            <span>
              Account Role
            </span>

            <strong>
              {customer.role ||
                "customer"}
            </strong>

            <p>
              Standard customer account
            </p>
          </div>

        </div>

      </div>

      {/* ===================================================
          ORDER HISTORY
      =================================================== */}

      <div className="customer-orders-section">

        <div className="customer-orders-heading">

          <div>
            <span>
              ORDER HISTORY
            </span>

            <h2>
              Customer Orders
            </h2>

            <p>
              Orders placed by{" "}
              {customer.name ||
                "this customer"}.
            </p>
          </div>

          <div className="customer-orders-count">
            {totalOrders} Orders
          </div>

        </div>

        {orders.length === 0 ? (

          <div className="customer-orders-empty">

            <div className="customer-orders-empty-icon">
              <ShoppingBag size={30} />
            </div>

            <h3>
              No Orders Yet
            </h3>

            <p>
              This customer has not placed
              any orders yet.
            </p>

          </div>

        ) : (

          <div className="customer-orders-card">

            <div className="customer-orders-table-wrapper">

              <table className="customer-orders-table">

                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (

                    <tr key={order._id}>

                      <td>
                        <strong>
                          #{order.orderNumber}
                        </strong>
                      </td>

                      <td>
                        {order.items?.length || 0}
                      </td>

                      <td>
                        <strong>
                          Rs.{" "}
                          {Number(
                            order.total || 0
                          ).toLocaleString()}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`customer-payment-status ${
                            order.paymentStatus
                              ?.toLowerCase()
                          }`}
                        >
                          {order.paymentStatus ||
                            "Pending"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`customer-order-status ${getStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          {getStatusIcon(
                            order.orderStatus
                          )}

                          {order.orderStatus ||
                            "Pending"}
                        </span>
                      </td>

                      <td>
                        {formatShortDate(
                          order.createdAt
                        )}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="customer-order-view-btn"
                          onClick={() =>
                            navigate(
                              `/admin/orders/${order._id}`
                            )
                          }
                        >
                          View
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminCustomerDetails;