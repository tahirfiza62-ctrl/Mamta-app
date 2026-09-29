
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
   MATERNITY PRODUCTS
========================================================= */

const maternityProducts = [
  {
    id: 1,
    name: "Cloud Comfort Maternity Pillow",
    price: 4990,
    oldPrice: 5790,
    image: "/products/maternity-pillow-1.jpg",
    tag: "BESTSELLER",
    rating: "4.9",
  },
  {
    id: 2,
    name: "Mum's Embrace Pregnancy Pillow",
    price: 5490,
    oldPrice: 6290,
    image: "/products/maternity-pillow-2.jpg",
    tag: "NEW",
    rating: "4.8",
  },
  {
    id: 3,
    name: "Soft Hug Body Pillow",
    price: 4690,
    oldPrice: 5290,
    image: "/products/maternity-pillow-3.jpg",
    tag: "POPULAR",
    rating: "4.9",
  },
  {
    id: 4,
    name: "Gentle Support Maternity Pillow",
    price: 4290,
    oldPrice: 4890,
    image: "/products/maternity-pillow-4.jpg",
    tag: "ESSENTIAL",
    rating: "4.8",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

const MaternityPillows = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);

  const [addingProductId, setAddingProductId] =
    useState(null);

  /* =======================================================
     LOAD WISHLIST
  ======================================================== */

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist =
          JSON.parse(
            localStorage.getItem("mamta_wishlist")
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

    // Initial wishlist load
    loadWishlist();

    // Listen for wishlist changes
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

  const isProductInWishlist = (productId) => {
    return wishlist.some(
      (item) =>
        (item._id || item.id) === productId
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
          localStorage.getItem("mamta_wishlist")
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
         REMOVE FROM WISHLIST
      --------------------------------------------- */

      if (alreadyExists) {
        updatedWishlist =
          currentWishlist.filter(
            (item) =>
              (item._id || item.id) !==
              productId
          );
      }

      /* ---------------------------------------------
         ADD TO WISHLIST
      --------------------------------------------- */

      else {
        updatedWishlist = [
          ...currentWishlist,
          product,
        ];
      }

      /* ---------------------------------------------
         SAVE TO LOCAL STORAGE
      --------------------------------------------- */

      localStorage.setItem(
        "mamta_wishlist",
        JSON.stringify(updatedWishlist)
      );

      /* ---------------------------------------------
         UPDATE LOCAL STATE
      --------------------------------------------- */

      setWishlist(updatedWishlist);

      /* ---------------------------------------------
         UPDATE HEADER + OTHER PAGES
      --------------------------------------------- */

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );

    } catch (error) {
      console.error(
        "WISHLIST ERROR:",
        error
      );
    }
  };

  /* =======================================================
     ADD TO CART
  ======================================================== */

  const addToCart = async (product) => {
    /* ---------------------------------------------
       CHECK LOGIN
    --------------------------------------------- */

    const token =
      localStorage.getItem(
        "mamta_user_token"
      );

    if (!token) {
      navigate("/login");
      return;
    }

    /* ---------------------------------------------
       PREVENT DOUBLE CLICK
    --------------------------------------------- */

    if (
      addingProductId ===
      product.id
    ) {
      return;
    }

    try {
      setAddingProductId(product.id);

      /* -------------------------------------------
         BACKEND REQUEST
      ------------------------------------------- */

      await axios.post(
        `${API_URL}/cart/add`,
        {
          productId:
            product.id ||
            product._id,

          name: product.name,

          image: product.image,

          price: product.price,

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
         SUCCESS MESSAGE
      ------------------------------------------- */

      alert(
        `${product.name} added to cart`
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

        navigate("/login");

        return;
      }

      /* -------------------------------------------
         OTHER ERROR
      ------------------------------------------- */

      alert(
        error.response?.data?.message ||
        "Unable to add product to cart."
      );

    } finally {
      setAddingProductId(null);
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

              const productInWishlist =
                isProductInWishlist(
                  product.id
                );

              return (
                <ScrollReveal
                  key={product.id}
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
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/700x700/F4D9DC/4A3032?text=MAMTA";
                        }}
                      />

                      {/* PRODUCT TAG */}

                      <span className="maternity-product-tag">

                        {product.tag}

                      </span>

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
                          toggleWishlist(product)
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
                              `/product/${product.id}`
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
                          onClick={() =>
                            addToCart(product)
                          }
                          disabled={
                            addingProductId ===
                            product.id
                          }
                        >

                          <ShoppingBag
                            size={16}
                          />

                          {addingProductId ===
                          product.id
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
                          {product.rating}
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

                        <span>
                          {formatPrice(
                            product.oldPrice
                          )}
                        </span>

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
