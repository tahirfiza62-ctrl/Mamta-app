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

import "./NursingPillows.css";

const API_URL = "http://localhost:3000/api";

const NursingPillows = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

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
          : response.data?.products || [];

      
const nursingProducts = allProducts.filter((product) => {
  const category = String(product.category || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  return [
    "nursing products",
    "nursing",
    "nursing pillows",
    "newborn & kids",
  ].includes(category);
});


        if (!cancelled) {
          setProducts(nursingProducts);
        }
      } catch (error) {
        console.error(
          "Failed to load nursing pillows:",
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

  /* =====================================================
     WISHLIST
  ===================================================== */

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter(
            (id) => id !== productId
          )
        : [...prev, productId]
    );
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <main className="nursing-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="nursing-hero">

        <div className="nursing-hero-content">

          <span className="nursing-eyebrow">
            MAAMTA • MOTHER & BABY
          </span>

          <h1>
            Nursing
            <span> Pillows</span>
          </h1>

          <p>
            Gentle support for comfortable feeding,
            bonding and precious moments with your little one.
          </p>

          <div className="nursing-hero-actions">

            <a
              href="#nursing-products"
              className="nursing-primary-button"
            >
              Explore Collection
              <ArrowUpRight size={18} />
            </a>

          </div>

        </div>

        <div className="nursing-hero-decoration">

          <div className="nursing-circle nursing-circle-one" />

          <div className="nursing-circle nursing-circle-two" />

          <div className="nursing-soft-shape" />

        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="nursing-intro">

        <div>

          <span className="nursing-section-label">
            MADE FOR COMFORT
          </span>

          <h2>
            Support that makes
            <br />
            every feeding moment easier.
          </h2>

        </div>

        <p>
          Discover thoughtfully designed nursing pillows
          created to provide gentle support for mothers
          and babies during feeding and everyday bonding.
        </p>

      </section>


      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section
        className="nursing-products-section"
        id="nursing-products"
      >

        <div className="nursing-products-header">

          <div>

            <span className="nursing-section-label">
              SHOP NURSING
            </span>

            <h2>
              Nursing Pillow Collection
            </h2>

          </div>

          <span className="nursing-product-count">

            {products.length}{" "}

            {products.length === 1
              ? "Product"
              : "Products"}

          </span>

        </div>


        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading ? (

          <div className="nursing-loading">

            <LoaderCircle
              size={30}
              className="nursing-spinner"
            />

            <p>
              Loading our collection...
            </p>

          </div>

        ) : products.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================== */

          <div className="nursing-empty">

            <div className="nursing-empty-icon">
              <ShoppingBag size={28} />
            </div>

            <h3>
              No nursing pillows yet
            </h3>

            <p>
              Our nursing collection is being prepared.
              Please check back soon.
            </p>

            <Link
              to="/"
              className="nursing-empty-button"
            >
              Back to Home
            </Link>

          </div>

        ) : (

          /* =================================================
             PRODUCT GRID
          ================================================== */

          <div className="nursing-product-grid">

            {products.map((product) => {

              const isWishlisted =
                wishlist.includes(
                  product._id
                );

              /*
                 PRODUCT IMAGE

                 Supports:
                 product.image
                 product.images[0]
                 object-based image
              */

              let image =
                product.image || "";

              if (
                !image &&
                Array.isArray(
                  product.images
                ) &&
                product.images.length > 0
              ) {
                const firstImage =
                  product.images[0];

                if (
                  typeof firstImage ===
                  "string"
                ) {
                  image =
                    firstImage;
                } else if (
                  typeof firstImage ===
                    "object" &&
                  firstImage !== null
                ) {
                  image =
                    firstImage.url ||
                    firstImage.image ||
                    firstImage.src ||
                    "";
                }
              }

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
                  className="nursing-product-card"
                  key={product._id}
                >

                  {/* =======================================
                      IMAGE
                  ======================================== */}

                  <div className="nursing-product-image">

                    <Link
                      to={`/product/${product._id}`}
                    >

                      {image ? (

                        <img
                          src={image}
                          alt={
                            product.name
                          }
                          onError={(
                            event
                          ) => {
                            event.currentTarget.src =
                              "https://placehold.co/600x600/F4D9DC/4A3032?text=MAMTA";
                          }}
                        />

                      ) : (

                        <div className="nursing-no-image">

                          <ShoppingBag
                            size={28}
                          />

                        </div>

                      )}

                    </Link>


                    {/* =================================
                        WISHLIST
                    ================================== */}

                    <button
                      type="button"
                      className={`nursing-wishlist ${
                        isWishlisted
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        toggleWishlist(
                          product._id
                        )
                      }
                      aria-label={
                        isWishlisted
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
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


                  {/* =======================================
                      CONTENT
                  ======================================== */}

                  <div className="nursing-product-content">

                    <span className="nursing-product-category">
                      Nursing
                    </span>


                    <Link
                      to={`/product/${product._id}`}
                      className="nursing-product-name"
                    >
                      {product.name}
                    </Link>


                    {/* =====================================
                        RATING
                    ====================================== */}

                    <div className="nursing-product-rating">

                      <div className="nursing-stars">

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
                        Loved by mothers
                      </span>

                    </div>


                    {/* =====================================
                        PRICE + VIEW
                    ====================================== */}

                    <div className="nursing-product-bottom">

                      <div className="nursing-price">

                        <strong>
                          Rs.{" "}
                          {price.toLocaleString()}
                        </strong>


                        {oldPrice &&
                          oldPrice >
                            price && (
                            <del>
                              Rs.{" "}
                              {oldPrice.toLocaleString()}
                            </del>
                          )}

                      </div>


                      <Link
                        to={`/product/${product._id}`}
                        className="nursing-view-button"
                        aria-label={`View ${product.name}`}
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
          BOTTOM MESSAGE
      ===================================================== */}

      <section className="nursing-bottom-banner">

        <div>

          <span className="nursing-section-label">
            MAAMTA
          </span>

          <h2>
            Comfort for you.
            <br />
            Care for your little one.
          </h2>

        </div>

        <p>
          Designed with softness, support and everyday
          motherhood in mind.
        </p>

      </section>

    </main>
  );
};

export default NursingPillows;