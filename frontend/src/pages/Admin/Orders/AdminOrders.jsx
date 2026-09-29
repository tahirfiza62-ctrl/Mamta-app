import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  ShoppingBag,
  Eye,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";

const API_URL =
  "http://localhost:3000/api/admin/orders";

const AdminOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  /* =========================================================
     INITIAL FETCH
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        if (!cancelled) {
          setLoading(true);
        }

        const token =
          localStorage.getItem(
            "mamta_admin_token"
          );

        if (!token) {
          if (!cancelled) {
            navigate("/admin/login");
          }

          return;
        }

        const response = await fetch(
          API_URL,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        /*
         * TOKEN EXPIRED / UNAUTHORIZED
         */

        if (
          response.status === 401
        ) {
          localStorage.removeItem(
            "mamta_admin_token"
          );

          if (!cancelled) {
            navigate("/admin/login");
          }

          return;
        }

        /*
         * OTHER API ERROR
         */

        if (!response.ok) {
          throw new Error(
            "Unable to fetch orders."
          );
        }

        const data =
          await response.json();

        console.log(
          "ADMIN ORDERS:",
          data
        );

        /*
         * API MAY RETURN:
         *
         * [
         *   ...
         * ]
         *
         * OR
         *
         * {
         *   orders: [...]
         * }
         */

        let fetchedOrders = [];

        if (
          Array.isArray(data)
        ) {
          fetchedOrders = data;
        } else if (
          Array.isArray(
            data?.orders
          )
        ) {
          fetchedOrders =
            data.orders;
        }

        if (!cancelled) {
          setOrders(
            fetchedOrders
          );
        }
      } catch (error) {
        console.error(
          "ADMIN ORDERS ERROR:",
          error
        );

        if (!cancelled) {
          setOrders([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    /*
     * Run initial fetch.
     *
     * The function is declared inside
     * the effect, so there is no:
     *
     * react-hooks/exhaustive-deps
     *
     * warning.
     */

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  /* =========================================================
     REFRESH
  ========================================================= */

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      const token =
        localStorage.getItem(
          "mamta_admin_token"
        );

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(
        API_URL,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      /*
       * UNAUTHORIZED
       */

      if (
        response.status === 401
      ) {
        localStorage.removeItem(
          "mamta_admin_token"
        );

        navigate("/admin/login");

        return;
      }

      /*
       * API ERROR
       */

      if (!response.ok) {
        throw new Error(
          "Unable to refresh orders."
        );
      }

      const data =
        await response.json();

      console.log(
        "REFRESHED ADMIN ORDERS:",
        data
      );

      let refreshedOrders = [];

      if (
        Array.isArray(data)
      ) {
        refreshedOrders = data;
      } else if (
        Array.isArray(
          data?.orders
        )
      ) {
        refreshedOrders =
          data.orders;
      }

      setOrders(
        refreshedOrders
      );
    } catch (error) {
      console.error(
        "REFRESH ORDERS ERROR:",
        error
      );
    } finally {
      setRefreshing(false);
    }
  };

  /* =========================================================
     FILTER ORDERS
  ========================================================= */

  const filteredOrders =
    orders.filter(
      (order) => {
        const searchValue =
          search
            .trim()
            .toLowerCase();

        const customerName =
          order.customer?.name ||
          order.name ||
          order.customerName ||
          "";

        const customerEmail =
          order.customer?.email ||
          order.email ||
          "";

        const orderId =
          order._id ||
          order.id ||
          "";

        const matchesSearch =
          !searchValue ||
          String(
            customerName
          )
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          String(
            customerEmail
          )
            .toLowerCase()
            .includes(
              searchValue
            ) ||
          String(
            orderId
          )
            .toLowerCase()
            .includes(
              searchValue
            );

        const orderStatus =
          order.status ||
          "Pending";

        const matchesStatus =
          statusFilter ===
            "All" ||
          orderStatus ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  /* =========================================================
     HELPERS
  ========================================================= */

  const getCustomerName = (
    order
  ) => {
    return (
      order.customer?.name ||
      order.name ||
      order.customerName ||
      "Guest Customer"
    );
  };

  const getCustomerEmail = (
    order
  ) => {
    return (
      order.customer?.email ||
      order.email ||
      "—"
    );
  };

  const getTotal = (order) => {
    return Number(
      order.total ||
        order.grandTotal ||
        order.amount ||
        0
    );
  };

  const getPaymentMethod = (
    order
  ) => {
    return (
      order.paymentMethod ||
      order.payment?.method ||
      "—"
    );
  };

  const getStatus = (order) => {
    return (
      order.status ||
      "Pending"
    );
  };

  const getDate = (order) => {
    const date =
      order.createdAt ||
      order.date ||
      order.created_on;

    if (!date) {
      return "—";
    }

    try {
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
    } catch {
      return "—";
    }
  };

  const getItemCount = (
    order
  ) => {
    if (
      !Array.isArray(
        order.items
      )
    ) {
      return 0;
    }

    return order.items.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );
  };

  /* =========================================================
     GET COLORS
  ========================================================= */

  const getOrderColors = (
    order
  ) => {
    if (
      !Array.isArray(
        order.items
      )
    ) {
      return [];
    }

    return order.items
      .map((item) => {
        if (!item.color) {
          return null;
        }

        return String(
          item.color
        );
      })
      .filter(Boolean);
  };

  /* =========================================================
     STATUS CLASS
  ========================================================= */

  const getStatusClass = (
    status
  ) => {
    return String(status)
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      );
  };

  /* =========================================================
     OPEN ORDER
  ========================================================= */

  const handleViewOrder = (
    orderId
  ) => {
    if (!orderId) {
      return;
    }

    navigate(
      `/admin/orders/${orderId}`
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="admin-orders-page">

        <div className="admin-orders-loading">

          <RefreshCw
            size={28}
            className="admin-orders-spinner"
          />

          <p>
            Loading orders...
          </p>

        </div>

      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="admin-orders-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="admin-orders-header">

        <div>

          <span className="admin-orders-eyebrow">
            MAMTA ADMIN
          </span>

          <h1>
            Orders
          </h1>

          <p>
            Manage and review customer orders.
          </p>

        </div>


        <button
          type="button"
          className="admin-refresh-button"
          onClick={
            handleRefresh
          }
          disabled={
            refreshing
          }
        >

          <RefreshCw
            size={17}
            className={
              refreshing
                ? "admin-orders-spinner"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh"}

        </button>

      </div>


      {/* =====================================================
          FILTER BAR
      ====================================================== */}

      <div className="admin-orders-toolbar">

        {/* SEARCH */}

        <div className="admin-orders-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search orders, customer name or email..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        {/* STATUS */}

        <div className="admin-orders-filter">

          <Filter size={17} />

          <select
            value={
              statusFilter
            }
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >

            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Processing">
              Processing
            </option>

            <option value="Shipped">
              Shipped
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

          </select>

        </div>

      </div>


      {/* =====================================================
          ORDER COUNT
      ====================================================== */}

      <div className="admin-orders-count">

        Showing{" "}

        <strong>
          {
            filteredOrders.length
          }
        </strong>

        {" "}of{" "}

        <strong>
          {orders.length}
        </strong>

        {" "}orders

      </div>


      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="admin-orders-table-wrapper">

        {filteredOrders.length ===
        0 ? (

          <div className="admin-orders-empty">

            <div className="admin-orders-empty-icon">

              <ShoppingBag
                size={28}
              />

            </div>

            <h2>
              No orders found
            </h2>

            <p>
              There are no orders matching your current filters.
            </p>

          </div>

        ) : (

          <table className="admin-orders-table">

            <thead>

              <tr>

                <th>
                  ORDER
                </th>

                <th>
                  CUSTOMER
                </th>

                <th>
                  ITEMS
                </th>

                <th>
                  TOTAL
                </th>

                <th>
                  PAYMENT
                </th>

                <th>
                  STATUS
                </th>

                <th>
                  DATE
                </th>

                <th>
                  ACTION
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredOrders.map(
                (
                  order,
                  index
                ) => {

                  const orderId =
                    order._id ||
                    order.id ||
                    "";

                  const colors =
                    getOrderColors(
                      order
                    );

                  const itemCount =
                    getItemCount(
                      order
                    );

                  const status =
                    getStatus(
                      order
                    );

                  return (

                    <tr
                      key={
                        orderId ||
                        index
                      }
                    >

                      {/* ORDER */}

                      <td>

                        <div className="admin-order-id">

                          <span>
                            #
                          </span>

                          {String(
                            orderId
                          ).slice(-8)}

                        </div>

                      </td>


                      {/* CUSTOMER */}

                      <td>

                        <div className="admin-order-customer">

                          <strong>
                            {
                              getCustomerName(
                                order
                              )
                            }
                          </strong>

                          <span>
                            {
                              getCustomerEmail(
                                order
                              )
                            }
                          </span>

                        </div>

                      </td>


                      {/* ITEMS */}

                      <td>

                        <div className="admin-order-items-cell">

                          <strong>
                            {
                              itemCount
                            }{" "}
                            {
                              itemCount ===
                              1
                                ? "item"
                                : "items"
                            }
                          </strong>


                          {/* COLOR PREVIEW */}

                          {colors.length >
                            0 && (

                            <div className="admin-order-colors-preview">

                              {colors
                                .slice(
                                  0,
                                  2
                                )
                                .map(
                                  (
                                    color,
                                    colorIndex
                                  ) => (

                                    <span
                                      key={`${color}-${colorIndex}`}
                                      className="admin-order-color-preview"
                                    >

                                      <span className="admin-order-color-dot"></span>

                                      {
                                        color
                                      }

                                    </span>

                                  )
                                )}


                              {colors.length >
                                2 && (

                                <span className="admin-order-more-colors">

                                  +
                                  {
                                    colors.length -
                                    2
                                  }

                                </span>

                              )}

                            </div>

                          )}

                        </div>

                      </td>


                      {/* TOTAL */}

                      <td>

                        <strong className="admin-order-total">

                          Rs.{" "}

                          {
                            getTotal(
                              order
                            ).toLocaleString()
                          }

                        </strong>

                      </td>


                      {/* PAYMENT */}

                      <td>

                        <span className="admin-payment-method">

                          {
                            getPaymentMethod(
                              order
                            )
                          }

                        </span>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`admin-order-status ${getStatusClass(
                            status
                          )}`}
                        >

                          {status}

                        </span>

                      </td>


                      {/* DATE */}

                      <td>

                        <span className="admin-order-date">

                          {
                            getDate(
                              order
                            )
                          }

                        </span>

                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          type="button"
                          className="admin-view-order-button"
                          onClick={() =>
                            handleViewOrder(
                              orderId
                            )
                          }
                        >

                          <Eye
                            size={16}
                          />

                          View

                        </button>

                      </td>

                    </tr>

                  );
                }
              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
};

export default AdminOrders;