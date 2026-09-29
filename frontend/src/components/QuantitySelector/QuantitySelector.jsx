
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Feather,
} from "lucide-react";

import "./WhyChooseMamta.css";

const features = [
  {
    number: "01",
    icon: Heart,
    title: "Made with Love",
    text: "Every MAMTA piece is thoughtfully designed with mothers and little ones in mind.",
  },
  {
    number: "02",
    icon: Feather,
    title: "Soft & Gentle",
    text: "Comfort-focused materials and soft textures made for everyday moments.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Quality First",
    text: "We focus on thoughtful craftsmanship and quality that you can feel.",
  },
  {
    number: "04",
    icon: Sparkles,
    title: "Beautifully Simple",
    text: "Elegant designs that bring warmth and softness into your everyday space.",
  },
];

const WhyChooseMamta = () => {
  return (
    <section className="why-mamta">
      <div className="why-mamta-container">

        <div className="why-mamta-heading">

          <span className="why-mamta-eyebrow">
            THE MAMTA PROMISE
          </span>

          <h2>
            Comfort You Can
            <span> Feel</span>
          </h2>

          <p>
            At MAMTA, we believe comfort is more than softness.
            It is about creating little moments of care, warmth
            and happiness for mothers and their little ones.
          </p>

        </div>

        <div className="why-mamta-grid">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div className="why-mamta-card" key={feature.number}>

                <div className="why-card-top">
                  <span className="why-number">
                    {feature.number}
                  </span>

                  <div className="why-icon">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="why-card-content">
                  <h3>{feature.title}</h3>

                  <p>{feature.text}</p>
                </div>

                <span className="why-card-line"></span>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default WhyChooseMamta;

