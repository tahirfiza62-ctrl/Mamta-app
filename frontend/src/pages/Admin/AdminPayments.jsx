
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  CreditCard,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertCircle,
  WalletCards,
  Banknote,
} from "lucide-react";

import "./AdminPayments.css";

const API_URL =
  "http://localhost:3000/api/admin/payments";

const AdminPayments = () => {
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [payments, setPayments] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [methodFilter, setMethodFilter] =
    useState("All");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalPayments: 0,
    paidPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    cancelledPayments: 0,
    totalRevenue: 0,
    pendingAmount: 0,
  });

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    const token = localStorage.getItem(
      "mamta_admin_token"
    );

    if (!token) {
      navigate("/admin");
      return;
    }

    let cancelled = false;

    const loadPayments = async () => {
      try {
        const response = await axios.get(
          API_URL,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        if (cancelled) return;

        setPayments(
          response.data?.payments || []
        );

        setStats(
          response.data?.stats || {
            totalPayments: 0,
            paidPayments: 0,
            pendingPayments: 0,
            failedPayments: 0,
            cancelledPayments: 0,
            totalRevenue: 0,
            pendingAmount: 0,
          }
        );
      } catch (err) {
        if (cancelled) return;

        console.error(
          "FETCH PAYMENTS ERROR:",
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
            "Failed to load payments."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPayments();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  /* =======================================================
     MANUAL REFRESH
  ======================================================= */

  const handleRefresh = async () => {
    const token = localStorage.getItem(
      "mamta_admin_token"
    );

    if (!token) {
      navigate("/admin");
      return;
    }

    try {
      setRefreshing(true);
      setError("");

      const response = await axios.get(
        API_URL,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setPayments(
        response.data?.payments || []
      );

      setStats(
        response.data?.stats || {
          totalPayments: 0,
          paidPayments: 0,
          pendingPayments: 0,
          failedPayments: 0,
          cancelledPayments: 0,
          totalRevenue: 0,
          pendingAmount: 0,
        }
      );
    } catch (err) {
      console.error(
        "REFRESH PAYMENTS ERROR:",
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
          "Failed to refresh payments."
      );
    } finally {
      setRefreshing(false);
    }
  };

  /* =======================================================
     FILTER PAYMENTS
  ======================================================= */

  const filteredPayments = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !searchText ||
        payment.orderNumber
          ?.toLowerCase()
          .includes(searchText) ||
        payment.customer?.name
          ?.toLowerCase()
          .includes(searchText) ||
        payment.customer?.email
          ?.toLowerCase()
          .includes(searchText) ||
        payment.paymentReference
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        payment.paymentStatus ===
          statusFilter;

      const matchesMethod =
        methodFilter === "All" ||
        payment.paymentMethod ===
          methodFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod
      );
    });
  }, [
    payments,
    search,
    statusFilter,
    methodFilter,
  ]);

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
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =======================================================
     STATUS ICON
  ======================================================= */

  const getPaymentIcon = (status) => {
    switch (status) {
      case "Paid":
        return (
          <CheckCircle2 size={14} />
        );

      case "Failed":
        return (
          <XCircle size={14} />
        );

      case "Cancelled":
        return (
          <AlertCircle size={14} />
        );

      default:
        return (
          <Clock3 size={14} />
        );
    }
  };

  /* =======================================================
     STATUS CLASS
  ======================================================= */

  const getPaymentClass = (status) => {
    switch (status) {
      case "Paid":
        return "paid";

      case "Failed":
        return "failed";

      case "Cancelled":
        return "cancelled";

      default:
        return "pending";
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="admin-payments-page">

        <div className="payments-loading">

          <div className="payments-loader"></div>

          <p>
            Loading payments...
          </p>

        </div>

      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="admin-payments-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="payments-page-header">

        <div className="payments-heading">

          <div className="payments-heading-icon">
            <CreditCard size={23} />
          </div>

          <div>

            <span>
              MAMTA ADMIN
            </span>

            <h1>
              Payments
            </h1>

            <p>
              Monitor customer payments and
              transaction status.
            </p>

          </div>

        </div>

        <button
          type="button"
          className="payments-refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "refresh-spinning"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="payments-error">
          {error}
        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="payments-stats">

        {/* TOTAL */}

        <div className="payment-stat-card">

          <div className="payment-stat-icon total">
            <WalletCards size={20} />
          </div>

          <div>

            <span>
              Total Payments
            </span>

            <strong>
              {stats.totalPayments}
            </strong>

          </div>

        </div>

        {/* PAID */}

        <div className="payment-stat-card">

          <div className="payment-stat-icon paid">
            <CheckCircle2 size={20} />
          </div>

          <div>

            <span>
              Paid
            </span>

            <strong>
              {stats.paidPayments}
            </strong>

          </div>

        </div>

        {/* PENDING */}

        <div className="payment-stat-card">

          <div className="payment-stat-icon pending">
            <Clock3 size={20} />
          </div>

          <div>

            <span>
              Pending
            </span>

            <strong>
              {stats.pendingPayments}
            </strong>

          </div>

        </div>

        {/* FAILED */}

        <div className="payment-stat-card">

          <div className="payment-stat-icon failed">
            <XCircle size={20} />
          </div>

          <div>

            <span>
              Failed
            </span>

            <strong>
              {stats.failedPayments}
            </strong>

          </div>

        </div>

        {/* CANCELLED */}

        <div className="payment-stat-card">

          <div className="payment-stat-icon cancelled">
            <AlertCircle size={20} />
          </div>

          <div>

            <span>
              Cancelled
            </span>

            <strong>
              {stats.cancelledPayments}
            </strong>

          </div>

        </div>

      </div>

      {/* =================================================
          REVENUE CARDS
      ================================================= */}

      <div className="payments-money-grid">

        {/* PAID REVENUE */}

        <div className="payment-money-card">

          <div className="payment-money-icon">
            <Banknote size={21} />
          </div>

          <div>

            <span>
              Paid Revenue
            </span>

            <strong>
              Rs.{" "}
              {Number(
                stats.totalRevenue || 0
              ).toLocaleString()}
            </strong>

            <p>
              Total successfully paid amount
            </p>

          </div>

        </div>

        {/* PENDING AMOUNT */}

        <div className="payment-money-card">

          <div className="payment-money-icon pending-money">
            <Clock3 size={21} />
          </div>

          <div>

            <span>
              Pending Amount
            </span>

            <strong>
              Rs.{" "}
              {Number(
                stats.pendingAmount || 0
              ).toLocaleString()}
            </strong>

            <p>
              Amount awaiting payment
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="payments-toolbar">

        <div className="payments-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search order, customer or reference..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          className="payments-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >

          <option value="All">
            All Payment Status
          </option>

          <option value="Paid">
            Paid
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Failed">
            Failed
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

        <select
          className="payments-filter"
          value={methodFilter}
          onChange={(e) =>
            setMethodFilter(e.target.value)
          }
        >

          <option value="All">
            All Methods
          </option>

          <option value="Cash on Delivery">
            Cash on Delivery
          </option>

          <option value="Online Payment">
            Online Payment
          </option>

        </select>

        <div className="payments-count">
          {filteredPayments.length} Payments
        </div>

      </div>

      {/* =================================================
          EMPTY
      ================================================= */}

      {filteredPayments.length === 0 ? (

        <div className="payments-empty">

          <div className="payments-empty-icon">
            <CreditCard size={34} />
          </div>

          <h3>

            {search ||
            statusFilter !== "All" ||
            methodFilter !== "All"
              ? "No payments found"
              : "No payments yet"}

          </h3>

          <p>

            {search ||
            statusFilter !== "All" ||
            methodFilter !== "All"
              ? "Try changing your search or filters."
              : "Customer payments will appear here when orders are placed."}

          </p>

        </div>

      ) : (

        /* =================================================
           TABLE
        ================================================= */

        <div className="payments-table-card">

          <div className="payments-table-wrapper">

            <table className="payments-table">

              <thead>

                <tr>

                  <th>
                    Order
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Method
                  </th>

                  <th>
                    Reference
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Order Status
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredPayments.map(
                  (payment) => (

                    <tr
                      key={payment._id}
                    >

                      {/* ORDER */}

                      <td>

                        <strong>
                          #{payment.orderNumber}
                        </strong>

                      </td>

                      {/* CUSTOMER */}

                      <td>

                        <div className="payment-customer">

                          <div className="payment-customer-avatar">

                            {payment.customer?.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "C"}

                          </div>

                          <div>

                            <strong>
                              {payment.customer
                                ?.name ||
                                "Unknown Customer"}
                            </strong>

                            <span>
                              {payment.customer
                                ?.email ||
                                "No email"}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* AMOUNT */}

                      <td>

                        <strong className="payment-amount">

                          Rs.{" "}

                          {Number(
                            payment.total || 0
                          ).toLocaleString()}

                        </strong>

                      </td>

                      {/* METHOD */}

                      <td>

                        <span className="payment-method">

                          {payment.paymentMethod ||
                            "N/A"}

                        </span>

                      </td>

                      {/* REFERENCE */}

                      <td>

                        <span className="payment-reference">

                          {payment.paymentReference ||
                            "—"}

                        </span>

                      </td>

                      {/* PAYMENT STATUS */}

                      <td>

                        <span
                          className={`payment-status ${getPaymentClass(
                            payment.paymentStatus
                          )}`}
                        >

                          {getPaymentIcon(
                            payment.paymentStatus
                          )}

                          {payment.paymentStatus ||
                            "Pending"}

                        </span>

                      </td>

                      {/* ORDER STATUS */}

                      <td>

                        <span
                          className={`payment-order-status ${
                            payment.orderStatus
                              ?.toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )
                          }`}
                        >

                          {payment.orderStatus ||
                            "Pending"}

                        </span>

                      </td>

                      {/* DATE */}

                      <td>

                        {formatDate(
                          payment.createdAt
                        )}

                      </td>

                      {/* ACTION */}

                      <td>

                        <button
                          type="button"
                          className="payment-view-btn"
                          onClick={() =>
                            navigate(
                              `/admin/orders/${payment._id}`
                            )
                          }
                        >

                          <Eye size={15} />

                          View

                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminPayments;
