
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const API_URL = "http://localhost:3000/api";

const Checkout = () => {
  const navigate = useNavigate();

  /* =====================================================
     GET SAVED USER
  ===================================================== */

  const getSavedUser = () => {
    try {
      const savedUser = localStorage.getItem("mamta_user");

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);
    } catch (error) {
      console.error("USER DATA ERROR:", error);
      return null;
    }
  };

  const savedUser = getSavedUser();

  /* =====================================================
     STATE
  ===================================================== */

  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [paymentMethod, setPaymentMethod] = useState(
    "Cash on Delivery"
  );

  const [formData, setFormData] = useState(() => ({
    name: savedUser?.name || "",
    email: savedUser?.email || "",
    phone: "",
    address: "",
    city: "",
  }));

  /* =====================================================
     LOAD CART
  ===================================================== */

  useEffect(() => {
    const token = localStorage.getItem("mamta_user_token");

    if (!token) {
      navigate("/login", {
        state: {
          message: "Please login before checkout.",
        },
      });

      return;
    }

    let cancelled = false;

    const loadCart = async () => {
      try {
        const response = await axios.get(`${API_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (cancelled) return;

        setCart(response.data.cart);
      } catch (error) {
        if (cancelled) return;

        console.error("CHECKOUT CART ERROR:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("mamta_user_token");
          localStorage.removeItem("mamta_user");

          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Unable to load your cart."
        );
      } finally {
        if (!cancelled) {
          setLoadingCart(false);
        }
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     PLACE ORDER
  ===================================================== */

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("mamta_user_token");

    /* -----------------------------------------------------
       LOGIN CHECK
    ----------------------------------------------------- */

    if (!token) {
      navigate("/login");
      return;
    }

    /* -----------------------------------------------------
       FORM VALIDATION
    ----------------------------------------------------- */

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      setError("Please fill in all delivery details.");
      setSuccess("");
      return;
    }

    /* -----------------------------------------------------
       CART CHECK
    ----------------------------------------------------- */

    if (!cart?.items?.length) {
      setError("Your cart is empty.");
      setSuccess("");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");
      setSuccess("");

      /* ===================================================
         CASH ON DELIVERY
      =================================================== */

      if (paymentMethod === "Cash on Delivery") {
        const response = await axios.post(
          `${API_URL}/orders`,
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            paymentMethod: "Cash on Delivery",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const order = response.data.order;

          window.dispatchEvent(new Event("cartChanged"));

          setSuccess(
            "Your order has been placed successfully."
          );

          setTimeout(() => {
            navigate(`/order-success/${order._id}`, {
              state: {
                order,
              },
            });
          }, 700);
        }

        return;
      }

      /* ===================================================
         ONLINE PAYMENT
      =================================================== */

      if (paymentMethod === "Online Payment") {
        const response = await axios.post(
          `${API_URL}/payments/create`,
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            paymentMethod: "Online Payment",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const checkoutUrl = response.data.checkoutUrl;

          if (!checkoutUrl) {
            throw new Error(
              "Payment checkout URL was not returned."
            );
          }

          window.location.href = checkoutUrl;
        }
      }
    } catch (error) {
      console.error("CHECKOUT ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("mamta_user_token");
        localStorage.removeItem("mamta_user");

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to process your order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  /* =====================================================
     CART DATA
  ===================================================== */

  const items = cart?.items || [];

  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.price) * Number(item.quantity),
    0
  );

  const shipping = subtotal >= 5000 ? 0 : 250;

  const total = subtotal + shipping;

  /* =====================================================
     LOADING
  ===================================================== */

  if (loadingCart) {
    return (
      <main className="checkout-page checkout-loading">
        <div className="checkout-loader">
          <div className="checkout-spinner"></div>
          <p>Preparing your checkout...</p>
        </div>
      </main>
    );
  }

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (!items.length) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <div className="checkout-empty-icon">
            <ShoppingBag size={34} />
          </div>

          <h1>Your cart is empty</h1>

          <p>
            Add something beautiful to your cart before
            continuing to checkout.
          </p>

          <Link
            to="/shop"
            className="checkout-shop-button"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  /* =====================================================
     MAIN CHECKOUT
  ===================================================== */

  return (
    <main className="checkout-page">

      {/* =================================================
         HEADER
      ================================================= */}

      <section className="checkout-header">
        <div className="checkout-header-inner">

          <Link
            to="/cart"
            className="checkout-back"
          >
            <ArrowLeft size={17} />
            Back to Cart
          </Link>

          <div className="checkout-heading">

            <span>SECURE CHECKOUT</span>

            <h1>
              Complete Your <em>Order</em>
            </h1>

            <p>
              A little comfort is on its way to you.
            </p>

          </div>

        </div>
      </section>

      {/* =================================================
         CONTENT
      ================================================= */}

      <section className="checkout-content">
        <div className="checkout-container">

          {/* =================================================
             LEFT
          ================================================= */}

          <div className="checkout-left">

            {/* DELIVERY DETAILS */}

            <div className="checkout-card">

              <div className="checkout-card-heading">

                <div className="checkout-section-icon">
                  <MapPin size={19} />
                </div>

                <div>
                  <span>01</span>
                  <h2>Delivery Details</h2>
                </div>

              </div>

              <form
                onSubmit={handlePlaceOrder}
                id="checkout-form"
              >

                <div className="checkout-form-grid">

                  {/* NAME */}

                  <div className="checkout-field">

                    <label>
                      <User size={14} />
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />

                  </div>

                  {/* EMAIL */}

                  <div className="checkout-field">

                    <label>
                      <Mail size={14} />
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />

                  </div>

                  {/* PHONE */}

                  <div className="checkout-field">

                    <label>
                      <Phone size={14} />
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="03XX XXXXXXX"
                      required
                    />

                  </div>

                  {/* CITY */}

                  <div className="checkout-field">

                    <label>
                      <MapPin size={14} />
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Your city"
                      required
                    />

                  </div>

                </div>

                {/* ADDRESS */}

                <div className="checkout-field checkout-address-field">

                  <label>
                    <MapPin size={14} />
                    Complete Delivery Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House number, street, area..."
                    rows="4"
                    required
                  />

                </div>

              </form>

            </div>

            {/* PAYMENT METHOD */}

            <div className="checkout-card payment-card">

              <div className="checkout-card-heading">

                <div className="checkout-section-icon">
                  <CreditCard
                    size={19}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="checkout-heading-text">

                  <span>02</span>

                  <h2>
                    Payment Method
                  </h2>

                  <p>
                    Choose how you would like to pay
                  </p>

                </div>

              </div>

              <div className="payment-options">

                {/* COD */}

                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod ===
                    "Cash on Delivery"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod(
                      "Cash on Delivery"
                    )
                  }
                >

                  <div className="payment-option-left">

                    <div className="payment-radio">

                      {paymentMethod ===
                      "Cash on Delivery" ? (
                        <CheckCircle2
                          size={18}
                          strokeWidth={2}
                        />
                      ) : (
                        <span />
                      )}

                    </div>

                    <div className="payment-info">

                      <div className="payment-title-row">

                        <strong>
                          Cash on Delivery
                        </strong>

                        <span className="payment-badge">
                          Popular
                        </span>

                      </div>

                      <p>
                        Pay when your MAMTA order
                        arrives at your doorstep.
                      </p>

                    </div>

                  </div>

                </button>

                {/* ONLINE PAYMENT */}

                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod ===
                    "Online Payment"
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    setPaymentMethod(
                      "Online Payment"
                    )
                  }
                >

                  <div className="payment-option-left">

                    <div className="payment-radio">

                      {paymentMethod ===
                      "Online Payment" ? (
                        <CheckCircle2
                          size={18}
                          strokeWidth={2}
                        />
                      ) : (
                        <span />
                      )}

                    </div>

                    <div className="payment-info">

                      <div className="payment-title-row">

                        <strong>
                          Online Payment
                        </strong>

                        <span className="payment-badge secure">
                          Secure
                        </span>

                      </div>

                      <p>
                        Pay securely online using
                        the available payment
                        methods.
                      </p>

                    </div>

                  </div>

                  <div className="payment-method-icon">

                    <CreditCard
                      size={21}
                      strokeWidth={1.7}
                    />

                  </div>

                </button>

              </div>

              {/* SECURITY */}

              <div className="payment-security">

                <div className="security-icon">
                  <CheckCircle2 size={15} />
                </div>

                <span>
                  Your payment information is
                  handled securely.
                </span>

              </div>

            </div>

            {/* TRUST */}

            <div className="checkout-trust">

              <ShieldCheck size={22} />

              <div>

                <strong>
                  Safe & Secure Ordering
                </strong>

                <p>
                  Your personal information is
                  securely handled.
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
             RIGHT — ORDER SUMMARY
          ================================================= */}

          <aside className="checkout-summary">

            <div className="summary-card">

              {/* SUMMARY HEADING */}

              <div className="summary-heading">

                <span>
                  YOUR ORDER
                </span>

                <strong>
                  {items.length}{" "}
                  {items.length === 1
                    ? "Item"
                    : "Items"}
                </strong>

              </div>

              {/* PRODUCTS */}

              <div className="summary-products">

                {items.map((item, index) => (

                  <div
                    className="summary-product"
                    key={
                      item.productId ||
                      item._id ||
                      index
                    }
                  >

                    <div className="summary-product-image">

                      <img
                        src={
                          item.image ||
                          "https://placehold.co/120x120/F4D9DC/4A3032?text=MAMTA"
                        }
                        alt={
                          item.name ||
                          "MAMTA Product"
                        }
                      />

                      <span>
                        {item.quantity}
                      </span>

                    </div>

                    <div className="summary-product-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        Rs.{" "}
                        {Number(
                          item.price
                        ).toLocaleString()}
                      </p>

                    </div>

                    <strong>
                      Rs.{" "}
                      {(
                        Number(item.price) *
                        Number(item.quantity)
                      ).toLocaleString()}
                    </strong>

                  </div>

                ))}

              </div>

              {/* TOTALS */}

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
                    Delivery
                  </span>

                  <strong>
                    {shipping === 0
                      ? "FREE"
                      : `Rs. ${shipping.toLocaleString()}`}
                  </strong>

                </div>

              </div>

              {/* TOTAL */}

              <div className="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  Rs.{" "}
                  {total.toLocaleString()}
                </strong>

              </div>

              {/* ERROR */}

              {error && (
                <div className="checkout-message error">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="checkout-message success">

                  <CheckCircle2 size={17} />

                  {success}

                </div>
              )}

              {/* BUTTON */}

              <button
                type="submit"
                form="checkout-form"
                className="place-order-button"
                disabled={placingOrder}
              >

                {placingOrder ? (
                  <>
                    <span className="button-spinner"></span>

                    {paymentMethod ===
                    "Online Payment"
                      ? "Opening Payment..."
                      : "Placing Order..."}
                  </>
                ) : (
                  <>
                    {paymentMethod ===
                    "Online Payment" ? (
                      <CreditCard size={18} />
                    ) : (
                      <ShoppingBag size={18} />
                    )}

                    {paymentMethod ===
                    "Online Payment"
                      ? "Pay Securely"
                      : "Place Order"}
                  </>
                )}

              </button>

              {/* NOTE */}

              <p className="checkout-note">
                By placing your order, you agree
                to our terms and conditions.
              </p>

            </div>

          </aside>

        </div>
      </section>

    </main>
  );
};

export default Checkout;

