
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  CreditCard,
  LogOut,
  MessageCircle,
  X,
  
} from "lucide-react";

import "./AdminSidebar.css";

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("mamta_admin_token");
    localStorage.removeItem("mamta_admin");
    localStorage.removeItem("mamta_admin_logged_in");

    navigate("/admin", { replace: true });
  };

  const closeMobile = () => {
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  const linkClass = ({ isActive }) =>
    `admin-nav-link ${isActive ? "active" : ""}`;

  return (
    <>
      {mobileOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`admin-sidebar ${
          mobileOpen ? "mobile-open" : ""
        }`}
      >

        {/* BRAND */}
        <div className="admin-sidebar-brand">

          <div>
            <span className="admin-brand-name">
              MAMTA CIRCLE
            </span>

            <span className="admin-brand-label">
              ADMINISTRATION
            </span>
          </div>

          <button
            className="admin-mobile-close"
            onClick={closeMobile}
            type="button"
          >
            <X size={21} />
          </button>

        </div>


        {/* NAVIGATION */}
        <nav className="admin-sidebar-nav">

          {/* DASHBOARD */}
          <NavLink
            to="/admin/dashboard"
            className={linkClass}
            onClick={closeMobile}
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>


          {/* PRODUCTS */}
          <div className="admin-nav-section">

            <div className="admin-nav-section-title">
              <span>CATALOG</span>
            </div>

            <NavLink
              to="/admin/products"
              className={linkClass}
              onClick={closeMobile}
            >
              <Package size={19} />
              <span>Products</span>
            </NavLink>

            <NavLink
              to="/admin/products/add"
              className={linkClass}
              onClick={closeMobile}
            >
              <span className="admin-sub-icon">+</span>
              <span>Add Product</span>
            </NavLink>

          </div>


          {/* ORDERS */}
          <div className="admin-nav-section">

            <div className="admin-nav-section-title">
              <span>SALES</span>
            </div>

            <NavLink
              to="/admin/orders"
              className={linkClass}
              onClick={closeMobile}
            >
              <ShoppingBag size={19} />
              <span>Orders</span>
            </NavLink>

            <NavLink
              to="/admin/orders/pending"
              className={linkClass}
              onClick={closeMobile}
            >
              <span className="admin-sub-dot pending" />
              <span>Pending</span>
            </NavLink>

            <NavLink
              to="/admin/orders/processing"
              className={linkClass}
              onClick={closeMobile}
            >
              <span className="admin-sub-dot processing" />
              <span>Processing</span>
            </NavLink>

            <NavLink
              to="/admin/orders/shipped"
              className={linkClass}
              onClick={closeMobile}
            >
              <span className="admin-sub-dot shipped" />
              <span>Shipped</span>
            </NavLink>

            <NavLink
              to="/admin/orders/delivered"
              className={linkClass}
              onClick={closeMobile}
            >
              <span className="admin-sub-dot delivered" />
              <span>Delivered</span>
            </NavLink>

            <NavLink
              to="/admin/orders/cancelled"
              className={linkClass}
              onClick={closeMobile}
            >
              <span className="admin-sub-dot cancelled" />
              <span>Cancelled</span>
            </NavLink>

          </div>


          {/* CUSTOMERS */}
          <div className="admin-nav-section">

            <div className="admin-nav-section-title">
              <span>PEOPLE</span>
            </div>

            <NavLink
              to="/admin/customers"
              className={linkClass}
              onClick={closeMobile}
            >
              <Users size={19} />
              <span>Customers</span>
            </NavLink>

          </div>


          {/* PAYMENTS */}
          <div className="admin-nav-section">

            <div className="admin-nav-section-title">
              <span>FINANCE</span>
            </div>

            <NavLink
              to="/admin/payments"
              className={linkClass}
              onClick={closeMobile}
            >
              <CreditCard size={19} />
              <span>Payments</span>
            </NavLink>

          </div>
 <div className="admin-nav-section">

            <div className="admin-nav-section-title">
              <span>Contact</span>
            </div>

           <NavLink to="/admin/contacts">
  <MessageCircle size={18} />
  <span>Messages</span>
</NavLink>

          </div>

        </nav>


        {/* BOTTOM */}
        <div className="admin-sidebar-bottom">

          <div className="admin-sidebar-divider" />

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
            type="button"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;

