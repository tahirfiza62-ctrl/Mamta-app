
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  PackageOpen,
} from "lucide-react";

import "./Cart.css";

const API_URL = "http://localhost:3000/api";

const Cart = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  /* =========================================================
     LOAD CART
  ========================================================= */

  useEffect(() => {
    const token = localStorage.getItem("mamta_user_token");

    if (!token) {
      navigate("/login");
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

        console.error("FETCH CART ERROR:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("mamta_user_token");
          localStorage.removeItem("mamta_user");

          window.dispatchEvent(
            new Event("authChanged")
          );

          navigate("/login");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  /* =========================================================
     UPDATE QUANTITY
  ========================================================= */

  const updateQuantity = async (
    productId,
    newQuantity,
    color = ""
  ) => {
    if (newQuantity < 1) return;

    const token =
      localStorage.getItem("mamta_user_token");

    if (!token) {
      navigate("/login");
      return;
    }

    /*
      The backend identifies a cart item using:

      productId + color

      Therefore color must be sent with
      every quantity update.
    */

    const updateKey =
      `${productId}-${color || "default"}`;

    try {
      setUpdatingId(updateKey);

      const response = await axios.put(
        `${API_URL}/cart/update/${productId}`,
        {
          quantity: Number(newQuantity),
          color: color || "",
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setCart(response.data.cart);

      window.dispatchEvent(
        new Event("cartChanged")
      );

    } catch (error) {
      console.error(
        "UPDATE QUANTITY ERROR:",
        error
      );

      console.error(
        "UPDATE QUANTITY RESPONSE:",
        error.response?.data
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "mamta_user_token"
        );

        localStorage.removeItem(
          "mamta_user"
        );

        window.dispatchEvent(
          new Event("authChanged")
        );

        navigate("/login");
      }

    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================================================
     REMOVE ITEM
  ========================================================= */

  const removeItem = async (
    productId,
    color = ""
  ) => {
    const token =
      localStorage.getItem("mamta_user_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const updateKey =
      `${productId}-${color || "default"}`;

    try {
      setUpdatingId(updateKey);

      const response = await axios.delete(
        `${API_URL}/cart/remove/${productId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          /*
            Axios DELETE request body
            must be inside `data`.
          */

          data: {
            color: color || "",
          },
        }
      );

      setCart(response.data.cart);

      window.dispatchEvent(
        new Event("cartChanged")
      );

    } catch (error) {
      console.error(
        "REMOVE ITEM ERROR:",
        error
      );

      console.error(
        "REMOVE ITEM RESPONSE:",
        error.response?.data
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "mamta_user_token"
        );

        localStorage.removeItem(
          "mamta_user"
        );

        window.dispatchEvent(
          new Event("authChanged")
        );

        navigate("/login");
      }

    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================================================
     CLEAR CART
  ========================================================= */

  const clearCart = async () => {
    const token =
      localStorage.getItem("mamta_user_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/cart/clear`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setCart({
        items: [],
      });

      window.dispatchEvent(
        new Event("cartChanged")
      );

    } catch (error) {
      console.error(
        "CLEAR CART ERROR:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "mamta_user_token"
        );

        localStorage.removeItem(
          "mamta_user"
        );

        window.dispatchEvent(
          new Event("authChanged")
        );

        navigate("/login");
      }
    }
  };

  /* =========================================================
     TOTALS
  ========================================================= */

  const items =
    cart?.items || [];

  const subtotal =
    items.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.quantity),
      0
    );

  const shipping = 0;

  const total =
    subtotal + shipping;

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="cart-page">

        <div className="cart-loading">

          <ShoppingBag size={30} />

          <p>
            Loading your cart...
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
      <main className="cart-page">

        <section className="cart-hero">

          <div className="cart-hero-content">

            <span>
              YOUR MAMTA BAG
            </span>

            <h1>
              Your <em>Cart</em>
            </h1>

            <p>
              A little space waiting for
              something beautiful.
            </p>

          </div>

        </section>

        <section className="empty-cart">

          <div className="empty-cart-icon">
            <PackageOpen size={38} />
          </div>

          <span className="empty-label">
            YOUR CART IS EMPTY
          </span>

          <h2>
            Nothing here yet
          </h2>

          <p>
            Explore our collection of
            thoughtfully selected products
            for mothers and little ones.
          </p>

          <Link
            to="/shop"
            className="cart-shop-button"
          >
            EXPLORE COLLECTION
            <ArrowRight size={17} />
          </Link>

        </section>

      </main>
    );
  }

  /* =========================================================
     CART
  ========================================================= */

  return (
    <main className="cart-page">

      <section className="cart-hero">

        <div className="cart-hero-content">

          <span>
            YOUR MAMTA BAG
          </span>

          <h1>
            Shopping <em>Cart</em>
          </h1>

          <p>
            Review your selected pieces
            before continuing to checkout.
          </p>

        </div>

      </section>

      <section className="cart-container">

        {/* =================================================
           LEFT
        ================================================= */}

        <div className="cart-items-section">

          <div className="cart-heading">

            <div>

              <span>
                YOUR SELECTION
              </span>

              <h2>
                {items.length}{" "}
                {items.length === 1
                  ? "Item"
                  : "Items"}
              </h2>

            </div>

            <button
              type="button"
              className="clear-cart"
              onClick={clearCart}
            >
              CLEAR CART
            </button>

          </div>

          <div className="cart-items">

            {items.map(
              (
                item,
                index
              ) => {

                /*
                  Unique key for product + color.

                  This is important when the same product
                  exists in two different colors.
                */

                const itemKey =
                  `${item.productId}-${item.color || "default"}`;

                const isUpdating =
                  updatingId === itemKey;

                return (
                  <article
                    className="cart-item"
                    key={`${itemKey}-${index}`}
                  >

                    {/* =================================================
                       IMAGE
                    ================================================= */}

                    <div className="cart-item-image">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={
                            item.name ||
                            "MAMTA Product"
                          }
                        />
                      ) : (
                        <ShoppingBag
                          size={30}
                        />
                      )}

                    </div>

                    {/* =================================================
                       DETAILS
                    ================================================= */}

                    <div className="cart-item-details">

                      <span className="cart-item-label">
                        MAMTA COLLECTION
                      </span>

                      <h3>
                        {item.name}
                      </h3>

                      <p className="cart-item-price">
                        Rs.{" "}
                        {Number(
                          item.price
                        ).toLocaleString()}
                      </p>

                      {/* =================================================
                         COLOR
                      ================================================= */}

                      
                     {item.color && (
  <div className="cart-item-color">
    <span className="color-label">
      Color
    </span>

    <span className="selected-color">

      <span
        className="color-dot"
        style={{
          backgroundColor:
            item.colorCode || "#e7d8d3",
        }}
      />

      {item.color}

    </span>
  </div>
)}

                      {/* =================================================
                         QUANTITY
                      ================================================= */}

                      <div className="quantity-row">

                        <span>
                          Quantity
                        </span>

                        <div className="quantity-control">

                          {/* DECREASE */}

                          <button
                            type="button"
                            disabled={
                              isUpdating ||
                              Number(
                                item.quantity
                              ) <= 1
                            }
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                Number(
                                  item.quantity
                                ) - 1,
                                item.color || ""
                              )
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus
                              size={14}
                            />
                          </button>

                          {/* CURRENT QUANTITY */}

                          <strong>
                            {item.quantity}
                          </strong>

                          {/* INCREASE */}

                          <button
                            type="button"
                            disabled={
                              isUpdating
                            }
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                Number(
                                  item.quantity
                                ) + 1,
                                item.color || ""
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus
                              size={14}
                            />
                          </button>

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                       RIGHT
                    ================================================= */}

                    <div className="cart-item-right">

                      <strong>
                      
                      </strong>

                      {/* =================================================
                         EDIT + DELETE
                      ================================================= */}

                      <div className="cart-item-actions">

                        {/* EDIT */}

                        <button
                          type="button"
                          className="edit-item"
                          onClick={() =>
                            navigate(
                              `/product/${item.productId}`
                            )
                          }
                          aria-label={`Edit ${
                            item.name ||
                            "product"
                          }`}
                        >
                          EDIT
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          className="remove-item"
                          disabled={
                            isUpdating
                          }
                          onClick={() =>
                            removeItem(
                              item.productId,
                              item.color || ""
                            )
                          }
                          aria-label={`Remove ${
                            item.name ||
                            "product"
                          }`}
                        >
                          <Trash2
                            size={17}
                          />
                        </button>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>

          {/* =================================================
             CONTINUE SHOPPING
          ================================================= */}

          <Link
            to="/shop"
            className="continue-shopping-cart"
          >
            <ArrowLeft size={17} />
            CONTINUE SHOPPING
          </Link>

        </div>

        {/* =================================================
           SUMMARY
        ================================================= */}

        <aside className="cart-summary">

          <div className="summary-top">

            <span>
              ORDER SUMMARY
            </span>

            <ShoppingBag
              size={21}
            />

          </div>

          <h2>
            Your Order
          </h2>

          {/* SUBTOTAL */}

          <div className="summary-line">

            <span>
              Subtotal
            </span>

            <strong>
              Rs.{" "}
              {subtotal.toLocaleString()}
            </strong>

          </div>

          {/* SHIPPING */}

          <div className="summary-line">

            <span>
              Shipping
            </span>

            <strong className="free-shipping">
              FREE SHIPPING
            </strong>

          </div>

          <div className="summary-divider" />

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

          {/* CHECKOUT */}

          <Link
            to="/checkout"
            className="checkout-button"
          >
            PROCEED TO CHECKOUT
            <ArrowRight size={17} />
          </Link>

          {/* SECURE NOTE */}

          <div className="secure-note">

            <PackageOpen size={16} />

            <span>
              Free shipping · Secure checkout ·
              Carefully packed by MAMTA
            </span>

          </div>

        </aside>

      </section>

    </main>
  );
};

export default Cart;
