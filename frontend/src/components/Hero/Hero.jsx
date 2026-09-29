import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ArrowLeft,
  Heart,
  ShieldCheck,
} from "lucide-react";

import ScrollReveal from "../../components/ScrollReveal/ScrollReveal";

import "./Hero.css";


/* =========================================================
   HERO SLIDES
========================================================= */

const slides = [
  {
    image:
      "https://res.cloudinary.com/iysbraru/image/upload/v1790683770/hey2.jpg",

    alt: "Mother holding her baby",

    title: "Made for Comfort",

    subtitle: "Soft • Gentle • Cozy",
  },

  {
    image:
      "https://res.cloudinary.com/iysbraru/image/upload/v1790683769/hey1.jpg",

    alt: "Sleeping baby",

    title: "For Little Moments",

    subtitle: "Comfort made with care",
  },

  {
    image:
      "https://res.cloudinary.com/iysbraru/image/upload/v1790683770/hey4.jpg",

    alt: "Mother and baby together",

    title: "Thoughtful Care",

    subtitle: "Made for mothers & little ones",
  },

  {
    image:
      "https://res.cloudinary.com/iysbraru/image/upload/v1790683770/hey3.jpg",

    alt: "Mother with child",

    title: "Love in Every Detail",

    subtitle: "Beautifully made for everyday life",
  },
];


/* =========================================================
   TYPING HEADINGS
========================================================= */

const typingHeadings = [
  "Comfort Made With Love",
  "Softness Made For You",
  "Gentle Care For Little Ones",
  "Beautiful Moments, Softer Days",
];


