import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "../ScrollReveal/ScrollReveal";

import "./MotherBabyBanner.css";

const MotherBabyBanner = () => {
  return (
    <section className="mother-baby-banner">
      <div className="mother-baby-container">

        {/* IMAGE — LEFT TO RIGHT */}
        <ScrollReveal direction="left">
          <div className="mother-baby-image">
            <img
              src="https://res.cloudinary.com/iysbraru/image/upload/v1790355796/Screenshot_2026-09-25_at_10.02.46_PM.png"
              alt="MAMTA comfort collection"
            />

            <div className="mother-baby-image-label">
              <span>01</span>
              <p>Softness for every moment</p>
            </div>
          </div>
        </ScrollReveal>

        {/* CONTENT — BOTTOM TO TOP */}
        <ScrollReveal direction="up">
          <div className="mother-baby-content">

            <span className="mother-baby-eyebrow">
              MADE FOR MOTHERHOOD
            </span>

            <h2>
              Little Moments
              <span> Matter</span>
            </h2>

            <p className="mother-baby-main-text">
              From quiet mornings to precious cuddles, MAMTA is
              designed to bring a little more comfort into the
              moments that matter most.
            </p>

            <p className="mother-baby-small-text">
              Thoughtfully designed maternity pillows, baby
              essentials and soft companions — made with care
              for mothers and little ones.
            </p>

            <Link
              to="/shop"
              className="mother-baby-button"
            >
              <span>Explore Collection</span>

              <ArrowUpRight
                size={17}
                strokeWidth={1.5}
              />
            </Link>

            <div className="mother-baby-details">

              <div className="mother-detail-item">
                <strong>Soft</strong>
                <span>Materials</span>
              </div>

              <div className="mother-detail-item">
                <strong>Thoughtful</strong>
                <span>Design</span>
              </div>

              <div className="mother-detail-item">
                <strong>Made</strong>
                <span>With Love</span>
              </div>

            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

export default MotherBabyBanner;