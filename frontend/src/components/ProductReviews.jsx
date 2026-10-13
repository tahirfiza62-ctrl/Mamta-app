
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
   PRODUCT REVIEW HELPERS
========================================================= */

const getProductId = (product) =>
  String(product?._id || product?.id || "");

const getProductName = (product) =>
  product?.name || product?.title || "MAMTA Product";

const getCategory = (product) =>
  String(product?.category || "").toLowerCase();

/*
  These are SAMPLE / DEMO reviews.
  They are displayed separately from real reviews fetched
  from MongoDB. Replace these samples with real customer
  testimonials before presenting them as genuine reviews.
*/

const reviewTemplates = {
  maternity: [
    {
      name: "Ayesha Khan",
      city: "Islamabad",
      rating: 5,
      message:
        "The pillow feels soft and supportive. I really like how comfortably it fits around me while I rest.",
    },
    {
      name: "Fatima Ahmed",
      city: "Rawalpindi",
      rating: 5,
      message:
        "The fabric feels gentle, and the cushioning is lovely. It has become a comfortable part of my resting routine.",
    },
    {
      name: "Sana Malik",
      city: "Lahore",
      rating: 4,
      message:
        "I like the shape and softness of this pillow. It is comfortable to use and looks beautiful too.",
    },
    {
      name: "Hira Sheikh",
      city: "Karachi",
      rating: 5,
      message:
        "The overall finish is neat, and the pillow feels cozy. I am happy with the quality and presentation.",
    },
  ],

  baby: [
    {
      name: "Maryam Ali",
      city: "Islamabad",
      rating: 5,
      message:
        "The material feels soft and lovely. I especially appreciate the neat stitching and gentle fabric.",
    },
    {
      name: "Noor Fatima",
      city: "Faisalabad",
      rating: 4,
      message:
        "The design is adorable, and the fabric feels pleasant to touch. It is a sweet addition to our nursery.",
    },
    {
      name: "Zainab Tariq",
      city: "Multan",
      rating: 5,
      message:
        "The product looks just as lovely as I expected. The finishing and color make it feel thoughtfully made.",
    },
    {
      name: "Iqra Hussain",
      city: "Peshawar",
      rating: 5,
      message:
        "I love the simple design and soft feel. The quality looks good, and the product arrived looking lovely.",
    },
  ],

  nursing: [
    {
      name: "Amna Raza",
      city: "Rawalpindi",
      rating: 5,
      message:
        "I like the practical design and comfortable cushioning. It makes setting up my feeding space easier.",
    },
    {
      name: "Eman Shah",
      city: "Lahore",
      rating: 4,
      message:
        "The shape is useful, and the fabric feels soft. It is a thoughtful product for a mother's daily routine.",
    },
    {
      name: "Laiba Noor",
      city: "Islamabad",
      rating: 5,
      message:
        "The design is convenient, and the stitching looks tidy. I appreciate the attention to the small details.",
    },
    {
      name: "Rabia Aslam",
      city: "Sialkot",
      rating: 5,
      message:
        "A lovely and practical product. I like its appearance, soft texture, and the way it fits into my routine.",
    },
  ],

  elders: [
    {
      name: "Samina Begum",
      city: "Islamabad",
      rating: 5,
      message:
        "The pillow feels comfortable and has a neat finish. I appreciate the softness and simple design.",
    },
    {
      name: "Nadia Iqbal",
      city: "Gujranwala",
      rating: 4,
      message:
        "The material feels pleasant, and the pillow looks well made. It is a nice addition to our home.",
    },
    {
      name: "Shazia Ahmed",
      city: "Rawalpindi",
      rating: 5,
      message:
        "I like the comfortable feel and clean stitching. The overall quality and presentation are lovely.",
    },
    {
      name: "Kiran Mahmood",
      city: "Sargodha",
      rating: 5,
      message:
        "The design is simple and practical. The fabric feels soft, and the product has a nice, tidy finish.",
    },
  ],

  accessories: [
    {
      name: "Mehak Asif",
      city: "Islamabad",
      rating: 5,
      message:
        "The finishing is neat, and the design is lovely. It is a thoughtful little addition to my collection.",
    },
    {
      name: "Anum Khalid",
      city: "Karachi",
      rating: 4,
      message:
        "I like the simple design and overall presentation. The quality feels nice, and the product is easy to use.",
    },
    {
      name: "Mishal Arif",
      city: "Lahore",
      rating: 5,
      message:
        "The product looks lovely in person. I appreciate the neat details and the care put into its presentation.",
    },
    {
      name: "Sidra Younis",
      city: "Peshawar",
      rating: 5,
      message:
        "A beautiful little product with a clean finish. I like its appearance and the attention to detail.",
    },
  ],

  general: [
    {
      name: "Areeba Khan",
      city: "Islamabad",
      rating: 5,
      message:
        "The product has a lovely finish and thoughtful design. I appreciate the attention to detail.",
    },
    {
      name: "Maham Ali",
      city: "Rawalpindi",
      rating: 4,
      message:
        "The overall presentation is lovely, and the material feels nice. It is a pleasant addition to our home.",
    },
    {
      name: "Dua Ahmed",
      city: "Lahore",
      rating: 5,
      message:
        "I like the design and finishing. The product feels thoughtfully made and looks beautiful.",
    },
    {
      name: "Alina Shah",
      city: "Multan",
      rating: 5,
      message:
        "The quality looks good, and the details are neat. I am pleased with the overall look and feel.",
    },
  ],
};

