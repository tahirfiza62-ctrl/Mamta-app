
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowUpRight, Star } from "lucide-react";

import ScrollReveal from "../ScrollReveal/ScrollReveal";
import "./FeaturedProducts.css";

/* =========================================================
   MAMTA FEATURED PRODUCTS
   Matching ProductDetails products
========================================================= */

const products = [
  {
    id: 1,
    name: "Cloud Comfort Maternity Pillow",
    category: "Maternity Pillows",
    price: 4990,
    oldPrice: 5790,
    rating: "4.9",
    image: "/products/maternity-pillow-1.jpg",
  },

  {
    id: 2,
    name: "Mum's Embrace Pregnancy Pillow",
    category: "Maternity Pillows",
    price: 5490,
    oldPrice: 6290,
    rating: "4.9",
    image: "/products/maternity-pillow-2.jpg",
  },

  {
    id: 3,
    name: "Soft Nest Baby Pillow",
    category: "Baby Pillows",
    price: 2490,
    oldPrice: 2990,
    rating: "4.8",
    image: "/products/baby-pillow-1.jpg",
  },

  {
    id: 4,
    name: "Little Cloud Baby Pillow",
    category: "Baby Pillows",
    price: 2190,
    oldPrice: 2690,
    rating: "4.8",
    image: "/products/baby-pillow-2.jpg",
  },
];

/* =========================================================
   FORMAT PRICE
========================================================= */

const formatPrice = (price) => {
  return `Rs. ${Number(price).toLocaleString()}`;
};

/* =========================================================
   FEATURED PRODUCTS
========================================================= */

const FeaturedProducts = () => {
  const [wishlist, setWishlist] = useState([]);

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
          "FEATURED WISHLIST LOAD ERROR:",
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
     CHECK WISHLIST
  ======================================================== */

  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) =>
        (item._id || item.id) === productId
    );
  };

  /* =======================================================
     TOGGLE WISHLIST
  ======================================================== */

  const toggleWishlist = (product) => {
    try {
      const savedWishlist =
        JSON.parse(
          localStorage.getItem("mamta_wishlist")
        ) || [];

      const currentWishlist =
        Array.isArray(savedWishlist)
          ? savedWishlist
          : [];

      const productId =
        product._id || product.id;

      const alreadyExists =
        currentWishlist.some(
          (item) =>
            (item._id || item.id) === productId
        );

      let updatedWishlist;

      if (alreadyExists) {
        /* REMOVE */

        updatedWishlist =
          currentWishlist.filter(
            (item) =>
              (item._id || item.id) !== productId
          );
      } else {
        /* ADD */

        updatedWishlist = [
          ...currentWishlist,
          product,
        ];
      }

      /* SAVE */

      localStorage.setItem(
        "mamta_wishlist",
        JSON.stringify(updatedWishlist)
      );

      /* UPDATE CURRENT PAGE */

      setWishlist(updatedWishlist);

      /* UPDATE HEADER + OTHER PAGES */

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );

    } catch (error) {
      console.error(
        "FEATURED WISHLIST ERROR:",
        error
      );
    }
  };

  /* =======================================================
     RETURN
  ======================================================== */

  return (
    <section className="featured-products">

      <div className="featured-container">

        {/* =================================================
            HEADING
        ================================================= */}

        <ScrollReveal direction="down">

          <div className="featured-heading">

            <div className="featured-title">

              <span className="featured-eyebrow">
                MAMTA COLLECTION
              </span>

              <h2>
                Loved for
                <span> Comfort</span>
              </h2>

            </div>

            <div className="featured-intro">

              <p>
                Discover thoughtfully designed pillows made
                to bring softness, comfort and care into
                everyday moments.
              </p>

              <Link
                to="/shop"
                className="view-all-products"
              >

                <span>
                  View All Products
                </span>

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.6}
                />

              </Link>

            </div>

          </div>

        </ScrollReveal>

        {/* =================================================
            PRODUCTS GRID
        ================================================= */}

        <div className="products-grid">

          {products.map(
            (product, index) => {

              const productInWishlist =
                isInWishlist(product.id);

              return (
                <ScrollReveal
                  key={product.id}
                  direction="up"
                  className={`stagger-${index + 1}`}
                >

                  <article className="product-card">

                    {/* =================================================
                        PRODUCT IMAGE
                    ================================================= */}

                    <div className="product-image">

                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/900x900/F4D9DC/4A3032?text=MAMTA";
                        }}
                      />

                      {/* CATEGORY */}

                      <span className="product-badge">
                        {product.category}
                      </span>

                      {/* WISHLIST */}

                      <button
                        type="button"
                        className={`wishlist-button ${
                          productInWishlist
                            ? "active"
                            : ""
                        }`}
                        aria-label={
                          productInWishlist
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                        onClick={() =>
                          toggleWishlist(product)
                        }
                      >

                        <Heart
                          size={18}
                          strokeWidth={1.6}
                          fill={
                            productInWishlist
                              ? "currentColor"
                              : "none"
                          }
                        />

                      </button>

                      {/* QUICK VIEW */}

                      <Link
                        to={`/product/${product.id}`}
                        className="quick-view"
                      >

                        <span>
                          Quick View
                        </span>

                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.7}
                        />

                      </Link>

                    </div>

                    {/* =================================================
                        PRODUCT INFORMATION
                    ================================================= */}

                    <div className="product-info">

                      {/* NAME */}

                      <h3>
                        {product.name}
                      </h3>

                      {/* RATING */}

                      <div className="product-rating">

                        <div className="stars">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (

                              <Star
                                key={star}
                                size={12}
                                strokeWidth={1.5}
                                fill="currentColor"
                              />

                            )
                          )}

                        </div>

                        <span>
                          {product.rating}
                        </span>

                      </div>

                      {/* PRICE */}

                      <div className="product-price">

                        <strong>
                          {formatPrice(
                            product.price
                          )}
                        </strong>

                        {product.oldPrice && (
                          <del>
                            {formatPrice(
                              product.oldPrice
                            )}
                          </del>
                        )}

                      </div>

                    </div>

                  </article>

                </ScrollReveal>
              );
            }
          )}

        </div>

        {/* =================================================
            BOTTOM SHOP CTA
        ================================================= */}

        <ScrollReveal direction="up">
        </ScrollReveal>

      </div>

    </section>
  );
};

export default FeaturedProducts;
