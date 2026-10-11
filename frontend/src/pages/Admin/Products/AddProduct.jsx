
import { useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  ImagePlus,
  Plus,
  X,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const API_URL = "http://localhost:3000/api/admin/products";

/* =========================================================
   ALLOWED CATEGORIES
========================================================= */

const ALLOWED_CATEGORIES = [
  "Maternity Pillows",
  "Baby Pillows",
  "Nursing Products",
  "Elders Pillows",
  "Accessories",
];

/* =========================================================
   AVAILABLE COLORS
========================================================= */

const AVAILABLE_COLORS = [
  { name: "Pink", value: "pink", hex: "#F4A6B8" },
  { name: "Blush Pink", value: "blush-pink", hex: "#E8A0A8" },
  { name: "Dusty Rose", value: "dusty-rose", hex: "#C98B91" },
  { name: "Rose", value: "rose", hex: "#D96C7B" },
  { name: "Mauve", value: "mauve", hex: "#B7848C" },

  { name: "Lavender", value: "lavender", hex: "#B8A1D9" },
  { name: "Purple", value: "purple", hex: "#8B5CF6" },
  { name: "Lilac", value: "lilac", hex: "#C8A2E8" },

  { name: "Blue", value: "blue", hex: "#6FA8DC" },
  { name: "Baby Blue", value: "baby-blue", hex: "#A7D8F0" },
  { name: "Sky Blue", value: "sky-blue", hex: "#87CEEB" },
  { name: "Navy Blue", value: "navy-blue", hex: "#243B53" },
  { name: "Royal Blue", value: "royal-blue", hex: "#4169E1" },

  { name: "Teal", value: "teal", hex: "#4DB6AC" },
  { name: "Mint", value: "mint", hex: "#A8D5BA" },
  { name: "Green", value: "green", hex: "#6FAF7B" },
  { name: "Sage Green", value: "sage-green", hex: "#A3B18A" },
  { name: "Olive", value: "olive", hex: "#808000" },

  { name: "Cream", value: "cream", hex: "#FFF1D0" },
  { name: "Ivory", value: "ivory", hex: "#FFFFF0" },
  { name: "White", value: "white", hex: "#FFFFFF" },
  { name: "Off White", value: "off-white", hex: "#F8F5F0" },

  { name: "Beige", value: "beige", hex: "#D8C3A5" },
  { name: "Nude", value: "nude", hex: "#D8A98B" },
  { name: "Camel", value: "camel", hex: "#C19A6B" },

  { name: "Brown", value: "brown", hex: "#8B5E3C" },
  { name: "Chocolate", value: "chocolate", hex: "#5C4033" },

  { name: "Grey", value: "grey", hex: "#9E9E9E" },
  { name: "Light Grey", value: "light-grey", hex: "#D3D3D3" },
  { name: "Charcoal", value: "charcoal", hex: "#36454F" },
  { name: "Black", value: "black", hex: "#111111" },

  { name: "Yellow", value: "yellow", hex: "#F4D35E" },
  { name: "Mustard", value: "mustard", hex: "#D4A017" },
  { name: "Orange", value: "orange", hex: "#F28C28" },
  { name: "Peach", value: "peach", hex: "#FFCBA4" },
  { name: "Coral", value: "coral", hex: "#FF7F7F" },

  { name: "Red", value: "red", hex: "#D71920" },
  { name: "Maroon", value: "maroon", hex: "#800000" },
  { name: "Wine", value: "wine", hex: "#722F37" },
  { name: "Burgundy", value: "burgundy", hex: "#800020" },

  { name: "Turquoise", value: "turquoise", hex: "#40E0D0" },
  { name: "Sea Green", value: "sea-green", hex: "#2E8B57" },
  { name: "Peacock Blue", value: "peacock-blue", hex: "#007C91" },
  { name: "Denim", value: "denim", hex: "#1560BD" },

  { name: "Terracotta", value: "terracotta", hex: "#C76B4A" },
  { name: "Khaki", value: "khaki", hex: "#C3B091" },
];

/* =========================================================
   CREATE COLOR OBJECT
========================================================= */

const createColorObject = (color) => ({
  name: color.name,
  value: color.value,
  code: color.hex,
  image: "",
  useMainImage: true,
});

/* =========================================================
   ADD PRODUCT
========================================================= */

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    category: "",
    image: "",
    images: [],
    stock: "",
    active: true,
    features: [],
    colors: [],
  });

  const [feature, setFeature] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =========================================================
     HANDLE INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =========================================================
     TOGGLE COLOR
  ========================================================= */

  const toggleColor = (color) => {
    setForm((prev) => {
      const alreadySelected =
        prev.colors.some(
          (item) => item.value === color.value
        );

      if (alreadySelected) {
        return {
          ...prev,
          colors: prev.colors.filter(
            (item) => item.value !== color.value
          ),
        };
      }

      return {
        ...prev,
        colors: [
          ...prev.colors,
          createColorObject(color),
        ],
      };
    });
  };

  /* =========================================================
     TOGGLE USE MAIN IMAGE
  ========================================================= */

  const toggleUseMainImage = (colorValue) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((color) =>
        color.value === colorValue
          ? {
              ...color,
              useMainImage: !color.useMainImage,
            }
          : color
      ),
    }));
  };

  /* =========================================================
     UPDATE COLOR IMAGE
  ========================================================= */

  const updateColorImage = (colorValue, imageValue) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((color) =>
        color.value === colorValue
          ? {
              ...color,
              image: imageValue,
              useMainImage: false,
            }
          : color
      ),
    }));
  };

  /* =========================================================
     REMOVE COLOR
  ========================================================= */

  const removeColor = (colorValue) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter(
        (color) => color.value !== colorValue
      ),
    }));
  };

  /* =========================================================
     ADD FEATURE
  ========================================================= */

  const addFeature = () => {
    const value = feature.trim();

    if (!value) {
      return;
    }

    if (form.features.includes(value)) {
      setError("This feature has already been added.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      features: [...prev.features, value],
    }));

    setFeature("");
    setError("");
  };

  /* =========================================================
     REMOVE FEATURE
  ========================================================= */

  const removeFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  /* =========================================================
     ADD ADDITIONAL IMAGE
  ========================================================= */

  const addImage = () => {
    const value = imageUrl.trim();

    if (!value) {
      setError("Please enter an image URL.");
      return;
    }

    if (form.images.length >= 4) {
      setError("You can add up to 4 additional images.");
      return;
    }

    if (form.images.includes(value)) {
      setError("This image has already been added.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, value],
    }));

    setImageUrl("");
    setError("");
  };

  /* =========================================================
     REMOVE IMAGE
  ========================================================= */

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  /* =========================================================
     SUBMIT PRODUCT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    /* -----------------------------------------
       PRODUCT NAME
    ----------------------------------------- */

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    /* -----------------------------------------
       CATEGORY
    ----------------------------------------- */

    const normalizedCategory = form.category.trim();

    if (!ALLOWED_CATEGORIES.includes(normalizedCategory)) {
      setError("Please select a valid product category.");
      return;
    }

    /* -----------------------------------------
       PRICE
    ----------------------------------------- */

    if (
      form.price === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      setError("Enter a valid price.");
      return;
    }

    /* -----------------------------------------
       OLD PRICE
    ----------------------------------------- */

    if (
      form.oldPrice !== "" &&
      (!Number.isFinite(Number(form.oldPrice)) ||
        Number(form.oldPrice) < 0)
    ) {
      setError("Old price cannot be negative.");
      return;
    }

    /* -----------------------------------------
       STOCK
    ----------------------------------------- */

    if (
      form.stock !== "" &&
      (!Number.isFinite(Number(form.stock)) ||
        Number(form.stock) < 0)
    ) {
      setError("Stock cannot be negative.");
      return;
    }

    /* -----------------------------------------
       MAIN IMAGE VALIDATION
    ----------------------------------------- */

    for (const color of form.colors) {
      if (color.useMainImage && !form.image.trim()) {
        setError(
          `Please add a main product image for ${color.name}.`
        );
        return;
      }
    }

    /* -----------------------------------------
       COLOR IMAGE VALIDATION
    ----------------------------------------- */

    for (const color of form.colors) {
      if (
        !color.useMainImage &&
        (!color.image || !color.image.trim())
      ) {
        setError(`Please add an image for ${color.name}.`);
        return;
      }
    }

    const token = localStorage.getItem("mamta_admin_token");

    if (!token) {
      setError("Your admin session has expired. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      /* -----------------------------------------
         CLEAN COLORS
      ----------------------------------------- */

      const cleanedColors = form.colors.map((color) => ({
        name: color.name,
        value: color.value,
        code: color.code,
        image: color.useMainImage
          ? form.image.trim()
          : color.image.trim(),
      }));

      /* -----------------------------------------
         CLEAN ADDITIONAL IMAGES
      ----------------------------------------- */

      const cleanedImages = [
        ...new Set(
          form.images
            .map((image) =>
              typeof image === "string"
                ? image.trim()
                : ""
            )
            .filter(Boolean)
        ),
      ].slice(0, 4);

      /* -----------------------------------------
         PRODUCT DATA

         IMPORTANT:
         Do not convert the selected category
         to Nursing Products or Accessories.
      ----------------------------------------- */

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        oldPrice:
          form.oldPrice === ""
            ? null
            : Number(form.oldPrice),

        // Save the exact category selected in the dropdown.
        category: normalizedCategory,

        image: form.image.trim(),
        images: cleanedImages,
        stock: form.stock === "" ? 0 : Number(form.stock),
        active: form.active,
        features: form.features,
        colors: cleanedColors,
      };

      console.log("ADDING PRODUCT:", productData);
      console.log("PRODUCT CATEGORY:", productData.category);

      /* -----------------------------------------
         API REQUEST
      ----------------------------------------- */

      await axios.post(API_URL, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Product added successfully.");

      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <section className="admin-add-product-page">
      <div className="admin-add-product-header">
        <button
          type="button"
          className="admin-back-button"
          onClick={() => navigate("/admin/products")}
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>

        <div>
          <p className="admin-page-label">
            PRODUCT MANAGEMENT
          </p>

          <h1>Add New Product</h1>

          <p className="admin-page-description">
            Add a new product to the MAMTA store.
          </p>
        </div>
      </div>

      {error && (
        <div className="admin-product-alert admin-product-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-product-alert admin-product-success">
          <Check size={18} />
          {success}
        </div>
      )}

      <form
        className="admin-add-product-form"
        onSubmit={handleSubmit}
      >
        {/* BASIC INFORMATION */}

        <div className="admin-product-card">
          <div className="admin-card-heading">
            <div>
              <span className="admin-card-eyebrow">
                BASIC INFORMATION
              </span>

              <h2>Product Details</h2>

              <p>
                Enter the main information about your product.
              </p>
            </div>
          </div>

          <div className="admin-form-group">
            <label>
              Product Name <span>*</span>
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="5"
            />
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>
                Price <span>*</span>
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="admin-form-group">
              <label>Old Price</label>

              <input
                type="number"
                name="oldPrice"
                value={form.oldPrice}
                onChange={handleChange}
                placeholder="Optional"
                min="0"
              />
            </div>
          </div>

          {/* CATEGORY DROPDOWN */}

          <div className="admin-form-group">
            <label>
              Category <span>*</span>
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>

              {ALLOWED_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Stock</label>

            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="admin-active-row">
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />

              <span className="admin-custom-checkbox">
                {form.active && <Check size={14} />}
              </span>

              <span>Product is active</span>
            </label>
          </div>
        </div>

        {/* MAIN IMAGE */}

        <div className="admin-product-card">
          <div className="admin-card-heading">
            <div>
              <span className="admin-card-eyebrow">
                PRODUCT IMAGE
              </span>

              <h2>Main Product Image</h2>

              <p>
                Add the primary image for this product.
              </p>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Main Image URL</label>

            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/product-image.jpg"
            />
          </div>

          {form.image && (
            <div className="admin-main-image-preview">
              <img
                src={form.image}
                alt={form.name || "Product"}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* ADDITIONAL IMAGES */}

        <div className="admin-product-card">
          <div className="admin-card-heading">
            <div>
              <span className="admin-card-eyebrow">
                PRODUCT GALLERY
              </span>

              <h2>Additional Images</h2>

              <p>
                Add up to 4 additional images. These images
                become the automatic product gallery on
                ProductDetails.
              </p>
            </div>

            <div className="admin-selected-count">
              {form.images.length} / 4
            </div>
          </div>

          <div className="admin-add-input-row">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImage();
                }
              }}
              placeholder="Paste image URL"
              disabled={form.images.length >= 4}
            />

            <button
              type="button"
              className="admin-add-small-button"
              onClick={addImage}
              disabled={form.images.length >= 4}
            >
              <Plus size={18} />

              {form.images.length >= 4 ? "Maximum" : "Add"}
            </button>
          </div>

          {form.images.length > 0 && (
            <div className="admin-image-list">
              {form.images.map((image, index) => (
                <div
                  className="admin-image-item"
                  key={`${image}-${index}`}
                >
                  <div className="admin-image-preview">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <div className="admin-image-url">
                    <span>Image {index + 1}</span>
                    {image}
                  </div>

                  <button
                    type="button"
                    className="admin-remove-button"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <X size={17} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FEATURES */}

        <div className="admin-product-card">
          <div className="admin-card-heading">
            <div>
              <span className="admin-card-eyebrow">
                PRODUCT FEATURES
              </span>

              <h2>Features</h2>

              <p>
                Add important features of this product.
              </p>
            </div>
          </div>

          <div className="admin-add-input-row">
            <input
              type="text"
              value={feature}
              onChange={(e) => setFeature(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              placeholder="e.g. Soft memory foam"
            />

            <button
              type="button"
              className="admin-add-small-button"
              onClick={addFeature}
            >
              <Plus size={18} />
              Add
            </button>
          </div>

          {form.features.length > 0 && (
            <div className="admin-feature-list">
              {form.features.map((item, index) => (
                <div
                  className="admin-feature-item"
                  key={`${item}-${index}`}
                >
                  <div className="admin-feature-check">
                    <Check size={15} />
                  </div>

                  <span>{item}</span>

                  <button
                    type="button"
                    className="admin-remove-button"
                    onClick={() => removeFeature(index)}
                    aria-label={`Remove ${item}`}
                  >
                    <X size={17} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLORS */}

        <div className="admin-product-card">
          <div className="admin-card-heading">
            <div>
              <span className="admin-card-eyebrow">
                PRODUCT COLORS
              </span>

              <h2>Available Colors</h2>

              <p>
                Select the colors available for this product.
                Use the main image or add a separate image
                for each color.
              </p>
            </div>

            <div className="admin-selected-count">
              {form.colors.length} selected
            </div>
          </div>

          <div className="admin-color-grid">
            {AVAILABLE_COLORS.map((color) => {
              const selected = form.colors.some(
                (item) => item.value === color.value
              );

              return (
                <button
                  type="button"
                  key={color.value}
                  className={`admin-color-option ${
                    selected ? "selected" : ""
                  }`}
                  onClick={() => toggleColor(color)}
                >
                  <span
                    className="admin-color-swatch"
                    style={{ backgroundColor: color.hex }}
                  />

                  <span className="admin-color-name">
                    {color.name}
                  </span>

                  {selected && (
                    <span className="admin-color-check">
                      <Check size={13} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {form.colors.length > 0 && (
            <div className="admin-selected-colors">
              <div className="admin-selected-colors-title">
                Selected Colors
              </div>

              {form.colors.map((color) => (
                <div
                  className="admin-selected-color-card"
                  key={color.value}
                >
                  <div className="admin-selected-color-header">
                    <div className="admin-selected-color-info">
                      <span
                        className="admin-color-swatch"
                        style={{ backgroundColor: color.code }}
                      />

                      <div>
                        <strong>{color.name}</strong>
                        <small>{color.value}</small>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="admin-remove-color"
                      onClick={() => removeColor(color.value)}
                      aria-label={`Remove ${color.name}`}
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="admin-color-image-section">
                    <label>
                      <ImagePlus size={17} />
                      Image for {color.name}
                      <span>*</span>
                    </label>

                    <label className="admin-use-main-image">
                      <input
                        type="checkbox"
                        checked={color.useMainImage}
                        onChange={() =>
                          toggleUseMainImage(color.value)
                        }
                      />

                      <span className="admin-custom-checkbox">
                        {color.useMainImage && (
                          <Check size={14} />
                        )}
                      </span>

                      <span>Use Main Product Image</span>
                    </label>

                    {!color.useMainImage && (
                      <>
                        <input
                          type="text"
                          value={color.image}
                          onChange={(e) =>
                            updateColorImage(
                              color.value,
                              e.target.value
                            )
                          }
                          placeholder={`Paste ${color.name} product image URL`}
                        />

                        {color.image && (
                          <div className="admin-color-image-preview">
                            <img
                              src={color.image}
                              alt={color.name}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}

                    {color.useMainImage && form.image && (
                      <div className="admin-color-image-preview">
                        <img
                          src={form.image}
                          alt={`${color.name} product`}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />

                        <span className="admin-main-image-used">
                          <Check size={14} />
                          Using main product image
                        </span>
                      </div>
                    )}

                    {color.useMainImage && !form.image && (
                      <div className="admin-color-image-warning">
                        <ImagePlus size={16} />
                        Add the main product image above to use it
                        for this color.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FORM ACTIONS */}

        <div className="admin-product-form-actions">
          <button
            type="button"
            className="admin-cancel-button"
            onClick={() => navigate("/admin/products")}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-save-product-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="admin-button-spinner" />
                Adding Product...
              </>
            ) : (
              <>
                <Check size={18} />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddProduct;
