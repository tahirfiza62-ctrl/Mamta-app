import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowUpRight,
  Heart,
  ShoppingBag,
  Star,
  LoaderCircle,
} from "lucide-react";

import "./ElderPillows.css";

const API_URL = "http://localhost:3000/api";

const ElderPillows = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  /* =========================================================
     FETCH ELDER PILLOWS
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        if (!cancelled) {
          setLoading(true);
        }

        const response = await axios.get(
          `${API_URL}/products`
        );

        const allProducts = Array.isArray(
          response.data
        )
          ? response.data
          : response.data.products || [];

      
const elderProducts = allProducts.filter((product) => {
  const category = String(product.category || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  return [
    "elders pillows",
    "elder pillows",
    "elders",
  ].includes(category);
});


        if (!cancelled) {
          setProducts(elderProducts);
        }
      } catch (error) {
        console.error(
          "Failed to load elder pillows:",
          error
        );

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     WISHLIST
  ========================================================= */

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter(
            (id) => id !== productId
          )
        : [...prev, productId]
    );
  };

  return (
    <main className="elder-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="elder-hero">

        <div className="elder-hero-content">

          <span className="elder-eyebrow">
            MAAMTA • EVERY GENERATION
          </span>

          <h1>
            Elder
            <span> Pillows</span>
          </h1>

          <p>
            Thoughtful comfort and gentle support designed
            for restful moments, relaxing evenings and
            everyday wellbeing.
          </p>

          <div className="elder-hero-actions">

            <a
              href="#elder-products"
              className="elder-primary-button"
            >
              Explore Collection
              <ArrowUpRight size={18} />
            </a>

          </div>

        </div>

        <div className="elder-hero-decoration">

          <div className="elder-circle elder-circle-one" />

          <div className="elder-circle elder-circle-two" />

          <div className="elder-soft-shape" />

        </div>

      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="elder-intro">

        <div>

          <span className="elder-section-label">
            COMFORT FOR EVERY AGE
          </span>

          <h2>
            Gentle support for
            <br />
            peaceful rest.
          </h2>

        </div>

        <p>
          MAAMTA elder pillows are created with comfort
          and everyday support in mind, bringing softness
          and relaxation into your daily routine.
        </p>

      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section
        className="elder-products-section"
        id="elder-products"
      >

        <div className="elder-products-header">

          <div>

            <span className="elder-section-label">
              SHOP ELDER PILLOWS
            </span>

            <h2>
              Elder Pillow Collection
            </h2>

          </div>

          <span className="elder-product-count">
            {products.length}{" "}
            {products.length === 1
              ? "Product"
              : "Products"}
          </span>

        </div>

        {loading ? (
          <div className="elder-loading">

            <LoaderCircle
              size={30}
              className="elder-spinner"
            />

            <p>
              Loading our collection...
            </p>

          </div>
        ) : products.length === 0 ? (
          <div className="elder-empty">

            <div className="elder-empty-icon">
              <ShoppingBag size={28} />
            </div>

            <h3>
              No elder pillows yet
            </h3>

            <p>
              Our elder pillow collection is being prepared.
              Please check back soon.
            </p>

            <Link
              to="/"
              className="elder-empty-button"
            >
              Back to Home
            </Link>

          </div>
        ) : (
          <div className="elder-product-grid">

            {products.map((product) => {

              const isWishlisted =
                wishlist.includes(
                  product._id
                );

              const image =
                product.image ||
                product.images?.[0] ||
                "";

              const price =
                Number(
                  product.price || 0
                );

              const oldPrice =
                product.oldPrice &&
                Number(
                  product.oldPrice
                );

              return (
                <article
                  className="elder-product-card"
                  key={product._id}
                >

                  {/* IMAGE */}

                  <div className="elder-product-image">

                    <Link
                      to={`/product/${product._id}`}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                        />
                      ) : (
                        <div className="elder-no-image">

                          <ShoppingBag
                            size={28}
                          />

                        </div>
                      )}
                    </Link>

                    <button
                      type="button"
                      className={`elder-wishlist ${
                        isWishlisted
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        toggleWishlist(
                          product._id
                        )
                      }
                      aria-label="Add to wishlist"
                    >

                      <Heart
                        size={18}
                        fill={
                          isWishlisted
                            ? "currentColor"
                            : "none"
                        }
                      />

                    </button>

                  </div>

                  {/* CONTENT */}

                  <div className="elder-product-content">

                    <span className="elder-product-category">
                      Elder Pillows
                    </span>

                    <Link
                      to={`/product/${product._id}`}
                      className="elder-product-name"
                    >
                      {product.name}
                    </Link>

                    <div className="elder-product-rating">

                      <div className="elder-stars">

                        <Star
                          size={13}
                          fill="currentColor"
                        />

                        <Star
                          size={13}
                          fill="currentColor"
                        />

                        <Star
                          size={13}
                          fill="currentColor"
                        />

                        <Star
                          size={13}
                          fill="currentColor"
                        />

                        <Star
                          size={13}
                          fill="currentColor"
                        />

                      </div>

                      <span>
                        Designed for comfort
                      </span>

                    </div>

                    <div className="elder-product-bottom">

                      <div className="elder-price">

                        <strong>
                          Rs.{" "}
                          {price.toLocaleString()}
                        </strong>

                        {oldPrice &&
                          oldPrice > price && (
                            <del>
                              Rs.{" "}
                              {oldPrice.toLocaleString()}
                            </del>
                          )}

                      </div>

                      <Link
                        to={`/product/${product._id}`}
                        className="elder-view-button"
                      >

                        <ArrowUpRight
                          size={17}
                        />

                      </Link>

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </section>

      {/* =====================================================
          BOTTOM BANNER
      ===================================================== */}

      <section className="elder-bottom-banner">

        <div>

          <span className="elder-section-label">
            MAAMTA
          </span>

          <h2>
            Thoughtful comfort.
            <br />
            Every day.
          </h2>

        </div>

        <p>
          Softness and support made for relaxing moments
          and comfortable rest.
        </p>

      </section>

    </main>
  );
};

export default ElderPillows;