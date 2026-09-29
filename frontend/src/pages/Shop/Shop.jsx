
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Heart,
  ArrowUpRight,
} from "lucide-react";

import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";

import "./Shop.css";

/* =========================================================
   API
========================================================= */

const API_URL = "http://localhost:3000/api";

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  "All",
  "Maternity Pillows",
  "Baby Pillows",
  "Elders Pillows",
];

/* =========================================================
   SHOP COMPONENT
========================================================= */

const Shop = () => {
  const navigate = useNavigate();

  /* =======================================================
     STATES
  ======================================================== */

  const [products, setProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] =
    useState(true);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [sortBy, setSortBy] =
    useState("featured");

  /* =======================================================
     FETCH PRODUCTS
  ======================================================== */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        const endpoint = `${API_URL}/products`;

        console.log(
          "===================================="
        );

        console.log(
          "FETCHING PRODUCTS FROM:",
          endpoint
        );

        console.log(
          "===================================="
        );

        const response = await axios.get(endpoint, {
          timeout: 10000,
        });

        console.log(
          "PRODUCT API RESPONSE:",
          response.data
        );

        /* ---------------------------------------------
           VALIDATE RESPONSE
        --------------------------------------------- */

        if (
          response.data &&
          Array.isArray(response.data.products)
        ) {
          setProducts(response.data.products);
        } else {
          console.error(
            "INVALID PRODUCTS RESPONSE:",
            response.data
          );

          setProducts([]);

          toast.error(
            "Invalid product data received from server."
          );
        }

      } catch (error) {
        console.error(
          "===================================="
        );

        console.error(
          "FETCH PRODUCTS ERROR:",
          error
        );

        console.error(
          "ERROR MESSAGE:",
          error.message
        );

        console.error(
          "ERROR RESPONSE:",
          error.response
        );

        console.error(
          "ERROR REQUEST:",
          error.request
        );

        console.error(
          "===================================="
        );

        /* ---------------------------------------------
           SERVER RESPONSE ERROR
        --------------------------------------------- */

        if (error.response) {
          toast.error(
            error.response.data?.message ||
            `Server error: ${error.response.status}`
          );
        }

        /* ---------------------------------------------
           NETWORK ERROR
        --------------------------------------------- */

        else if (error.request) {
          toast.error(
            "Unable to connect to the server. Make sure the backend is running on port 3000."
          );
        }

        /* ---------------------------------------------
           OTHER ERROR
        --------------------------------------------- */

        else {
          toast.error(
            "Unable to load products."
          );
        }

        setProducts([]);

      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  /* =======================================================
     FILTER + SEARCH + SORT
  ======================================================== */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /* ---------------------------------------------
       CATEGORY
    --------------------------------------------- */

    if (activeCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category === activeCategory
      );
    }

    /* ---------------------------------------------
       SEARCH
    --------------------------------------------- */

    if (searchTerm.trim()) {
      const search = searchTerm
        .toLowerCase()
        .trim();

      result = result.filter(
        (product) =>
          product.name
            ?.toLowerCase()
            .includes(search) ||
          product.category
            ?.toLowerCase()
            .includes(search)
      );
    }

    /* ---------------------------------------------
       SORT
    --------------------------------------------- */

    if (sortBy === "low-high") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    else if (sortBy === "high-low") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    else if (sortBy === "name") {
      result.sort(
        (a, b) =>
          (a.name || "").localeCompare(
            b.name || ""
          )
      );
    }

    return result;

  }, [
    products,
    activeCategory,
    searchTerm,
    sortBy,
  ]);

  /* =======================================================
     PRICE FORMAT
  ======================================================== */

  const formatPrice = (price) => {
    return `Rs. ${Number(
      price || 0
    ).toLocaleString()}`;
  };

  /* =======================================================
     WISHLIST
  ======================================================== */

  const getWishlist = () => {
    try {
      const savedWishlist =
        JSON.parse(
          localStorage.getItem(
            "mamta_wishlist"
          )
        ) || [];

      return Array.isArray(savedWishlist)
        ? savedWishlist
        : [];

    } catch (error) {
      console.error(
        "GET WISHLIST ERROR:",
        error
      );

      return [];
    }
  };

  /* =======================================================
     HANDLE WISHLIST
  ======================================================== */

  const handleWishlist = (product) => {
    if (!product?._id) {
      toast.error(
        "Product information is missing."
      );

      return;
    }

    const currentWishlist =
      getWishlist();

    const alreadyExists =
      currentWishlist.some(
        (item) =>
          (item._id || item.id) ===
          product._id
      );

    /* ---------------------------------------------
       REMOVE
    --------------------------------------------- */

    if (alreadyExists) {
      const updatedWishlist =
        currentWishlist.filter(
          (item) =>
            (item._id || item.id) !==
            product._id
        );

      localStorage.setItem(
        "mamta_wishlist",
        JSON.stringify(
          updatedWishlist
        )
      );

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );

      toast.success(
        `${product.name} removed from wishlist.`
      );

      return;
    }

    /* ---------------------------------------------
       ADD
    --------------------------------------------- */

    const updatedWishlist = [
      ...currentWishlist,
      product,
    ];

    localStorage.setItem(
      "mamta_wishlist",
      JSON.stringify(
        updatedWishlist
      )
    );

    window.dispatchEvent(
      new Event("wishlistUpdated")
    );

    toast.success(
      `${product.name} added to wishlist.`
    );
  };

  /* =======================================================
     CHECK WISHLIST
  ======================================================== */

  const isInWishlist = (productId) => {
    const currentWishlist =
      getWishlist();

    return currentWishlist.some(
      (item) =>
        (item._id || item.id) ===
        productId
    );
  };

  /* =======================================================
     ADD TO CART
  ======================================================== */

  const handleAddToCart = async (
    product
  ) => {

    const token =
      localStorage.getItem(
        "mamta_user_token"
      );

    /* ---------------------------------------------
       LOGIN CHECK
    --------------------------------------------- */

    if (!token) {
      toast.error(
        "Please login before adding items to your cart."
      );

      navigate("/login");

      return;
    }

    /* ---------------------------------------------
       PRODUCT CHECK
    --------------------------------------------- */

    if (!product?._id) {
      toast.error(
        "Product information is missing."
      );

      return;
    }

    /* ---------------------------------------------
       ADD TO CART
    --------------------------------------------- */

    try {

      await axios.post(
        `${API_URL}/cart/add`,

        {
          productId:
            product._id,

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
         CART UPDATE EVENT
      ------------------------------------------- */

      window.dispatchEvent(
        new Event("cartChanged")
      );

      /* -------------------------------------------
         SUCCESS
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
         TOKEN EXPIRED
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
    }
  };

  /* =======================================================
     RESET FILTERS
  ======================================================== */

  const resetFilters = () => {
    setSearchTerm("");

    setActiveCategory(
      "All"
    );

    setSortBy(
      "featured"
    );
  };

  /* =======================================================
     LOADING
  ======================================================== */

  if (loadingProducts) {
    return (
      <main className="mamta-shop-page">

        <section className="shop-loading-section">

          <div className="shop-loading-spinner"></div>

          <p>
            Loading MAMTA collection...
          </p>

        </section>

      </main>
    );
  }

  /* =======================================================
     RETURN
  ======================================================== */

  return (
    <main className="mamta-shop-page">

      {/* ===================================================
          SHOP HERO
      ==================================================== */}

      <section className="shop-hero">

        <div className="shop-hero-glow shop-glow-one"></div>

        <div className="shop-hero-glow shop-glow-two"></div>

        <div className="shop-hero-inner">

          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <ScrollReveal direction="left">

            <div className="shop-hero-content">

              <div className="shop-hero-label">

                <span></span>

                THE MAMTA COLLECTION

              </div>

              <h1>

                Comfort made

                <br />

                <em>
                  with love.
                </em>

              </h1>

              <p>

                Discover thoughtfully crafted pillows
                designed for mothers, little ones,
                and every generation that deserves
                a little more comfort.

              </p>

              <div className="shop-hero-actions">

                <a
                  href="#shop-products"
                  className="shop-hero-btn"
                >

                  Explore Collection

                  <ArrowUpRight
                    size={17}
                  />

                </a>

                <span className="shop-hero-note">

                  Softness • Support • Care

                </span>

              </div>

            </div>

          </ScrollReveal>

          {/* =================================================
              RIGHT VISUAL
          ================================================== */}

          <ScrollReveal direction="right">

            <div className="shop-hero-visual">

              <div className="hero-image-main">

                <img
                  src="https://res.cloudinary.com/iysbraru/image/upload/v1790503813/image12_jpg.jpg"
                  alt="MAMTA comfort collection"
                />

              </div>

              <div className="hero-floating-card">

                <span className="floating-card-small">

                  MAMTA

                </span>

                <strong>

                  Made for

                  <br />

                  gentle moments.

                </strong>

              </div>

              <div className="hero-round-text">

                <span>

                  COMFORT • CARE • MAMTA •

                </span>

              </div>

              <div className="hero-decor-circle"></div>

            </div>

          </ScrollReveal>

        </div>

        {/* =================================================
            HERO BOTTOM
        ================================================== */}

        <div className="shop-hero-bottom">

          <span>
            01
          </span>

          <div></div>

          <span>
            SHOP COLLECTION
          </span>

        </div>

      </section>

      {/* ===================================================
          SHOP CONTENT
      ==================================================== */}

      <section className="shop-container">

        {/* =================================================
            CATEGORY SECTION
        ================================================== */}

        <div className="shop-category-section">

          <ScrollReveal direction="down">

            <div className="category-heading">

              <div>

                <span className="section-eyebrow">

                  EXPLORE COLLECTIONS

                </span>

                <h2>

                  Shop by category

                </h2>

              </div>

              <p>

                Find the comfort made
                especially for you.

              </p>

            </div>

          </ScrollReveal>

          {/* =================================================
              CATEGORY TABS
          ================================================== */}

          <ScrollReveal direction="up">

            <div className="category-tabs">

              {categories.map(
                (category) => (

                  <button
                    key={category}
                    type="button"
                    className={
                      activeCategory ===
                      category
                        ? "category-tab active"
                        : "category-tab"
                    }
                    onClick={() =>
                      setActiveCategory(
                        category
                      )
                    }
                  >

                    {category}

                    {activeCategory ===
                      category && (

                      <span className="active-dot"></span>

                    )}

                  </button>

                )
              )}

            </div>

          </ScrollReveal>

        </div>

        {/* =================================================
            TOOLBAR
        ================================================== */}

        <ScrollReveal direction="up">

          <div className="shop-toolbar">

            {/* RESULTS */}

            <div className="results-count">

              <SlidersHorizontal
                size={16}
              />

              <span>

                {filteredProducts.length}{" "}

                {filteredProducts.length ===
                1
                  ? "product"
                  : "products"}

              </span>

            </div>

            {/* SEARCH */}

            <div className="shop-search">

              <Search
                size={17}
              />

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>

            {/* SORT */}

            <div className="shop-sort">

              <span>
                Sort by
              </span>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
              >

                <option value="featured">
                  Featured
                </option>

                <option value="low-high">
                  Price: Low to High
                </option>

                <option value="high-low">
                  Price: High to Low
                </option>

                <option value="name">
                  Name
                </option>

              </select>

            </div>

          </div>

        </ScrollReveal>

        {/* =================================================
            PRODUCTS
        ================================================== */}

        {filteredProducts.length > 0 ? (

          <div
            id="shop-products"
            className="shop-products-grid"
          >

            {filteredProducts.map(
              (product, index) => (

                <ScrollReveal
                  key={
                    product._id ||
                    product.id ||
                    index
                  }
                  direction="up"
                  className={
                    `stagger-${
                      (index % 6) + 1
                    }`
                  }
                >

                  <article
                    className="shop-product-card"
                  >

                    {/* =================================================
                        PRODUCT IMAGE
                    ================================================== */}

                    <div className="product-image-wrapper">

                      <Link
                        to={`/product/${product._id}`}
                        className="product-image-link"
                      >

                        <img
                          src={
                            product.image ||
                            "https://placehold.co/700x700/F4D9DC/4A3032?text=MAMTA"
                          }
                          alt={
                            product.name ||
                            "MAMTA product"
                          }
                          onError={(e) => {

                            e.currentTarget.src =
                              "https://placehold.co/700x700/F4D9DC/4A3032?text=MAMTA";

                          }}
                        />

                      </Link>

                      {/* WISHLIST */}

                      <button
                        type="button"
                        className={`product-wishlist ${
                          isInWishlist(
                            product._id
                          )
                            ? "wishlist-active"
                            : ""
                        }`}
                        aria-label={
                          isInWishlist(
                            product._id
                          )
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                        onClick={() =>
                          handleWishlist(
                            product
                          )
                        }
                      >

                        <Heart
                          size={17}
                          fill={
                            isInWishlist(
                              product._id
                            )
                              ? "currentColor"
                              : "none"
                          }
                        />

                      </button>

                      {/* CATEGORY */}

                      <span className="product-category">

                        {product.category}

                      </span>

                    </div>

                    {/* =================================================
                        PRODUCT INFO
                    ================================================== */}

                    <div className="product-info">

                      <div className="product-info-top">

                        <div>

                          <span className="product-small-label">

                            MAMTA

                          </span>

                          <h3>

                            {product.name}

                          </h3>

                        </div>

                      </div>

                      {/* =================================================
                          PRICE + ACTIONS
                      ================================================== */}

                      <div className="product-bottom">

                        <strong>

                          {formatPrice(
                            product.price
                          )}

                        </strong>

                        <div className="product-card-actions">

                          {/* DETAILS */}

                          <Link
                            to={`/product/${product._id}`}
                            className="view-details-button"
                          >

                            <span>
                              Details
                            </span>

                            <ArrowUpRight
                              size={15}
                            />

                          </Link>

                          {/* ADD TO CART */}

                          <button
                            type="button"
                            className="add-cart-button"
                            onClick={() =>
                              handleAddToCart(
                                product
                              )
                            }
                          >

                            <ShoppingBag
                              size={16}
                            />

                            <span>
                              Add
                            </span>

                          </button>

                        </div>

                      </div>

                    </div>

                  </article>

                </ScrollReveal>

              )
            )}

          </div>

        ) : (

          /* =================================================
             NO PRODUCTS
          ================================================== */

          <ScrollReveal direction="up">

            <div className="no-products">

              <div className="no-products-icon">

                <Search
                  size={25}
                />

              </div>

              <h3>

                No products found

              </h3>

              <p>

                Try another search or
                choose a different category.

              </p>

              <button
                type="button"
                onClick={resetFilters}
              >

                View all products

                <ArrowUpRight
                  size={16}
                />

              </button>

            </div>

          </ScrollReveal>

        )}

      </section>

    </main>
  );
};

export default Shop;
