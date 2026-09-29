

/* =========================================================
   WISHLIST SOUND
========================================================= */

export const playWishlistSound = () => {
  try {
    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContext) {
      return;
    }

    const audioContext = new AudioContext();

    const oscillator = audioContext.createOscillator();

    const gainNode = audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      520,
      audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      820,
      audioContext.currentTime + 0.12
    );

    gainNode.gain.setValueAtTime(
      0.0001,
      audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
      0.08,
      audioContext.currentTime + 0.02
    );

    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.18
    );

    oscillator.connect(gainNode);

    gainNode.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + 0.18
    );

    oscillator.onended = () => {
      audioContext.close();
    };

  } catch (error) {
    console.error(
      "Wishlist sound error:",
      error
    );
  }
};


/* =========================================================
   ANIMATE PRODUCT TO WISHLIST
========================================================= */

export const animateToWishlist = ({
  image,
  startX,
  startY,
}) => {

  try {

    const wishlistTarget =
      document.querySelector(
        '[data-wishlist-target="true"]'
      );

    if (!wishlistTarget) {

      console.warn(
        'MAMTA: Wishlist target not found. Add data-wishlist-target="true" to your navbar wishlist.'
      );

      return;
    }

    const targetRect =
      wishlistTarget.getBoundingClientRect();

    const targetX =
      targetRect.left +
      targetRect.width / 2;

    const targetY =
      targetRect.top +
      targetRect.height / 2;

    const flying =
      document.createElement("div");

    flying.className =
      "mamta-flying-wishlist-item";

    const productImage =
      document.createElement("img");

    productImage.src =
      image ||
      "https://placehold.co/700x700/F4D9DC/4A3032?text=MAMTA";

    productImage.alt = "";

    flying.appendChild(productImage);

    const itemSize = 60;

    flying.style.left =
      `${startX - itemSize / 2}px`;

    flying.style.top =
      `${startY - itemSize / 2}px`;

    document.body.appendChild(flying);

    const deltaX =
      targetX - startX;

    const deltaY =
      targetY - startY;

    const animation =
      flying.animate(
        [
          {
            transform:
              "translate3d(0, 0, 0) scale(1) rotate(0deg)",
            opacity: 1,
          },

          {
            transform:
              "translate3d(0, -30px, 0) scale(1.04) rotate(-3deg)",
            opacity: 1,
            offset: 0.15,
          },

          {
            transform:
              `translate3d(
                ${deltaX * 0.30}px,
                ${deltaY * 0.30 - 42}px,
                0
              )
              scale(0.92)
              rotate(4deg)`,
            opacity: 0.97,
            offset: 0.38,
          },

          {
            transform:
              `translate3d(
                ${deltaX * 0.62}px,
                ${deltaY * 0.62 - 25}px,
                0
              )
              scale(0.72)
              rotate(-3deg)`,
            opacity: 0.82,
            offset: 0.65,
          },

          {
            transform:
              `translate3d(
                ${deltaX}px,
                ${deltaY}px,
                0
              )
              scale(0.25)
              rotate(0deg)`,
            opacity: 0,
          },
        ],
        {
          duration: 850,

          easing:
            "cubic-bezier(0.16, 1, 0.3, 1)",

          fill: "forwards",
        }
      );

    animation.onfinish = () => {

      flying.remove();

      wishlistTarget.classList.add(
        "wishlist-target-bounce"
      );

      setTimeout(() => {

        wishlistTarget.classList.remove(
          "wishlist-target-bounce"
        );

      }, 500);
    };

    setTimeout(() => {

      if (document.body.contains(flying)) {
        flying.remove();
      }

    }, 1200);

  } catch (error) {

    console.error(
      "Wishlist animation error:",
      error
    );

  }
};