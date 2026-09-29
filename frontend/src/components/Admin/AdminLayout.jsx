
import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

import "./AdminLayout.css";

const AdminLayout = () => {
  // Mobile sidebar state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Toggle sidebar from header menu button
  const handleMenuClick = () => {
    setMobileOpen((prev) => !prev);
  };

  // Refresh current page
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN AREA */}
      <div className="admin-main">

        <AdminHeader
          onMenuClick={handleMenuClick}
          onRefresh={handleRefresh}
        />

        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;

