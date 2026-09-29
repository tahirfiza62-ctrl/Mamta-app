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

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./AdminOrderDetails.css";

const API_URL =
  "http://localhost:3000/api/admin/orders";

const FALLBACK_IMAGE =
  "https://placehold.co/100x100/F4D9DC/4A3032?text=MAMTA";


const AdminOrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] =
    useState("Pending");


  /* =========================================================
     FETCH ORDER
  ========================================================= */

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem(
            "mamta_admin_token"
          );

        if (!token) {
          navigate("/admin/login");
          return;
        }

        const response =
          await axios.get(
            `${API_URL}/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(
          "ADMIN ORDER DETAILS:",
          response.data
        );

        const orderData =
          response.data?.order ||
          response.data;

        setOrder(orderData);

        setStatus(
          orderData?.orderStatus ||
          orderData?.status ||
          "Pending"
        );

      } catch (error) {
        console.error(
          "ADMIN ORDER DETAILS ERROR:",
          error
        );

        if (
          error.response?.status === 401
        ) {
          localStorage.removeItem(
            "mamta_admin_token"
          );

          navigate("/admin/login");
          return;
        }

        setOrder(null);

      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, navigate]);


  /* =========================================================
     UPDATE STATUS
  ========================================================= */

  const handleStatusUpdate =
    async () => {
      if (!id || !status) {
        return;
      }

      try {
        setSaving(true);

        const token =
          localStorage.getItem(
            "mamta_admin_token"
          );

        if (!token) {
          navigate("/admin/login");
          return;
        }

        console.log(
          "UPDATING ORDER STATUS:",
          {
            orderId: id,
            status,
          }
        );

        const response =
          await axios.put(
            `${API_URL}/${id}/status`,
            {
              status,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        console.log(
          "STATUS UPDATE RESPONSE:",
          response.data
        );

        const updatedOrder =
          response.data?.order ||
          response.data;

        setOrder((current) => ({
          ...current,
          ...(updatedOrder &&
          typeof updatedOrder ===
            "object"
            ? updatedOrder
            : {}),

          orderStatus:
            status,

          status:
            status,
        }));

        setStatus(status);

        alert(
          "Order status updated successfully."
        );

      } catch (error) {
        console.error(
          "UPDATE ORDER STATUS ERROR:",
          error
        );

        console.error(
          "STATUS ERROR RESPONSE:",
          error.response?.data
        );

        if (
          error.response?.status === 401
        ) {
          localStorage.removeItem(
            "mamta_admin_token"
          );

          navigate("/admin/login");
          return;
        }

        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to update order status."
        );

      } finally {
        setSaving(false);
      }
    };


  /* =========================================================
     CUSTOMER HELPERS
  ========================================================= */

  const getCustomerName = () => {
    return (
      order?.customer?.name ||
      order?.customerName ||
      order?.name ||
      "—"
    );
  };


  const getCustomerEmail = () => {
    return (
      order?.customer?.email ||
      order?.email ||
      "—"
    );
  };


  const getCustomerPhone = () => {
    return (
      order?.customer?.phone ||
      order?.phone ||
      "—"
    );
  };


  const getAddress = () => {
    const address =
      order?.shippingAddress ||
      order?.address ||
      order?.deliveryAddress ||
      order?.customer?.address;

    if (
      typeof address === "string"
    ) {
      return address;
    }

    if (
      address &&
      typeof address === "object"
    ) {
      return [
        address.address,
        address.street,
        address.area,
        address.city,
        address.state,
        address.postalCode,
      ]
        .filter(Boolean)
        .join(", ");
    }

    return "—";
  };


  const getPaymentMethod = () => {
    return (
      order?.paymentMethod ||
      order?.payment?.method ||
      "—"
    );
  };


  const getOrderDate = () => {
    const date =
      order?.createdAt ||
      order?.date;

    if (!date) {
      return "—";
    }

    try {
      return new Date(
        date
      ).toLocaleString(
        "en-PK",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return "—";
    }
  };


  /* =========================================================
     MONEY HELPERS
  ========================================================= */

  const getSubtotal = () => {
    if (
      typeof order?.subtotal ===
      "number"
    ) {
      return order.subtotal;
    }

    if (
      Array.isArray(order?.items)
    ) {
      return order.items.reduce(
        (total, item) =>
          total +
          Number(item.price || 0) *
            Number(item.quantity || 0),
        0
      );
    }

    return 0;
  };


  const getShipping = () => {
    return Number(
      order?.shipping ??
      order?.shippingFee ??
      0
    );
  };


  const getTotal = () => {
    if (
      typeof order?.total ===
      "number"
    ) {
      return order.total;
    }

    return (
      getSubtotal() +
      getShipping()
    );
  };


  /* =========================================================
     COLOR HELPERS
  ========================================================= */

  const getColorName = (item) => {
    if (!item) {
      return "";
    }

    if (
      typeof item.color === "string"
    ) {
      return item.color.trim();
    }

    if (
      item.color &&
      typeof item.color === "object"
    ) {
      return (
        item.color.name ||
        item.color.colorName ||
        item.color.value ||
        item.color.label ||
        ""
      );
    }

    return "";
  };


  const getColorCode = (item) => {
    if (!item) {
      return "#e7d8d3";
    }

    /*
      NEW ORDERS:
      Use exact color code stored in database.
    */

    if (
      item.colorCode &&
      typeof item.colorCode === "string"
    ) {
      return item.colorCode;
    }


    /*
      OLD ORDERS:
      Small fallback map so old orders still
      display a reasonable color.
    */

    const colorName =
      getColorName(item)
        .toLowerCase()
        .trim();

    const colorMap = {
      pink: "#F4A6C1",
      "blush pink": "#F7C4D4",
      "dusty rose": "#C48A9A",
      rose: "#E8A0B5",
      mauve: "#B7849A",
      lavender: "#C8B6E2",
      purple: "#B39DDB",
      lilac: "#C8A2C8",
      blue: "#8DB9E8",
      "baby blue": "#A9D6F5",
      "sky blue": "#87CEEB",
      "navy blue": "#1F3A5F",
      "royal blue": "#4169E1",
      teal: "#4FA7A0",
      mint: "#A8D5BA",
      green: "#91B89A",
      "sage green": "#A3B18A",
      olive: "#808000",
      cream: "#F5E6C8",
      ivory: "#FFFFF0",
      white: "#FFFFFF",
      "off white": "#F8F4EC",
      beige: "#D8C3A5",
      nude: "#E6C7B2",
      camel: "#C19A6B",
      brown: "#8B5E3C",
      chocolate: "#5C4033",
      grey: "#A7A7A7",
      "light grey": "#D3D3D3",
      charcoal: "#36454F",
      black: "#222222",
      yellow: "#F5D76E",
      mustard: "#D4A017",
      orange: "#F4A261",
      peach: "#FFCBA4",
      coral: "#FF7F7F",
      red: "#E57373",
      maroon: "#800000",
      wine: "#722F37",
      burgundy: "#800020",
      turquoise: "#40E0D0",
      "sea green": "#2E8B57",
      "peacock blue": "#006D77",
      denim: "#1560BD",
      terracotta: "#C66B3D",
      khaki: "#C3B091",
    };

    return (
      colorMap[colorName] ||
      "#e7d8d3"
    );
  };


  /* =========================================================
     COLOR IMAGE
  ========================================================= */

  const getColorImage = (item) => {
    if (
      item?.colorImage &&
      typeof item.colorImage === "string"
    ) {
      return item.colorImage;
    }

    if (
      item?.image &&
      typeof item.image === "string"
    ) {
      return item.image;
    }

    return FALLBACK_IMAGE;
  };


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="admin-order-details-page">

        <div className="admin-order-details-loading">

          <Package size={30} />

          <p>
            Loading order details...
          </p>

        </div>

      </div>
    );
  }


  /* =========================================================
     ORDER NOT FOUND
  ========================================================= */

  if (!order) {
    return (
      <div className="admin-order-details-page">

        <div className="admin-order-not-found">

          <Package size={35} />

          <h2>
            Order not found
          </h2>

          <p>
            This order could not be found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            <ArrowLeft size={17} />

            Back to Orders
          </button>

        </div>

      </div>
    );
  }


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="admin-order-details-page">

      {/* BACK */}

      <button
        type="button"
        className="admin-order-back-button"
        onClick={() =>
          navigate("/admin/orders")
        }
      >
        <ArrowLeft size={18} />

        Back to Orders
      </button>


      {/* HEADER */}

      <div className="admin-order-details-header">

        <div>

          <span className="admin-order-details-eyebrow">
            MAMTA ORDER
          </span>

          <h1>
            Order Details
          </h1>

          <p>
            #
            {String(
              order.orderNumber ||
              order._id ||
              order.id ||
              id
            ).slice(-10)}
          </p>

        </div>


        <div className="admin-order-details-date">

          <CalendarDays size={17} />

          <span>
            {getOrderDate()}
          </span>

        </div>

      </div>


      {/* TOP GRID */}

      <div className="admin-order-details-grid">

        {/* CUSTOMER */}

        <div className="admin-order-card">

          <div className="admin-order-card-heading">

            <div className="admin-order-card-icon">
              <User size={18} />
            </div>

            <div>

              <span>
                CUSTOMER
              </span>

              <h2>
                Customer Information
              </h2>

            </div>

          </div>


          <div className="admin-order-customer-details">

            <div>
              <span>Name</span>

              <strong>
                {getCustomerName()}
              </strong>
            </div>

            <div>
              <span>Email</span>

              <strong>
                {getCustomerEmail()}
              </strong>
            </div>

            <div>
              <span>Phone</span>

              <strong>
                {getCustomerPhone()}
              </strong>
            </div>

          </div>

        </div>


        {/* DELIVERY */}

        <div className="admin-order-card">

          <div className="admin-order-card-heading">

            <div className="admin-order-card-icon">
              <MapPin size={18} />
            </div>

            <div>

              <span>
                DELIVERY
              </span>

              <h2>
                Delivery Address
              </h2>

            </div>

          </div>


          <div className="admin-order-address">

            <MapPin size={17} />

            <p>
              {getAddress()}
            </p>

          </div>

        </div>


        {/* PAYMENT */}

        <div className="admin-order-card">

          <div className="admin-order-card-heading">

            <div className="admin-order-card-icon">
              <CreditCard size={18} />
            </div>

            <div>

              <span>
                PAYMENT
              </span>

              <h2>
                Payment Information
              </h2>

            </div>

          </div>


          <div className="admin-order-payment-details">

            <span>
              Method
            </span>

            <strong>
              {getPaymentMethod()}
            </strong>

          </div>

        </div>

      </div>


      {/* ORDERED PRODUCTS */}

      <div className="admin-order-card admin-order-products-card">

        <div className="admin-order-card-heading">

          <div className="admin-order-card-icon">
            <Package size={18} />
          </div>

          <div>

            <span>
              ORDER
            </span>

            <h2>
              Ordered Products
            </h2>

          </div>

        </div>


        <div className="admin-order-items">

          {Array.isArray(order.items) &&
            order.items.map(
              (item, index) => {

                const colorName =
                  getColorName(item);

                const colorCode =
                  getColorCode(item);

                const itemPrice =
                  Number(
                    item.price || 0
                  );

                const itemQuantity =
                  Number(
                    item.quantity || 0
                  );

                const itemTotal =
                  Number(item.total) ||
                  itemPrice *
                    itemQuantity;

                const productImage =
                  getColorImage(item);

                return (
                  <div
                    className="admin-order-item"
                    key={`${item.productId || "product"}-${
                      colorName || "default"
                    }-${index}`}
                  >

                    {/* PRODUCT IMAGE */}

                    <div className="admin-order-item-image">

                      <img
                        src={productImage}
                        alt={
                          item.name ||
                          "Product"
                        }
                        onError={(e) => {
                          if (
                            e.currentTarget.src !==
                            FALLBACK_IMAGE
                          ) {
                            e.currentTarget.src =
                              FALLBACK_IMAGE;
                          }
                        }}
                      />

                    </div>


                    {/* PRODUCT INFO */}

                    <div className="admin-order-item-info">

                      <strong className="admin-order-item-name">
                        {item.name ||
                          "Product"}
                      </strong>


                      {/* COLOR */}

                      <div className="admin-order-item-color-box">

                        <span className="admin-order-color-label">
                          SELECTED COLOR
                        </span>

                        {colorName ? (
                          <div className="admin-order-color-value">

                            <span
                              className="admin-order-color-dot"
                              style={{
                                backgroundColor:
                                  colorCode,
                              }}
                            />

                            <span className="admin-order-color-name">
                              {colorName}
                            </span>

                          </div>
                        ) : (
                          <span className="admin-order-no-color">
                            No color selected
                          </span>
                        )}

                      </div>


                      {/* QUANTITY */}

                      <span className="admin-order-item-quantity">

                        Quantity:

                        <strong>
                          {itemQuantity}
                        </strong>

                      </span>

                    </div>


                    {/* PRICE */}

                    <div className="admin-order-item-price">

                      <span>
                        Rs.{" "}
                        {itemPrice.toLocaleString()}
                        {" "}×{" "}
                        {itemQuantity}
                      </span>

                      <strong>
                        Rs.{" "}
                        {itemTotal.toLocaleString()}
                      </strong>

                    </div>

                  </div>
                );
              }
            )}

        </div>

      </div>


      {/* BOTTOM */}

      <div className="admin-order-bottom-grid">

        {/* STATUS */}

        <div className="admin-order-card">

          <div className="admin-order-card-heading">

            <div className="admin-order-card-icon">
              <Save size={18} />
            </div>

            <div>

              <span>
                ORDER STATUS
              </span>

              <h2>
                Update Status
              </h2>

            </div>

          </div>


          <div className="admin-status-update">

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
              }
              disabled={saving}
            >

              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
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


            <button
              type="button"
              onClick={
                handleStatusUpdate
              }
              disabled={saving}
            >

              <Save size={17} />

              {saving
                ? "Saving..."
                : "Save Status"}

            </button>

          </div>

        </div>


        {/* SUMMARY */}

        <div className="admin-order-card admin-order-summary-card">

          <div className="admin-order-card-heading">

            <div className="admin-order-card-icon">
              <Package size={18} />
            </div>

            <div>

              <span>
                SUMMARY
              </span>

              <h2>
                Order Summary
              </h2>

            </div>

          </div>


          <div className="admin-order-summary">

            <div>

              <span>
                Subtotal
              </span>

              <strong>
                Rs.{" "}
                {getSubtotal().toLocaleString()}
              </strong>

            </div>


            <div>

              <span>
                Shipping
              </span>

              <strong>
                {getShipping() === 0
                  ? "FREE"
                  : `Rs. ${getShipping().toLocaleString()}`}
              </strong>

            </div>


            <div className="admin-order-summary-total">

              <span>
                Total
              </span>

              <strong>
                Rs.{" "}
                {getTotal().toLocaleString()}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


export default AdminOrderDetails;