/* Determine which demo set matches the product. */
function getReviewGroup(product) {
  const category = getCategory(product);
  const name = getProductName(product).toLowerCase();
  const text = `${category} ${name}`;

  if (
    text.includes("maternity") ||
    text.includes("pregnancy") ||
    text.includes("pregnant")
  ) {
    return "maternity";
  }

  if (
    text.includes("baby") ||
    text.includes("newborn") ||
    text.includes("kid") ||
    text.includes("infant")
  ) {
    return "baby";
  }

  if (
    text.includes("nursing") ||
    text.includes("feeding") ||
    text.includes("breastfeeding")
  ) {
    return "nursing";
  }

  if (
    text.includes("elder") ||
    text.includes("senior") ||
    text.includes("orthopedic")
  ) {
    return "elders";
  }

  if (
    text.includes("accessor") ||
    text.includes("cover") ||
    text.includes("case")
  ) {
    return "accessories";
  }

  return "general";
}

/*
  Generate a product-specific set of four sample reviews.
  A stable hash selects variations using the product name
  and ID, so products in the same category need not show
  identical demo comments.

  These remain demo content, not verified purchases.
*/
function getDemoReviews(product) {
  const name = getProductName(product);
  const id = getProductId(product);
  const group = reviewTemplates[getReviewGroup(product)];

  let hash = 0;
  const seed = `${name}-${id}`;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const shift = hash % group.length;

  return group.map((review, index) => {
    const selected = group[(index + shift) % group.length];

    return {
      ...selected,
      _id: `demo-${id || name}-${index}`,
      isDemo: true,
      date: null,
    };
  });
}

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
            className={star <= rating ? "pr-star-filled" : "pr-star-empty"}
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

