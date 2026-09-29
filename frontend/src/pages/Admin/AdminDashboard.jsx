
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  ShoppingBag,
  Users,
  Wallet,
  CheckCircle2,
  Clock3,
  Truck,
  XCircle,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

import "./AdminDashboard.css";

const API_URL = "http://localhost:3000/api/admin/dashboard";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     FETCH DASHBOARD
  ===================================================== */

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("mamta_admin_token");

      const response = await axios.get(API_URL, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      if (response.data?.success) {
        setDashboard(response.data);
      } else {
        setError(
          response.data?.message || "Unable to load dashboard."
        );
      }
    } catch (err) {
      console.error("ADMIN DASHBOARD ERROR:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        setError(
          "Your admin session has expired. Please login again."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load admin dashboard."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("mamta_admin_token");

        const response = await axios.get(API_URL, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        if (cancelled) return;

        if (response.data?.success) {
          setDashboard(response.data);
        } else {
          setError(
            response.data?.message || "Unable to load dashboard."
          );
        }
      } catch (err) {
        if (cancelled) return;

        console.error("ADMIN DASHBOARD ERROR:", err);

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          setError(
            "Your admin session has expired. Please login again."
          );
        } else {
          setError(
            err.response?.data?.message ||
              "Failed to load admin dashboard."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =====================================================
     REFRESH FROM ADMIN HEADER
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const handleRefresh = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("mamta_admin_token");

        const response = await axios.get(API_URL, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });

        if (cancelled) return;

        if (response.data?.success) {
          setDashboard(response.data);
        } else {
          setError(
            response.data?.message || "Unable to load dashboard."
          );
        }
      } catch (err) {
        if (cancelled) return;

        console.error("ADMIN DASHBOARD REFRESH ERROR:", err);

        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          setError(
            "Your admin session has expired. Please login again."
          );
        } else {
          setError(
            err.response?.data?.message ||
              "Failed to load admin dashboard."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    window.addEventListener("adminRefresh", handleRefresh);

    return () => {
      cancelled = true;

      window.removeEventListener(
        "adminRefresh",
        handleRefresh
      );
    };
  }, []);

  /* =====================================================
     HELPERS
  ===================================================== */

  const formatCurrency = (amount = 0) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCustomerName = (order) => {
    if (order?.user?.name) {
      return order.user.name;
    }

    if (order?.customer?.name) {
      return order.customer.name;
    }

    if (order?.name) {
      return order.name;
    }

    return "Guest Customer";
  };

  const getOrderId = (order) => {
    if (order?._id) {
      return `#${String(order._id).slice(-6).toUpperCase()}`;
    }

    if (order?.id) {
      return `#${String(order.id).slice(-6).toUpperCase()}`;
    }

    return "#—";
  };

  const getStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "pending":
        return "status-pending";

      case "processing":
        return "status-processing";

      case "shipped":
        return "status-shipped";

      case "delivered":
        return "status-delivered";

      case "cancelled":
        return "status-cancelled";

      default:
        return "status-default";
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading && !dashboard) {
    return (
      <section className="admin-dashboard-page">
        <div className="dashboard-loading">
          <div className="dashboard-spinner">
            <RefreshCw size={24} />
          </div>

          <h2>Loading Dashboard</h2>

          <p>
            Preparing your MAMTA administration overview...
          </p>
        </div>
      </section>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error && !dashboard) {
    return (
      <section className="admin-dashboard-page">
        <div className="dashboard-error">
          <div className="dashboard-error-icon">
            <AlertCircle size={28} />
          </div>

          <h2>Unable to Load Dashboard</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={fetchDashboard}
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const stats = dashboard?.stats || {};
  const orderStatus = dashboard?.orderStatus || {};
  const recentOrders = dashboard?.recentOrders || [];
  const recentCustomers = dashboard?.recentCustomers || [];

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className="admin-dashboard-page">

      {/* =================================================
          PAGE HEADING
      ================================================= */}

      <div className="dashboard-page-heading">
        <div>
          <p>
            Welcome back. Here is what's happening with your
            MAMTA store.
          </p>
        </div>

        <button
          className="dashboard-refresh-btn"
          type="button"
          onClick={fetchDashboard}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "refresh-spinning" : ""}
          />

          Refresh
        </button>
      </div>

      {/* =================================================
          ERROR NOTICE
      ================================================= */}

      {error && dashboard && (
        <div className="dashboard-inline-error">
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="dashboard-stat-grid">

        {/* PRODUCTS */}

        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <div className="stat-icon stat-icon-rose">
              <Package size={21} />
            </div>

            <span className="stat-card-label">
              Products
            </span>
          </div>

          <strong>
            {stats.totalProducts ?? 0}
          </strong>

          <div className="stat-card-bottom">
            <span>
              {stats.activeProducts ?? 0} active products
            </span>

            <Package size={15} />
          </div>
        </div>

        {/* ORDERS */}

        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <div className="stat-icon stat-icon-purple">
              <ShoppingBag size={21} />
            </div>

            <span className="stat-card-label">
              Orders
            </span>
          </div>

          <strong>
            {stats.totalOrders ?? 0}
          </strong>

          <div className="stat-card-bottom">
            <span>
              Total customer orders
            </span>

            <ShoppingBag size={15} />
          </div>
        </div>

        {/* CUSTOMERS */}

        <div className="dashboard-stat-card">
          <div className="stat-card-top">
            <div className="stat-icon stat-icon-blue">
              <Users size={21} />
            </div>

            <span className="stat-card-label">
              Customers
            </span>
          </div>

          <strong>
            {stats.totalCustomers ?? 0}
          </strong>

          <div className="stat-card-bottom">
            <span>
              Registered customers
            </span>

            <Users size={15} />
          </div>
        </div>

        {/* REVENUE */}

        <div className="dashboard-stat-card revenue-card">
          <div className="stat-card-top">
            <div className="stat-icon stat-icon-green">
              <Wallet size={21} />
            </div>

            <span className="stat-card-label">
              Revenue
            </span>
          </div>

          <strong className="revenue-value">
            {formatCurrency(stats.revenue ?? 0)}
          </strong>

          <div className="stat-card-bottom">
            <span>
              From delivered orders
            </span>

            <ArrowUpRight size={15} />
          </div>
        </div>

      </div>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="dashboard-main-grid">

        {/* =================================================
            ORDER STATUS
        ================================================= */}

        <div className="dashboard-panel">

          <div className="panel-heading">
            <div>
              <span>ORDER OVERVIEW</span>
              <h2>Order Status</h2>
            </div>

            <ShoppingBag size={20} />
          </div>

          <div className="order-status-list">

            <div className="order-status-item">
              <div className="order-status-left">
                <div className="order-status-icon pending">
                  <Clock3 size={18} />
                </div>

                <div>
                  <strong>Pending</strong>
                  <span>
                    Awaiting confirmation
                  </span>
                </div>
              </div>

              <strong>
                {orderStatus.pending ?? 0}
              </strong>
            </div>

            <div className="order-status-item">
              <div className="order-status-left">
                <div className="order-status-icon processing">
                  <RefreshCw size={18} />
                </div>

                <div>
                  <strong>Processing</strong>
                  <span>
                    Being prepared
                  </span>
                </div>
              </div>

              <strong>
                {orderStatus.processing ?? 0}
              </strong>
            </div>

            <div className="order-status-item">
              <div className="order-status-left">
                <div className="order-status-icon shipped">
                  <Truck size={18} />
                </div>

                <div>
                  <strong>Shipped</strong>
                  <span>
                    On the way
                  </span>
                </div>
              </div>

              <strong>
                {orderStatus.shipped ?? 0}
              </strong>
            </div>

            <div className="order-status-item">
              <div className="order-status-left">
                <div className="order-status-icon delivered">
                  <CheckCircle2 size={18} />
                </div>

                <div>
                  <strong>Delivered</strong>
                  <span>
                    Successfully completed
                  </span>
                </div>
              </div>

              <strong>
                {orderStatus.delivered ?? 0}
              </strong>
            </div>

            <div className="order-status-item">
              <div className="order-status-left">
                <div className="order-status-icon cancelled">
                  <XCircle size={18} />
                </div>

                <div>
                  <strong>Cancelled</strong>
                  <span>
                    Cancelled orders
                  </span>
                </div>
              </div>

              <strong>
                {orderStatus.cancelled ?? 0}
              </strong>
            </div>

          </div>
        </div>

        {/* =================================================
            QUICK SUMMARY
        ================================================= */}

        <div className="dashboard-panel dashboard-summary-panel">

          <div className="panel-heading">
            <div>
              <span>STORE HEALTH</span>
              <h2>Quick Summary</h2>
            </div>

            <CheckCircle2 size={20} />
          </div>

          <div className="quick-summary">

            <div className="quick-summary-row">
              <span>Active Products</span>

              <strong>
                {stats.activeProducts ?? 0}
              </strong>
            </div>

            <div className="quick-summary-row">
              <span>Total Products</span>

              <strong>
                {stats.totalProducts ?? 0}
              </strong>
            </div>

            <div className="quick-summary-row">
              <span>Total Orders</span>

              <strong>
                {stats.totalOrders ?? 0}
              </strong>
            </div>

            <div className="quick-summary-row">
              <span>Customers</span>

              <strong>
                {stats.totalCustomers ?? 0}
              </strong>
            </div>

            <div className="quick-summary-row revenue-row">
              <span>Delivered Revenue</span>

              <strong>
                {formatCurrency(stats.revenue ?? 0)}
              </strong>
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          RECENT ORDERS
      ================================================= */}

      <div className="dashboard-panel recent-orders-panel">

        <div className="panel-heading">
          <div>
            <span>RECENT ACTIVITY</span>
            <h2>Recent Orders</h2>
          </div>

          <ShoppingBag size={20} />
        </div>

        {recentOrders.length === 0 ? (
          <div className="dashboard-empty">
            <ShoppingBag size={28} />
            <p>No orders found yet.</p>
          </div>
        ) : (
          <div className="recent-orders-table">

            <div className="recent-order-header">
              <span>Order</span>
              <span>Customer</span>
              <span>Date</span>
              <span>Status</span>
              <span>Amount</span>
            </div>

            {recentOrders.map((order) => (
              <div
                className="recent-order-row"
                key={order._id || order.id}
              >
                <strong>
                  {getOrderId(order)}
                </strong>

                <div className="order-customer">
                  <span className="customer-avatar">
                    {getCustomerName(order)
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <span>
                    {getCustomerName(order)}
                  </span>
                </div>

                <span className="order-date">
                  {formatDate(order.createdAt)}
                </span>

                <span
                  className={`order-status-badge ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status || "Unknown"}
                </span>

                <strong>
                  {formatCurrency(
                    order.totalAmount ??
                      order.total ??
                      0
                  )}
                </strong>
              </div>
            ))}

          </div>
        )}

      </div>

      {/* =================================================
          RECENT CUSTOMERS
      ================================================= */}

      <div className="dashboard-panel recent-customers-panel">

        <div className="panel-heading">
          <div>
            <span>CUSTOMER ACTIVITY</span>
            <h2>Recent Customers</h2>
          </div>

          <Users size={20} />
        </div>

        {recentCustomers.length === 0 ? (
          <div className="dashboard-empty">
            <Users size={28} />
            <p>
              No customers found yet.
            </p>
          </div>
        ) : (
          <div className="recent-customers-grid">

            {recentCustomers.map((customer) => (
              <div
                className="recent-customer-card"
                key={customer._id || customer.id}
              >
                <div className="customer-large-avatar">
                  {(customer.name || "C")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="customer-details">
                  <strong>
                    {customer.name || "Customer"}
                  </strong>

                  <span>
                    {customer.email || "No email"}
                  </span>

                  <small>
                    Joined{" "}
                    {formatDate(customer.createdAt)}
                  </small>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>

    </section>
  );
};

export default AdminDashboard;