const Hero = () => {

  /* =======================================================
     SLIDER STATE
  ======================================================= */

  const [activeSlide, setActiveSlide] =
    useState(0);


  /* =======================================================
     TYPING STATE
  ======================================================= */

  const [headingIndex, setHeadingIndex] =
    useState(0);

  const [typedText, setTypedText] =
    useState("");

  const [isDeleting, setIsDeleting] =
    useState(false);


  /* =======================================================
     TYPEWRITER EFFECT
  ======================================================= */

  useEffect(() => {

    const currentHeading =
      typingHeadings[headingIndex];

    let timeout;


    /*
       TYPING COMPLETE

       Wait before starting deletion.
    */

    if (
      !isDeleting &&
      typedText === currentHeading
    ) {

      timeout = setTimeout(() => {

        setIsDeleting(true);

      }, 2200);

    }


    /*
       DELETION COMPLETE

       Move to the next heading.

       IMPORTANT:
       State updates are now INSIDE
       the timeout callback so the
       React set-state-in-effect
       warning is avoided.
    */

    else if (
      isDeleting &&
      typedText === ""
    ) {

      timeout = setTimeout(() => {

        setIsDeleting(false);

        setHeadingIndex(
          (prev) =>
            (prev + 1) %
            typingHeadings.length
        );

      }, 0);

    }


    /*
       TYPE OR DELETE CHARACTER
    */

    else {

      timeout = setTimeout(
        () => {

          setTypedText(
            isDeleting
              ? currentHeading.slice(
                  0,
                  typedText.length - 1
                )
              : currentHeading.slice(
                  0,
                  typedText.length + 1
                )
          );

        },
        isDeleting
          ? 45
          : 85
      );

    }


    return () => {

      if (timeout) {
        clearTimeout(timeout);
      }

    };

  }, [
    typedText,
    isDeleting,
    headingIndex,
  ]);


  /* =======================================================
     AUTO SLIDER
  ======================================================= */

  useEffect(() => {

    const interval =
      setInterval(() => {

        setActiveSlide(
          (prev) =>
            (prev + 1) %
            slides.length
        );

      }, 5000);


    return () =>
      clearInterval(interval);

  }, []);


  /* =======================================================
     SLIDER CONTROLS
  ======================================================= */

  const nextSlide = () => {

    setActiveSlide(
      (prev) =>
        (prev + 1) %
        slides.length
    );

  };


  const previousSlide = () => {

    setActiveSlide(
      (prev) =>
        (prev - 1 + slides.length) %
        slides.length
    );

  };


  /* =======================================================
     CURRENT SLIDE
  ======================================================= */

  const currentSlide =
    slides[activeSlide];


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <section
      className="hero"
      id="home"
    >

      {/* ===================================================
          BACKGROUND DECORATION
      =================================================== */}

      <div className="hero-bg-line"></div>


      {/* ===================================================
          LEFT CONTENT
      =================================================== */}

      <ScrollReveal direction="left">

        <div className="hero-content">

          <div className="hero-eyebrow">

            <span className="eyebrow-line"></span>

            <span>
              MADE WITH LOVE FOR MOTHERS & LITTLE ONES
            </span>

            <Heart
              size={13}
              strokeWidth={1.5}
              fill="currentColor"
            />

          </div>


          {/* =================================================
              TYPEWRITER HEADING
          ================================================= */}

          <div className="hero-heading-wrapper">

            <h1>

              {typedText
                .split(" ")
                .map(
                  (
                    word,
                    index
                  ) => {

                    const words =
                      typedText.split(
                        " "
                      );

                    const isLast =
                      index ===
                      words.length - 1;

                    return (
                      <span
                        key={`${word}-${index}`}
                        className={
                          isLast
                            ? "typing-highlight"
                            : ""
                        }
                      >
                        {word}{" "}
                      </span>
                    );

                  }
                )}

              <span className="typing-cursor">
                |
              </span>

            </h1>

          </div>


          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p className="hero-description">

            Thoughtfully designed pillows and soft
            essentials made to bring comfort, warmth
            and care to mothers, babies and little ones.

          </p>


          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="hero-buttons">

            <Link
              to="/shop"
              className="primary-btn"
            >

              <span>
                Shop Collection
              </span>

              <ArrowRight
                size={17}
                strokeWidth={1.7}
              />

            </Link>


            <Link
              to="/maternity-pillows"
              className="secondary-btn"
            >
              Explore Maternity
            </Link>

          </div>


          {/* =================================================
              TRUST INFORMATION
          ================================================= */}

          <div className="hero-trust">

            <div className="trust-item">

              <div className="trust-icon">

                <Heart
                  size={16}
                  strokeWidth={1.5}
                />

              </div>

              <div>

                <strong>
                  Made with Love
                </strong>

                <span>
                  For every beautiful moment
                </span>

              </div>

            </div>


            <div className="trust-line"></div>


            <div className="trust-item">

              <div className="trust-icon">

                <ShieldCheck
                  size={16}
                  strokeWidth={1.5}
                />

              </div>

              <div>

                <strong>
                  Soft & Gentle
                </strong>

                <span>
                  Designed for everyday comfort
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              SMALL STATS
          ================================================= */}

        </div>

      </ScrollReveal>


      {/* ===================================================
          RIGHT IMAGE SLIDER
      =================================================== */}

      <ScrollReveal direction="right">

        <div className="hero-image-area">


          {/* =================================================
              MAIN IMAGE
          ================================================= */}

          <div className="hero-image-frame">

            {slides.map(
              (
                slide,
                index
              ) => (

                <img
                  key={slide.image}
                  src={slide.image}
                  alt={slide.alt}
                  className={
                    index === activeSlide
                      ? "hero-slide active"
                      : "hero-slide"
                  }
                />

              )
            )}


            {/* =================================================
                IMAGE OVERLAY
            ================================================= */}

            <div className="hero-image-overlay"></div>


            {/* =================================================
                FLOATING CARD
            ================================================= */}

            <div className="floating-card">

              <div className="floating-icon">

                <Heart
                  size={18}
                  strokeWidth={1.5}
                  fill="currentColor"
                />

              </div>


              <div className="floating-text">

                <strong>
                  {currentSlide.title}
                </strong>

                <small>
                  {currentSlide.subtitle}
                </small>

              </div>

            </div>


            {/* =================================================
                SLIDER CONTROLS
            ================================================= */}

            <div className="hero-slider-controls">

              <button
                type="button"
                onClick={
                  previousSlide
                }
                aria-label="Previous image"
              >

                <ArrowLeft
                  size={17}
                  strokeWidth={1.5}
                />

              </button>


              <div className="hero-slider-dots">

                {slides.map(
                  (
                    _,
                    index
                  ) => (

                    <button
                      key={index}
                      type="button"
                      className={
                        index ===
                        activeSlide
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setActiveSlide(
                          index
                        )
                      }
                      aria-label={`Go to slide ${
                        index + 1
                      }`}
                    />

                  )
                )}

              </div>


              <button
                type="button"
                onClick={
                  nextSlide
                }
                aria-label="Next image"
              >

                <ArrowRight
                  size={17}
                  strokeWidth={1.5}
                />

              </button>

            </div>

          </div>


          {/* =================================================
              SIDE DECORATION
          ================================================= */}

          <div className="hero-side-text">
            MAMTA — THOUGHTFUL COMFORT
          </div>

        </div>

      </ScrollReveal>

    </section>

  );

};

export default Hero;