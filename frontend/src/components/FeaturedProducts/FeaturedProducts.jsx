import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Heart,
  ArrowUpRight,
  Star,
} from "lucide-react";

import ScrollReveal from "../ScrollReveal/ScrollReveal";
import "./FeaturedProducts.css";


/* =========================================================
   API
========================================================= */

const API_URL = "http://localhost:3000/api";


/* =========================================================
   FORMAT PRICE
========================================================= */

const formatPrice = (price) => {
  return `Rs. ${Number(price || 0).toLocaleString()}`;
};


/* =========================================================
   FEATURED PRODUCTS
========================================================= */

const FeaturedProducts = () => {

  const [products, setProducts] = useState([]);

  const [wishlist, setWishlist] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  /* =======================================================
     LOAD PRODUCTS FROM BACKEND
  ======================================================== */

  useEffect(() => {

    const loadProducts = async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(
            `${API_URL}/products`
          );

        console.log(
          "FEATURED PRODUCTS:",
          response.data
        );


        /*
         * Depending on your backend response,
         * products may be inside:
         *
         * response.data.products
         *
         * or directly response.data
         */

        const backendProducts =
          Array.isArray(
            response.data?.products
          )
            ? response.data.products
            : Array.isArray(
                response.data
              )
            ? response.data
            : [];


        /*
         * Only show first 4 products
         * in Featured Products.
         */

        setProducts(
          backendProducts.slice(0, 4)
        );

      } catch (error) {

        console.error(
          "FEATURED PRODUCTS LOAD ERROR:",
          error
        );

        setProducts([]);

      } finally {

        setLoading(false);

      }

    };


    loadProducts();

  }, []);


  /* =======================================================
     LOAD USER-SPECIFIC WISHLIST
  ======================================================== */

  useEffect(() => {

    const loadWishlist = () => {

      try {

        const user =
          JSON.parse(
            localStorage.getItem(
              "mamta_user"
            )
          );


        const userId =
          user?._id ||
          user?.id ||
          user?.email;


        const wishlistKey =
          userId
            ? `mamta_wishlist_${userId}`
            : null;


        if (!wishlistKey) {

          setWishlist([]);

          return;

        }


        const savedWishlist =
          JSON.parse(
            localStorage.getItem(
              wishlistKey
            )
          ) || [];


        setWishlist(
          Array.isArray(
            savedWishlist
          )
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
     GET PRODUCT ID
  ======================================================== */

  const getProductId = (product) => {

    return (
      product?._id ||
      product?.id
    );

  };


  /* =======================================================
     GET PRODUCT IMAGE
  ======================================================== */

  const getProductImage = (product) => {

    return (
      product?.image ||
      product?.images?.[0] ||
      "/products/maternity-pillow-1.jpg"
    );

  };


  /* =======================================================
     GET PRODUCT CATEGORY
  ======================================================== */

  const getProductCategory = (
    product
  ) => {

    return (
      product?.category ||
      "MAMTA COLLECTION"
    );

  };


  /* =======================================================
     CHECK WISHLIST
  ======================================================== */

  const isInWishlist = (
    productId
  ) => {

    return wishlist.some(
      (item) =>
        String(
          item?._id ||
          item?.id
        ) ===
        String(productId)
    );

  };


  /* =======================================================
     TOGGLE WISHLIST
  ======================================================== */

  const toggleWishlist = (
    product
  ) => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem(
            "mamta_user"
          )
        );


      const userId =
        user?._id ||
        user?.id ||
        user?.email;


      if (!userId) {

        return;

      }


      const wishlistKey =
        `mamta_wishlist_${userId}`;


      const currentWishlist =
        JSON.parse(
          localStorage.getItem(
            wishlistKey
          )
        ) || [];


      const productId =
        getProductId(product);


      const exists =
        currentWishlist.some(
          (item) =>
            String(
              item?._id ||
              item?.id
            ) ===
            String(productId)
        );


      let updatedWishlist;


      if (exists) {

        updatedWishlist =
          currentWishlist.filter(
            (item) =>
              String(
                item?._id ||
                item?.id
              ) !==
              String(productId)
          );

      } else {

        updatedWishlist = [
          ...currentWishlist,
          product,
        ];

      }


      localStorage.setItem(
        wishlistKey,
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
        "FEATURED WISHLIST UPDATE ERROR:",
        error
      );

    }

  };


  /* =======================================================
     LOADING
  ======================================================== */

  if (loading) {

    return (
      <section className="featured-products">

        <div className="featured-container">

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

          </div>

        </div>

      </section>
    );

  }


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
                Discover thoughtfully designed
                pillows made to bring softness,
                comfort and care into everyday
                moments.
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

              const productId =
                getProductId(
                  product
                );


              const productInWishlist =
                isInWishlist(
                  productId
                );


              return (

                <ScrollReveal
                  key={productId}
                  direction="up"
                  className={`stagger-${
                    index + 1
                  }`}
                >

                  <article
                    className="product-card"
                  >


                    {/* =================================================
                        PRODUCT IMAGE
                    ================================================= */}

                    <div className="product-image">

                      <img
                        src={
                          getProductImage(
                            product
                          )
                        }
                        alt={
                          product.name
                        }

                        onError={(e) => {

                          e.currentTarget.src =
                            "https://placehold.co/900x900/F4D9DC/4A3032?text=MAMTA";

                        }}

                      />


                      {/* CATEGORY */}

                      <span className="product-badge">

                        {
                          getProductCategory(
                            product
                          )
                        }

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
                          toggleWishlist(
                            product
                          )
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


                      {/* =================================================
                          QUICK VIEW
                      ================================================= */}

                      <Link
                        to={`/product/${productId}`}
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
                        {
                          product.name
                        }
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
                          {
                            product.rating ||
                            "4.9"
                          }
                        </span>

                      </div>


                      {/* PRICE */}

                      <div className="product-price">

                        <strong>
                          {
                            formatPrice(
                              product.price
                            )
                          }
                        </strong>


                        {
                          product.oldPrice && (

                            <del>
                              {
                                formatPrice(
                                  product.oldPrice
                                )
                              }
                            </del>

                          )
                        }

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