
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Star,
  UserRound,
  Send,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Heart,
  Quote,
  LoaderCircle,
} from "lucide-react";
import "./ProductReviews.css";

const API_URL = "http://localhost:3000/api";

/* =========================================================
   PRODUCT HELPERS
========================================================= */

const getProductId = (product) =>
  String(product?._id || product?.id || "");

const getProductName = (product) =>
  product?.name || product?.title || "MAAMTA Product";

/* =========================================================
   STAR RATING
========================================================= */

function StarRating({
  rating = 0,
  interactive = false,
  onChange,
  size = 17,
}) {
  return (
    <div
      className={`pr-stars ${interactive ? "pr-stars-interactive" : ""}`}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) =>
        interactive ? (
          <button
            key={star}
            type="button"
            className={`pr-star-button ${
              star <= rating ? "is-active" : ""
            }`}
            onClick={() => onChange?.(star)}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            aria-checked={rating === star}
            role="radio"
          >
            <Star
              size={size}
              fill={star <= rating ? "currentColor" : "none"}
              strokeWidth={1.8}
            />
          </button>
        ) : (
          <Star
            key={star}
            size={size}
            className={
              star <= rating ? "pr-star-filled" : "pr-star-empty"
            }
            fill={star <= rating ? "currentColor" : "none"}
            strokeWidth={1.8}
          />
        )
      )}
    </div>
  );
}

/* =========================================================
   MAIN PRODUCT REVIEWS COMPONENT
========================================================= */

