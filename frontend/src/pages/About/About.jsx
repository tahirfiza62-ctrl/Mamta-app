import {
  ArrowUpRight,
  Heart,
  Sparkles,
  ShieldCheck,
  Feather,
  Quote,
} from "lucide-react";
import { Link } from "react-router-dom";

import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";
import "./About.css";

const About= () => {
  return (
    <main className="about-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="about-hero">
        <div className="about-hero-container">

          <ScrollReveal direction="left">
            <div className="about-hero-content">

              <span className="about-eyebrow">
                THE STORY OF MAMTA
              </span>

              <h1>
                Made with care,
                <span>made for comfort.</span>
              </h1>

              <p>
                MAMTA was created around a simple idea —
                that comfort should feel thoughtful, beautiful
                and full of care.
              </p>

              <Link to="/shop" className="about-hero-button">
                <span>Explore Collection</span>
                <ArrowUpRight size={17} strokeWidth={1.6} />
              </Link>

            </div>
          </ScrollReveal>


          <ScrollReveal direction="right">
            <div className="about-hero-visual">

              <div className="about-hero-circle"></div>

              <div className="about-glow about-glow-one"></div>
              <div className="about-glow about-glow-two"></div>

              <div className="about-main-image">
                <img
                  src="https://res.cloudinary.com/iysbraru/image/upload/v1790508893/cush.jpg"
                  alt="MAMTA comfort collection"
                />
              </div>

              <div className="about-floating-card">
                <Heart
                  size={18}
                  strokeWidth={1.5}
                  fill="currentColor"
                />

                <div>
                  <strong>Made with Love</strong>
                  <span>For mothers & little ones</span>
                </div>
              </div>

           

            </div>
          </ScrollReveal>

        </div>
      </section>


      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="about-intro">
        <div className="about-intro-container">

          <ScrollReveal direction="down">
            <div className="about-intro-heading">

              <span className="about-section-label">
                OUR BEGINNING
              </span>

              <h2>
                A little more
                <span>comfort in every day.</span>
              </h2>

            </div>
          </ScrollReveal>


          <ScrollReveal direction="up">
            <div className="about-intro-text">

              <p className="about-intro-main">
                MAMTA is a comfort-focused brand created for
                the beautiful, busy and deeply meaningful
                journey of motherhood.
              </p>

              <p>
                From maternity pillows to baby essentials,
                every piece is chosen with one thought in mind:
                making everyday moments feel a little softer,
                calmer and more comfortable.
              </p>

              <p>
                We believe the smallest comforts can become
                part of the moments you remember forever.
              </p>

            </div>
          </ScrollReveal>

        </div>
      </section>


      {/* =====================================================
          IMAGE STORY
      ===================================================== */}

      <section className="about-story">
        <div className="about-story-container">

          <ScrollReveal direction="left">
            <div className="about-story-image">

              <img
                src="https://res.cloudinary.com/iysbraru/image/upload/v1790508989/comfort.jpg"
                alt="MAMTA baby comfort collection"
              />

              <div className="about-story-label">
                <span>02</span>
                <p>
                  Softness for
                  <br />
                  every little moment
                </p>
              </div>

            </div>
          </ScrollReveal>


          <ScrollReveal direction="right">
            <div className="about-story-content">

              <span className="about-section-label">
                WHY MAMTA
              </span>

              <h2>
                Because
                <span>comfort matters.</span>
              </h2>

              <p className="about-story-main">
                Motherhood is made up of countless little
                moments — quiet mornings, growing bellies,
                sleepy cuddles, feeding time and everything
                in between.
              </p>

              <p>
                MAMTA exists to bring comfort into those
                moments through thoughtfully selected
                essentials that feel soft, simple and special.
              </p>

              <div className="about-story-line"></div>

              <span className="about-signature">
                MAMTA
              </span>

            </div>
          </ScrollReveal>

        </div>
      </section>


      {/* =====================================================
          VALUES
      ===================================================== */}

      <section className="about-values">

        <div className="about-values-container">

          <ScrollReveal direction="down">
            <div className="about-values-heading">

              <span className="about-section-label">
                WHAT WE BELIEVE
              </span>

              <h2>
                Thoughtfulness in
                <span>every detail.</span>
              </h2>

              <p>
                Our approach is simple — create comfort
                with intention and choose every detail with care.
              </p>

            </div>
          </ScrollReveal>


          <div className="about-values-grid">

            <ScrollReveal
              direction="left"
              className="stagger-1"
            >
              <article className="about-value-card">

                <div className="about-value-number">
                  01
                </div>

                <div className="about-value-icon">
                  <Feather size={21} strokeWidth={1.5} />
                </div>

                <h3>
                  Softness
                </h3>

                <p>
                  Comfort begins with softness. We look for
                  materials and designs that feel gentle,
                  cozy and welcoming.
                </p>

              </article>
            </ScrollReveal>


            <ScrollReveal
              direction="up"
              className="stagger-2"
            >
              <article className="about-value-card">

                <div className="about-value-number">
                  02
                </div>

                <div className="about-value-icon">
                  <Sparkles size={21} strokeWidth={1.5} />
                </div>

                <h3>
                  Thoughtful Design
                </h3>

                <p>
                  Every product should have a purpose.
                  We value simple designs that make everyday
                  comfort feel effortless.
                </p>

              </article>
            </ScrollReveal>


            <ScrollReveal
              direction="right"
              className="stagger-3"
            >
              <article className="about-value-card">

                <div className="about-value-number">
                  03
                </div>

                <div className="about-value-icon">
                  <ShieldCheck size={21} strokeWidth={1.5} />
                </div>

                <h3>
                  Care
                </h3>

                <p>
                  From mothers to little ones, care is at
                  the heart of everything we hope to bring
                  into your home.
                </p>

              </article>
            </ScrollReveal>

          </div>

        </div>
      </section>


      {/* =====================================================
          PHILOSOPHY
      ===================================================== */}

      <section className="about-philosophy">

        <div className="about-philosophy-container">

          <ScrollReveal direction="up">

            <div className="about-quote-icon">
              <Quote size={25} strokeWidth={1.2} />
            </div>

            <span className="about-philosophy-label">
              THE MAMTA PHILOSOPHY
            </span>

            <h2>
              “Comfort is not just
              <span>something you feel.</span>
              <br />
              It is something you give.”
            </h2>

            <p>
              A reminder behind every little detail we create.
            </p>

          </ScrollReveal>

        </div>

      </section>


      {/* =====================================================
          MOTHERHOOD SECTION
      ===================================================== */}

      <section className="about-motherhood">

        <div className="about-motherhood-container">

          <ScrollReveal direction="left">
            <div className="about-motherhood-content">

              <span className="about-section-label">
                MADE FOR MOTHERHOOD
              </span>

              <h2>
                For the moments
                <span>that matter most.</span>
              </h2>

              <p>
                MAMTA is more than pillows and soft essentials.
                It is about creating small moments of comfort
                throughout a journey that changes everything.
              </p>

              <p>
                Whether it is a mother finding a comfortable
                moment to rest or a little one settling into
                a peaceful sleep, we want MAMTA to be part
                of those moments.
              </p>

              <Link
                to="/shop"
                className="about-motherhood-button"
              >
                <span>Discover MAMTA</span>
                <ArrowUpRight size={17} />
              </Link>

            </div>
          </ScrollReveal>


          <ScrollReveal direction="right">
            <div className="about-motherhood-visual">

              <div className="motherhood-image-main">
                <img
                  src="https://res.cloudinary.com/iysbraru/image/upload/v1790504967/Screenshot_2026-09-27_at_3.28.57_PM.png"
                  alt="MAMTA maternity comfort"
                />
              </div>

              <div className="motherhood-small-card">

                <Heart
                  size={17}
                  strokeWidth={1.5}
                  fill="currentColor"
                />

                <span>
                  Comfort
                  <strong>With Love</strong>
                </span>

              </div>

            </div>
          </ScrollReveal>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="about-final">

        <ScrollReveal direction="up">

          <div className="about-final-content">

            <span className="about-final-label">
              MAMTA
            </span>

            <h2>
              Little moments.
              <span>Lasting memories.</span>
            </h2>

            <p>
              Discover comfort thoughtfully created for
              mothers, babies and every beautiful little moment.
            </p>

            <Link
              to="/shop"
              className="about-final-button"
            >
              <span>Shop the Collection</span>
              <ArrowUpRight size={17} />
            </Link>

          </div>

        </ScrollReveal>

      </section>

    </main>
  );
};

export default About;