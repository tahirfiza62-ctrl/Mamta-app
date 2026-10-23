
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Clock3,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  RefreshCw,
} from "lucide-react";
import "./OrderStatusPage.css";

const API_URL =
  "https://mamta-app-8.onrender.com/api/admin/orders";


/* =========================================================
   STATUS CONFIG
========================================================= */

const STATUS_CONFIG = {
  Pending: {
    title: "Pending Orders",
    description: "Orders waiting for confirmation.",
    icon: Clock3,
    className: "pending",
  },

  Processing: {
    title: "Processing Orders",
    description: "Orders currently being prepared.",
    icon: PackageCheck,
    className: "processing",
  },

  Shipped: {
    title: "Shipped Orders",
    description: "Orders that have been shipped.",
    icon: Truck,
    className: "shipped",
  },

  Delivered: {
    title: "Delivered Orders",
    description: "Successfully delivered orders.",
    icon: CheckCircle2,
    className: "delivered",
  },

  Cancelled: {
    title: "Cancelled Orders",
    description: "Orders that have been cancelled.",
    icon: XCircle,
    className: "cancelled",
  },
};


const OrderStatusPage = ({ status }) => {
  const navigate = useNavigate();


  /* =======================================================
     STATE
  ======================================================= */

  const [orders, setOrders] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  /* =======================================================
     STATUS CONFIG
  ======================================================= */

  const config = STATUS_CONFIG[status];


  /* =======================================================
     FETCH ORDERS
     GET /api/admin/orders
  ======================================================= */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "mamta_admin_token"
        );


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


      const allOrders =
        response.data?.orders || [];


      /* ===================================================
         ONLY SHOW ORDERS FOR CURRENT STATUS
      =================================================== */

      const filteredOrders =
        allOrders.filter(
          (order) =>
            order.orderStatus === status
        );


      setOrders(
        filteredOrders
      );

    } catch (err) {

      console.error(
        "FETCH ORDERS ERROR:",
        err
      );


      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        localStorage.removeItem(
          "mamta_admin_token"
        );

        localStorage.removeItem(
          "mamta_admin_user"
        );

        navigate("/admin");

        return;
      }


      setError(
        err.response?.data?.message ||
        "Failed to load orders."
      );

    } finally {

      setLoading(false);

    }
  };


  /* =======================================================
     INITIAL LOAD / STATUS CHANGE
  ======================================================= */

  useEffect(() => {
    let ignore = false;


    const loadOrders = async () => {

      try {

        setLoading(true);
        setError("");


        const token =
          localStorage.getItem(
            "mamta_admin_token"
          );


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


        if (ignore) {
          return;
        }


        const allOrders =
          response.data?.orders || [];


        const filteredOrders =
          allOrders.filter(
            (order) =>
              order.orderStatus ===
              status
          );


        setOrders(
          filteredOrders
        );


      } catch (err) {

        if (ignore) {
          return;
        }


        console.error(
          "FETCH ORDERS ERROR:",
          err
        );


        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {

          localStorage.removeItem(
            "mamta_admin_token"
          );

          localStorage.removeItem(
            "mamta_admin_user"
          );

          navigate("/admin");

          return;
        }


        setError(
          err.response?.data?.message ||
          "Failed to load orders."
        );


      } finally {

        if (!ignore) {
          setLoading(false);
        }

      }

    };


    loadOrders();


    return () => {
      ignore = true;
    };

  }, [status, navigate]);


  /* =======================================================
     SEARCH FILTER
  ======================================================= */

  const filteredOrders =
    orders.filter((order) => {

      const searchText =
        search
          .toLowerCase()
          .trim();


      return (
        order.orderNumber
          ?.toLowerCase()
          .includes(searchText) ||

        order.customer?.name
          ?.toLowerCase()
          .includes(searchText) ||

        order.customer?.email
          ?.toLowerCase()
          .includes(searchText)
      );

    });


  /* =======================================================
     INVALID STATUS
  ======================================================= */

  if (!config) {
    return (
      <div className="order-status-page">

        <div className="order-status-error">
          Invalid order status.
        </div>

      </div>
    );
  }


  /* =======================================================
     STATUS ICON
  ======================================================= */

  const StatusIcon =
    config.icon;


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="order-status-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="order-status-header">

        <div>

          <div
            className={`order-status-icon ${config.className}`}
          >
            <StatusIcon size={24} />
          </div>


          <div className="order-status-heading">

            <h1>
              {config.title}
            </h1>

            <p>
              {config.description}
            </p>

          </div>

        </div>


        {/* REFRESH */}

        <button
          className="order-refresh-btn"
          onClick={fetchOrders}
          disabled={loading}
        >

          <RefreshCw
            size={17}
            className={
              loading
                ? "order-refresh-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="order-status-toolbar">

        <div className="order-search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search order number, customer or email..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <div
          className={`order-count-badge ${config.className}`}
        >
          {filteredOrders.length} Orders
        </div>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="order-status-error">
          {error}
        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="order-status-empty">

          <div className="order-loader"></div>

          <p>
            Loading orders...
          </p>

        </div>

      ) : filteredOrders.length === 0 ? (

        /* =================================================
           EMPTY
        ================================================= */

        <div className="order-status-empty">

          <StatusIcon size={42} />

          <h3>
            No {status.toLowerCase()} orders
          </h3>

          <p>
            There are currently no orders with
            "{status}" status.
          </p>

        </div>

      ) : (

        /* =================================================
           ORDERS TABLE
        ================================================= */

        <div className="orders-table-card">

          <div className="orders-table-wrapper">

            <table className="orders-table">

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
                  (order) => (

                    <tr
                      key={order._id}
                    >

                      {/* ORDER */}

                      <td>

                        <strong>
                          #{order.orderNumber}
                        </strong>

                      </td>


                      {/* CUSTOMER */}

                      <td>

                        <div className="customer-info">

                          <strong>
                            {
                              order.customer?.name ||
                              "N/A"
                            }
                          </strong>

                          <span>
                            {
                              order.customer?.email ||
                              "N/A"
                            }
                          </span>

                        </div>

                      </td>


                      {/* ITEMS */}

                      <td>
                        {
                          order.items?.length ||
                          0
                        }
                      </td>


                      {/* TOTAL */}

                      <td>

                        <strong>
                          Rs.{" "}
                          {Number(
                            order.total || 0
                          ).toLocaleString()}
                        </strong>

                      </td>


                      {/* PAYMENT */}

                      <td>

                        <span
                          className={`payment-badge ${
                            order.paymentStatus
                              ?.toLowerCase() || ""
                          }`}
                        >
                          {
                            order.paymentStatus ||
                            "Pending"
                          }
                        </span>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`status-badge ${config.className}`}
                        >
                          {
                            order.orderStatus
                          }
                        </span>

                      </td>


                      {/* DATE */}

                      <td>

                        {
                          order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString()
                            : "N/A"
                        }

                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          className="view-order-btn"
                          onClick={() =>
                            navigate(
                              `/admin/orders/${order._id}`
                            )
                          }
                        >

                          <Eye size={16} />

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


export default OrderStatusPage;
