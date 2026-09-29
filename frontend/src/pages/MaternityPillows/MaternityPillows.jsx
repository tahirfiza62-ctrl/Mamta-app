
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Heart,
  ShoppingBag,
  ArrowUpRight,
  Check,
  Star,
} from "lucide-react";

import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";

import "./MaternityPillows.css";

/* =========================================================
   API
========================================================= */

const API_URL = "http://localhost:3000/api";

/* =========================================================
   COMPONENT
========================================================= */

const MaternityPillows = () => {
  const navigate = useNavigate();

  /* =======================================================
     PRODUCTS
  ======================================================== */

  const [maternityProducts, setMaternityProducts] =
    useState([]);

  const [wishlist, setWishlist] =
    useState([]);

  const [addingProductId, setAddingProductId] =
    useState(null);

  /* =======================================================
     LOAD MATERNITY PRODUCTS FROM DATABASE
  ======================================================== */

  useEffect(() => {
    const loadMaternityProducts = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/products`
        );

        const products =
          response.data?.products || [];

        /*
          Only show products whose category
          contains "maternity".
        */

        const filteredProducts =
          products.filter((product) =>
            String(product.category || "")
              .toLowerCase()
              .includes("maternity")
          );

        setMaternityProducts(
          filteredProducts
        );
      } catch (error) {
        console.error(
          "MATERNITY PRODUCTS LOAD ERROR:",
          error
        );

        setMaternityProducts([]);
      }
    };

    loadMaternityProducts();
  }, []);

  /* =======================================================
     LOAD WISHLIST
  ======================================================== */

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist =
          JSON.parse(
            localStorage.getItem(
              "mamta_wishlist"
            )
          ) || [];

        setWishlist(
          Array.isArray(savedWishlist)
            ? savedWishlist
            : []
        );
      } catch (error) {
        console.error(
          "WISHLIST LOAD ERROR:",
          error
        );

        setWishlist([]);
      }
    };

    loadWishlist();

    window.addEventListener(
      "wishlistUpdated",
      loadWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        loadWishlist
      );
    };
  }, []);

  /* =======================================================
     PRICE FORMAT
  ======================================================== */

  const formatPrice = (price) => {
    return `Rs. ${Number(
      price || 0
    ).toLocaleString()}`;
  };

  /* =======================================================
     CHECK WISHLIST
  ======================================================== */

  const isProductInWishlist = (
    productId
  ) => {
    return wishlist.some(
      (item) =>
        (item._id || item.id) ===
        productId
    );
  };

  /* =======================================================
     TOGGLE WISHLIST
  ======================================================== */

  const toggleWishlist = (product) => {
    const productId =
      product._id || product.id;

    try {
      const savedWishlist =
        JSON.parse(
          localStorage.getItem(
            "mamta_wishlist"
          )
        ) || [];

      const currentWishlist =
        Array.isArray(savedWishlist)
          ? savedWishlist
          : [];

      const alreadyExists =
        currentWishlist.some(
          (item) =>
            (item._id || item.id) ===
            productId
        );

      let updatedWishlist;

      /* ---------------------------------------------
         REMOVE
      --------------------------------------------- */

      if (alreadyExists) {
        updatedWishlist =
          currentWishlist.filter(
            (item) =>
              (item._id || item.id) !==
              productId
          );

        toast.success(
          `${product.name} removed from wishlist.`
        );
      }

      /* ---------------------------------------------
         ADD
      --------------------------------------------- */

      else {
        updatedWishlist = [
          ...currentWishlist,
          product,
        ];

        toast.success(
          `${product.name} added to wishlist.`
        );
      }

      /* ---------------------------------------------
         SAVE
      --------------------------------------------- */

      localStorage.setItem(
        "mamta_wishlist",
        JSON.stringify(
          updatedWishlist
        )
      );

      /* ---------------------------------------------
         STATE
      --------------------------------------------- */

      setWishlist(
        updatedWishlist
      );

      /* ---------------------------------------------
         HEADER + OTHER PAGES
      --------------------------------------------- */

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    } catch (error) {
      console.error(
        "WISHLIST ERROR:",
        error
      );

      toast.error(
        "Unable to update wishlist."
      );
    }
  };

  /* =======================================================
     FLY TO CART ANIMATION
     SAME ANIMATION AS SHOP.JSX
  ======================================================== */

  const animateToCart = (
    buttonElement
  ) => {
    if (!buttonElement) {
      console.log(
        "❌ Add button not found"
      );

      return;
    }

    /* ---------------------------------------------
       FIND CART
    --------------------------------------------- */

    const cartTarget =
      document.querySelector(
        '[data-cart-target="true"]'
      );

    if (!cartTarget) {
      console.warn(
        "MAMTA: Cart target not found. Add data-cart-target='true' to the cart element."
      );

      return;
    }

    /* ---------------------------------------------
       BUTTON POSITION
    --------------------------------------------- */

    const buttonRect =
      buttonElement.getBoundingClientRect();

    /* ---------------------------------------------
       CART POSITION
    --------------------------------------------- */

    const cartRect =
      cartTarget.getBoundingClientRect();

    /* ---------------------------------------------
       FLYING ITEM SIZE
    --------------------------------------------- */

    const size = 58;

    /* ---------------------------------------------
       START
    --------------------------------------------- */

    const startX =
      buttonRect.left +
      buttonRect.width / 2 -
      size / 2;

    const startY =
      buttonRect.top +
      buttonRect.height / 2 -
      size / 2;

    /* ---------------------------------------------
       END
    --------------------------------------------- */

    const endX =
      cartRect.left +
      cartRect.width / 2 -
      size / 2;

    const endY =
      cartRect.top +
      cartRect.height / 2 -
      size / 2;

    /* ---------------------------------------------
       DISTANCE
    --------------------------------------------- */

    const deltaX =
      endX - startX;

    const deltaY =
      endY - startY;

    /* ---------------------------------------------
       CREATE FLYING M
    --------------------------------------------- */

    const flyingItem =
      document.createElement(
        "div"
      );

    flyingItem.className =
      "mamta-flying-cart-item";

    flyingItem.innerHTML = `
      <span>M</span>
    `;

    /* ---------------------------------------------
       INITIAL POSITION
    --------------------------------------------- */

    flyingItem.style.left =
      `${startX}px`;

    flyingItem.style.top =
      `${startY}px`;

    document.body.appendChild(
      flyingItem
    );

    /* ---------------------------------------------
       ANIMATION
    --------------------------------------------- */

    const animation =
      flyingItem.animate(
        [
          {
            transform:
              "translate3d(0, 0, 0) scale(1)",
            opacity: 1,
          },

          {
            transform:
              `translate3d(
                ${deltaX * 0.18}px,
                ${deltaY * 0.18 - 45}px,
                0
              ) scale(0.96)`,
            opacity: 1,
          },

          {
            transform:
              `translate3d(
                ${deltaX * 0.48}px,
                ${deltaY * 0.48 - 55}px,
                0
              ) scale(0.82)`,
            opacity: 0.95,
          },

          {
            transform:
              `translate3d(
                ${deltaX * 0.78}px,
                ${deltaY * 0.78 - 25}px,
                0
              ) scale(0.6)`,
            opacity: 0.65,
          },

          {
            transform:
              `translate3d(
                ${deltaX}px,
                ${deltaY}px,
                0
              ) scale(0.25)`,
            opacity: 0,
          },
        ],
        {
          duration: 950,

          easing:
            "cubic-bezier(0.16, 1, 0.3, 1)",

          fill: "forwards",
        }
      );

    /* ---------------------------------------------
       ANIMATION FINISHED
    --------------------------------------------- */

    animation.onfinish = () => {
      flyingItem.remove();

      /* -------------------------------------------
         CART POP
      ------------------------------------------- */

      cartTarget.classList.remove(
        "cart-flying-pop"
      );

      void cartTarget.offsetWidth;

      cartTarget.classList.add(
        "cart-flying-pop"
      );

      setTimeout(() => {
        cartTarget.classList.remove(
          "cart-flying-pop"
        );
      }, 450);
    };
  };

  /* =======================================================
     ADD TO CART
  ======================================================== */

  const addToCart = async (
    product,
    buttonElement
  ) => {
    /* ---------------------------------------------
       CHECK LOGIN
    --------------------------------------------- */

    const token =
      localStorage.getItem(
        "mamta_user_token"
      );

    if (!token) {
      toast.error(
        "Please login before adding items to your cart."
      );

      navigate("/login");

      return;
    }

    /* ---------------------------------------------
       PRODUCT ID
    --------------------------------------------- */

    const productId =
      product._id || product.id;

    /* ---------------------------------------------
       PREVENT DOUBLE CLICK
    --------------------------------------------- */

    if (
      addingProductId ===
      productId
    ) {
      return;
    }

    try {
      setAddingProductId(
        productId
      );

      /* -------------------------------------------
         START FLYING ANIMATION
         IMMEDIATELY
      ------------------------------------------- */

      animateToCart(
        buttonElement
      );

      /* -------------------------------------------
         BACKEND REQUEST
      ------------------------------------------- */

      await axios.post(
        `${API_URL}/cart/add`,
        {
          productId:
            productId,

          name:
            product.name,

          image:
            product.image,

          price:
            product.price,

          quantity: 1,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      /* -------------------------------------------
         UPDATE HEADER CART COUNT
      ------------------------------------------- */

      window.dispatchEvent(
        new Event("cartChanged")
      );

      /* -------------------------------------------
         SUCCESS TOAST
         SAME AS SHOP.JSX
      ------------------------------------------- */

      toast.success(
        `${product.name} added to cart.`
      );
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error
      );

      /* -------------------------------------------
         TOKEN EXPIRED / INVALID
      ------------------------------------------- */

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "mamta_user_token"
        );

        localStorage.removeItem(
          "mamta_user"
        );

        localStorage.removeItem(
          "mamta_token"
        );

        localStorage.removeItem(
          "mamta_user_data"
        );

        window.dispatchEvent(
          new Event("authChanged")
        );

        toast.error(
          "Your session has expired. Please login again."
        );

        navigate("/login");

        return;
      }

      /* -------------------------------------------
         OTHER ERROR
      ------------------------------------------- */

      toast.error(
        error.response?.data?.message ||
          "Unable to add product to cart."
      );
    } finally {
      setAddingProductId(
        null
      );
    }
  };

  /* =======================================================
     RETURN
  ======================================================== */

  return (
    <main className="maternity-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="maternity-hero">

        <div className="maternity-hero-glow maternity-glow-one"></div>

        <div className="maternity-hero-glow maternity-glow-two"></div>

        <div className="maternity-hero-inner">

          {/* =================================================
              HERO CONTENT
          ================================================== */}

          <ScrollReveal direction="left">

            <div className="maternity-hero-content">

              <span className="maternity-eyebrow">

                <span></span>

                MAMTA MATERNITY COLLECTION

              </span>

              <h1>

                Made for

                <br />

                <em>
                  your comfort.
                </em>

              </h1>

              <p>

                Gentle support for the beautiful journey
                of motherhood. Discover thoughtfully
                designed maternity pillows made to bring
                comfort to every moment of rest.

              </p>

              <div className="maternity-hero-actions">

                <a
                  href="#maternity-products"
                  className="maternity-primary-btn"
                >

                  Shop the collection

                  <ArrowUpRight
                    size={17}
                  />

                </a>

                <span className="maternity-hero-note">

                  Soft support • Thoughtful comfort

                </span>

              </div>

            </div>

          </ScrollReveal>

          {/* =================================================
              HERO VISUAL
          ================================================== */}

          <ScrollReveal direction="right">

            <div className="maternity-hero-visual">

              <div className="maternity-hero-circle"></div>

              <div className="maternity-main-image">

                <img
                  src="https://res.cloudinary.com/iysbraru/image/upload/v1790504967/Screenshot_2026-09-27_at_3.28.57_PM.png"
                  alt="MAMTA maternity pillow"
                />

              </div>

              <div className="maternity-floating-card">

                <span>
                  DESIGNED FOR MUMS
                </span>

                <strong>

                  A softer way

                  <br />

                  to rest.

                </strong>

                <div className="floating-check">

                  <Check size={13} />

                  Thoughtful comfort

                </div>

              </div>

              <div className="maternity-round-badge">

                <span>
                  COMFORT • CARE • MAMTA •
                </span>

              </div>

            </div>

          </ScrollReveal>

        </div>

        {/* =================================================
            HERO BOTTOM
        ================================================== */}

        <div className="maternity-hero-bottom">

          <span>
            01
          </span>

          <div></div>

          <span>
            MATERNITY COLLECTION
          </span>

        </div>

      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <ScrollReveal direction="down">

        <section className="maternity-intro">

          <div className="maternity-intro-label">
            WHY MAMTA
          </div>

          <h2>

            Comfort that feels

            <br />

            <em>
              like a little care.
            </em>

          </h2>

          <p>

            Pregnancy brings countless changes.
            Your comfort should not be one of them.
            Our maternity pillows are thoughtfully
            selected to offer soft, supportive comfort
            throughout your day and night.

          </p>

        </section>

      </ScrollReveal>

      {/* =====================================================
          BENEFITS
      ===================================================== */}

      <section className="maternity-benefits">

        {/* BENEFIT 01 */}

        <ScrollReveal direction="left">

          <div className="maternity-benefit">

            <div className="benefit-number">
              01
            </div>

            <div>

              <h3>
                Gentle Support
              </h3>

              <p>

                Designed with comfort and support
                in mind for relaxing moments.

              </p>

            </div>

          </div>

        </ScrollReveal>

        {/* BENEFIT 02 */}

        <ScrollReveal
          direction="up"
          className="stagger-2"
        >

          <div className="maternity-benefit">

            <div className="benefit-number">
              02
            </div>

            <div>

              <h3>
                Soft Materials
              </h3>

              <p>

                Soft-touch fabrics create a cozy
                feeling whenever you need to rest.

              </p>

            </div>

          </div>

        </ScrollReveal>

        {/* BENEFIT 03 */}

        <ScrollReveal
          direction="right"
          className="stagger-3"
        >

          <div className="maternity-benefit">

            <div className="benefit-number">
              03
            </div>

            <div>

              <h3>
                Made for Motherhood
              </h3>

              <p>

                Thoughtfully chosen with the needs
                of expecting mothers in mind.

              </p>

            </div>

          </div>

        </ScrollReveal>

      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section
        className="maternity-products-section"
        id="maternity-products"
      >

        {/* SECTION HEADING */}

        <ScrollReveal direction="down">

          <div className="maternity-section-heading">

            <div>

              <span className="maternity-section-eyebrow">

                THE COLLECTION

              </span>

              <h2>

                Maternity <em>pillows.</em>

              </h2>

            </div>

            <p>

              Find the gentle support that
              feels right for you.

            </p>

          </div>

        </ScrollReveal>

        {/* =================================================
            PRODUCT GRID
        ================================================== */}

        <div className="maternity-products-grid">

          {maternityProducts.map(
            (product, index) => {

              const productId =
                product._id ||
                product.id;

              const productInWishlist =
                isProductInWishlist(
                  productId
                );

              return (
                <ScrollReveal
                  key={productId}
                  direction="up"
                  className={`stagger-${
                    (index % 6) + 1
                  }`}
                >

                  <article className="maternity-product-card">

                    {/* =================================================
                        PRODUCT IMAGE
                    ================================================== */}

                    <div className="maternity-product-image">

                      <img
                        src={
                          product.image
                        }
                        alt={
                          product.name
                        }
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/700x700/F4D9DC/4A3032?text=MAMTA";
                        }}
                      />

                      {/* PRODUCT TAG */}

                      {product.tag && (
                        <span className="maternity-product-tag">

                          {product.tag}

                        </span>
                      )}

                      {/* =================================================
                          WISHLIST
                      ================================================== */}

                      <button
                        type="button"
                        className={`maternity-wishlist ${
                          productInWishlist
                            ? "liked"
                            : ""
                        }`}
                        onClick={() =>
                          toggleWishlist(
                            product
                          )
                        }
                        aria-label={
                          productInWishlist
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >

                        <Heart
                          size={18}
                          fill={
                            productInWishlist
                              ? "currentColor"
                              : "none"
                          }
                        />

                      </button>

                      {/* =================================================
                          PRODUCT OVERLAY
                      ================================================== */}

                      <div className="maternity-product-overlay">

                        {/* VIEW DETAILS */}

                        <button
                          type="button"
                          className="maternity-details-button"
                          onClick={() =>
                            navigate(
                              `/product/${productId}`
                            )
                          }
                        >

                          View Details

                          <ArrowUpRight
                            size={15}
                          />

                        </button>

                        {/* ADD TO CART */}

                        <button
                          type="button"
                          className="maternity-add-cart-button"
                          onClick={(e) =>
                            addToCart(
                              product,
                              e.currentTarget
                            )
                          }
                          disabled={
                            addingProductId ===
                            productId
                          }
                        >

                          <ShoppingBag
                            size={16}
                          />

                          {addingProductId ===
                          productId
                            ? "Adding..."
                            : "Add to cart"}

                        </button>

                      </div>

                    </div>

                    {/* =================================================
                        PRODUCT INFO
                    ================================================== */}

                    <div className="maternity-product-info">

                      {/* RATING */}

                      <div className="maternity-rating">

                        <Star
                          size={13}
                          fill="currentColor"
                        />

                        <span>
                          {product.rating ||
                            "4.9"}
                        </span>

                      </div>

                      {/* NAME */}

                      <h3>
                        {product.name}
                      </h3>

                      {/* PRICE */}

                      <div className="maternity-price">

                        <strong>
                          {formatPrice(
                            product.price
                          )}
                        </strong>

                        {product.oldPrice && (
                          <span>
                            {formatPrice(
                              product.oldPrice
                            )}
                          </span>
                        )}

                      </div>

                    </div>

                  </article>

                </ScrollReveal>
              );
            }
          )}

        </div>

      </section>

      {/* =====================================================
          CLOSING BANNER
      ===================================================== */}

      <ScrollReveal direction="up">

        <section className="maternity-closing">

          <div className="maternity-closing-inner">

            <span>
              FOR EVERY MOTHER
            </span>

            <h2>

              Because you deserve

              <br />

              <em>
                comfort too.
              </em>

            </h2>

            <a href="#maternity-products">

              Explore maternity pillows

              <ArrowUpRight
                size={16}
              />

            </a>

          </div>

        </section>

      </ScrollReveal>

    </main>
  );
};

export default MaternityPillows;
