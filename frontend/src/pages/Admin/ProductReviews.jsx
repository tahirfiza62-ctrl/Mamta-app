
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Star,
  Search,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  MessageSquare,
  CheckCircle2,
  Clock3,
  Package,
  Save,
} from "lucide-react";
import "./ProductReviews.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mamta-app-8.onrender.com/api";

const getAdminHeaders = () => {
  const token = localStorage.getItem("mamta_admin_token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

const getReviews = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.reviews)) return data.reviews;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return parsed.toLocaleDateString("en-PK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getProductName = (review) => {
  if (review.productId && typeof review.productId === "object") {
    return review.productId.name || "Product";
  }

  if (review.productId) {
    return `Product ID: ${review.productId}`;
  }

  return "General testimonial";
};
function RatingStars({ rating }) {
  return (
    <div className="mamta-admin-review-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={15}
          fill={star <= Number(rating) ? "currentColor" : "none"}
        />
      ))}
      <span>{Number(rating) || 0}/5</span>
    </div>
  );
}

const emptyForm = {
  name: "",
  city: "",
  rating: 5,
  message: "",
  approved: true,
};

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchReviews = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await axios.get(
        `${API_URL}/reviews/admin/all`,
        {
          headers: getAdminHeaders(),
          timeout: 15000,
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Unable to load reviews."
        );
      }

      setReviews(getReviews(response.data));
    } catch (error) {
      console.error(
        "ADMIN REVIEWS ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.status === 401 ||
        error.response?.status === 403
          ? "Admin authentication failed. Please sign in again."
          : error.response?.data?.message ||
              error.message ||
              "Unable to load reviews."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter(
      (review) => review.approved !== false
    ).length;
    const pending = total - approved;

    const average = total
      ? (
          reviews.reduce(
            (sum, review) => sum + Number(review.rating || 0),
            0
          ) / total
        ).toFixed(1)
      : "0.0";

    return { total, approved, pending, average };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reviews.filter((review) => {
      const productName = getProductName(review);

      const matchesSearch =
        !query ||
        [
          review.name,
          review.city,
          review.message,
          review.email,
          productName,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesRating =
        ratingFilter === "all" ||
        Number(review.rating) === Number(ratingFilter);

      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "product" && Boolean(review.productId)) ||
        (typeFilter === "general" && !review.productId);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "approved" &&
          review.approved !== false) ||
        (statusFilter === "pending" &&
          review.approved === false);

      return (
        matchesSearch &&
        matchesRating &&
        matchesType &&
        matchesStatus
      );
    });
  }, [reviews, search, ratingFilter, typeFilter, statusFilter]);

  const openEdit = (review) => {
    setEditingReview(review);

    setFormData({
      name: review.name || "",
      city: review.city || "",
      rating: Number(review.rating) || 5,
      message: review.message || review.text || "",
      approved: review.approved !== false,
    });
  };

  const closeEdit = () => {
    if (saving) return;

    setEditingReview(null);
    setFormData(emptyForm);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!editingReview?._id) {
      toast.error("Review ID is missing.");
      return;
    }

    const name = formData.name.trim();
    const city = formData.city.trim();
    const message = formData.message.trim();
    const rating = Number(formData.rating);

    if (name.length < 2 || name.length > 50) {
      toast.error("Name must contain 2–50 characters.");
      return;
    }

    if (city.length < 2 || city.length > 50) {
      toast.error("City must contain 2–50 characters.");
      return;
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      toast.error("Please select a rating from 1 to 5.");
      return;
    }

    if (message.length < 10 || message.length > 500) {
      toast.error("Review must contain 10–500 characters.");
      return;
    }

    setSaving(true);

    try {
      const response = await axios.put(
        `${API_URL}/reviews/${editingReview._id}`,
        {
          name,
          city,
          rating,
          message,
          approved: Boolean(formData.approved),
        },
        {
          headers: getAdminHeaders(),
          timeout: 15000,
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Unable to update review."
        );
      }

      const updatedReview = response.data?.review;

      if (updatedReview?._id) {
        setReviews((previous) =>
          previous.map((review) =>
            review._id === updatedReview._id
              ? { ...review, ...updatedReview }
              : review
          )
        );
      } else {
        await fetchReviews(true);
      }

      setEditingReview(null);
      setFormData(emptyForm);
      toast.success("Review updated successfully.");
    } catch (error) {
      console.error(
        "UPDATE REVIEW ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to update review."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (review) => {
    if (!review?._id) {
      toast.error("Review ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      `Delete the review from ${review.name || "this customer"}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(review._id);

    try {
      const response = await axios.delete(
        `${API_URL}/reviews/${review._id}`,
        {
          headers: getAdminHeaders(),
          timeout: 15000,
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Unable to delete review."
        );
      }

      setReviews((previous) =>
        previous.filter((item) => item._id !== review._id)
      );

      if (editingReview?._id === review._id) {
        setEditingReview(null);
      }

      toast.success("Review deleted successfully.");
    } catch (error) {
      console.error(
        "DELETE REVIEW ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to delete review."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const toggleApproval = async (review) => {
    try {
      const response = await axios.put(
        `${API_URL}/reviews/${review._id}`,
        {
          name: review.name,
          city: review.city || review.place || "",
          rating: Number(review.rating),
          message: review.message || review.text || review.review || "",
          approved: review.approved === false,
        },
        {
          headers: getAdminHeaders(),
          timeout: 15000,
        }
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Unable to update review status."
        );
      }

      const updatedReview = response.data?.review;

      if (updatedReview?._id) {
        setReviews((previous) =>
          previous.map((item) =>
            item._id === updatedReview._id
              ? { ...item, ...updatedReview }
              : item
          )
        );
      } else {
        await fetchReviews(true);
      }

      toast.success(
        review.approved === false
          ? "Review approved."
          : "Review hidden from customers."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to update review status."
      );
    }
  };

  return (
    <section className="mamta-admin-reviews">
      <header className="mamta-admin-reviews-header">
        <div>
          <span className="mamta-admin-reviews-eyebrow">
            CUSTOMER EXPERIENCE
          </span>
          <h1>Reviews Management</h1>
          <p>
            Manage customer feedback and product reviews for MAMTA.
          </p>
        </div>

        <button
          type="button"
          className="mamta-admin-refresh"
          onClick={() => fetchReviews(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw
            size={17}
            className={refreshing ? "mamta-spin" : ""}
          />
          Refresh
        </button>
      </header>

      <div className="mamta-admin-review-stats">
        <article className="mamta-admin-stat-card">
          <span className="mamta-admin-stat-icon">
            <MessageSquare size={21} />
          </span>
          <div>
            <span>Total reviews</span>
            <strong>{stats.total}</strong>
          </div>
        </article>

        <article className="mamta-admin-stat-card">
          <span className="mamta-admin-stat-icon">
            <CheckCircle2 size={21} />
          </span>
          <div>
            <span>Approved</span>
            <strong>{stats.approved}</strong>
          </div>
        </article>

        <article className="mamta-admin-stat-card">
          <span className="mamta-admin-stat-icon">
            <Clock3 size={21} />
          </span>
          <div>
            <span>Hidden / pending</span>
            <strong>{stats.pending}</strong>
          </div>
        </article>

        <article className="mamta-admin-stat-card">
          <span className="mamta-admin-stat-icon">
            <Star size={21} />
          </span>
          <div>
            <span>Average rating</span>
            <strong>{stats.average}<small> / 5</small></strong>
          </div>
        </article>
      </div>

      <div className="mamta-admin-review-toolbar">
        <label className="mamta-admin-review-search">
          <Search size={19} />
          <input
            type="search"
            placeholder="Search customer, city, product or review..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <select
          aria-label="Filter by rating"
          value={ratingFilter}
          onChange={(event) => setRatingFilter(event.target.value)}
        >
          <option value="all">All ratings</option>
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={String(rating)}>
              {rating} stars
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by review type"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
        >
          <option value="all">All types</option>
          <option value="product">Product reviews</option>
          <option value="general">General testimonials</option>
        </select>

        <select
          aria-label="Filter by approval status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Hidden / pending</option>
        </select>
      </div>

      <div className="mamta-admin-review-results">
        <span>
          Showing <strong>{filteredReviews.length}</strong> of{" "}
          <strong>{reviews.length}</strong> reviews
        </span>
      </div>

      {loading ? (
        <div className="mamta-admin-review-state">
          <RefreshCw size={25} className="mamta-spin" />
          <p>Loading reviews from MongoDB...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="mamta-admin-review-state">
          <MessageSquare size={34} />
          <h3>No reviews found</h3>
          <p>
            {reviews.length
              ? "Try changing your search or filters."
              : "Customer reviews will appear here after they are saved."}
          </p>
          <button
            type="button"
            className="mamta-admin-refresh"
            onClick={() => fetchReviews(true)}
          >
            Refresh reviews
          </button>
        </div>
      ) : (
        <div className="mamta-admin-review-list">
          {filteredReviews.map((review) => (
            <article
              className="mamta-admin-review-card"
              key={review._id}
            >
              <div className="mamta-admin-review-card-top">
                <div className="mamta-admin-review-person">
                  <div className="mamta-admin-review-avatar">
                    {(review.name || "C").charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{review.name || "Customer"}</h3>
                    <p>
                      {review.city || review.place || "City unavailable"}
                      {review.email ? ` · ${review.email}` : ""}
                    </p>
                  </div>
                </div>

                <span
                  className={`mamta-admin-review-status ${
                    review.approved === false
                      ? "is-hidden"
                      : "is-approved"
                  }`}
                >
                  {review.approved === false ? "Hidden" : "Approved"}
                </span>
              </div>

              <RatingStars rating={review.rating} />

              <p className="mamta-admin-review-message">
                {review.message || review.text || review.review || ""}
              </p>

              <div className="mamta-admin-review-meta">
                <span>
                  <Package size={15} />
                  {getProductName(review)}
                </span>
                <span>{formatDate(review.createdAt)}</span>
              </div>

              <div className="mamta-admin-review-actions">
                <button
                  type="button"
                  className="mamta-admin-action-approval"
                  onClick={() => toggleApproval(review)}
                >
                  {review.approved === false
                    ? "Approve review"
                    : "Hide review"}
                </button>

                <div className="mamta-admin-action-group">
                  <button
                    type="button"
                    className="mamta-admin-action-edit"
                    onClick={() => openEdit(review)}
                    aria-label={`Edit review by ${review.name}`}
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="mamta-admin-action-delete"
                    onClick={() => handleDelete(review)}
                    disabled={deletingId === review._id}
                    aria-label={`Delete review by ${review.name}`}
                  >
                    <Trash2 size={16} />
                    {deletingId === review._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingReview && (
        <div
          className="mamta-review-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEdit();
          }}
        >
          <section
            className="mamta-review-edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mamta-review-edit-title"
          >
            <div className="mamta-review-modal-heading">
              <div>
                <span className="mamta-admin-reviews-eyebrow">
                  REVIEW MANAGEMENT
                </span>
                <h2 id="mamta-review-edit-title">Edit Review</h2>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                aria-label="Close edit dialog"
              >
                <X size={21} />
              </button>
            </div>

            <form
              className="mamta-review-edit-form"
              onSubmit={handleSave}
            >
              <div className="mamta-review-edit-grid">
                <label>
                  Customer name
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    minLength={2}
                    maxLength={50}
                    required
                  />
                </label>

                <label>
                  City
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    minLength={2}
                    maxLength={50}
                    required
                  />
                </label>
              </div>

              <label>
                Rating
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleFormChange}
                  required
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} {rating === 1 ? "star" : "stars"}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Review message
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={5}
                  minLength={10}
                  maxLength={500}
                  required
                />
                <small>{formData.message.length}/500 characters</small>
              </label>

              <label className="mamta-review-approval-checkbox">
                <input
                  type="checkbox"
                  checked={Boolean(formData.approved)}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      approved: event.target.checked,
                    }))
                  }
                />
                Show this review to customers
              </label>

              <div className="mamta-review-modal-actions">
                <button
                  type="button"
                  className="mamta-review-cancel"
                  onClick={closeEdit}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="mamta-review-save"
                  disabled={saving}
                >
                  <Save size={17} />
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
