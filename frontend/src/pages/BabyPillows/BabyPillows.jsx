
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Heart,
  ShoppingBag,
  Star,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Feather,
  Check,
} from "lucide-react";

import { Link } from "react-router-dom";

import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";

import "./BabyPillows.css";

/* =========================================================
   API
========================================================= */

const API_URL = "http://localhost:3000/api";

/* =========================================================
   BABY PRODUCTS
========================================================= */

const products = [
  {
    id: 1,
    name: "Soft Nest Baby Pillow",
    price: 2490,
    oldPrice: 2990,
    rating: "4.9",
    reviews: 38,
    tag: "BESTSELLER",
    image:
      "https://res.cloudinary.com/iysbraru/image/upload/v1790354535/image8.jpg",
  },
  {
    id: 2,
    name: "Little Cloud Baby Pillow",
    price: 2190,
    oldPrice: 2690,
    rating: "4.8",
    reviews: 31,
    tag: "NEW",
    image:
      "https://res.cloudinary.com/iysbraru/image/upload/v1790352591/image2.jpg",
  },
  {
    id: 3,
    name: "Gentle Sleep Baby Pillow",
    price: 2690,
    oldPrice: 3190,
    rating: "4.9",
    reviews: 42,
    tag: "POPULAR",
    image:
      "https://res.cloudinary.com/iysbraru/image/upload/v1790354535/image8.jpg",
  },
  {
    id: 4,
    name: "Baby Comfort Pillow",
    price: 2390,
    oldPrice: 2890,
    rating: "4.8",
    reviews: 27,
    tag: "ESSENTIAL",
    image:
      "https://res.cloudinary.com/iysbraru/image/upload/v1790352591/image2.jpg",
  },
];

/* =========================================================
   COMPONENT
========================================================= */

