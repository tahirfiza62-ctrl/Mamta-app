
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Star,
} from "lucide-react";
import "./Wishlist.css";

const Wishlist = () => {
  const navigate = useNavigate();

  /* =========================================================
     LOAD WISHLIST & CART
     Initialize directly from localStorage
  ========================================================= */

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mamta_wishlist")) || [];
    } catch (error) {
      console.error("Wishlist loading error:", error);
      return [];
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mamta_cart")) || [];
    } catch (error) {
      console.error("Cart loading error:", error);
      return [];
    }
  });

  /* =========================================================
     REMOVE FROM WISHLIST
  ========================================================= */

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter(
      (item) => item._id !== productId && item.id !== productId
    );

    setWishlist(updatedWishlist);

    localStorage.setItem(
      "mamta_wishlist",
      JSON.stringify(updatedWishlist)
    );

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  /* =========================================================
     ADD TO CART
  ========================================================= */

  const addToCart = (product) => {
    const productId = product._id || product.id;

    const existingItem = cart.find(
      (item) => (item._id || item.id) === productId
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        (item._id || item.id) === productId
          ? {
              ...item,
              quantity: (item.quantity || 1) + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    setCart(updatedCart);

    localStorage.setItem(
      "mamta_cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  /* =========================================================
     CLEAR WISHLIST
  ========================================================= */

  const clearWishlist = () => {
    setWishlist([]);

    localStorage.setItem(
      "mamta_wishlist",
      JSON.stringify([])
    );

    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  /* =========================================================
     PRODUCT IMAGE
  ========================================================= */

  const getProductImage = (product) => {
    if (product.image) {
      return product.image;
    }

    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images[0];
    }

    return "/placeholder-product.jpg";
  };

  /* =========================================================
     PRODUCT ID
  ========================================================= */

  const getProductId = (product) => {
    return product._id || product.id;
  };

  /* =========================================================
     RATING
  ========================================================= */

  const getRating = (product) => {
    return product.rating || 5;
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="mamta-wishlist-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="wishlist-hero">

        <div className="wishlist-hero-content">

          <div className="wishlist-breadcrumb">
            <Link to="/">
              Home
            </Link>

            <span>/</span>

            <span>
              Wishlist
            </span>
          </div>

          <div className="wishlist-hero-icon">
            <Heart size={24} />
          </div>

          <span className="wishlist-eyebrow">
            YOUR FAVORITES
          </span>

          <h1>
            My Wishlist
          </h1>

          <p>
            Keep the products you love close
            and come back to them whenever
            you're ready.
          </p>

        </div>

      </section>


      {/* =====================================================
          WISHLIST CONTENT
      ===================================================== */}

      <section className="wishlist-section">

        <div className="wishlist-container">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="wishlist-content-header">

            <div>

              <span className="wishlist-small-label">
                MAMTA COLLECTION
              </span>

              <h2>
                Saved Products
              </h2>

              <p>
                {wishlist.length === 0
                  ? "You haven't saved any products yet."
                  : `${wishlist.length} ${
                      wishlist.length === 1
                        ? "product"
                        : "products"
                    } saved to your wishlist.`}
              </p>

            </div>


            {wishlist.length > 0 && (

              <button
                type="button"
                className="wishlist-clear-btn"
                onClick={clearWishlist}
              >
                <Trash2 size={15} />
                Clear Wishlist
              </button>

            )}

          </div>


          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {wishlist.length === 0 ? (

            <div className="wishlist-empty">

              <div className="wishlist-empty-heart">
                <Heart size={38} />
              </div>

              <span>
                YOUR WISHLIST IS EMPTY
              </span>

              <h3>
                Nothing saved yet
              </h3>

              <p>
                Explore our beautiful maternity
                and baby pillow collection and
                save your favorite products here.
              </p>

              <button
                type="button"
                className="wishlist-shop-btn"
                onClick={() =>
                  navigate("/shop")
                }
              >
                Explore Collection
                <ArrowRight size={17} />
              </button>

            </div>

          ) : (

            /* =================================================
               PRODUCT GRID
            ================================================= */

            <div className="wishlist-grid">

              {wishlist.map((product) => {

                const productId =
                  getProductId(product);

                const image =
                  getProductImage(product);

                const rating =
                  getRating(product);

                return (

                  <article
                    className="wishlist-product-card"
                    key={productId}
                  >

                    {/* PRODUCT IMAGE */}

                    <div className="wishlist-product-image">

                      <img
                        src={image}
                        alt={
                          product.name ||
                          "MAMTA Product"
                        }
                      />

                      <button
                        type="button"
                        className="wishlist-remove-btn"
                        aria-label="Remove from wishlist"
                        onClick={() =>
                          removeFromWishlist(
                            productId
                          )
                        }
                      >
                        <Heart
                          size={18}
                          fill="currentColor"
                        />
                      </button>

                      {product.oldPrice &&
                        Number(
                          product.oldPrice
                        ) >
                          Number(
                            product.price
                          ) && (

                          <span className="wishlist-sale-badge">
                            SALE
                          </span>

                        )}

                    </div>


                    {/* PRODUCT INFORMATION */}

                    <div className="wishlist-product-info">

                      <span className="wishlist-product-category">
                        {product.category ||
                          "MAMTA COLLECTION"}
                      </span>

                      <h3>
                        {product.name ||
                          "Premium Pillow"}
                      </h3>


                      {/* RATING */}

                      <div className="wishlist-rating">

                        <div className="wishlist-stars">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (

                              <Star
                                key={star}
                                size={12}
                                fill={
                                  star <= rating
                                    ? "currentColor"
                                    : "none"
                                }
                              />

                            )
                          )}

                        </div>

                        <span>
                          {rating.toFixed
                            ? rating.toFixed(1)
                            : rating}
                        </span>

                      </div>


                      {/* PRICE */}

                      <div className="wishlist-price-row">

                        <div className="wishlist-price">

                          <strong>
                            Rs.{" "}
                            {Number(
                              product.price || 0
                            ).toLocaleString()}
                          </strong>

                          {product.oldPrice && (
                            <del>
                              Rs.{" "}
                              {Number(
                                product.oldPrice
                              ).toLocaleString()}
                            </del>
                          )}

                        </div>

                      </div>


                      {/* ACTION */}

                      <div className="wishlist-product-actions">

                        <button
                          type="button"
                          className="wishlist-cart-btn"
                          onClick={() =>
                            addToCart(product)
                          }
                        >
                          <ShoppingBag size={16} />
                          Add to Cart
                        </button>

                      

                      </div>

                    </div>

                  </article>

                );
              })}

            </div>

          )}

        </div>

      </section>

    </main>
  );
};

export default Wishlist;
