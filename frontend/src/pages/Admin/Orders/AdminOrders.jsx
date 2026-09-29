
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Search,
  RefreshCw,
  ShoppingBag,
  Eye,
  Filter,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./AdminOrders.css";


/* =========================================================
   API
========================================================= */

const API_URL =
  "http://localhost:3000/api/admin/orders";


const AdminOrders = () => {

  const navigate =
    useNavigate();


  /* =======================================================
     STATE
  ======================================================= */

  const [orders, setOrders] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =======================================================
     TOKEN
  ======================================================= */

  const getToken = () => {
    return localStorage.getItem(
      "mamta_admin_token"
    );
  };


  /* =======================================================
     FETCH ORDERS
  ======================================================= */

  const fetchOrders =
    async () => {

      try {

        setLoading(true);
        setError("");

        const token =
          getToken();


        if (!token) {
          navigate("/admin");
          return;
        }


        const response =
          await axios.get(
            API_URL,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        if (
          Array.isArray(
            response.data?.orders
          )
        ) {

          setOrders(
            response.data.orders
          );

        } else {

          setOrders([]);

        }

      } catch (err) {

        console.error(
          "ADMIN ORDERS ERROR:",
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


        setError(
          err.response?.data?.message ||
          "Unable to load orders."
        );

      } finally {

        setLoading(false);

      }
    };


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

/* =======================================================
   INITIAL LOAD
======================================================= */

useEffect(() => {
  let cancelled = false;

  const loadInitialOrders = async () => {
    try {
      const token = getToken();

      if (!token) {
        navigate("/admin");
        return;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (cancelled) return;

      if (Array.isArray(response.data?.orders)) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }

      setError("");
    } catch (err) {
      if (cancelled) return;

      console.error("ADMIN ORDERS ERROR:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("mamta_admin_token");
        navigate("/admin");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load orders."
      );
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  loadInitialOrders();

  return () => {
    cancelled = true;
  };
}, [navigate]);
  /* =======================================================
     FILTERED ORDERS
  ======================================================= */

  const filteredOrders =
    useMemo(() => {

      const searchValue =
        search
          .toLowerCase()
          .trim();


      return orders.filter(
        (order) => {

          const orderNumber =
            order.orderNumber
              ?.toLowerCase() ||
            "";


          const customerName =
            order.customer?.name
              ?.toLowerCase() ||
            order.userId?.name
              ?.toLowerCase() ||
            "";


          const customerEmail =
            order.customer?.email
              ?.toLowerCase() ||
            order.userId?.email
              ?.toLowerCase() ||
            "";


          const matchesSearch =
            !searchValue ||
            orderNumber.includes(
              searchValue
            ) ||
            customerName.includes(
              searchValue
            ) ||
            customerEmail.includes(
              searchValue
            );


          const matchesStatus =
            status === "All" ||
            order.orderStatus ===
              status;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

    }, [
      orders,
      search,
      status,
    ]);


  /* =======================================================
     STATUS
  ======================================================= */

  const statuses = [
    "All",
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];


  /* =======================================================
     DATE
  ======================================================= */

  const formatDate =
    (date) => {

      if (!date) {
        return "-";
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


  /* =======================================================
     PAYMENT STATUS CLASS
  ======================================================= */

  const getPaymentClass =
    (paymentStatus) => {

      switch (
        paymentStatus
      ) {

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
     ORDER STATUS CLASS
  ======================================================= */

  const getOrderClass =
    (orderStatus) => {

      switch (
        orderStatus
      ) {

        case "Confirmed":
          return "confirmed";

        case "Processing":
          return "processing";

        case "Shipped":
          return "shipped";

        case "Delivered":
          return "delivered";

        case "Cancelled":
          return "cancelled";

        default:
          return "pending";

      }
    };


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="admin-orders-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-orders-header">

        <div className="admin-orders-title-row">

          <div className="admin-orders-icon">
            <ShoppingBag size={22} />
          </div>


          <div>

            <h1>
              Orders
            </h1>

            <p>
              Manage and track all MAMTA customer orders.
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="admin-orders-toolbar">


        {/* SEARCH */}

        <div className="admin-orders-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search order or customer..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        {/* STATUS */}

        <div className="admin-orders-filter">

          <Filter size={17} />

          <select
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

        </div>


        {/* REFRESH */}

        <button
          className="admin-orders-refresh"
          onClick={
            fetchOrders
          }
          disabled={loading}
        >

          <RefreshCw
            size={17}
            className={
              loading
                ? "admin-orders-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* =================================================
          RESULT
      ================================================= */}

      <div className="admin-orders-results">

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


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="admin-orders-error">
          {error}
        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="admin-orders-loading">

          <RefreshCw
            size={28}
            className="admin-orders-spin"
          />

          <p>
            Loading orders...
          </p>

        </div>

      ) : filteredOrders.length === 0 ? (

        <div className="admin-orders-empty">

          <div className="admin-orders-empty-icon">
            <ShoppingBag size={36} />
          </div>

          <h3>
            No orders found
          </h3>

          <p>
            {orders.length === 0
              ? "There are no customer orders yet."
              : "Try changing your search or status filter."}
          </p>

        </div>

      ) : (

        /* =================================================
           TABLE
        ================================================= */

        <div className="admin-orders-table-wrapper">

          <table className="admin-orders-table">

            <thead>

              <tr>

                <th>
                  Order
                </th>

                <th>
                  Customer
                </th>

                <th>
                  Items
                </th>

                <th>
                  Total
                </th>

                <th>
                  Payment
                </th>

                <th>
                  Status
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

              {filteredOrders.map(
                (order) => {

                  const customerName =
                    order.customer?.name ||
                    order.userId?.name ||
                    "Guest";


                  const customerEmail =
                    order.customer?.email ||
                    order.userId?.email ||
                    "-";


                  const itemCount =
                    Array.isArray(
                      order.items
                    )
                      ? order.items.reduce(
                          (
                            total,
                            item
                          ) =>
                            total +
                            Number(
                              item.quantity ||
                                0
                            ),
                          0
                        )
                      : 0;


                  return (

                    <tr
                      key={
                        order._id
                      }
                    >

                      {/* ORDER */}

                      <td>

                        <div className="admin-order-number">

                          <strong>
                            #
                            {
                              order.orderNumber ||
                              String(
                                order._id
                              ).slice(-8)
                            }
                          </strong>

                          <span>
                            ID:{" "}
                            {String(
                              order._id
                            ).slice(-8)}
                          </span>

                        </div>

                      </td>


                      {/* CUSTOMER */}

                      <td>

                        <div className="admin-order-customer">

                          <strong>
                            {customerName}
                          </strong>

                          <span>
                            {customerEmail}
                          </span>

                        </div>

                      </td>


                      {/* ITEMS */}

                      <td>

                        <span className="admin-order-items">

                          {itemCount}{" "}
                          {itemCount === 1
                            ? "item"
                            : "items"}

                        </span>

                      </td>


                      {/* TOTAL */}

                      <td>

                        <strong className="admin-order-total">

                          Rs.{" "}

                          {Number(
                            order.total || 0
                          ).toLocaleString()}

                        </strong>

                      </td>


                      {/* PAYMENT */}

                      <td>

                        <div className="admin-order-payment">

                          <span
                            className={`
                              admin-payment-status
                              ${getPaymentClass(
                                order.paymentStatus
                              )}
                            `}
                          >

                            {order.paymentStatus ||
                              "Pending"}

                          </span>

                          <small>
                            {
                              order.paymentMethod ||
                              "-"
                            }
                          </small>

                        </div>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`
                            admin-order-status
                            ${getOrderClass(
                              order.orderStatus
                            )}
                          `}
                        >

                          <span></span>

                          {
                            order.orderStatus ||
                            "Pending"
                          }

                        </span>

                      </td>


                      {/* DATE */}

                      <td>

                        <span className="admin-order-date">

                          {formatDate(
                            order.createdAt
                          )}

                        </span>

                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          className="admin-order-view"
                          title="View Order"
                          onClick={() =>
                            navigate(
                              `/admin/orders/${order._id}`
                            )
                          }
                        >

                          <Eye size={17} />

                        </button>

                      </td>

                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
};


export default AdminOrders;

