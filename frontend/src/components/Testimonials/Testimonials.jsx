
import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import axios from "axios";

import ScrollReveal from "../ScrollReveal/ScrollReveal";
import "./Testimonials.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mamta-app-8.onrender.com/api";

const defaultTestimonials = [
  {
    name: "Ayesha K.",
    city: "Islamabad",
    text: "The maternity pillow is beautifully soft and comfortable. I really loved the quality and the thoughtful design.",
    rating: 5,
  },
  {
    name: "Hira M.",
    city: "Lahore",
    text: "The fabric feels so gentle and the pillow looks beautiful too. It has become a lovely part of my daily routine.",
    rating: 5,
  },
  {
    name: "Sana R.",
    city: "Rawalpindi",
    text: "I ordered a baby pillow and absolutely loved it. The quality, softness and packaging were all wonderful.",
    rating: 5,
  },
  {
    name: "Maham A.",
    city: "Karachi",
    text: "MAMTA has such a beautiful collection. Everything feels carefully designed and the quality is excellent.",
    rating: 5,
  },
  {
    name: "Iqra F.",
    city: "Islamabad",
    text: "The nursing pillow is comfortable and supportive. I also really liked the elegant packaging.",
    rating: 5,
  },
  {
    name: "Zoya M.",
    city: "Faisalabad",
    text: "The pillow is soft, cozy and exactly what I was looking for. The whole experience was lovely.",
    rating: 5,
  },
  {
    name: "Anaya S.",
    city: "Multan",
    text: "I purchased one as a gift and it was beautifully received. The design feels simple, elegant and thoughtful.",
    rating: 5,
  },
  {
    name: "Eman T.",
    city: "Peshawar",
    text: "Beautiful products with a very soft and premium feel. I would definitely explore more from the collection.",
    rating: 5,
  },
];

const TestimonialCard = ({ testimonial }) => {
  const rating = Math.min(
    5,
    Math.max(1, Number(testimonial.rating) || 5)
  );

  const reviewText =
    testimonial.text || testimonial.message || "";

  return (
    <article className="testimonial-card">
      <div className="testimonial-top">
        <span className="testimonial-quote">
          <Quote size={24} strokeWidth={1.2} />
        </span>

        <div className="testimonial-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={13}
              strokeWidth={1.4}
              fill={star <= rating ? "currentColor" : "none"}
            />
          ))}
        </div>
      </div>

      <p className="testimonial-text">
        {reviewText ? `“${reviewText}”` : "Thank you for sharing your experience with MAMTA."}
      </p>

      <div className="testimonial-author">
        <div className="author-avatar">
          {(testimonial.name || "M").charAt(0).toUpperCase()}
        </div>

        <div>
          <h3>{testimonial.name || "MAMTA Customer"}</h3>
          <span>{testimonial.city || testimonial.place || ""}</span>
        </div>
      </div>
    </article>
  );
};

const Testimonials = () => {
  const [customerTestimonials, setCustomerTestimonials] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_URL}/reviews`);

        if (
          isMounted &&
          response.data?.success &&
          Array.isArray(response.data.reviews)
        ) {
          const formattedReviews = response.data.reviews
            .map((review) => ({
              ...review,
              name: review.name || "MAMTA Customer",
              city: review.city || review.place || "",
              text: review.text || review.message || "",
              rating: Number(review.rating) || 5,
            }))
            .filter((review) => review.text.trim().length > 0);

          setCustomerTestimonials(formattedReviews);
        }
      } catch (error) {
        console.error("TESTIMONIALS ERROR:", error);
      }
    };

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const testimonials = [
    ...customerTestimonials,
    ...defaultTestimonials,
  ];

  return (
    <section className="testimonials">
      <div className="testimonials-container">
        <ScrollReveal direction="up">
          <div className="testimonials-heading">
            <span className="testimonials-eyebrow">
              CUSTOMER LOVE
            </span>

            <h2>
              Loved by <span>Mothers</span>
            </h2>

            <p>
              Little words from mothers and families who have
              welcomed a little more comfort into their everyday moments.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          className="testimonial-slider-reveal"
        >
          <div className="testimonial-slider">
            <div className="testimonial-track">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  testimonial={testimonial}
                  key={testimonial._id || `first-${index}`}
                />
              ))}

              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  testimonial={testimonial}
                  key={
                    testimonial._id
                      ? `duplicate-${testimonial._id}`
                      : `second-${index}`
                  }
                />
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up">
          <div className="testimonial-bottom">
            <span>YOUR COMFORT. OUR CARE.</span>
            <span className="testimonial-bottom-line"></span>
            <span>MAMTA</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Testimonials;