
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  User,
  ShoppingBag,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

import "./Checkout.css";

const API_URL =
  "http://localhost:3000/api";

const Checkout = () => {
  const navigate = useNavigate();

  /* =========================================================
     STATES
  ========================================================= */

  const [cart, setCart] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
    });

  /* =========================================================
     AUTH
  ========================================================= */

  const token =
    localStorage.getItem(
      "mamta_user_token"
    );

  /* =========================================================
     LOAD USER
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadUser = () => {
      try {
        const savedUser =
          JSON.parse(
            localStorage.getItem(
              "mamta_user"
            )
          );

        if (!savedUser) {
          return;
        }

        /*
         * setState is placed inside
         * setTimeout so React does not
         * report set-state-in-effect.
         */

        setTimeout(() => {
          if (cancelled) {
            return;
          }

          setFormData(
            (current) => ({
              ...current,

              name:
                savedUser.name ||
                savedUser.fullName ||
                current.name,

              email:
                savedUser.email ||
                current.email,

              phone:
                savedUser.phone ||
                current.phone,
            })
          );
        }, 0);
      } catch (error) {
        console.error(
          "LOAD USER ERROR:",
          error
        );
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     FETCH CART
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchCart = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        if (!cancelled) {
          setLoading(true);
        }

        const response =
          await axios.get(
            `${API_URL}/cart`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(
          "CHECKOUT CART:",
          response.data
        );

        const cartData =
          response.data?.cart ||
          response.data;

        if (!cancelled) {
          setCart(cartData);
        }
      } catch (error) {
        console.error(
          "CHECKOUT CART ERROR:",
          error
        );

        if (
          error.response?.status ===
          401
        ) {
          localStorage.removeItem(
            "mamta_user_token"
          );

          localStorage.removeItem(
            "mamta_user"
          );

          if (!cancelled) {
            navigate("/login");
          }

          return;
        }

        if (!cancelled) {
          setCart({
            items: [],
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCart();

    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  };

  /* =========================================================
     ITEMS
  ========================================================= */

  const items =
    cart?.items || [];

  /* =========================================================
     TOTALS
  ========================================================= */

  const subtotal =
    items.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.price || 0
        ) *
          Number(
            item.quantity || 0
          ),
      0
    );

  const shipping =
    subtotal >= 5000
      ? 0
      : 250;

  const total =
    subtotal +
    shipping;

  /* =========================================================
     COLOR HELPER
  ========================================================= */

  const getColorName = (
    color
  ) => {
    if (!color) {
      return "";
    }

    if (
      typeof color ===
      "object"
    ) {
      return (
        color.name ||
        color.colorName ||
        color.value ||
        ""
      );
    }

    return String(color);
  };

  /* =========================================================
     PLACE ORDER
  ========================================================= */

  const handlePlaceOrder =
    async (e) => {
      e.preventDefault();

      if (!token) {
        alert(
          "Please login first."
        );

        navigate("/login");

        return;
      }

      /* ---------------------------------------------
         VALIDATION
      --------------------------------------------- */

      if (
        !formData.name.trim()
      ) {
        alert(
          "Please enter your name."
        );

        return;
      }

      if (
        !formData.email.trim()
      ) {
        alert(
          "Please enter your email."
        );

        return;
      }

      if (
        !formData.phone.trim()
      ) {
        alert(
          "Please enter your phone number."
        );

        return;
      }

      if (
        !formData.address.trim()
      ) {
        alert(
          "Please enter your delivery address."
        );

        return;
      }

      if (
        !formData.city.trim()
      ) {
        alert(
          "Please enter your city."
        );

        return;
      }

      if (
        items.length === 0
      ) {
        alert(
          "Your cart is empty."
        );

        navigate("/cart");

        return;
      }

      /* ---------------------------------------------
         CREATE ORDER ITEMS WITH COLOR
      --------------------------------------------- */

      const orderItems =
        items.map(
          (item) => ({
            productId:
              item.productId ||
              item._id,

            name:
              item.name,

            image:
              item.image ||
              "",

            price:
              Number(
                item.price || 0
              ),

            quantity:
              Number(
                item.quantity || 1
              ),

            color:
              getColorName(
                item.color
              ),

            total:
              Number(
                item.price || 0
              ) *
              Number(
                item.quantity || 1
              ),
          })
        );

      /* ---------------------------------------------
         ORDER DATA
      --------------------------------------------- */

      const orderData = {
        name:
          formData.name.trim(),

        email:
          formData.email.trim(),

        phone:
          formData.phone.trim(),

        address:
          formData.address.trim(),

        city:
          formData.city.trim(),

        postalCode:
          formData.postalCode.trim(),

        items:
          orderItems,

        subtotal:
          subtotal,

        shipping:
          shipping,

        total:
          total,

        paymentMethod:
          paymentMethod,
      };

      try {
        setPlacingOrder(true);

        /* =================================================
           CASH ON DELIVERY
        ================================================= */

        if (
          paymentMethod ===
          "Cash on Delivery"
        ) {
          const response =
            await axios.post(
              `${API_URL}/orders`,
              orderData,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          console.log(
            "ORDER CREATED:",
            response.data
          );

          window.dispatchEvent(
            new Event(
              "cartChanged"
            )
          );

          const createdOrder =
            response.data?.order ||
            response.data;

          const orderId =
            createdOrder?._id ||
            createdOrder?.id;

          if (orderId) {
            navigate(
              `/order-success/${orderId}`
            );
          } else {
            navigate(
              "/order-success"
            );
          }

          return;
        }

        /* =================================================
           ONLINE PAYMENT
        ================================================= */

        const paymentResponse =
          await axios.post(
            `${API_URL}/payments/create`,
            orderData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(
          "PAYMENT RESPONSE:",
          paymentResponse.data
        );

        const paymentUrl =
          paymentResponse.data?.url ||
          paymentResponse.data
            ?.checkoutUrl ||
          paymentResponse.data
            ?.paymentUrl ||
          paymentResponse.data
            ?.redirectUrl;

        if (paymentUrl) {
          window.location.href =
            paymentUrl;
        } else {
          alert(
            "Payment session could not be created."
          );
        }
      } catch (error) {
        console.error(
          "CHECKOUT ORDER ERROR:",
          error
        );

        if (
          error.response?.status ===
          401
        ) {
          localStorage.removeItem(
            "mamta_user_token"
          );

          localStorage.removeItem(
            "mamta_user"
          );

          navigate("/login");

          return;
        }

        alert(
          error.response?.data
            ?.message ||
            "Unable to place your order. Please try again."
        );
      } finally {
        setPlacingOrder(false);
      }
    };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="checkout-page">

        <div className="checkout-loading">

          <ShoppingBag
            size={30}
          />

          <p>
            Loading your checkout...
          </p>

        </div>

      </main>
    );
  }

  /* =========================================================
     EMPTY CART
  ========================================================= */

  if (items.length === 0) {
    return (
      <main className="checkout-page">

        <section className="checkout-empty">

          <div className="checkout-empty-icon">

            <ShoppingBag
              size={32}
            />

          </div>

          <span>
            MAMTA CHECKOUT
          </span>

          <h1>
            Your cart is empty
          </h1>

          <p>
            Add something beautiful to your cart before checking out.
          </p>

          <Link
            to="/shop"
            className="checkout-back-shop"
          >

            <ArrowLeft
              size={17}
            />

            CONTINUE SHOPPING

          </Link>

        </section>

      </main>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="checkout-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="checkout-header">

        <div>

          <span className="checkout-eyebrow">
            MAMTA
          </span>

          <h1>
            Checkout
          </h1>

          <p>
            Complete your details to place your order.
          </p>

        </div>

        <Link
          to="/cart"
          className="checkout-back-link"
        >

          <ArrowLeft
            size={17}
          />

          Back to Cart

        </Link>

      </div>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div className="checkout-container">

        {/* ===================================================
            LEFT
        ==================================================== */}

        <form
          className="checkout-form"
          onSubmit={
            handlePlaceOrder
          }
        >

          {/* =================================================
              CUSTOMER INFORMATION
          ================================================== */}

          <section className="checkout-card">

            <div className="checkout-card-heading">

              <div className="checkout-card-icon">

                <User
                  size={18}
                />

              </div>

              <div>

                <span>
                  01
                </span>

                <h2>
                  Customer Information
                </h2>

              </div>

            </div>

            <div className="checkout-form-grid">

              {/* NAME */}

              <div className="checkout-field">

                <label>
                  Full Name
                </label>

                <div className="checkout-input-wrapper">

                  <User
                    size={17}
                  />

                  <input
                    type="text"
                    name="name"
                    value={
                      formData.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Your full name"
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="checkout-field">

                <label>
                  Email Address
                </label>

                <div className="checkout-input-wrapper">

                  <Mail
                    size={17}
                  />

                  <input
                    type="email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="you@example.com"
                  />

                </div>

              </div>

              {/* PHONE */}

              <div className="checkout-field checkout-phone-field">

                <label>
                  Phone Number
                </label>

                <div className="checkout-input-wrapper">

                  <Phone
                    size={17}
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="03XX XXXXXXX"
                    maxLength={11}
                  />

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              DELIVERY INFORMATION
          ================================================== */}

          <section className="checkout-card">

            <div className="checkout-card-heading">

              <div className="checkout-card-icon">

                <MapPin
                  size={18}
                />

              </div>

              <div>

                <span>
                  02
                </span>

                <h2>
                  Delivery Information
                </h2>

              </div>

            </div>

            <div className="checkout-form-grid">

              {/* ADDRESS */}

              <div className="checkout-field checkout-field-full">

                <label>
                  Delivery Address
                </label>

                <div className="checkout-input-wrapper checkout-textarea-wrapper">

                  <MapPin
                    size={17}
                  />

                  <textarea
                    name="address"
                    value={
                      formData.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House number, street, area..."
                    rows="4"
                  />

                </div>

              </div>

              {/* CITY */}

              <div className="checkout-field">

                <label>
                  City
                </label>

                <div className="checkout-input-wrapper">

                  <MapPin
                    size={17}
                  />

                  <input
                    type="text"
                    name="city"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Your city"
                  />

                </div>

              </div>

              {/* POSTAL CODE */}

              <div className="checkout-field">

                <label>
                  Postal Code
                </label>

                <div className="checkout-input-wrapper">

                  <MapPin
                    size={17}
                  />

                  <input
                    type="text"
                    name="postalCode"
                    value={
                      formData.postalCode
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Postal code"
                  />

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              PAYMENT
          ================================================== */}

          <section className="checkout-card">

            <div className="checkout-card-heading">

              <div className="checkout-card-icon">

                <CreditCard
                  size={18}
                />

              </div>

              <div>

                <span>
                  03
                </span>

                <h2>
                  Payment Method
                </h2>

              </div>

            </div>

            <div className="checkout-payment-options">

              {/* COD */}

              <label
                className={
                  paymentMethod ===
                  "Cash on Delivery"
                    ? "checkout-payment-option payment-selected"
                    : "checkout-payment-option"
                }
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={
                    paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <div className="checkout-payment-radio">

                  <CheckCircle2
                    size={19}
                  />

                </div>

                <div>

                  <strong>
                    Cash on Delivery
                  </strong>

                  <span>
                    Pay when your order arrives.
                  </span>

                </div>

              </label>

              {/* ONLINE */}

              <label
                className={
                  paymentMethod ===
                  "Online Payment"
                    ? "checkout-payment-option payment-selected"
                    : "checkout-payment-option"
                }
              >

                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online Payment"
                  checked={
                    paymentMethod ===
                    "Online Payment"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <div className="checkout-payment-radio">

                  <CreditCard
                    size={19}
                  />

                </div>

                <div>

                  <strong>
                    Online Payment
                  </strong>

                  <span>
                    Pay securely online.
                  </span>

                </div>

              </label>

            </div>

          </section>

          {/* =================================================
              PLACE ORDER
          ================================================== */}

          <button
            type="submit"
            className="checkout-place-order"
            disabled={
              placingOrder
            }
          >

            {placingOrder
              ? "PROCESSING ORDER..."
              : "PLACE ORDER"}

          </button>

          <div className="checkout-secure">

            <ShieldCheck
              size={17}
            />

            <span>
              Your information is secure and protected.
            </span>

          </div>

        </form>

        {/* ===================================================
            RIGHT — ORDER SUMMARY
        ==================================================== */}

        <aside className="checkout-summary">

          <div className="checkout-summary-header">

            <span>
              YOUR ORDER
            </span>

            <h2>
              Order Summary
            </h2>

          </div>

          {/* =================================================
              PRODUCTS
          ================================================== */}

          <div className="summary-products">

            {items.map(
              (
                item,
                index
              ) => {

                const colorName =
                  getColorName(
                    item.color
                  );

                const itemPrice =
                  Number(
                    item.price || 0
                  );

                const itemQuantity =
                  Number(
                    item.quantity || 0
                  );

                const itemTotal =
                  itemPrice *
                  itemQuantity;

                return (
                  <div
                    className="summary-product"
                    key={
                      item.productId ||
                      item._id ||
                      index
                    }
                  >

                    {/* IMAGE */}

                    <div className="summary-product-image">

                      <img
                        src={
                          item.image ||
                          "https://placehold.co/100x100/F4D9DC/4A3032?text=MAMTA"
                        }
                        alt={
                          item.name ||
                          "Product"
                        }
                        onError={(
                          e
                        ) => {
                          e.currentTarget.src =
                            "https://placehold.co/100x100/F4D9DC/4A3032?text=MAMTA";
                        }}
                      />

                    </div>

                    {/* INFO */}

                    <div className="summary-product-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        Rs.{" "}
                        {itemPrice.toLocaleString()}
                      </p>

                      {/* COLOR */}

                      {colorName && (
                        <span className="checkout-product-color">

                          <span className="checkout-color-dot"></span>

                          Color:{" "}
                          {colorName}

                        </span>
                      )}

                      {/* QUANTITY */}

                      <span className="checkout-product-quantity">

                        Quantity:{" "}
                        {itemQuantity}

                      </span>

                    </div>

                    {/* TOTAL */}

                    <strong>

                      Rs.{" "}
                      {itemTotal.toLocaleString()}

                    </strong>

                  </div>
                );
              }
            )}

          </div>

          {/* =================================================
              TOTALS
          ================================================== */}

          <div className="summary-totals">

            <div>

              <span>
                Subtotal
              </span>

              <strong>
                Rs.{" "}
                {subtotal.toLocaleString()}
              </strong>

            </div>

            <div>

              <span>
                Free Shipping
              </span>

            </div>

            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                Rs.{" "}
                {total.toLocaleString()}
              </strong>

            </div>

          </div>

          {/* =================================================
              DELIVERY NOTE
          ================================================== */}

          <div className="checkout-delivery-note">

            <TruckIcon />

            <div>

              <strong>
                Estimated Delivery
              </strong>

              <span>
                3–4 working days
              </span>

            </div>

          </div>

          {/* =================================================
              SECURE NOTE
          ================================================== */}

          <div className="checkout-summary-secure">

            <ShieldCheck
              size={18}
            />

            <span>
              Safe & secure checkout
            </span>

          </div>

        </aside>

      </div>

    </main>
  );
};

/* =========================================================
   SIMPLE TRUCK ICON
========================================================= */

const TruckIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >

      <path d="M10 17h4V5H2v12h3" />

      <path d="M14 8h4l4 4v5h-2" />

      <circle
        cx="7.5"
        cy="17.5"
        r="2.5"
      />

      <circle
        cx="16.5"
        cy="17.5"
        r="2.5"
      />

    </svg>
  );
};

export default Checkout;

