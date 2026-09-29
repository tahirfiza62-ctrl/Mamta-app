
import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import "./EditProduct.css";

const API_URL =
  "http://localhost:3000/api/admin/products";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [features, setFeatures] =
    useState([]);

  const [featureInput, setFeatureInput] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      price: "",
      oldPrice: "",
      category: "",
      image: "",
      stock: "",
      active: true,
    });

  /* =======================================================
     GET PRODUCT
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "mamta_admin_token"
          );

        if (!token) {
          navigate("/admin");
          return;
        }

        const response =
          await axios.get(
            `${API_URL}/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (cancelled) return;

        const product =
          response.data.product;

        if (!product) {
          setError(
            "Product not found."
          );
          return;
        }

        setFormData({
          name:
            product.name || "",

          description:
            product.description || "",

          price:
            product.price ?? "",

          oldPrice:
            product.oldPrice ?? "",

          category:
            product.category || "",

          image:
            product.image || "",

          stock:
            product.stock ?? "",

          active:
            product.active !== false,
        });

        setFeatures(
          Array.isArray(product.features)
            ? product.features
            : []
        );

      } catch (error) {
        if (cancelled) return;

        console.error(
          "GET PRODUCT ERROR:",
          error
        );

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem(
            "mamta_admin_token"
          );

          navigate("/admin");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load product."
        );

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =======================================================
     ADD FEATURE
  ======================================================= */

  const addFeature = () => {
    const value =
      featureInput.trim();

    if (!value) return;

    setFeatures((prev) => [
      ...prev,
      value,
    ]);

    setFeatureInput("");
  };

  /* =======================================================
     REMOVE FEATURE
  ======================================================= */

  const removeFeature = (index) => {
    setFeatures((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token =
        localStorage.getItem(
          "mamta_admin_token"
        );

      if (!token) {
        navigate("/admin");
        return;
      }

      const data = {
        ...formData,

        price:
          Number(formData.price),

        oldPrice:
          formData.oldPrice === ""
            ? null
            : Number(formData.oldPrice),

        stock:
          Number(
            formData.stock || 0
          ),

        features,
      };

      await axios.put(
        `${API_URL}/${id}`,
        data,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert(
        "Product updated successfully."
      );

      navigate(
        "/admin/products"
      );

    } catch (error) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem(
          "mamta_admin_token"
        );

        navigate("/admin");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to update product."
      );

    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="add-product-page">

        <div className="add-product-loading">
          Loading product...
        </div>

      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error && !formData.name) {
    return (
      <div className="add-product-page">

        <div className="add-product-error">
          {error}
        </div>

        <button
          className="add-product-back-btn"
          onClick={() =>
            navigate(
              "/admin/products"
            )
          }
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>

      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="add-product-page">

      {/* =================================================
          TOP
      ================================================= */}

      <div className="add-product-top">

        <button
          className="add-product-back-btn"
          onClick={() =>
            navigate(
              "/admin/products"
            )
          }
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>

        <div>
          <p className="add-product-eyebrow">
            MAMTA ADMIN
          </p>

          <h1>
            Edit Product
          </h1>

          <p>
            Update product information
          </p>
        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="add-product-error">
          {error}
        </div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <form
        className="add-product-form"
        onSubmit={handleSubmit}
      >

        {/* BASIC INFORMATION */}

        <section className="add-product-card">

          <div className="add-product-card-heading">

            <div>
              <h2>
                Basic Information
              </h2>

              <p>
                Update the main product details.
              </p>
            </div>

          </div>

          {/* NAME */}

          <div className="add-product-field">

            <label>
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />

          </div>

          {/* DESCRIPTION */}

          <div className="add-product-field">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="5"
            />

          </div>

          {/* CATEGORY */}

          <div className="add-product-field">

            <label>
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">
                Select category
              </option>

              <option value="Maternity Pillows">
                Maternity Pillows
              </option>

              <option value="Baby Pillows">
                Baby Pillows
              </option>
            </select>

          </div>

        </section>

        {/* PRICE */}

        <section className="add-product-card">

          <div className="add-product-card-heading">

            <div>
              <h2>
                Pricing & Stock
              </h2>

              <p>
                Update pricing and inventory.
              </p>
            </div>

          </div>

          <div className="add-product-grid">

            {/* PRICE */}

            <div className="add-product-field">

              <label>
                Current Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                required
              />

            </div>

            {/* OLD PRICE */}

            <div className="add-product-field">

              <label>
                Old Price
              </label>

              <input
                type="number"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleChange}
                min="0"
                placeholder="Optional"
              />

            </div>

            {/* STOCK */}

            <div className="add-product-field">

              <label>
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
              />

            </div>

          </div>

        </section>

        {/* IMAGE */}

        <section className="add-product-card">

          <div className="add-product-card-heading">

            <div>
              <h2>
                Product Image
              </h2>

              <p>
                Update the product image URL.
              </p>
            </div>

          </div>

          <div className="add-product-field">

            <label>
              Image URL
            </label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />

          </div>

          {formData.image && (
            <div className="add-product-image-preview">

              <img
                src={formData.image}
                alt={formData.name}
              />

            </div>
          )}

        </section>

        {/* FEATURES */}

        <section className="add-product-card">

          <div className="add-product-card-heading">

            <div>
              <h2>
                Product Features
              </h2>

              <p>
                Add important product features.
              </p>
            </div>

          </div>

          <div className="add-product-feature-input">

            <input
              type="text"
              value={featureInput}
              onChange={(e) =>
                setFeatureInput(
                  e.target.value
                )
              }
              placeholder="Enter a feature"
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  e.preventDefault();
                  addFeature();
                }
              }}
            />

            <button
              type="button"
              onClick={addFeature}
            >
              <Plus size={17} />
              Add
            </button>

          </div>

          <div className="add-product-features">

            {features.map(
              (feature, index) => (
                <div
                  className="add-product-feature"
                  key={index}
                >

                  <span>
                    {feature}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeFeature(index)
                    }
                  >
                    <X size={15} />
                  </button>

                </div>
              )
            )}

          </div>

        </section>

        {/* STATUS */}

        <section className="add-product-card">

          <div className="add-product-status">

            <div>

              <h3>
                Product Status
              </h3>

              <p>
                Active products are visible
                on the customer website.
              </p>

            </div>

            <label className="add-product-switch">

              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />

              <span></span>

            </label>

          </div>

        </section>

        {/* ACTIONS */}

        <div className="add-product-actions">

          <button
            type="button"
            className="add-product-cancel"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="add-product-submit"
            disabled={saving}
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditProduct;

