
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Star,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
  MessageSquareQuote,
} from "lucide-react";

import "./AdminReviews.css";

const API_URL = "http://localhost:3000/api";

const emptyForm = {
  name: "",
  city: "",
  rating: 5,
  message: "",
};

const normalizeReviews = (data) => {
  if (!Array.isArray(data)) return [];

  return data.map((review) => ({
    ...review,
    city: review.city || review.place || "",
    message: review.message || review.text || review.review || "",
  }));
};

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const getToken = () =>
    localStorage.getItem("mamta_admin_token");

  const authConfig = () => ({
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  // Load reviews from the backend.
  const fetchReviews = useCallback(async () => {
    const response = await axios.get(`${API_URL}/reviews`);

    setReviews(normalizeReviews(response.data?.reviews));
  }, []);

  // Initial loading.
  useEffect(() => {
    let cancelled = false;

    const initialLoad = async () => {
      try {
        const response = await axios.get(`${API_URL}/reviews`);

        if (!cancelled) {
          setReviews(normalizeReviews(response.data?.reviews));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("ADMIN REVIEWS ERROR:", error);

          toast.error(
            error.response?.data?.message ||
              "Unable to load reviews. Check your backend."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initialLoad();

    return () => {
      cancelled = true;
    };
  }, []);

  // Refresh reviews.
  const handleRefresh = async () => {
    try {
      setLoading(true);
      await fetchReviews();
    } catch (error) {
      console.error("REFRESH REVIEWS ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to refresh reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  // Start editing.
  const startEdit = (review) => {
    setEditingId(review._id);

    setForm({
      name: review.name || "",
      city: review.city || "",
      rating: Number(review.rating) || 5,
      message: review.message || review.text || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cancel editing.
  const cancelEdit = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  // Handle form changes.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  // Save edited review.
  const handleSave = async (event) => {
    event.preventDefault();

    if (!editingId) {
      toast.error("Select a review to edit.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      city: form.city.trim(),
      rating: Number(form.rating),
      message: form.message.trim(),
    };

    if (payload.name.length < 2 || payload.name.length > 50) {
      toast.error("Name must contain 2–50 characters.");
      return;
    }

    if (payload.city.length < 2 || payload.city.length > 50) {
      toast.error("City must contain 2–50 characters.");
      return;
    }

    if (
      !Number.isInteger(payload.rating) ||
      payload.rating < 1 ||
      payload.rating > 5
    ) {
      toast.error("Choose a rating from 1 to 5.");
      return;
    }

    if (
      payload.message.length < 10 ||
      payload.message.length > 500
    ) {
      toast.error("Review text must contain 10–500 characters.");
      return;
    }

    if (!getToken()) {
      toast.error("Please sign in to the admin panel again.");
      return;
    }

    try {
      setSaving(true);

      await axios.put(
        `${API_URL}/reviews/${editingId}`,
        payload,
        authConfig()
      );

      toast.success("Review updated successfully.");

      cancelEdit();
      await fetchReviews();
    } catch (error) {
      console.error("UPDATE REVIEW ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update review."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete a review.
  const handleDelete = async (review) => {
    const confirmed = window.confirm(
      `Delete the review from ${
        review.name || "this customer"
      }? This cannot be undone.`
    );

    if (!confirmed) return;

    if (!getToken()) {
      toast.error("Please sign in to the admin panel again.");
      return;
    }

    try {
      setDeletingId(review._id);

      await axios.delete(
        `${API_URL}/reviews/${review._id}`,
        authConfig()
      );

      setReviews((previous) =>
        previous.filter((item) => item._id !== review._id)
      );

      if (editingId === review._id) {
        cancelEdit();
      }

      toast.success("Review deleted successfully.");
    } catch (error) {
      console.error("DELETE REVIEW ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to delete review."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="admin-reviews-page">
      <header className="admin-reviews-header">
        <div>
          <span className="admin-reviews-eyebrow">
            CUSTOMER EXPERIENCE
          </span>

          <h1>Reviews</h1>

          <p>
            Read customer feedback and manage the testimonials
            displayed on your MAMTA website.
          </p>
        </div>

        <button
          type="button"
          className="admin-reviews-refresh"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={
              loading ? "admin-review-spinning" : ""
            }
          />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <div className="admin-reviews-summary">
        <div className="admin-reviews-summary-icon">
          <MessageSquareQuote size={23} />
        </div>

        <div>
          <span>Total reviews</span>
          <strong>{reviews.length}</strong>
        </div>
      </div>

      {editingId && (
        <form
          className="admin-review-edit-form"
          onSubmit={handleSave}
        >
          <div className="admin-review-form-heading">
            <div>
              <span>EDIT TESTIMONIAL</span>
              <h2>Update customer review</h2>
            </div>

            <button
              type="button"
              className="admin-review-cancel-icon"
              onClick={cancelEdit}
              aria-label="Cancel editing"
              disabled={saving}
            >
              <X size={20} />
            </button>
          </div>

          <div className="admin-review-form-grid">
            <label>
              Customer name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                minLength={2}
                maxLength={50}
                required
              />
            </label>

            <label>
              City / place
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                minLength={2}
                maxLength={50}
                required
              />
            </label>

            <label>
              Rating
              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                required
              >
                {[5, 4, 3, 2, 1].map((number) => (
                  <option key={number} value={number}>
                    {number} star{number === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-review-message-field">
              Review text
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                minLength={10}
                maxLength={500}
                required
              />

              <small>
                {form.message.length}/500 characters
              </small>
            </label>
          </div>

          <div className="admin-review-form-actions">
            <button
              type="button"
              className="admin-review-secondary-btn"
              onClick={cancelEdit}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-review-primary-btn"
              disabled={saving}
            >
              <Save size={17} />
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-reviews-list-header">
        <h2>All customer reviews</h2>
        <span>{reviews.length} total</span>
      </div>

      {loading ? (
        <div className="admin-reviews-state">
          <RefreshCw
            size={25}
            className="admin-review-spinning"
          />
          <p>Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="admin-reviews-state">
          <MessageSquareQuote size={35} />
          <h3>No reviews yet</h3>
          <p>
            Customer reviews will appear here after submission.
          </p>
        </div>
      ) : (
        <div className="admin-reviews-list">
          {reviews.map((review) => (
            <article
              className="admin-review-card"
              key={review._id}
            >
              <div className="admin-review-card-top">
                <div className="admin-review-avatar">
                  {(review.name || "M")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="admin-review-customer">
                  <h3>{review.name || "Customer"}</h3>
                  <span>
                    {review.city || "Location not provided"}
                  </span>
                </div>

                <div
                  className="admin-review-stars"
                  aria-label={`${Number(review.rating) || 0} out of 5 stars`}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      fill={
                        star <= Number(review.rating)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="admin-review-message">
                {review.message || "No review text available."}
              </p>

              <div className="admin-review-card-footer">
                <span>
                  {review.createdAt
                    ? new Date(
                        review.createdAt
                      ).toLocaleDateString()
                    : "Date unavailable"}
                </span>

                <div className="admin-review-actions">
                  <button
                    type="button"
                    onClick={() => startEdit(review)}
                    className="admin-review-edit-btn"
                    disabled={Boolean(deletingId)}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(review)}
                    className="admin-review-delete-btn"
                    disabled={Boolean(deletingId)}
                  >
                    <Trash2 size={15} />
                    {deletingId === review._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminReviews;
