
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  UserRound,
  Mail,
  LockKeyhole,
  Package,
  ChevronRight,
  LogOut,
  ShoppingBag,
  ShieldCheck,
  EyeOff,
  KeyRound,
} from "lucide-react";

import "./Account.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

const Account = () => {
  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  // Read the saved user when the component initializes.
  // This avoids calling setState synchronously in useEffect.
  const [user] = useState(() => {
    const storedUser = localStorage.getItem("mamta_user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("USER DATA ERROR:", error);
      return null;
    }
  });

  const [activeSection, setActiveSection] = useState("overview");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // CHECK LOGIN
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("mamta_user_token");
    const storedUser = localStorage.getItem("mamta_user");

    if (!token || !storedUser || !user) {
      localStorage.removeItem("mamta_user");
      localStorage.removeItem("mamta_user_token");

      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("mamta_user_token");
    localStorage.removeItem("mamta_user");

    localStorage.removeItem("mamta_token");
    localStorage.removeItem("mamta_user_data");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login", { replace: true });
  };

  // =====================================================
  // PASSWORD INPUT
  // =====================================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setPasswordError("");
    setPasswordMessage("");
  };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordMessage("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("mamta_user_token");

      await axios.put(
        `${API_URL}/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPasswordMessage("Password changed successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("mamta_user_token");
        localStorage.removeItem("mamta_user");

        window.dispatchEvent(new Event("authChanged"));

        navigate("/login", { replace: true });
        return;
      }

      setPasswordError(
        error.response?.data?.message ||
          "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (!user) {
    return (
      <div className="account-loading">
        Loading account...
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="account-page">
      {/* HERO */}

      <section className="account-hero">
        <div className="account-hero-content">
          <span className="account-eyebrow">
            MY MAAMTA
          </span>

          <h1>
            Welcome,
            <em> {user.name}</em>
          </h1>

          <p>
            Manage your personal information, orders,
            security and account settings in one place.
          </p>
        </div>
      </section>

      {/* ACCOUNT CONTAINER */}

      <section className="account-container">
        {/* SIDEBAR */}

        <aside className="account-sidebar">
          {/* USER */}

          <div className="account-user-mini">
            <div className="account-avatar">
              <UserRound size={25} />
            </div>

            <div className="account-user-info">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          {/* MENU */}

          <div className="account-menu">
            {/* OVERVIEW */}

            <button
              type="button"
              className={
                activeSection === "overview"
                  ? "account-menu-item active"
                  : "account-menu-item"
              }
              onClick={() => setActiveSection("overview")}
            >
              <UserRound size={18} />

              <span>Account Overview</span>

              <ChevronRight size={16} />
            </button>

            {/* MY ORDERS */}

            <button
              type="button"
              className={
                activeSection === "orders"
                  ? "account-menu-item active"
                  : "account-menu-item"
              }
              onClick={() => setActiveSection("orders")}
            >
              <Package size={18} />

              <span>My Orders</span>

              <ChevronRight size={16} />
            </button>

            {/* PASSWORD */}

            <button
              type="button"
              className={
                activeSection === "password"
                  ? "account-menu-item active"
                  : "account-menu-item"
              }
              onClick={() => setActiveSection("password")}
            >
              <LockKeyhole size={18} />

              <span>Change Password</span>

              <ChevronRight size={16} />
            </button>
          </div>

          {/* SIDEBAR BOTTOM */}

          <div className="account-sidebar-bottom">
            <Link to="/shop" className="continue-shopping">
              <ShoppingBag size={17} />

              <span>Continue Shopping</span>
            </Link>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              <LogOut size={17} />

              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}

        <div className="account-content">
          {/* OVERVIEW */}

          {activeSection === "overview" && (
            <div className="account-section">
              <div className="section-heading">
                <div>
                  <span>ACCOUNT</span>
                  <h2>Personal Details</h2>
                </div>

                <ShieldCheck size={25} />
              </div>

              {/* DETAILS */}

              <div className="details-grid">
                {/* NAME */}

                <div className="detail-card">
                  <div className="detail-icon">
                    <UserRound size={20} />
                  </div>

                  <div>
                    <span>FULL NAME</span>
                    <strong>{user.name}</strong>
                  </div>
                </div>

                {/* EMAIL */}

                <div className="detail-card">
                  <div className="detail-icon">
                    <Mail size={20} />
                  </div>

                  <div>
                    <span>EMAIL ADDRESS</span>
                    <strong>{user.email}</strong>
                  </div>
                </div>

                {/* PASSWORD */}

                <div className="detail-card">
                  <div className="detail-icon">
                    <LockKeyhole size={20} />
                  </div>

                  <div>
                    <span>PASSWORD</span>

                    <strong className="protected-password">
                      <EyeOff size={15} />
                      Protected
                    </strong>
                  </div>
                </div>

                {/* STATUS */}

                <div className="detail-card">
                  <div className="detail-icon">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <span>ACCOUNT STATUS</span>

                    <strong className="account-status">
                      Active
                    </strong>
                  </div>
                </div>
              </div>

              {/* SECURITY NOTE */}

              <div className="security-note">
                <div className="security-note-icon">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <strong>
                    Your information is protected
                  </strong>

                  <p>
                    Your password is securely stored
                    and is never displayed in your
                    account. You can change it anytime.
                  </p>
                </div>
              </div>

              {/* QUICK ACCESS */}

              <div className="quick-section">
                <span className="quick-label">
                  QUICK ACCESS
                </span>

                <div className="quick-grid">
                  {/* ORDERS */}

                  <button
                    type="button"
                    className="quick-card"
                    onClick={() => setActiveSection("orders")}
                  >
                    <Package size={22} />

                    <div>
                      <strong>My Orders</strong>
                      <span>View your purchases</span>
                    </div>

                    <ChevronRight size={17} />
                  </button>

                  {/* SECURITY */}

                  <button
                    type="button"
                    className="quick-card"
                    onClick={() => setActiveSection("password")}
                  >
                    <KeyRound size={22} />

                    <div>
                      <strong>Security</strong>
                      <span>Change your password</span>
                    </div>

                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MY ORDERS */}

          {activeSection === "orders" && (
            <div className="account-section">
              <div className="section-heading">
                <div>
                  <span>SHOPPING</span>
                  <h2>My Orders</h2>

                  <p className="section-description">
                    View your order history and track
                    your purchases.
                  </p>
                </div>

                <Package size={25} />
              </div>

              <div className="orders-preview-card">
                <div className="orders-preview-icon">
                  <ShoppingBag size={30} />
                </div>

                <div className="orders-preview-content">
                  <h3>View All Your Orders</h3>

                  <p>
                    See your complete order history,
                    order status, products, quantities
                    and total amounts in one place.
                  </p>
                </div>

                <Link
                  to="/orders"
                  className="view-orders-button"
                >
                  VIEW MY ORDERS
                  <ChevronRight size={17} />
                </Link>
              </div>
            </div>
          )}

          {/* CHANGE PASSWORD */}

          {activeSection === "password" && (
            <div className="account-section">
              <div className="section-heading">
                <div>
                  <span>SECURITY</span>
                  <h2>Change Password</h2>
                </div>

                <LockKeyhole size={25} />
              </div>

              {/* INTRO */}

              <div className="password-intro">
                <ShieldCheck size={20} />

                <p>
                  Your current password is never
                  displayed. Enter it below and
                  choose a new password.
                </p>
              </div>

              {/* ERROR */}

              {passwordError && (
                <div className="password-error" role="alert">
                  {passwordError}
                </div>
              )}

              {/* SUCCESS */}

              {passwordMessage && (
                <div className="password-success" role="status">
                  {passwordMessage}
                </div>
              )}

              {/* FORM */}

              <form
                className="change-password-form"
                onSubmit={handleChangePassword}
              >
                {/* CURRENT */}

                <div className="password-field">
                  <label htmlFor="currentPassword">
                    CURRENT PASSWORD
                  </label>

                  <div className="password-input">
                    <LockKeyhole size={18} />

                    <input
                      id="currentPassword"
                      type="password"
                      name="currentPassword"
                      autoComplete="current-password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                </div>

                {/* NEW */}

                <div className="password-field">
                  <label htmlFor="newPassword">
                    NEW PASSWORD
                  </label>

                  <div className="password-input">
                    <KeyRound size={18} />

                    <input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      autoComplete="new-password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                {/* CONFIRM */}

                <div className="password-field">
                  <label htmlFor="confirmPassword">
                    CONFIRM NEW PASSWORD
                  </label>

                  <div className="password-input">
                    <KeyRound size={18} />

                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                {/* BUTTON */}

                <button
                  type="submit"
                  className="change-password-button"
                  disabled={loading}
                >
                  {loading
                    ? "UPDATING..."
                    : "CHANGE PASSWORD"}

                  {!loading && <ChevronRight size={18} />}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Account;
