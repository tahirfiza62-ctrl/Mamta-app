import { useEffect, useRef, useState } from "react";

const ScrollReveal = ({
  children,
  direction = "up",
  className = "",
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal reveal-${direction} ${
        visible ? "is-visible" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;