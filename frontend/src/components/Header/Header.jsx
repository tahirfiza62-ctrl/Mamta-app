
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  Heart,
  User,
  Menu,
  X,
} from "lucide-react";

import "./Header.css";

const Header = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartBounce, setCartBounce] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const previousCartCount = useRef(0);

  // =====================================================
  // CART SOUND
  // =====================================================

  const playCartSound = () => {
    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) return;

      const audioContext = new AudioContext();

      const oscillator =
        audioContext.createOscillator();

      const gainNode =
        audioContext.createGain();

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        620,
        audioContext.currentTime
      );

      oscillator.frequency.exponentialRampToValueAtTime(
        900,
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
        audioContext.currentTime + 0.16
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();

      oscillator.stop(
        audioContext.currentTime + 0.16
      );

      setTimeout(() => {
        audioContext.close();
      }, 250);

    } catch (error) {
      console.error("CART SOUND ERROR:", error);
    }
  };


  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist =
          JSON.parse(
            localStorage.getItem("mamta_wishlist")
          ) || [];

        setWishlist(
          Array.isArray(savedWishlist)
            ? savedWishlist
            : []
        );

      } catch (error) {
        console.error(
          "WISHLIST LOAD ERROR:",
          error
        );

        setWishlist([]);
      }
    };

    loadWishlist();

    window.addEventListener(
      "wishlistUpdated",
      loadWishlist
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        loadWishlist
      );
    };
  }, []);


  // =====================================================
  // LOAD CART COUNT
  // =====================================================

  useEffect(() => {
    const loadCartCount = async () => {
      const token =
        localStorage.getItem(
          "mamta_user_token"
        );

      if (!token) {
        setCartCount(0);
        previousCartCount.current = 0;
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/api/cart",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          setCartCount(0);
          return;
        }

        const data =
          await response.json();

        const items =
          data.cart?.items || [];

        const count =
          items.reduce(
            (total, item) =>
              total +
              Number(item.quantity || 0),
            0
          );

        if (
          count >
          previousCartCount.current
        ) {
          setCartBounce(false);

          requestAnimationFrame(() => {
            setCartBounce(true);
          });

          playCartSound();

          setTimeout(() => {
            setCartBounce(false);
          }, 700);
        }

        previousCartCount.current = count;
        setCartCount(count);

      } catch (error) {
        console.error(
          "CART COUNT ERROR:",
          error
        );

        setCartCount(0);
      }
    };

    loadCartCount();

    window.addEventListener(
      "cartChanged",
      loadCartCount
    );

    window.addEventListener(
      "authChanged",
      loadCartCount
    );

    return () => {
      window.removeEventListener(
        "cartChanged",
        loadCartCount
      );

      window.removeEventListener(
        "authChanged",
        loadCartCount
      );
    };
  }, []);


  // =====================================================
  // LOGIN STATUS
  // =====================================================

  useEffect(() => {
    const checkLoginStatus = () => {
      const token =
        localStorage.getItem(
          "mamta_user_token"
        );

      const user =
        localStorage.getItem(
          "mamta_user"
        );

      setIsLoggedIn(
        !!token && !!user
      );
    };

    checkLoginStatus();

    window.addEventListener(
      "authChanged",
      checkLoginStatus
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        checkLoginStatus
      );
    };
  }, []);


  // =====================================================
  // CLOSE MOBILE MENU ON DESKTOP
  // =====================================================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);


  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      {/* =================================================
          TOP ANNOUNCEMENT BAR
          NOT STICKY
      ================================================= */}

      <div className="top-line">

        <div className="top-line-track">

          {/* FIRST SET */}

          <div className="top-line-content">

            <span>
              Made with Love for Mothers & Little Ones
            </span>

            <span className="top-line-divider">
              ✦
            </span>

            <span>
              Softness for Every Beautiful Moment
            </span>

            <span className="top-line-divider">
              ✦
            </span>

            <span>
              Premium Comfort for Motherhood
            </span>

            <span className="top-line-divider">
              ✦
            </span>

            <span>
              Gentle Support. Beautifully Made.
            </span>

            <span className="top-line-divider">
              ✦
            </span>

            <span>
              Comfort Designed for Every Little One
            </span>

            <span className="top-line-divider">
              ✦
            </span>

            <span>
              Thoughtfully Made for Your Beautiful Journey
            </span>

            <span className="top-line-divider">
              ✦
            </span>

          </div>


          {/* SECOND SET */}

          <div className="top-line-content">

            <span>
              Made with Love for Mothers & Little Ones
            </span>

            <span className="top-line-divider">
              ✦
            </span>

            <span>
              Softness for Every Beautiful Moment
            </span>

            <span className="top-line-divider">
              ✦
            </span>

            <span>
              Premium Comfort for Motherhood
            </span>

            <span className="top-line-divider">
              ✦
            </span>

            <span>
              Gentle Support. Beautifully Made.
            </span>

            <span className="top-line-divider">
              ✦
            </span>

            <span>
              Comfort Designed for Every Little One
            </span>

            <span className="top-line-divider">
              ✦
            </span>

            <span>
              Thoughtfully Made for Your Beautiful Journey
            </span>

            <span className="top-line-divider">
              ✦
            </span>

          </div>

        </div>

      </div>


      {/* =================================================
          STICKY NAVBAR
          THIS IS NOW OUTSIDE THE TOP-LINE CONTAINER
      ================================================= */}

      <div className="main-header">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="logo-group"
          onClick={closeMobileMenu}
        >

          <img
            src="/logo.jpg"
            alt="MAMTA Logo"
            className="logo-one"
          />

          <img
            src="/logo2.jpg"
            alt="MAMTA Brand Logo"
            className="logo-two"
          />

        </Link>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="main-nav">

          <Link to="/">
            Home
          </Link>

          <Link to="/shop">
            Shop
          </Link>

          <Link to="/maternity-pillows">
            Maternity
          </Link>

          <Link to="/baby-pillows">
            Baby & Kids
          </Link>

          <Link to="/about">
            About Us
          </Link>

          <Link to="/contact">
            Contact
          </Link>

        </nav>


        {/* =================================================
            HEADER ACTIONS
        ================================================= */}

        <div className="header-actions">

          {/* SEARCH */}

          <Link
            to="/search"
            className="header-icon"
            aria-label="Search"
            title="Search"
          >
            <Search
              size={20}
              strokeWidth={1.7}
            />
          </Link>


          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="header-icon wishlist-header-icon"
            aria-label="Wishlist"
            title="Wishlist"
          >

            <Heart
              size={20}
              strokeWidth={1.7}
            />

            {wishlist.length > 0 && (
              <span className="wishlist-count">
                {wishlist.length}
              </span>
            )}

          </Link>


          {/* LOGIN / ACCOUNT */}

          {!isLoggedIn ? (

            <Link
              to="/login"
              className="header-login-btn"
            >
              LOGIN
            </Link>

          ) : (

            <Link
              to="/profile"
              className="header-icon account-icon"
              aria-label="Account"
              title="My Account"
            >
              <User
                size={20}
                strokeWidth={1.7}
              />
            </Link>

          )}


          {/* CART */}

          <Link
            to="/cart"
            className={`cart-action ${
              cartBounce
                ? "cart-bounce"
                : ""
            }`}
            aria-label="Cart"
            title="Cart"
          >

            <span className="action-icon">
              🛍
            </span>

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}

          </Link>


          {/* MOBILE MENU */}

          <button
            type="button"
            className="mobile-menu"
            aria-label={
              mobileOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen(
                (prev) => !prev
              )
            }
          >

            {mobileOpen ? (
              <X
                size={23}
                strokeWidth={1.7}
              />
            ) : (
              <Menu
                size={23}
                strokeWidth={1.7}
              />
            )}

          </button>

        </div>


        {/* =================================================
            MOBILE NAVIGATION
        ================================================= */}

        <div
          className={`mobile-nav ${
            mobileOpen
              ? "mobile-nav-open"
              : ""
          }`}
        >

          <Link
            to="/"
            onClick={closeMobileMenu}
          >
            Home
          </Link>

          <Link
            to="/shop"
            onClick={closeMobileMenu}
          >
            Shop
          </Link>

          <Link
            to="/maternity-pillows"
            onClick={closeMobileMenu}
          >
            Maternity
          </Link>

          <Link
            to="/baby-pillows"
            onClick={closeMobileMenu}
          >
            Baby & Kids
          </Link>

          <Link
            to="/about"
            onClick={closeMobileMenu}
          >
            About Us
          </Link>

          <Link
            to="/contact"
            onClick={closeMobileMenu}
          >
            Contact
          </Link>

        </div>

      </div>


      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {mobileOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Header;

