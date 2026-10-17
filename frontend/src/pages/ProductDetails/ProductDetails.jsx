console.log("🔥🔥🔥 PRODUCT DETAILS TEST 🔥🔥🔥");

import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import ProductReviews from "../../components/ProductReviews";
import axios from "axios";
import toast from "react-hot-toast";

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

console.log("🔥 CUSTOMER PRODUCT DETAILS FILE LOADED");

/* =========================================================
   API
========================================================= */

const API_URL = "http://localhost:3000/api";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/900x900/F4D9DC/4A3032?text=MAMTA";

const THUMBNAIL_PLACEHOLDER =
  "https://placehold.co/200x200/F4D9DC/4A3032?text=MAMTA";

/* =========================================================
   COLOR MAP
========================================================= */

const COLOR_MAP = {
  pink: "#F4A6B8",
  "blush-pink": "#E8A0A8",
  "dusty-rose": "#C98B91",
  rose: "#D96C7B",
  mauve: "#B7848C",

  lavender: "#B8A1D9",
  purple: "#8B5CF6",
  lilac: "#C8A2E8",

  blue: "#6FA8DC",
  "baby-blue": "#A7D8F0",
  "sky-blue": "#87CEEB",
  "navy-blue": "#243B53",
  "royal-blue": "#4169E1",

  teal: "#4DB6AC",
  mint: "#A8D5BA",
  green: "#6FAF7B",
  "sage-green": "#A3B18A",
  olive: "#808000",

  cream: "#FFF1D0",
  ivory: "#FFFFF0",
  white: "#FFFFFF",
  "off-white": "#F8F5F0",

  beige: "#D8C3A5",
  nude: "#D8A98B",
  camel: "#C19A6B",

  brown: "#8B5E3C",
  chocolate: "#5C4033",

  grey: "#9E9E9E",
  "light-grey": "#D3D3D3",
  charcoal: "#36454F",
  black: "#111111",

  yellow: "#F4D35E",
  mustard: "#D4A017",
  orange: "#F28C28",
  peach: "#FFCBA4",
  coral: "#FF7F7F",

  red: "#D71920",
  maroon: "#800000",
  wine: "#722F37",
  burgundy: "#800020",

  turquoise: "#40E0D0",
  "sea-green": "#2E8B57",
  "peacock-blue": "#007C91",
  denim: "#1560BD",

  terracotta: "#C76B4A",
  khaki: "#C3B091",
};

/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const normalizeImage = (image) => {
  if (typeof image === "string") {
    return image.trim();
  }

  if (
    typeof image === "object" &&
    image !== null
  ) {
    const url =
      image.url ||
      image.image ||
      image.src ||
      "";

    return typeof url === "string"
      ? url.trim()
      : "";
  }

  return "";
};

/* =========================================================
   COLOR VALUE
========================================================= */

const getColorValue = (color) => {
  if (!color) {
    return "";
  }

  if (typeof color === "object") {
    return (
      color.value ||
      color.name ||
      color.colorName ||
      color.label ||
      ""
    );
  }

  return String(color);
};

/* =========================================================
   COLOR NAME
========================================================= */

const getColorName = (color) => {
  if (!color) {
    return "";
  }

  if (typeof color === "object") {
    return (
      color.name ||
      color.colorName ||
      color.label ||
      color.value ||
      ""
    );
  }

  return String(color);
};

/* =========================================================
   COLOR CODE
========================================================= */

const getColorCode = (color) => {
  if (!color) {
    return "#d8c4c7";
  }

  if (typeof color === "object") {
    return (
      color.code ||
      color.colorCode ||
      color.hex ||
      "#d8c4c7"
    );
  }

  const normalized = String(color)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  return (
    COLOR_MAP[normalized] ||
    "#d8c4c7"
  );
};

/* =========================================================
   PRODUCT COLORS
========================================================= */

const getProductColors = (product) => {
  if (!product) {
    return [];
  }

  if (Array.isArray(product.colors)) {
    return product.colors.slice(0, 10);
  }

  return [];
};

/* =========================================================
   COLOR IMAGES
========================================================= */

