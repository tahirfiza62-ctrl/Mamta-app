import { Star, Quote } from "lucide-react";
import ScrollReveal from "../ScrollReveal/ScrollReveal";

import "./Testimonials.css";

const testimonials = [
  {
    name: "Ayesha K.",
    city: "Islamabad",
    text: "The maternity pillow is beautifully soft and comfortable. I really loved the quality and the thoughtful design.",
  },
  {
    name: "Hira M.",
    city: "Lahore",
    text: "The fabric feels so gentle and the pillow looks beautiful too. It has become a lovely part of my daily routine.",
  },
  {
    name: "Sana R.",
    city: "Rawalpindi",
    text: "I ordered a baby pillow and absolutely loved it. The quality, softness and packaging were all wonderful.",
  },
  {
    name: "Maham A.",
    city: "Karachi",
    text: "MAMTA has such a beautiful collection. Everything feels carefully designed and the quality is excellent.",
  },
  {
    name: "Iqra F.",
    city: "Islamabad",
    text: "The nursing pillow is comfortable and supportive. I also really liked the elegant packaging.",
  },
  {
    name: "Zoya M.",
    city: "Faisalabad",
    text: "The pillow is soft, cozy and exactly what I was looking for. The whole experience was lovely.",
  },
  {
    name: "Anaya S.",
    city: "Multan",
    text: "I purchased one as a gift and it was beautifully received. The design feels simple, elegant and thoughtful.",
  },
  {
    name: "Eman T.",
    city: "Peshawar",
    text: "Beautiful products with a very soft and premium feel. I would definitely explore more from the collection.",
  },
];

const TestimonialCard = ({ testimonial }) => {
  return (
    <article className="testimonial-card">

      <div className="testimonial-top">

        <span className="testimonial-quote">
          <Quote
            size={24}
            strokeWidth={1.2}
          />
        </span>

        <div className="testimonial-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={13}
              strokeWidth={1.4}
              fill="currentColor"
            />
          ))}
        </div>

      </div>

      <p className="testimonial-text">
        “{testimonial.text}”
      </p>

      <div className="testimonial-author">

        <div className="author-avatar">
          {testimonial.name.charAt(0)}
        </div>

        <div>
          <h3>{testimonial.name}</h3>
          <span>{testimonial.city}</span>
        </div>

      </div>

    </article>
  );
};

const Testimonials = () => {
  return (
    <section className="testimonials">

      <div className="testimonials-container">

        {/* HEADING */}
        <ScrollReveal direction="up">
          <div className="testimonials-heading">

            <span className="testimonials-eyebrow">
              CUSTOMER LOVE
            </span>

            <h2>
              Loved by
              <span> Mothers</span>
            </h2>

            <p>
              Little words from mothers and families who have
              welcomed a little more comfort into their everyday
              moments.
            </p>

          </div>
        </ScrollReveal>


        {/* SLIDER */}
        <ScrollReveal
          direction="up"
          className="testimonial-slider-reveal"
        >
          <div className="testimonial-slider">

            <div className="testimonial-track">

              {/* FIRST SET */}
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  testimonial={testimonial}
                  key={`first-${index}`}
                />
              ))}

              {/* DUPLICATE SET */}
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  testimonial={testimonial}
                  key={`second-${index}`}
                />
              ))}

            </div>

          </div>
        </ScrollReveal>


        {/* BOTTOM LINE */}
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