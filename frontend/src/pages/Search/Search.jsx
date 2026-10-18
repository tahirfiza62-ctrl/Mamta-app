
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Search as SearchIcon,
  Heart,
  ArrowUpRight,
  Star,
  X,
} from "lucide-react";

import "./Search.css";
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${API_URL}/products`
        );

        const data = response.data;

        const productList =
          data.products ||
          data.data ||
          [];

        setProducts(
          Array.isArray(productList)
            ? productList
            : []
        );
      } catch (error) {
        console.error(
          "SEARCH PRODUCTS ERROR:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =========================================================
     LOAD WISHLIST
  ========================================================= */

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const saved =
          JSON.parse(
            localStorage.getItem(
              "mamta_wishlist"
            )
          ) || [];

        setWishlist(
          Array.isArray(saved)
            ? saved
            : []
        );
      } catch (error) {
        console.error(
          "SEARCH WISHLIST ERROR:",
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

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedQuery =
      query.trim();

    if (trimmedQuery) {
      setSearchParams({
        q: trimmedQuery,
      });
    } else {
      setSearchParams({});
    }
  };

  /* =========================================================
     FILTER PRODUCTS
  ========================================================= */

  const searchTerm =
    query.trim().toLowerCase();

  const filteredProducts =
    searchTerm === ""
      ? []
      : products.filter((product) => {
          const name =
            product.name?.toLowerCase() || "";

          const category =
            product.category?.toLowerCase() || "";

          const description =
            product.description?.toLowerCase() || "";

          return (
            name.includes(searchTerm) ||
            category.includes(searchTerm) ||
            description.includes(searchTerm)
          );
        });

  /* =========================================================
     WISHLIST
  ========================================================= */

  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) =>
        (item._id || item.id) ===
        productId
    );
  };

  const toggleWishlist = (product) => {
    const productId =
      product._id || product.id;

    try {
      const saved =
        JSON.parse(
          localStorage.getItem(
            "mamta_wishlist"
          )
        ) || [];

      const currentWishlist =
        Array.isArray(saved)
          ? saved
          : [];

      const exists =
        currentWishlist.some(
          (item) =>
            (item._id || item.id) ===
            productId
        );

      const updatedWishlist = exists
        ? currentWishlist.filter(
            (item) =>
              (item._id || item.id) !==
              productId
          )
        : [
            ...currentWishlist,
            product,
          ];

      localStorage.setItem(
        "mamta_wishlist",
        JSON.stringify(
          updatedWishlist
        )
      );

      setWishlist(
        updatedWishlist
      );

      window.dispatchEvent(
        new Event(
          "wishlistUpdated"
        )
      );
    } catch (error) {
      console.error(
        "TOGGLE WISHLIST ERROR:",
        error
      );
    }
  };

  /* =========================================================
     IMAGE
  ========================================================= */

  const getImage = (product) => {
    if (product.image) {
      return product.image;
    }

    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images[0];
    }

    return "https://placehold.co/700x700/F4D9DC/4A3032?text=MAMTA";
  };

  /* =========================================================
     PRICE
  ========================================================= */

  const formatPrice = (price) => {
    return `Rs. ${Number(
      price || 0
    ).toLocaleString()}`;
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <main className="mamta-search-page">

      {/* =====================================================
          SEARCH HERO
      ===================================================== */}

      <section className="search-hero">

        <div className="search-hero-inner">

          <span className="search-eyebrow">
            MAAMTA COLLECTION
          </span>

          <h1>
            Find something
            <span> beautiful.</span>
          </h1>

          <p>
            Search our collection of maternity
            and baby pillows.
          </p>

          {/* SEARCH FORM */}

          <form
            className="search-form"
            onSubmit={handleSearch}
          >

            <SearchIcon
              size={21}
              strokeWidth={1.6}
            />

            <input
              type="text"
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search pillows..."
              autoFocus
            />

            {query && (
              <button
                type="button"
                className="search-clear"
                onClick={() => {
                  setQuery("");
                  setSearchParams({});
                }}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}

            <button
              type="submit"
              className="search-submit"
            >
              Search
            </button>

          </form>

        </div>

      </section>

      {/* =====================================================
          RESULTS
      ===================================================== */}

      <section className="search-results">

        <div className="search-results-container">

          {query.trim() && (
            <div className="search-results-heading">

              <div>

                <span>
                  SEARCH RESULTS
                </span>

                <h2>
                  Results for{" "}
                  <strong>
                    "{query}"
                  </strong>
                </h2>

              </div>

              {!loading && (
                <p>
                  {filteredProducts.length}{" "}
                  product
                  {filteredProducts.length !==
                  1
                    ? "s"
                    : ""}
                </p>
              )}

            </div>
          )}

          {/* LOADING */}

          {loading && (
            <div className="search-message">
              <div className="search-spinner"></div>

              <p>
                Finding your favorites...
              </p>
            </div>
          )}

          {/* EMPTY SEARCH */}

          {!loading &&
            !query.trim() && (
              <div className="search-message search-start">

                <SearchIcon
                  size={42}
                  strokeWidth={1.2}
                />

                <h3>
                  What are you looking for?
                </h3>

                <p>
                  Try searching for maternity
                  pillows, baby pillows or a
                  product name.
                </p>

              </div>
            )}

          {/* NO RESULTS */}

          {!loading &&
            query.trim() &&
            filteredProducts.length === 0 && (
              <div className="search-message">

                <div className="empty-search-icon">
                  <SearchIcon
                    size={34}
                    strokeWidth={1.3}
                  />
                </div>

                <h3>
                  No products found
                </h3>

                <p>
                  We couldn't find anything
                  matching "{query}".
                </p>

                <Link
                  to="/shop"
                  className="search-shop-button"
                >
                  Browse All Products
                  <ArrowUpRight size={16} />
                </Link>

              </div>
            )}

          {/* PRODUCT GRID */}

          {!loading &&
            filteredProducts.length > 0 && (
              <div className="search-product-grid">

                {filteredProducts.map(
                  (product) => {

                    const productId =
                      product._id ||
                      product.id;

                    const liked =
                      isInWishlist(
                        productId
                      );

                    return (
                      <article
                        className="search-product-card"
                        key={productId}
                      >

                        {/* IMAGE */}

                        <div className="search-product-image">

                          <img
                            src={getImage(
                              product
                            )}
                            alt={
                              product.name
                            }
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/700x700/F4D9DC/4A3032?text=MAMTA";
                            }}
                          />

                          {product.category && (
                            <span className="search-product-badge">
                              {product.category}
                            </span>
                          )}

                          {/* WISHLIST */}

                          <button
                            type="button"
                            className={`search-wishlist ${
                              liked
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              toggleWishlist(
                                product
                              )
                            }
                            aria-label={
                              liked
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                            }
                          >

                            <Heart
                              size={18}
                              strokeWidth={1.5}
                              fill={
                                liked
                                  ? "currentColor"
                                  : "none"
                              }
                            />

                          </button>

                          {/* VIEW */}

                          <Link
                            to={`/product/${productId}`}
                            className="search-view-button"
                          >

                            <span>
                              View Details
                            </span>

                            <ArrowUpRight
                              size={15}
                            />

                          </Link>

                        </div>

                        {/* INFO */}

                        <div className="search-product-info">

                          <h3>
                            {product.name}
                          </h3>

                          <div className="search-rating">

                            <div className="search-stars">

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
                              {product.rating ||
                                "5.0"}
                            </span>

                          </div>

                          <div className="search-price">

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
                    );
                  }
                )}

              </div>
            )}

        </div>

      </section>

    </main>
  );
};

export default Search;