const getColorImages = (color) => {
  if (!color || typeof color !== "object") {
    return [];
  }

  const images = [];

  /* SINGLE COLOR IMAGE */

  if (
    typeof color.image === "string" &&
    color.image.trim()
  ) {
    images.push(
      color.image.trim()
    );
  }

  /* COLOR IMAGE ARRAY */

  if (Array.isArray(color.images)) {
    color.images.forEach((image) => {
      const imageUrl =
        normalizeImage(image);

      if (
        imageUrl &&
        !images.includes(imageUrl)
      ) {
        images.push(imageUrl);
      }
    });
  }

  return [
    ...new Set(
      images.filter(Boolean)
    ),
  ].slice(0, 10);
};

/* =========================================================
   NORMAL PRODUCT SLIDER IMAGES

   Main image + additional images

   Example:
   product.image
   product.images[0]
   product.images[1]
   product.images[2]
   product.images[3]

   = automatic slider

   These are NOT side thumbnails.
========================================================= */

const getProductSliderImages = (product) => {
  if (!product) {
    return [];
  }

  const images = [];

  /* MAIN IMAGE FIRST */

  const mainImage =
    normalizeImage(
      product.image
    );

  if (mainImage) {
    images.push(mainImage);
  }

  /* ADDITIONAL IMAGES */

  if (Array.isArray(product.images)) {
    product.images.forEach((image) => {
      const imageUrl =
        normalizeImage(image);

      if (
        imageUrl &&
        !images.includes(imageUrl)
      ) {
        images.push(imageUrl);
      }
    });
  }

  /*
     MAIN IMAGE + MAX 4 ADDITIONAL
     = MAX 5 SLIDER IMAGES
  */

  return [
    ...new Set(images),
  ].slice(0, 5);
};