export default function ProductReviews({
  product,
  productId: suppliedId,
}) {
  const resolvedProductId = String(
    suppliedId || getProductId(product) || ""
  );

  const productName = getProductName(product);

  const [customerReviews, setCustomerReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    city: "",
    email: "",
    rating: 5,
    message: "",
  });

  /* =======================================================
     FETCH REVIEWS FOR CURRENT PRODUCT ONLY
  ======================================================= */

  const loadReviews = useCallback(async () => {
    if (!resolvedProductId) {
      setCustomerReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/reviews`, {
        params: {
          productId: resolvedProductId,
        },
      });

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.reviews || [];

      const currentProductReviews = data.filter((review) => {
        const reviewProductId = String(
          review.productId?._id ||
            review.productId?.id ||
            review.productId ||
            ""
        );

        return reviewProductId === resolvedProductId;
      });

      setCustomerReviews(currentProductReviews);
    } catch (error) {
      console.error("Unable to load product reviews:", error);

      setCustomerReviews([]);
      toast.error("Could not load customer reviews.");
    } finally {
      setLoading(false);
    }
  }, [resolvedProductId]);

  useEffect(() => {
    let cancelled = false;

    const fetchReviews = async () => {
      if (!resolvedProductId) {
        setCustomerReviews([]);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/reviews`, {
          params: {
            productId: resolvedProductId,
          },
        });

        if (cancelled) return;

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.reviews || [];

        const currentProductReviews = data.filter((review) => {
          const reviewProductId = String(
            review.productId?._id ||
              review.productId?.id ||
              review.productId ||
              ""
          );

          return reviewProductId === resolvedProductId;
        });

        setCustomerReviews(currentProductReviews);
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to load product reviews:", error);
          setCustomerReviews([]);
          toast.error("Could not load customer reviews.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchReviews();

    return () => {
      cancelled = true;
    };
  }, [resolvedProductId]);

  /* =======================================================
     REVIEW STATISTICS
  ======================================================= */

  const allReviews = useMemo(
    () => customerReviews,
    [customerReviews]
  );

  const averageRating = useMemo(() => {
    if (allReviews.length === 0) return 0;

    const total = allReviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0
    );

    return total / allReviews.length;
  }, [allReviews]);

  const ratingCounts = useMemo(() => {
    const counts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    allReviews.forEach((review) => {
      const rating = Number(review.rating);

      if (rating >= 1 && rating <= 5) {
        counts[rating] += 1;
      }
    });

    return counts;
  }, [allReviews]);

  /* =======================================================
     FORM HANDLERS
  ======================================================= */

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setForm((previous) => ({
      ...previous,
      rating,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!resolvedProductId) {
      toast.error("This product could not be identified.");
      return;
    }

    if (!form.name.trim() || !form.city.trim()) {
      toast.error("Please enter your name and city.");
      return;
    }

    if (form.message.trim().length < 10) {
      toast.error("Please write at least 10 characters in your review.");
      return;
    }

    if (form.message.trim().length > 1000) {
      toast.error("Your review must be 1000 characters or fewer.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        city: form.city.trim(),
        email: form.email.trim(),
        rating: Number(form.rating),
        message: form.message.trim(),
        productId: resolvedProductId,
      };

      const response = await axios.post(
        `${API_URL}/reviews`,
        payload
      );

      const savedReview = response.data?.review || response.data;

      if (savedReview?._id) {
        const savedProductId = String(
          savedReview.productId?._id ||
            savedReview.productId?.id ||
            savedReview.productId ||
            resolvedProductId
        );

        if (savedProductId === resolvedProductId) {
          setCustomerReviews((previous) => [
            savedReview,
            ...previous.filter(
              (item) => String(item._id) !== String(savedReview._id)
            ),
          ]);
        }
      }

      setForm({
        name: "",
        city: "",
        email: "",
        rating: 5,
        message: "",
      });

      toast.success("Thank you! Your review has been submitted.");

      await loadReviews();
    } catch (error) {
      console.error(
        "Unable to submit review:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Your review could not be submitted. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     DATE FORMATTER
  ======================================================= */



  /* =======================================================
     UI
  ======================================================= */

  return (
    <section
      className="product-reviews-section"
      aria-labelledby="product-reviews-heading"
    >
      <div className="pr-container">

        {/* HEADER */}

        <div className="pr-heading">
          <div className="pr-heading-icon">
            <Heart size={22} />
          </div>

          <span className="pr-eyebrow">
            LOVE NOTES FROM OUR COMMUNITY
          </span>

          <h2 id="product-reviews-heading">
            What People <span>Are Saying</span>
          </h2>

          <p>
            Every little detail matters. Explore feedback for{" "}
            <strong>{productName}</strong> and share your own experience.
          </p>

          <div className="pr-heading-decoration">
            <span />
            <Heart size={14} fill="currentColor" />
            <span />
          </div>
        </div>

        {/* RATING SUMMARY */}

        <div className="pr-summary">
          <div className="pr-summary-main">
            <div className="pr-average">
              {averageRating.toFixed(1)}
            </div>

            <StarRating
              rating={Math.round(averageRating)}
              size={20}
            />

            <p>Overall rating</p>

            <span>
              {allReviews.length}{" "}
              {allReviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>

          <div className="pr-rating-breakdown">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingCounts[rating];

              const percentage = allReviews.length
                ? (count / allReviews.length) * 100
                : 0;

              return (
                <div className="pr-rating-row" key={rating}>
                  <span className="pr-rating-label">
                    {rating}{" "}
                    <Star size={13} fill="currentColor" />
                  </span>

                  <div
                    className="pr-rating-track"
                    role="progressbar"
                    aria-label={`${rating} star reviews`}
                    aria-valuemin={0}
                    aria-valuemax={allReviews.length || 1}
                    aria-valuenow={count}
                  >
                    <span style={{ width: `${percentage}%` }} />
                  </div>

                  <span className="pr-rating-count">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pr-summary-note">
            <ShieldCheck size={25} />

            <div>
              <strong>Made with care</strong>
              <p>
                Your feedback helps us improve the MAAMTA experience.
              </p>
            </div>
          </div>
        </div>

        {/* REVIEW LIST HEADING */}

        <div className="pr-list-heading">
          <div>
            <span className="pr-eyebrow">
              CUSTOMER EXPERIENCES
            </span>

            <h3>Reviews & Kind Words</h3>
          </div>

          <span className="pr-review-count">
            {allReviews.length} total
          </span>
        </div>

        {/* CUSTOMER REVIEWS ONLY */}

        {loading ? (
          <div className="pr-loading">
            <LoaderCircle className="pr-spinner" size={30} />
            <p>Loading reviews...</p>
          </div>
        ) : allReviews.length === 0 ? (
          <div className="pr-loading pr-empty-reviews">
            <MessageCircle size={30} />

            <h3>No reviews yet</h3>

            <p>
              Be the first to share your experience with this product.
            </p>
          </div>
        ) : (
          <div className="pr-review-grid">
            {allReviews.map((review, index) => {
              const displayName = review.name || "MAAMTA Customer";
              const initial = displayName.trim().charAt(0).toUpperCase();

              return (
                <article
                  className="pr-review-card"
                  key={review._id || `review-${index}`}
                  style={{ "--review-index": index % 8 }}
                >
                  <div className="pr-card-top">
                    <div className="pr-avatar">
                      {initial || <UserRound size={20} />}
                    </div>

                    <div className="pr-review-author">
                      <h4>{displayName}</h4>
                      <p>{review.city || "MAAMTA Community"}</p>
                    </div>

                    <Quote
                      className="pr-quote-icon"
                      size={26}
                      fill="currentColor"
                    />
                  </div>

                  <StarRating
                    rating={Number(review.rating || 0)}
                    size={16}
                  />

                  <p className="pr-review-message">
                    {review.message}
                  </p>

                  <div className="pr-card-footer">
                   
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* WRITE A REVIEW */}

        <div className="pr-form-section">
          <div className="pr-form-intro">
            <div className="pr-form-icon">
              <MessageCircle size={25} />
            </div>

            <span className="pr-eyebrow">
              YOUR VOICE MATTERS
            </span>

            <h3>Share Your Experience</h3>

            <p>
              Tried this product? Tell us what you think. Your review
              will be connected to this product only.
            </p>
          </div>

          <form className="pr-review-form" onSubmit={handleSubmit}>
            <div className="pr-form-rating">
              <label>Your rating</label>

              <div className="pr-rating-picker">
                <StarRating
                  rating={Number(form.rating)}
                  interactive
                  onChange={handleRatingChange}
                  size={27}
                />

                <span>
                  {
                    {
                      1: "Not satisfied",
                      2: "Could be better",
                      3: "It's good",
                      4: "Really lovely",
                      5: "Absolutely love it!",
                    }[form.rating]
                  }
                </span>
              </div>
            </div>

            <div className="pr-form-grid">
              <div className="pr-field">
                <label htmlFor="pr-review-name">
                  Your name *
                </label>

                <input
                  id="pr-review-name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleInputChange}
                  maxLength={80}
                  required
                />
              </div>

              <div className="pr-field">
                <label htmlFor="pr-review-city">
                  Your city *
                </label>

                <input
                  id="pr-review-city"
                  name="city"
                  type="text"
                  placeholder="e.g. Islamabad"
                  value={form.city}
                  onChange={handleInputChange}
                  maxLength={80}
                  required
                />
              </div>

              <div className="pr-field pr-field-full">
                <label htmlFor="pr-review-email">
                  Email address (optional)
                </label>

                <input
                  id="pr-review-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleInputChange}
                  maxLength={150}
                />
              </div>

              <div className="pr-field pr-field-full">
                <label htmlFor="pr-review-message">
                  Your review *
                </label>

                <textarea
                  id="pr-review-message"
                  name="message"
                  placeholder="What did you like about this product?"
                  value={form.message}
                  onChange={handleInputChange}
                  minLength={10}
                  maxLength={1000}
                  rows={5}
                  required
                />

                <span className="pr-character-count">
                  {form.message.length}/1000 characters
                </span>
              </div>
            </div>

            <div className="pr-form-bottom">
              <p>
                <ShieldCheck size={16} />
                Please keep your feedback kind and respectful.
              </p>

              <button
                className="pr-submit-button"
                type="submit"
                disabled={submitting || !resolvedProductId}
              >
                {submitting ? (
                  <>
                    <LoaderCircle
                      className="pr-spinner"
                      size={18}
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* FOOTER */}

        <div className="pr-footer-note">
          <Sparkles size={17} />

          <p>
            <strong>MAAMTA</strong> — Comfort, care, and love in
            every little detail.
          </p>
        </div>
      </div>
    </section>
  );
}
