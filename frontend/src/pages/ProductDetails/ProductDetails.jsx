import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
} from "lucide-react";

import "./ProductDetails.css";

/* =========================================================
   MAMTA PRODUCTS
========================================================= */

const products = [
  {
    id: 1,
    name: "Cloud Comfort Maternity Pillow",
    category: "Maternity Pillows",
    price: 4990,
    oldPrice: 5790,
    image: "/products/maternity-pillow-1.jpg",
    description:
      "A soft and supportive maternity pillow designed to bring extra comfort during pregnancy and restful moments.",
    features: [
      "Soft supportive filling",
      "Comfortable body support",
      "Premium soft-touch cover",
      "Designed for everyday comfort",
    ],
  },

  {
    id: 2,
    name: "Mum's Embrace Pregnancy Pillow",
    category: "Maternity Pillows",
    price: 5490,
    oldPrice: 6290,
    image: "/products/maternity-pillow-2.jpg",
    description:
      "Thoughtfully designed for mothers who deserve gentle support and comfort throughout the day and night.",
    features: [
      "Full-body support",
      "Soft premium filling",
      "Comfort-focused design",
      "Easy everyday use",
    ],
  },

  {
    id: 3,
    name: "Soft Nest Baby Pillow",
    category: "Baby Pillows",
    price: 2490,
    oldPrice: 2990,
    image: "/products/baby-pillow-1.jpg",
    description:
      "A soft and cozy pillow made for little ones, bringing gentle comfort to their everyday rest.",
    features: [
      "Soft-touch fabric",
      "Lightweight construction",
      "Gentle comfort",
      "Easy to maintain",
    ],
  },

  {
    id: 4,
    name: "Little Cloud Baby Pillow",
    category: "Baby Pillows",
    price: 2190,
    oldPrice: 2690,
    image: "/products/baby-pillow-2.jpg",
    description:
      "A delicate and comfortable baby pillow designed with softness and everyday coziness in mind.",
    features: [
      "Soft and cozy feel",
      "Lightweight design",
      "Comfortable filling",
      "Made for little ones",
    ],
  },

  {
    id: 5,
    name: "Gentle Sleep Baby Pillow",
    category: "Baby Pillows",
    price: 2690,
    oldPrice: 3190,
    image: "/products/baby-pillow-3.jpg",
    description:
      "A gentle comfort pillow created for peaceful and cozy rest for your little one.",
    features: [
      "Gentle soft filling",
      "Comfortable shape",
      "Premium fabric",
      "Everyday comfort",
    ],
  },

  {
    id: 6,
    name: "Grand Comfort Pillow",
    category: "Elders Pillows",
    price: 3490,
    oldPrice: 3990,
    image: "/products/elder-pillow-1.jpg",
    description:
      "A thoughtfully crafted comfort pillow designed to provide gentle everyday support.",
    features: [
      "Supportive filling",
      "Soft premium cover",
      "Comfort-focused shape",
      "Suitable for everyday use",
    ],
  },

  {
    id: 7,
    name: "Relax & Rest Support Pillow",
    category: "Elders Pillows",
    price: 3790,
    oldPrice: 4290,
    image: "/products/elder-pillow-2.jpg",
    description:
      "A comfortable support pillow created for relaxed and restful everyday moments.",
    features: [
      "Supportive construction",
      "Soft-touch fabric",
      "Comfortable design",
      "Long-lasting everyday use",
    ],
  },

  {
    id: 8,
    name: "Heritage Comfort Pillow",
    category: "Elders Pillows",
    price: 3290,
    oldPrice: 3790,
    image: "/products/elder-pillow-3.jpg",
    description:
      "Classic comfort with a soft MAMTA touch, created for peaceful everyday rest.",
    features: [
      "Classic comfort",
      "Soft premium filling",
      "Gentle support",
      "Made for everyday relaxation",
    ],
  },
];

