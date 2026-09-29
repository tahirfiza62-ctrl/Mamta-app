import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import MoveToTop from "./components/MoveToTop/MoveToTop";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
function AppContent() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Header />}

      <MoveToTop />

      <Routes>
        {/* other routes */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}