/* =========================================================
   PRODUCT DETAILS
========================================================= */

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* =======================================================
     STATES
  ======================================================== */

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const [wishlist, setWishlist] = useState(false);

  const [selectedColor, setSelectedColor] =
    useState("");

  const [selectedImage, setSelectedImage] =
    useState("");

  const [currentImageIndex, setCurrentImageIndex] =
    useState(0);

  /*
     TRUE = user is viewing a
     color-specific image.

     Normal product slider pauses.
  */

  const [isColorImageSelected, setIsColorImageSelected] =
    useState(false);

  /* =======================================================
     FETCH PRODUCT
  ======================================================== */

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        console.log(
          "===================================="
        );

        console.log(
          "FETCHING PRODUCT:",
          `${API_URL}/products/${id}`
        );

        console.log(
          "===================================="
        );

        const response = await axios.get(
          `${API_URL}/products/${id}`,
          {
            timeout: 10000,
          }
        );

        console.log(
          "PRODUCT DETAILS RESPONSE:",
          response.data
        );

        const productData =
          response.data?.product ||
          response.data;

        console.log(
          "🔥 PRODUCT DATA:",
          productData
        );

        console.log(
          "🎨 PRODUCT COLORS:",
          productData?.colors
        );

        console.log(
          "🖼️ ADDITIONAL IMAGES:",
          productData?.images
        );

        if (productData?._id) {
          setProduct(productData);
        } else {
          setProduct(null);

          toast.error(
            "Product not found."
          );
        }
      } catch (error) {
        console.error(
          "PRODUCT DETAILS ERROR:",
          error
        );

        console.error(
          "ERROR RESPONSE:",
          error.response
        );

        setProduct(null);

        if (
          error.response?.status === 404
        ) {
          toast.error(
            "Product not found."
          );
        } else if (error.request) {
          toast.error(
            "Unable to connect to the server."
          );
        } else {
          toast.error(
            "Unable to load product."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  /* =======================================================
     DERIVED PRODUCT DATA

     These are normal calculated values instead of useMemo.

     This removes the exhaustive-deps errors caused by
     getProductColors being recreated on every render.
  ======================================================== */

  const productColors =
    getProductColors(product);

  const productImages =
    getProductSliderImages(product);

  const mainProductImage =
    normalizeImage(
      product?.image
    );

  /* =======================================================
     COLOR GALLERY

     ONLY color-specific images appear
     as side thumbnails.

     Normal additional images DO NOT
     appear here.
  ======================================================== */

  const colorGallery = product
    ? productColors
        .map((color) => {
          const images =
            getColorImages(color);

          if (images.length === 0) {
            return null;
          }

          /*
             Do not duplicate main product
             image inside color gallery.
          */

          const uniqueColorImages =
            images.filter(
              (image) =>
                image !==
                mainProductImage
            );

          if (
            uniqueColorImages.length === 0
          ) {
            return null;
          }

          return {
            color,
            image:
              uniqueColorImages[0],
            images:
              uniqueColorImages,
            value:
              getColorValue(color),
            name:
              getColorName(color),
          };
        })
        .filter(Boolean)
        .slice(0, 10)
    : [];

  /* =======================================================
     ACTIVE COLOR
  ======================================================== */

  const activeColor =
    productColors.find(
      (color) => {
        const value =
          getColorValue(color);

        const name =
          getColorName(color);

        return (
          value === selectedColor ||
          name === selectedColor
        );
      }
    );

  /* =======================================================
     DEFAULT IMAGE WHEN PRODUCT LOADS

     IMPORTANT:
     State updates are inside setTimeout,
     not directly inside the effect body.

     This removes:
     react-hooks/set-state-in-effect
  ======================================================== */

  useEffect(() => {
    if (!product) {
      return;
    }

    const firstImage =
      getProductSliderImages(
        product
      )[0] ||
      normalizeImage(
        product.image
      ) ||
      "";

    const colors =
      getProductColors(product);

    const firstColor =
      colors[0];

    const firstColorValue =
      firstColor
        ? getColorValue(
            firstColor
          )
        : "";

    const timeoutId =
      setTimeout(() => {
        setSelectedImage(
          firstImage
        );

        setCurrentImageIndex(0);

        setIsColorImageSelected(
          false
        );

        if (firstColorValue) {
          setSelectedColor(
            firstColorValue
          );
        } else {
          setSelectedColor("");
        }
      }, 0);

    return () => {
      clearTimeout(
        timeoutId
      );
    };
  }, [product]);

  /* =======================================================
     AUTOMATIC IMAGE SLIDER

     Main image + additional images
     automatically change every 3 seconds.
  ======================================================== */

  useEffect(() => {
    if (!product) {
      return;
    }

    const images =
      getProductSliderImages(
        product
      );

    if (images.length <= 1) {
      return;
    }

    /*
       Color-specific image selected:
       pause normal slider.
    */

    if (isColorImageSelected) {
      return;
    }

    console.log(
      "🎞️ AUTOMATIC IMAGE SLIDER STARTED"
    );

    const intervalId =
      setInterval(() => {
        setCurrentImageIndex(
          (previousIndex) => {
            const nextIndex =
              (previousIndex + 1) %
              images.length;

            setSelectedImage(
              images[nextIndex]
            );

            console.log(
              "🎞️ AUTO SLIDE:",
              nextIndex + 1,
              "/",
              images.length
            );

            return nextIndex;
          }
        );
      }, 3000);

    return () => {
      clearInterval(
        intervalId
      );

      console.log(
        "🎞️ AUTOMATIC IMAGE SLIDER STOPPED"
      );
    };
  }, [
    product,
    isColorImageSelected,
  ]);

  /* =======================================================
     WISHLIST CHECK
  ======================================================== */

  useEffect(() => {
    if (!product?._id) {
      return;
    }

    let exists = false;

    try {
      const savedWishlist =
        JSON.parse(
          localStorage.getItem(
            "mamta_wishlist"
          )
        ) || [];

      exists =
        Array.isArray(
          savedWishlist
        ) &&
        savedWishlist.some(
          (item) =>
            (item._id ||
              item.id) ===
            product._id
        );
    } catch (error) {
      console.error(
        "CHECK WISHLIST ERROR:",
        error
      );

      exists = false;
    }

    const timeoutId =
      setTimeout(() => {
        setWishlist(exists);
      }, 0);

    return () => {
      clearTimeout(
        timeoutId
      );
    };
  }, [product]);

  /* =======================================================
     WHATSAPP
  ======================================================== */

  const handleWhatsApp = () => {
    if (!product) {
      return;
    }

    const phoneNumber =
      "923431516875";

    const currentActiveColor =
      activeColor;

    const colorText =
      currentActiveColor
        ? `Color: ${getColorName(
            currentActiveColor
          )}`
        : "";

    const message =
      encodeURIComponent(
        `Hello MAAMTA,

I am interested in this product:

Product: ${product.name}
Price: Rs. ${Number(
          product.price || 0
        ).toLocaleString()}
Quantity: ${quantity}
${colorText}

I would like to know more about this product.`
      );

    window.open(
      `https://wa.me/${phoneNumber}?text=${message}`,
      "_blank"
    );
  };

  /* =======================================================
     LOADING
  ======================================================== */

  if (loading) {
    return (
      <main className="product-details-page">

        <section className="product-not-found">

          <div className="product-not-found-icon">
            <ShoppingBag size={32} />
          </div>

          <span>
            MAAMTA COLLECTION
          </span>

          <h1>
            Loading product...
          </h1>

          <p>
            Please wait while we load
            the product details.
          </p>

        </section>

      </main>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================== */

  if (!product) {
    return (
      <main className="product-details-page">

        <section className="product-not-found">

          <div className="product-not-found-icon">
            <ShoppingBag size={32} />
          </div>

          <span>
            MAAMTA COLLECTION
          </span>

          <h1>
            Product not found
          </h1>

          <p>
            The product you are looking
            for could not be found.
          </p>

          <Link
            to="/shop"
            className="back-shop-button"
          >
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
    return `Rs. ${Number(
      price || 0
    ).toLocaleString()}`;
  };

  /* =======================================================
     CHANGE COLOR
  ======================================================== */

  const handleColorChange = (
    color
  ) => {
    const colorValue =
      getColorValue(color);

    const colorName =
      getColorName(color);

    const colorImages =
      getColorImages(color);

    console.log(
      "===================================="
    );

    console.log(
      "🎨 COLOR CHANGED"
    );

    console.log(
      "NAME:",
      colorName
    );

    console.log(
      "VALUE:",
      colorValue
    );

    console.log(
      "IMAGE COUNT:",
      colorImages.length
    );

    console.log(
      "IMAGES:",
      colorImages
    );

    console.log(
      "===================================="
    );

    setSelectedColor(
      colorValue
    );

    /*
       Color has its own image.
       Pause normal slider.
    */

    if (
      colorImages.length > 0
    ) {
      setIsColorImageSelected(
        true
      );

      setSelectedImage(
        colorImages[0]
      );

      return;
    }

    /*
       No color-specific image.

       Return to normal product
       image slider.
    */

    setIsColorImageSelected(
      false
    );

    setCurrentImageIndex(0);

    setSelectedImage(
      productImages[0] ||
        mainProductImage ||
        ""
    );
  };

  /* =======================================================
     CHANGE COLOR FROM IMAGE
  ======================================================== */

  const handleColorImageClick = (
    color
  ) => {
    const colorValue =
      getColorValue(color);

    const colorImages =
      getColorImages(color);

    setSelectedColor(
      colorValue
    );

    if (
      colorImages.length > 0
    ) {
      setIsColorImageSelected(
        true
      );

      setSelectedImage(
        colorImages[0]
      );

      return;
    }

    setIsColorImageSelected(
      false
    );

    setCurrentImageIndex(0);

    setSelectedImage(
      productImages[0] ||
        mainProductImage ||
        ""
    );
  };

  /* =======================================================
     CHANGE NORMAL PRODUCT IMAGE

     Used by slider dots.

     Additional images are NOT shown
     as side thumbnails.
  ======================================================== */

  const handleImageChange = (
    image
  ) => {
    const imageIndex =
      productImages.findIndex(
        (item) =>
          item === image
      );

    if (
      imageIndex >= 0
    ) {
      setCurrentImageIndex(
        imageIndex
      );

      setIsColorImageSelected(
        false
      );
    }

    setSelectedImage(
      image
    );
  };

  /* =======================================================
     PREVIOUS IMAGE
  ======================================================== */

  const handlePreviousImage = () => {
    if (
      productImages.length <= 1
    ) {
      return;
    }

    setIsColorImageSelected(
      false
    );

    setCurrentImageIndex(
      (previousIndex) => {
        const nextIndex =
          previousIndex === 0
            ? productImages.length - 1
            : previousIndex - 1;

        setSelectedImage(
          productImages[
            nextIndex
          ]
        );

        return nextIndex;
      }
    );
  };

  /* =======================================================
     NEXT IMAGE
  ======================================================== */

  const handleNextImage = () => {
    if (
      productImages.length <= 1
    ) {
      return;
    }

    setIsColorImageSelected(
      false
    );

    setCurrentImageIndex(
      (previousIndex) => {
        const nextIndex =
          (previousIndex + 1) %
          productImages.length;

        setSelectedImage(
          productImages[
            nextIndex
          ]
        );

        return nextIndex;
      }
    );
  };

  /* =======================================================
     WISHLIST
  ======================================================== */

  const handleWishlist = () => {
    if (!product?._id) {
      return;
    }

    try {
      const savedWishlist =
        JSON.parse(
          localStorage.getItem(
            "mamta_wishlist"
          )
        ) || [];

      const currentWishlist =
        Array.isArray(
          savedWishlist
        )
          ? savedWishlist
          : [];

      const alreadyExists =
        currentWishlist.some(
          (item) =>
            (item._id ||
              item.id) ===
            product._id
        );

      let updatedWishlist;

      if (
        alreadyExists
      ) {
        updatedWishlist =
          currentWishlist.filter(
            (item) =>
              (item._id ||
                item.id) !==
              product._id
          );

        setWishlist(false);

        toast.success(
          `${product.name} removed from wishlist.`
        );
      } else {
        updatedWishlist = [
          ...currentWishlist,
          product,
        ];

        setWishlist(true);

        toast.success(
          `${product.name} added to wishlist.`
        );
      }

      localStorage.setItem(
        "mamta_wishlist",
        JSON.stringify(
          updatedWishlist
        )
      );

      window.dispatchEvent(
        new Event(
          "wishlistUpdated"
        )
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
     ADD TO CART
  ======================================================== */

  const handleAddToCart =
    async () => {
      const token =
        localStorage.getItem(
          "mamta_user_token"
        );

      /* LOGIN CHECK */

      if (!token) {
        toast.error(
          "Please login before adding items to your cart."
        );

        navigate("/login");

        return;
      }

      /* PRODUCT CHECK */

      if (!product?._id) {
        toast.error(
          "Product information is missing."
        );

        return;
      }

      /* ACTIVE COLOR */

      const currentActiveColor =
        activeColor;

      const selectedColorName =
        currentActiveColor
          ? getColorName(
              currentActiveColor
            )
          : "";

      /* COLOR REQUIRED */

      if (
        productColors.length > 0 &&
        !selectedColorName
      ) {
        toast.error(
          "Please select a color."
        );

        return;
      }

      try {
        setAdding(true);

        /* COLOR IMAGE */

        const activeColorImages =
          currentActiveColor
            ? getColorImages(
                currentActiveColor
              )
            : [];

        /* CART IMAGE */

        const cartImage =
          activeColorImages.length >
          0
            ? activeColorImages[0]
            : mainProductImage;

        /* CART DATA */

        const cartData = {
          productId:
            product._id,

          name:
            product.name,

          image:
            cartImage,

          price:
            Number(
              product.price || 0
            ),

          quantity:
            Number(quantity),

          color:
            selectedColorName,
        };

        console.log(
          "🛒 ADDING TO CART:",
          cartData
        );

        await axios.post(
          `${API_URL}/cart/add`,
          cartData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        /* CART EVENT */

        window.dispatchEvent(
          new Event(
            "cartChanged"
          )
        );

        /* SUCCESS */

        setAdded(true);

        toast.success(
          `${product.name} added to cart.`
        );

        setTimeout(() => {
          setAdded(false);
        }, 2000);
      } catch (error) {
        console.error(
          "PRODUCT ADD TO CART ERROR:",
          error
        );

        /* EXPIRED TOKEN */

        if (
          error.response?.status ===
          401
        ) {
          localStorage.removeItem(
            "mamta_user_token"
          );

          localStorage.removeItem(
            "mamta_user"
          );

          window.dispatchEvent(
            new Event(
              "authChanged"
            )
          );

          toast.error(
            "Your session has expired. Please login again."
          );

          navigate("/login");

          return;
        }

        toast.error(
          error.response?.data
            ?.message ||
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
    setQuantity(
      (current) =>
        Math.max(
          1,
          current - 1
        )
    );
  };

  const increaseQuantity = () => {
    setQuantity(
      (current) =>
        current + 1
    );
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

        <Link to="/">
          Home
        </Link>

        <span>
          /
        </span>

        <Link to="/shop">
          Shop
        </Link>

        <span>
          /
        </span>

        <span>
          {product.name}
        </span>

      </div>


      {/* ===================================================
          PRODUCT MAIN
      ==================================================== */}

      <section className="product-details-container">

        {/* =================================================
            IMAGE SECTION
        ================================================== */}

        <div className="product-details-image-section">

          <div className="product-gallery">

            {/* =============================================
                SIDE THUMBNAILS

                IMPORTANT:

                ONLY COLOR IMAGES ARE SHOWN HERE.

                Main product image and additional
                product images are NOT rendered
                as thumbnails.
            ============================================== */}

            <div className="product-image-thumbnails">

              {colorGallery.map(
                (
                  item,
                  index
                ) => {

                  const isSelected =
                    selectedColor ===
                    item.value;

                  return (
                    <button
                      type="button"
                      key={`color-${item.value}-${index}`}
                      className={
                        isSelected
                          ? "product-image-thumbnail color-image-thumbnail active"
                          : "product-image-thumbnail color-image-thumbnail"
                      }
                      onClick={() =>
                        handleColorImageClick(
                          item.color
                        )
                      }
                      aria-label={`Select ${item.name}`}
                      title={`Select ${item.name}`}
                    >

                      <img
                        src={
                          item.image
                        }
                        alt={`${product.name} - ${item.name}`}
                        onError={(e) => {
                          e.currentTarget.src =
                            THUMBNAIL_PLACEHOLDER;
                        }}
                      />

                      <span className="product-thumbnail-color-name">
                        {item.name}
                      </span>

                    </button>
                  );
                }
              )}

            </div>


            {/* =============================================
                MAIN IMAGE SLIDER
            ============================================== */}

            <div className="product-details-image">

              <img
                src={
                  selectedImage ||
                  productImages[0] ||
                  mainProductImage ||
                  PLACEHOLDER_IMAGE
                }
                alt={
                  product.name ||
                  "MAAMTA product"
                }
                onError={(e) => {
                  e.currentTarget.src =
                    PLACEHOLDER_IMAGE;
                }}
              />


              {/* =========================================
                  PREVIOUS BUTTON
              ========================================== */}

              {productImages.length > 1 &&
                !isColorImageSelected && (
                  <button
                    type="button"
                    className="product-slider-arrow product-slider-arrow-left"
                    onClick={
                      handlePreviousImage
                    }
                    aria-label="Previous product image"
                  >
                    <ArrowLeft
                      size={20}
                    />
                  </button>
                )}


              {/* =========================================
                  NEXT BUTTON
              ========================================== */}

              {productImages.length > 1 &&
                !isColorImageSelected && (
                  <button
                    type="button"
                    className="product-slider-arrow product-slider-arrow-right"
                    onClick={
                      handleNextImage
                    }
                    aria-label="Next product image"
                  >
                    <ArrowRight
                      size={20}
                    />
                  </button>
                )}


              {/* =========================================
                  SLIDER DOTS

                  Main image + additional images
                  are represented here.

                  These are the ONLY controls for
                  normal product images.
              ========================================== */}

              {productImages.length > 1 &&
                !isColorImageSelected && (
                  <div className="product-image-slider-dots">

                    {productImages.map(
                      (
                        image,
                        index
                      ) => (
                        <button
                          type="button"
                          key={`dot-${index}`}
                          className={
                            index ===
                            currentImageIndex
                              ? "slider-dot active"
                              : "slider-dot"
                          }
                          onClick={() =>
                            handleImageChange(
                              image
                            )
                          }
                          aria-label={`Show product image ${
                            index + 1
                          }`}
                        />
                      )
                    )}

                  </div>
                )}

            </div>

          </div>


          {/* ===============================================
              IMAGE CAPTION
          ================================================ */}

        </div>


        {/* =================================================
            PRODUCT INFORMATION
        ================================================== */}

        <div className="product-details-info">

          <span className="product-details-category">
            {product.category}
          </span>

          <h1>
            {product.name}
          </h1>


          {/* =================================================
              RATING
          ================================================== */}

       <div className="product-rating">
  <span className="rating-divider">
    MAAMTA COLLECTION
  </span>

  

</div>

          {/* =================================================
              PRICE
          ================================================== */}

          <div className="product-details-price">

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

            {product.oldPrice && (
              <span className="sale-badge">
                SALE
              </span>
            )}

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <div className="product-description">

            <p>
              {product.description ||
                "Thoughtfully designed for comfort and everyday care."}
            </p>

            <h3>
              Delivery : 3-4 working days
            </h3>

          </div>


          {/* =================================================
              COLOR SELECTION
          ================================================== */}

          {productColors.length > 0 && (

            <div className="product-color-section">

              <div className="product-color-header">

                <div>

                  <span className="color-label">
                    SELECT COLOR
                  </span>

                  <strong>
                    {activeColor
                      ? getColorName(
                          activeColor
                        )
                      : "Choose a color"}
                  </strong>

                </div>

                {selectedColor && (
                  <span className="selected-color-text">
                    Selected
                  </span>
                )}

              </div>


              <div className="product-color-options">

                {productColors.map(
                  (
                    color,
                    index
                  ) => {

                    const colorName =
                      getColorName(
                        color
                      );

                    const colorValue =
                      getColorValue(
                        color
                      );

                    const colorCode =
                      getColorCode(
                        color
                      );

                    const colorImages =
                      getColorImages(
                        color
                      );

                    const isSelected =
                      selectedColor ===
                      colorValue;

                    return (
                      <button
                        type="button"
                        key={`${colorValue}-${index}`}
                        className={
                          isSelected
                            ? "color-option color-selected"
                            : "color-option"
                        }
                        onClick={() =>
                          handleColorChange(
                            color
                          )
                        }
                        aria-label={`Select ${colorName}`}
                        title={
                          colorImages.length >
                          0
                            ? `${colorName} - Image available`
                            : `${colorName} - Uses main product image`
                        }
                      >

                        <span
                          className="color-swatch"
                          style={{
                            backgroundColor:
                              colorCode,
                          }}
                        />

                        <span className="color-name">
                          {colorName}
                        </span>

                        {isSelected && (
                          <Check
                            size={16}
                            className="color-check"
                          />
                        )}

                      </button>
                    );
                  }
                )}

              </div>

            </div>
          )}


          {/* =================================================
              NO COLORS
          ================================================== */}

          {productColors.length === 0 && (

            <div className="product-no-color-data">

              <span>
                COLOR
              </span>

              <p>
                No color options available
                for this product.
              </p>

            </div>
          )}


          {/* =================================================
              QUANTITY
          ================================================== */}

          <div className="product-quantity-section">

            <span>
              QUANTITY
            </span>

            <div className="product-quantity-control">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                aria-label="Decrease quantity"
              >
                <Minus size={18} />
              </button>

              <strong>
                {quantity}
              </strong>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                aria-label="Increase quantity"
              >
                <Plus size={18} />
              </button>

            </div>

          </div>


          {/* =================================================
              WHATSAPP
          ================================================== */}

          <button
            type="button"
            className="product-whatsapp-button"
            onClick={
              handleWhatsApp
            }
            aria-label="Chat with MAAMTA on WhatsApp"
          >

            <svg
              className="product-whatsapp-icon"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >

              <path
                fill="currentColor"
                d="M16 2.4C8.49 2.4 2.4 8.49 2.4 16c0 2.4.63 4.65 1.73 6.61L2.3 29.7l7.25-1.8A13.53 13.53 0 0 0 16 29.6c7.51 0 13.6-6.09 13.6-13.6S23.51 2.4 16 2.4Zm0 24.73h-.01c-2.11 0-4.18-.57-5.98-1.66l-.43-.26-4.3 1.07 1.1-4.19-.28-.44A11.23 11.23 0 1 1 16 27.13Zm6.16-8.41c-.34-.17-.54-.17-.77.17-.23.34-.88 1.11-1.08 1.34-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.69-2.01-1.89-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.77-1.86-1.05-2.55-.28-.67-.56-.58-.77-.59h-.66c-.23 0-.6.09-.91.43-.31.34-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.69 5.86 5.18.82.26 2.02-.83 2.3-1.63.28-.8.28-1.49.2-1.63-.08-.14-.31-.23-.65-.4Z"
              />

            </svg>

            <span>
              CHAT WITH US ON WHATSAPP
            </span>

            <ArrowRight
              size={20}
            />

          </button>


          {/* =================================================
              ACTIONS
          ================================================== */}

          <div className="product-details-actions">

            <button
              type="button"
              className={
                added
                  ? "details-add-cart added"
                  : "details-add-cart"
              }
              onClick={
                handleAddToCart
              }
              disabled={adding}
            >

              {added ? (
                <>
                  <Check size={21} />
                  ADDED TO CART
                </>
              ) : (
                <>
                  <ShoppingBag size={21} />

                  {adding
                    ? "ADDING..."
                    : "ADD TO CART"}
                </>
              )}

            </button>


            <button
              type="button"
              className={
                wishlist
                  ? "details-wishlist wishlist-active"
                  : "details-wishlist"
              }
              aria-label={
                wishlist
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              onClick={
                handleWishlist
              }
            >

              <Heart
                size={23}
                fill={
                  wishlist
                    ? "currentColor"
                    : "none"
                }
              />

            </button>

          </div>


          {/* =================================================
              VIEW CART
          ================================================== */}

          <Link
            to="/cart"
            className="view-cart-button"
          >

            VIEW CART

            <ArrowRight
              size={19}
            />

          </Link>


          {/* =================================================
              BENEFITS
          ================================================== */}

          <div className="product-benefits">

            <div className="benefit-item">

              <div className="benefit-icon">
                <Truck size={21} />
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


            <div className="benefit-item">

              <div className="benefit-icon">
                <ShieldCheck size={21} />
              </div>

              <div>

                <strong>
                  MAAMTA Quality
                </strong>

                <span>
                  Made with comfort in mind
                </span>

              </div>

            </div>


            <div className="benefit-item">

              <div className="benefit-icon">
                <RotateCcw size={21} />
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

      
<ProductReviews
  key={product?._id || product?.id || id}
  productId={product?._id || product?.id || id}
/>
<section className="product-features-section">

        <div className="product-features-inner">

          <div className="features-heading">

            <span>
              WHY MAAMTA
            </span>

            <h2>
              Made for moments
              <em>
                {" "}that matter.
              </em>
            </h2>

          </div>


          <div className="features-content">

            <p>
              Every MAAMTA product is thoughtfully
              selected with comfort, softness and
              everyday care in mind.
            </p>

            <div className="feature-list">

              {Array.isArray(
                product.features
              ) &&
                product.features.map(
                  (
                    feature,
                    index
                  ) => (

                    <div
                      className="feature-item"
                      key={index}
                    >

                      <Check size={18} />

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

          <ArrowLeft size={19} />

          BACK TO ALL PRODUCTS

        </Link>

      </div>

    </main>
  );
};

export default ProductDetails;