export default function ProductReviews({ product, productId: suppliedId }) {
  const resolvedProductId = String(
    suppliedId || getProductId(product) || ""
  );

  const demoReviews = useMemo(
    () => getDemoReviews(product),
    [product]
  );

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

  /*
    Load only reviews belonging to the current product.
    Clear old product reviews immediately when switching
    from one product detail page to another.
  */

const loadReviews = useCallback(async () => {
  // Defer state updates so they don't run synchronously
  // when this function is called from useEffect.
  await Promise.resolve();

  if (!resolvedProductId) {
    setCustomerReviews([]);
    setLoading(false);
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/reviews`, {
      params: { productId: resolvedProductId },
    });

    const data = Array.isArray(response.data)
      ? response.data
      : response.data?.reviews || [];

    const currentProductReviews = data.filter(
      (review) =>
        String(
          review.productId?._id ||
            review.productId?.id ||
            review.productId ||
            ""
        ) === resolvedProductId
    );

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
    await Promise.resolve();

    if (cancelled) return;

    setLoading(true);
    await loadReviews();
  };

  fetchReviews();

  return () => {
    cancelled = true;
  };
}, [loadReviews]);

  const allReviews = useMemo(
    () => [...customerReviews, ...demoReviews],
    [customerReviews, demoReviews]
  );

  const averageRating = useMemo(() => {
    if (!allReviews.length) return 0;

    const total = allReviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0
    );

    return total / allReviews.length;
  }, [allReviews]);

  const ratingCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    allReviews.forEach((review) => {
      const rating = Number(review.rating);
      if (rating >= 1 && rating <= 5) {
        counts[rating] += 1;
      }
    });

    return counts;
  }, [allReviews]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setForm((previous) => ({ ...previous, rating }));
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

      /*
        Add the saved review immediately when the API returns
        a review object. The database remains the source of truth.
      */
      if (
        savedReview &&
        savedReview._id &&
        String(
          savedReview.productId?._id ||
            savedReview.productId?.id ||
            savedReview.productId ||
            resolvedProductId
        ) === resolvedProductId
      ) {
        setCustomerReviews((previous) => [
          savedReview,
          ...previous.filter(
            (item) => String(item._id) !== String(savedReview._id)
          ),
        ]);
      }

      setForm({
        name: "",
        city: "",
        email: "",
        rating: 5,
        message: "",
      });

      toast.success(
        "Thank you! Your review has been submitted."
      );

      /*
        Re-fetch to synchronize with MongoDB.
        Demo reviews remain because they are maintained separately.
      */
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

  const formatDate = (date) => {
    if (!date) return "Sample review";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Customer review";

    return parsedDate.toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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
            <strong>{getProductName(product)}</strong> and share
            your own experience.
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

            <StarRating rating={Math.round(averageRating)} size={20} />

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
                    {rating} <Star size={13} fill="currentColor" />
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

                  <span className="pr-rating-count">{count}</span>
                </div>
              );
            })}
          </div>

          <div className="pr-summary-note">
            <ShieldCheck size={25} />
            <div>
              <strong>Made with care</strong>
              <p>
                Your feedback helps us improve the MAMTA experience.
              </p>
            </div>
          </div>
        </div>

        {/* REVIEW LIST */}
        <div className="pr-list-heading">
          <div>
            <span className="pr-eyebrow">CUSTOMER EXPERIENCES</span>
            <h3>Reviews & Kind Words</h3>
          </div>

          <span className="pr-review-count">
            {allReviews.length} total
          </span>
        </div>

        {loading ? (
          <div className="pr-loading">
            <LoaderCircle className="pr-spinner" size={30} />
            <p>Loading reviews...</p>
          </div>
        ) : (
          <div className="pr-review-grid">
            {allReviews.map((review, index) => {
              const displayName = review.name || "MAMTA Customer";
              const initial = displayName.trim().charAt(0).toUpperCase();

              return (
                <article
                  className="pr-review-card"
                  key={`${review.isDemo ? "demo" : "customer"}-${review._id}`}
                  style={{ "--review-index": index % 8 }}
                >
                  <div className="pr-card-top">
                    <div className="pr-avatar">
                      {initial || <UserRound size={20} />}
                    </div>

                    <div className="pr-review-author">
                      <h4>{displayName}</h4>
                      <p>
                        {review.city || "MAMTA Community"}
                      </p>
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
  {!review.isDemo && (review.createdAt || review.date) && (
    <span className="pr-review-date">
      {formatDate(review.createdAt || review.date)}
    </span>
  )}
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

            <span className="pr-eyebrow">YOUR VOICE MATTERS</span>

            <h3>Share Your Experience</h3>

            <p>
              Tried this product? Tell us what you think. Your
              review will be connected to this product only.
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
                <label htmlFor="pr-review-name">Your name *</label>
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
                <label htmlFor="pr-review-city">Your city *</label>
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
                    <LoaderCircle className="pr-spinner" size={18} />
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
            <strong>MAMTA</strong> — Comfort, care, and love in
            every little detail.
          </p>
        </div>
      </div>
    </section>
  );
}