/* =========================================================
   PRODUCT DETAILS
========================================================= */

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  /* =======================================================
     PRODUCT NOT FOUND
  ======================================================== */

  if (!product) {
    return (
      <main className="product-details-page">
        <section className="product-not-found">
          <div className="product-not-found-icon">
            <ShoppingBag size={32} />
          </div>

          <span>MAMTA COLLECTION</span>

          <h1>Product not found</h1>

          <p>
            The product you are looking for could not be found.
          </p>

          <Link to="/shop" className="back-shop-button">
            <ArrowLeft size={17} />
            BACK TO SHOP
          </Link>
        </section>
      </main>
    );
  }

  /* =======================================================
     PRICE
  ======================================================== */

  const formatPrice = (price) => {
    return `Rs. ${Number(price).toLocaleString()}`;
  };

  /* =======================================================
     ADD TO CART
  ======================================================== */

  const handleAddToCart = async () => {
    const token = localStorage.getItem("mamta_user_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAdding(true);

      await axios.post(
        "http://localhost:3000/api/cart/add",
        {
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.dispatchEvent(new Event("cartChanged"));

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error) {
      console.error("PRODUCT ADD TO CART ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("mamta_user_token");
        localStorage.removeItem("mamta_user");

        window.dispatchEvent(new Event("authChanged"));

        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to add product to cart."
      );
    } finally {
      setAdding(false);
    }
  };

  /* =======================================================
     QUANTITY
  ======================================================== */

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  /* =======================================================
     RETURN
  ======================================================== */

  return (
    <main className="product-details-page">

      {/* ===================================================
          BREADCRUMB
      ==================================================== */}

      <div className="product-breadcrumb">
        <Link to="/">Home</Link>

        <span>/</span>

        <Link to="/shop">Shop</Link>

        <span>/</span>

        <span>{product.name}</span>
      </div>


      {/* ===================================================
          PRODUCT MAIN
      ==================================================== */}

      <section className="product-details-container">

        {/* =================================================
            IMAGE
        ================================================== */}

        <div className="product-details-image-section">

          <div className="product-details-image">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/900x900/F4D9DC/4A3032?text=MAMTA";
              }}
            />
          </div>

          <div className="image-caption">
            <span>MAMTA</span>

            <span>
              COMFORT • CARE • LOVE
            </span>
          </div>

        </div>


        {/* =================================================
            INFORMATION
        ================================================== */}

        <div className="product-details-info">

          <span className="product-details-category">
            {product.category}
          </span>

          <h1>{product.name}</h1>

          {/* RATING */}

          <div className="product-rating">

            <span className="stars">
              ★★★★★
            </span>

            <span>4.9</span>

            <span className="rating-divider">
              |
            </span>

            <span>
              MAMTA COLLECTION
            </span>

          </div>


          {/* PRICE */}

          <div className="product-details-price">

            <strong>
              {formatPrice(product.price)}
            </strong>

            {product.oldPrice && (
              <del>
                {formatPrice(product.oldPrice)}
              </del>
            )}

            {product.oldPrice && (
              <span className="sale-badge">
                SALE
              </span>
            )}

          </div>


          {/* DESCRIPTION */}

          <p className="product-description">
            {product.description}
            <h3>Delievery : 3-4 working days</h3>
          </p>


          {/* DIVIDER */}

          <div className="product-divider"></div>


          {/* QUANTITY */}

          <div className="product-quantity-section">

            <span>
              QUANTITY
            </span>

            <div className="product-quantity-control">

              <button
                type="button"
                onClick={decreaseQuantity}
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>

              <strong>
                {quantity}
              </strong>

              <button
                type="button"
                onClick={increaseQuantity}
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>

            </div>

          </div>


          {/* ACTIONS */}

          <div className="product-details-actions">

            <button
              type="button"
              className={
                added
                  ? "details-add-cart added"
                  : "details-add-cart"
              }
              onClick={handleAddToCart}
              disabled={adding}
            >

              {added ? (
                <>
                  <Check size={19} />
                  ADDED TO CART
                </>
              ) : (
                <>
                  <ShoppingBag size={19} />

                  {adding
                    ? "ADDING..."
                    : "ADD TO CART"}
                </>
              )}

            </button>


            <button
              type="button"
              className="details-wishlist"
              aria-label="Add to wishlist"
            >
              <Heart size={20} />
            </button>

          </div>


          {/* CHECKOUT */}

          <Link
            to="/cart"
            className="view-cart-button"
          >
            VIEW CART

            <ArrowRight size={17} />
          </Link>


          {/* =================================================
              BENEFITS
          ================================================== */}

          <div className="product-benefits">

            {/* DELIVERY */}

            <div className="benefit-item">

              <div className="benefit-icon">
                <Truck size={19} />
              </div>

              <div>
                <strong>
                  Delivery Time
                </strong>

                <span>
                  3–4 working days
                </span>
              </div>

            </div>


            {/* QUALITY */}

            <div className="benefit-item">

              <div className="benefit-icon">
                <ShieldCheck size={19} />
              </div>

              <div>
                <strong>
                  MAMTA Quality
                </strong>

                <span>
                  Made with comfort in mind
                </span>
              </div>

            </div>


            {/* CUSTOMER CARE */}

            <div className="benefit-item">

              <div className="benefit-icon">
                <RotateCcw size={19} />
              </div>

              <div>
                <strong>
                  Customer Care
                </strong>

                <span>
                  We're here to help
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          PRODUCT FEATURES
      ==================================================== */}

      <section className="product-features-section">

        <div className="product-features-inner">

          <div className="features-heading">

            <span>
              WHY MAMTA
            </span>

            <h2>
              Made for moments
              <em> that matter.</em>
            </h2>

          </div>


          <div className="features-content">

            <p>
              Every MAMTA product is thoughtfully
              selected with comfort, softness and
              everyday care in mind.
            </p>


            <div className="feature-list">

              {product.features.map(
                (feature, index) => (

                  <div
                    className="feature-item"
                    key={index}
                  >

                    <Check size={16} />

                    <span>
                      {feature}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================
          BACK TO SHOP
      ==================================================== */}

      <div className="product-back-shop">

        <Link to="/shop">

          <ArrowLeft size={17} />

          BACK TO ALL PRODUCTS

        </Link>

      </div>

    </main>
  );
};

export default ProductDetails;