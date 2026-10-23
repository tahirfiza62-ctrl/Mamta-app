
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Users,
  Search,
  RefreshCw,
  Eye,
  UserCheck,
  UserX,
  Trash2,
  UserRound,
  Mail,
  CalendarDays,
} from "lucide-react";

import "./AdminCustomers.css";

const API_URL =
  "https://mamta-app-8.onrender.com/api/admin/customers";

const AdminCustomers = () => {
  const navigate = useNavigate();

  /* =========================================================
     STATE
  ========================================================= */

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     TOKEN
  ========================================================= */

  const getToken = () => {
    return localStorage.getItem(
      "mamta_admin_token"
    );
  };

  /* =========================================================
     FETCH CUSTOMERS
     Used by Refresh button
  ========================================================= */

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/admin");
        return;
      }

      const response = await axios.get(
        API_URL,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setCustomers(
        Array.isArray(
          response.data?.customers
        )
          ? response.data.customers
          : []
      );
    } catch (err) {
      console.error(
        "FETCH CUSTOMERS ERROR:",
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
          "Failed to load customers."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
     
     Do not call fetchCustomers() directly from the effect
     because fetchCustomers() immediately changes state.
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadCustomers = async () => {
      try {
        const token = getToken();

        if (!token) {
          navigate("/admin");
          return;
        }

        const response = await axios.get(
          API_URL,
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

        setCustomers(
          Array.isArray(
            response.data?.customers
          )
            ? response.data.customers
            : []
        );

        setError("");
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "FETCH CUSTOMERS ERROR:",
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
            "Failed to load customers."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCustomers();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredCustomers = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    if (!searchText) {
      return customers;
    }

    return customers.filter(
      (customer) => {
        const name =
          customer.name
            ?.toLowerCase() || "";

        const email =
          customer.email
            ?.toLowerCase() || "";

        return (
          name.includes(searchText) ||
          email.includes(searchText)
        );
      }
    );
  }, [customers, search]);

  /* =========================================================
     STATISTICS
  ========================================================= */

  const totalCustomers =
    customers.length;

  const activeCustomers =
    customers.filter(
      (customer) =>
        customer.active
    ).length;

  const inactiveCustomers =
    totalCustomers -
    activeCustomers;

  /* =========================================================
     UPDATE STATUS
  ========================================================= */

  const handleStatusChange =
    async (customer) => {
      try {
        setActionLoading(
          customer._id
        );

        const token = getToken();

        if (!token) {
          navigate("/admin");
          return;
        }

        const response =
          await axios.patch(
            `${API_URL}/${customer._id}/status`,
            {
              active:
                !customer.active,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const updatedCustomer =
          response.data?.customer;

        if (!updatedCustomer) {
          throw new Error(
            "Updated customer data was not returned."
          );
        }

        setCustomers(
          (currentCustomers) =>
            currentCustomers.map(
              (item) =>
                item._id ===
                customer._id
                  ? updatedCustomer
                  : item
            )
        );
      } catch (err) {
        console.error(
          "UPDATE CUSTOMER STATUS ERROR:",
          err
        );

        if (
          err.response?.status ===
            401 ||
          err.response?.status ===
            403
        ) {
          localStorage.removeItem(
            "mamta_admin_token"
          );

          navigate("/admin");
          return;
        }

        alert(
          err.response?.data
            ?.message ||
            "Unable to update customer status."
        );
      } finally {
        setActionLoading("");
      }
    };

  /* =========================================================
     DELETE CUSTOMER
  ========================================================= */

  const handleDeleteCustomer =
    async (customer) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete ${customer.name}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          customer._id
        );

        const token = getToken();

        if (!token) {
          navigate("/admin");
          return;
        }

        await axios.delete(
          `${API_URL}/${customer._id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setCustomers(
          (currentCustomers) =>
            currentCustomers.filter(
              (item) =>
                item._id !==
                customer._id
            )
        );
      } catch (err) {
        console.error(
          "DELETE CUSTOMER ERROR:",
          err
        );

        if (
          err.response?.status ===
            401 ||
          err.response?.status ===
            403
        ) {
          localStorage.removeItem(
            "mamta_admin_token"
          );

          navigate("/admin");
          return;
        }

        alert(
          err.response?.data
            ?.message ||
            "Unable to delete customer."
        );
      } finally {
        setActionLoading("");
      }
    };

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="admin-customers-page">

        <div className="customers-loading">

          <div className="customers-loader"></div>

          <p>
            Loading customers...
          </p>

        </div>

      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="admin-customers-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="customers-page-header">

        <div className="customers-heading">

          <div className="customers-heading-icon">
            <Users size={23} />
          </div>

          <div>

            <span>
              MAMTA ADMIN
            </span>

            <h1>
              Customers
            </h1>

            <p>
              Manage your registered MAMTA customers.
            </p>

          </div>

        </div>

        <button
          type="button"
          className="customers-refresh-btn"
          onClick={fetchCustomers}
          disabled={loading}
        >
          <RefreshCw
            size={17}
          />

          Refresh
        </button>

      </div>


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="customers-stats">

        <div className="customer-stat-card">

          <div className="customer-stat-icon total">
            <Users size={20} />
          </div>

          <div>

            <span>
              Total Customers
            </span>

            <strong>
              {totalCustomers}
            </strong>

          </div>

        </div>


        <div className="customer-stat-card">

          <div className="customer-stat-icon active">
            <UserCheck size={20} />
          </div>

          <div>

            <span>
              Active Customers
            </span>

            <strong>
              {activeCustomers}
            </strong>

          </div>

        </div>


        <div className="customer-stat-card">

          <div className="customer-stat-icon inactive">
            <UserX size={20} />
          </div>

          <div>

            <span>
              Inactive Customers
            </span>

            <strong>
              {inactiveCustomers}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="customers-error">
          {error}
        </div>
      )}


      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="customers-toolbar">

        <div className="customers-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <div className="customers-count">

          {filteredCustomers.length}{" "}
          Customers

        </div>

      </div>


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {filteredCustomers.length ===
      0 ? (

        <div className="customers-empty">

          <div className="customers-empty-icon">
            <UserRound size={34} />
          </div>

          <h3>

            {search
              ? "No customers found"
              : "No customers yet"}

          </h3>

          <p>

            {search
              ? "Try searching with a different name or email."
              : "Registered customers will appear here."}

          </p>

        </div>

      ) : (

        /* ===================================================
           CUSTOMER TABLE
        ==================================================== */

        <div className="customers-table-card">

          <div className="customers-table-wrapper">

            <table className="customers-table">

              <thead>

                <tr>

                  <th>
                    Customer
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Joined
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCustomers.map(
                  (customer) => (

                    <tr
                      key={
                        customer._id
                      }
                    >

                      {/* CUSTOMER */}

                      <td>

                        <div className="customer-profile">

                          <div className="customer-avatar">

                            {customer.name
                              ?.charAt(
                                0
                              )
                              ?.toUpperCase() ||
                              "C"}

                          </div>

                          <div>

                            <strong>
                              {customer.name ||
                                "Unnamed Customer"}
                            </strong>

                            <span>
                              Customer
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* EMAIL */}

                      <td>

                        <div className="customer-email">

                          <Mail size={15} />

                          <span>
                            {customer.email ||
                              "-"}
                          </span>

                        </div>

                      </td>


                      {/* JOINED */}

                      <td>

                        <div className="customer-date">

                          <CalendarDays
                            size={15}
                          />

                          <span>
                            {formatDate(
                              customer.createdAt
                            )}
                          </span>

                        </div>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`customer-status ${
                            customer.active
                              ? "active"
                              : "inactive"
                          }`}
                        >

                          {customer.active
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="customer-actions">

                          {/* VIEW */}

                          <button
                            type="button"
                            className="customer-view-btn"
                            title="View Customer"
                            onClick={() =>
                              navigate(
                                `/admin/customers/${customer._id}`
                              )
                            }
                          >

                            <Eye size={16} />

                          </button>


                          {/* ACTIVATE / DEACTIVATE */}

                          <button
                            type="button"
                            className={`customer-status-btn ${
                              customer.active
                                ? "deactivate"
                                : "activate"
                            }`}
                            title={
                              customer.active
                                ? "Deactivate Customer"
                                : "Activate Customer"
                            }
                            disabled={
                              actionLoading ===
                              customer._id
                            }
                            onClick={() =>
                              handleStatusChange(
                                customer
                              )
                            }
                          >

                            {customer.active ? (

                              <UserX
                                size={16}
                              />

                            ) : (

                              <UserCheck
                                size={16}
                              />

                            )}

                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            className="customer-delete-btn"
                            title="Delete Customer"
                            disabled={
                              actionLoading ===
                              customer._id
                            }
                            onClick={() =>
                              handleDeleteCustomer(
                                customer
                              )
                            }
                          >

                            <Trash2
                              size={16}
                            />

                          </button>

                        </div>

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

export default AdminCustomers;
