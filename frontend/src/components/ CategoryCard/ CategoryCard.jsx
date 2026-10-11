import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import ScrollReveal from "../ScrollReveal/ScrollReveal";
import "./CategoryCard.css";

const categories = [
  {
    title: "Maternity Pillows",
    text: "Comfort designed for beautiful motherhood moments.",
    image:
      "https://res.cloudinary.com/iysbraru/image/upload/v1791132152/hello.jpg",
    link: "/maternity-pillows",
  },
  {
    title: "Baby Pillows",
    text: "Soft little comforts made for your little one.",
    image:
      "https://res.cloudinary.com/iysbraru/image/upload/v1790352591/image2.jpg",
    link: "/baby-pillows",
  },
  {
    title: "Nursing Products",
    text: "Gentle support for feeding and bonding time.",
    image:
      "https://res.cloudinary.com/iysbraru/image/upload/v1790352591/image3.jpg",
    link: "/nursing-pillows",
  },
  {
    title: "Elders Pillows",
    text: "Sweet, soft companions created for everyday comfort.",
    image:
      "https://res.cloudinary.com/iysbraru/image/upload/v1790352591/iamge4.jpg",
    link: "/elder-pillows",
  },
  {
    title: "Accessories",
    text: "Beautiful little essentials made to add comfort and softness to your everyday routine.",
    image:
      "https://res.cloudinary.com/iysbraru/image/upload/v1790788491/scruchies.jpg",
    link: "/accessories",
  },
];

const CategoryCard = () => {
  return (
    <section className="category-section">
      <div className="category-container">

        {/* =================================================
            HEADING
        ================================================= */}

        <ScrollReveal direction="down">
          <div className="category-heading">
            <div>
              <span className="category-eyebrow">
                EXPLORE MAMTA
              </span>

              <h2>
                Made for Every <span>Little Moments</span>
                
              </h2>
            </div>

            <p>
              Thoughtfully created to bring comfort, softness and
              warmth to mothers, babies and little ones.
            </p>
          </div>
        </ScrollReveal>

        {/* =================================================
            CATEGORY GRID
        ================================================= */}

        <div className="category-grid">
          {categories.map((category, index) => (
            <ScrollReveal
              key={category.title}
              direction="up"
              className={`stagger-${index + 1}`}
            >
              <Link
                to={category.link}
                className="category-card"
              >
                <div className="category-image">
                  <img
                    src={category.image}
                    alt={category.title}
                  />

                  <span className="category-arrow">
                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.6}
                    />
                  </span>
                </div>

                <div className="category-info">
                  <h3>{category.title}</h3>

                  <p>{category.text}</p>

                  <span className="category-link">
                    Explore Collection
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoryCard;