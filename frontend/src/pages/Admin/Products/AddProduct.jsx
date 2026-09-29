
import { useState } from "react";
import axios from "axios";
import { ArrowLeft, ImagePlus, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const API_URL = "http://localhost:3000/api/admin/products";

const AddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    oldPrice: "",
    category: "",
    image: "",
    stock: "",
    active: true,
    features: [],
  });

  const [feature, setFeature] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =====================================================
     ADD FEATURE
  ===================================================== */

  const addFeature = () => {
    const value = feature.trim();

    if (!value) return;

    setForm((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        value,
      ],
    }));

    setFeature("");
  };

  /* =====================================================
     REMOVE FEATURE
  ===================================================== */

  const removeFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter(
        (_, i) => i !== index
      ),
    }));
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      setError("Enter a valid price.");
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "mamta_admin_token"
        );

      await axios.post(
        API_URL,
        {
          ...form,
          price: Number(form.price),
          oldPrice:
            form.oldPrice === ""
              ? null
              : Number(form.oldPrice),
          stock:
            form.stock === ""
              ? 0
              : Number(form.stock),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        "Product added successfully."
      );

      setTimeout(() => {
        navigate("/admin/products");
      }, 800);
    } catch (err) {
      console.error(
        "ADD PRODUCT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-add-product-page">

      {/* HEADER */}

      <div className="admin-add-product-header">

        <button
          className="admin-back-btn"
          onClick={() =>
            navigate("/admin/products")
          }
        >
          <ArrowLeft size={18} />
          Back to Products
        </button>

        <div>
          <h1>Add Product</h1>
          <p>
            Add a new product to your MAMTA store.
          </p>
        </div>

      </div>


      {/* FORM */}

      <form
        className="admin-product-form"
        onSubmit={handleSubmit}
      >

        {/* BASIC INFORMATION */}

        <div className="admin-form-card">

          <div className="admin-form-card-header">
            <h2>Basic Information</h2>
            <p>
              Enter the main information about your product.
            </p>
          </div>


          <div className="admin-form-grid">

            <div className="admin-form-group full">
              <label>
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                placeholder="e.g. Premium Maternity Pillow"
                value={form.name}
                onChange={handleChange}
              />
            </div>


            <div className="admin-form-group full">
              <label>
                Description
              </label>

              <textarea
                name="description"
                rows="5"
                placeholder="Write a short description..."
                value={form.description}
                onChange={handleChange}
              />
            </div>


            <div className="admin-form-group">
              <label>
                Category *
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">
                  Select Category
                </option>

                <option value="Maternity Pillows">
                  Maternity Pillows
                </option>

                <option value="Baby Pillows">
                  Baby Pillows
                </option>

                <option value="Newborn">
                  Newborn
                </option>

                <option value="Kids">
                  Kids
                </option>

                <option value="Accessories">
                  Accessories
                </option>
              </select>
            </div>


            <div className="admin-form-group">
              <label>
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                min="0"
                placeholder="0"
                value={form.stock}
                onChange={handleChange}
              />
            </div>

          </div>

        </div>


        {/* PRICING */}

        <div className="admin-form-card">

          <div className="admin-form-card-header">
            <h2>Pricing</h2>
            <p>
              Set the current and original product prices.
            </p>
          </div>


          <div className="admin-form-grid">

            <div className="admin-form-group">
              <label>
                Current Price *
              </label>

              <div className="admin-input-prefix">
                <span>Rs.</span>

                <input
                  type="number"
                  name="price"
                  min="0"
                  placeholder="0"
                  value={form.price}
                  onChange={handleChange}
                />
              </div>
            </div>


            <div className="admin-form-group">
              <label>
                Old Price
              </label>

              <div className="admin-input-prefix">
                <span>Rs.</span>

                <input
                  type="number"
                  name="oldPrice"
                  min="0"
                  placeholder="Optional"
                  value={form.oldPrice}
                  onChange={handleChange}
                />
              </div>
            </div>

          </div>

        </div>


        {/* IMAGE */}

        <div className="admin-form-card">

          <div className="admin-form-card-header">
            <h2>Product Image</h2>
            <p>
              Add the image URL for your product.
            </p>
          </div>


          <div className="admin-image-input">

            <div className="admin-image-icon">
              <ImagePlus size={26} />
            </div>

            <div className="admin-image-field">

              <label>
                Image URL
              </label>

              <input
                type="text"
                name="image"
                placeholder="https://example.com/product-image.jpg"
                value={form.image}
                onChange={handleChange}
              />

            </div>

          </div>


          {form.image && (
            <div className="admin-image-preview">
              <img
                src={form.image}
                alt="Product preview"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />
            </div>
          )}

        </div>


        {/* FEATURES */}

        <div className="admin-form-card">

          <div className="admin-form-card-header">
            <h2>Product Features</h2>
            <p>
              Add important features of this product.
            </p>
          </div>


          <div className="admin-feature-input">

            <input
              type="text"
              placeholder="e.g. Soft cotton filling"
              value={feature}
              onChange={(e) =>
                setFeature(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
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


          {form.features.length > 0 && (
            <div className="admin-features-list">

              {form.features.map(
                (item, index) => (
                  <div
                    className="admin-feature-tag"
                    key={`${item}-${index}`}
                  >
                    <span>{item}</span>

                    <button
                      type="button"
                      onClick={() =>
                        removeFeature(index)
                      }
                    >
                      <X size={14} />
                    </button>
                  </div>
                )
              )}

            </div>
          )}

        </div>


        {/* STATUS */}

        <div className="admin-form-card">

          <div className="admin-form-status">

            <div>
              <h2>Product Status</h2>
              <p>
                Active products are visible to customers.
              </p>
            </div>

            <label className="admin-switch">

              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />

              <span></span>

            </label>

          </div>

        </div>


        {/* MESSAGES */}

        {error && (
          <div className="admin-form-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-form-success">
            {success}
          </div>
        )}


        {/* ACTIONS */}

        <div className="admin-form-actions">

          <button
            type="button"
            className="admin-cancel-btn"
            onClick={() =>
              navigate("/admin/products")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Adding Product..."
              : "Add Product"}
          </button>

        </div>

      </form>

    </section>
  );
};

export default AddProduct;