const BabyPillows = () => {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [addingProductId, setAddingProductId] = useState(null);

  /* =======================================================
     LOAD WISHLIST
  ======================================================== */

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist =
          JSON.parse(localStorage.getItem("mamta_wishlist")) || [];

        setWishlist(
          Array.isArray(savedWishlist) ? savedWishlist : []
        );
      } catch (error) {
        console.error("WISHLIST LOAD ERROR:", error);
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
     CHECK WISHLIST
  ======================================================== */

  const isProductInWishlist = (productId) => {
    return wishlist.some(
      (item) => (item._id || item.id) === productId
    );
  };

  /* =======================================================
     TOGGLE WISHLIST
  ======================================================== */

  const toggleWishlist = (product) => {
    const productId = product._id || product.id;

    try {
      const savedWishlist =
        JSON.parse(localStorage.getItem("mamta_wishlist")) || [];

      const currentWishlist = Array.isArray(savedWishlist)
        ? savedWishlist
        : [];

      const alreadyExists = currentWishlist.some(
        (item) => (item._id || item.id) === productId
      );

      let updatedWishlist;

      if (alreadyExists) {
        /* REMOVE */

        updatedWishlist = currentWishlist.filter(
          (item) => (item._id || item.id) !== productId
        );
      } else {
        /* ADD */

        updatedWishlist = [
          ...currentWishlist,
          product,
        ];
      }

      localStorage.setItem(
        "mamta_wishlist",
        JSON.stringify(updatedWishlist)
      );

      setWishlist(updatedWishlist);

      /* Update Header + Wishlist page */

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
      localStorage.getItem("mamta_user_token");

    if (!token) {
      navigate("/login");
      return;
    }

    /* ---------------------------------------------
       PREVENT DOUBLE CLICK
    --------------------------------------------- */

    if (addingProductId === product.id) {
      return;
    }

    try {
      setAddingProductId(product.id);

      /* -------------------------------------------
         SEND PRODUCT TO BACKEND
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
         INVALID / EXPIRED TOKEN
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
         OTHER BACKEND ERROR
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
    <main className="baby-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="baby-hero">

        <div className="baby-hero-container">

          {/* HERO CONTENT */}

          <ScrollReveal direction="left">

            <div className="baby-hero-content">

              <span className="baby-eyebrow">
                MAMTA · BABY COLLECTION
              </span>

              <h1>
                Soft comfort
                <span>
                  for little dreams.
                </span>
              </h1>

              <p>
                Thoughtfully designed baby pillows
                created to bring softness, comfort
                and warmth to everyday little moments.
              </p>

              <div className="baby-hero-actions">

                <a
                  href="#baby-collection"
                  className="baby-primary-button"
                >
                  <span>
                    Explore Collection
                  </span>

                  <ArrowUpRight size={17} />
                </a>

                <span className="baby-hero-note">
                  Soft · Gentle · Thoughtful
                </span>

              </div>

            </div>

          </ScrollReveal>

          {/* HERO VISUAL */}

          <ScrollReveal direction="right">

            <div className="maternity-hero-visual">

              <div className="maternity-hero-circle"></div>

              <div className="maternity-hero-glow maternity-glow-one"></div>

              <div className="maternity-hero-glow maternity-glow-two"></div>

              <div className="maternity-main-image">

                <img
                  src="https://res.cloudinary.com/iysbraru/image/upload/v1790508192/baby.jpg"
                  alt="MAMTA baby pillow collection"
                />

              </div>

              <div className="maternity-floating-card">

                <span>
                  MAMTA COMFORT
                </span>

                <strong>
                  Made for
                  <br />
                  beautiful moments.
                </strong>

                <div className="floating-check">

                  <Check size={13} />

                  <span>
                    Soft & thoughtfully designed
                  </span>

                </div>

              </div>

              <div className="maternity-round-badge">

                <span>
                  COMFORT · CARE · LOVE · MAMTA ·
                </span>

              </div>

            </div>

          </ScrollReveal>

        </div>

      </section>

      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="baby-introduction">

        <div className="baby-intro-container">

          <ScrollReveal direction="down">

            <div className="baby-intro-title">

              <span className="baby-section-label">
                GENTLE BY DESIGN
              </span>

              <h2>
                Comfort made
                <span>
                  for little ones.
                </span>
              </h2>

            </div>

          </ScrollReveal>

          <ScrollReveal direction="up">

            <div className="baby-intro-content">

              <p className="baby-intro-main">
                Every little moment deserves a little more
                softness. Our baby pillows are thoughtfully
                selected to make everyday comfort feel simple,
                beautiful and special.
              </p>

              <p className="baby-intro-secondary">
                From peaceful rest to quiet cuddles, MAMTA
                brings together soft essentials made with
                care for mothers and their little ones.
              </p>

            </div>

          </ScrollReveal>

        </div>

      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="baby-features">

        <div className="baby-features-container">

          {/* FEATURE 01 */}

          <ScrollReveal
            direction="left"
            className="stagger-1"
          >

            <div className="baby-feature">

              <div className="baby-feature-icon">
                <Feather size={20} />
              </div>

              <div>

                <span>
                  01
                </span>

                <h3>
                  Soft & Gentle
                </h3>

                <p>
                  Carefully selected soft materials
                  for cozy everyday comfort.
                </p>

              </div>

            </div>

          </ScrollReveal>

          {/* FEATURE 02 */}

          <ScrollReveal
            direction="up"
            className="stagger-2"
          >

            <div className="baby-feature">

              <div className="baby-feature-icon">
                <Sparkles size={20} />
              </div>

              <div>

                <span>
                  02
                </span>

                <h3>
                  Thoughtful Design
                </h3>

                <p>
                  Simple, comfortable designs created
                  with little ones in mind.
                </p>

              </div>

            </div>

          </ScrollReveal>

          {/* FEATURE 03 */}

          <ScrollReveal
            direction="right"
            className="stagger-3"
          >

            <div className="baby-feature">

              <div className="baby-feature-icon">
                <ShieldCheck size={20} />
              </div>

              <div>

                <span>
                  03
                </span>

                <h3>
                  Made with Care
                </h3>

                <p>
                  Everyday essentials chosen with
                  comfort and care at heart.
                </p>

              </div>

            </div>

          </ScrollReveal>

        </div>

      </section>

      {/* =====================================================
          COLLECTION
      ===================================================== */}

      <section
        className="baby-products"
        id="baby-collection"
      >

        <div className="baby-products-container">

          {/* COLLECTION HEADING */}

          <ScrollReveal direction="down">

            <div className="baby-products-heading">

              <div>

                <span className="baby-section-label">
                  THE COLLECTION
                </span>

                <h2>
                  Baby
                  <span>
                    Pillows
                  </span>
                </h2>

              </div>

              <p>
                Soft little companions thoughtfully chosen
                for everyday comfort and beautiful moments.
              </p>

            </div>

          </ScrollReveal>

          {/* PRODUCT GRID */}

          <div className="baby-products-grid">

            {products.map(
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

                    <article className="baby-product-card">

                      {/* PRODUCT IMAGE */}

                      <div className="baby-product-image">

                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/700x700/F4D9DC/4A3032?text=MAMTA";
                          }}
                        />

                        {/* PRODUCT TAG */}

                        <span className="baby-product-tag">
                          {product.tag}
                        </span>

                        {/* WISHLIST */}

                        <button
                          type="button"
                          className={`baby-wishlist ${
                            productInWishlist
                              ? "active"
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
                            strokeWidth={1.5}
                            fill={
                              productInWishlist
                                ? "currentColor"
                                : "none"
                            }
                          />

                        </button>

                        {/* VIEW DETAILS */}

                        <Link
                          to={`/product/${product.id}`}
                          className="baby-details-button"
                        >

                          <span>
                            View Details
                          </span>

                          <ArrowUpRight
                            size={15}
                          />

                        </Link>

                      </div>

                      {/* PRODUCT INFO */}

                      <div className="baby-product-info">

                        <span className="baby-product-category">
                          BABY & KIDS
                        </span>

                        <h3>
                          {product.name}
                        </h3>

                        {/* RATING */}

                        <div className="baby-rating">

                          <div className="baby-stars">

                            {[1, 2, 3, 4, 5].map(
                              (star) => (
                                <Star
                                  key={star}
                                  size={12}
                                  fill="currentColor"
                                  strokeWidth={1.2}
                                />
                              )
                            )}

                          </div>

                          <span>
                            {product.rating}
                            {" · "}
                            {product.reviews}
                            {" reviews"}
                          </span>

                        </div>

                        {/* PRICE + CART */}

                        <div className="baby-product-bottom">

                          <div className="baby-price">

                            <strong>
                              Rs.{" "}
                              {product.price.toLocaleString()}
                            </strong>

                            <del>
                              Rs.{" "}
                              {product.oldPrice.toLocaleString()}
                            </del>

                          </div>

                          {/* ADD TO CART */}

                          <button
                            type="button"
                            className={`baby-cart ${
                              addingProductId ===
                              product.id
                                ? "adding"
                                : ""
                            }`}
                            onClick={() =>
                              addToCart(product)
                            }
                            disabled={
                              addingProductId ===
                              product.id
                            }
                            aria-label={
                              `Add ${product.name} to cart`
                            }
                          >

                            <ShoppingBag
                              size={17}
                            />

                          </button>

                        </div>

                      </div>

                    </article>

                  </ScrollReveal>
                );
              }
            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="baby-final">

        <ScrollReveal direction="up">

          <div className="baby-final-content">

            <span className="baby-final-label">
              MAMTA
            </span>

            <h2>
              Small comforts.
              <span>
                Beautiful beginnings.
              </span>
            </h2>

            <p>
              Thoughtfully chosen for the little moments
              that become your favorite memories.
            </p>

            <Link
              to="/shop"
              className="baby-final-button"
            >

              <span>
                Shop All Products
              </span>

              <ArrowUpRight size={17} />

            </Link>

          </div>

        </ScrollReveal>

      </section>

    </main>
  );
};

export default BabyPillows;
