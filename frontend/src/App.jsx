
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

/* =========================================================
   CUSTOMER COMPONENTS
========================================================= */

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import MoveToTop from "./components/MoveToTop/MoveToTop";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";

/* =========================================================
   CUSTOMER PAGES
========================================================= */

import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Categories from "./pages/Categories/Categories";
import MaternityPillows from "./pages/MaternityPillows/MaternityPillows";
import BabyPillows from "./pages/BabyPillows/BabyPillows";
import NursingPillows from "./pages/NursingPillows/NursingPillows";
import ElderPillows from "./pages/ElderPillows/ElderPillows";
import Accessories from "./pages/Accessories/Accessories";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import EmailSent from "./pages/EmailSent/EmailSent";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Account from "./pages/Account/Account";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import MyOrders from "./pages/MyOrders/MyOrders";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import Wishlist from "./pages/Wishlist/Wishlist";
import Search from "./pages/Search/Search";

/* =========================================================
   ADMIN COMPONENTS
========================================================= */

import AdminLayout from "./components/Admin/AdminLayout";

/* =========================================================
   ADMIN PAGES
========================================================= */

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLogin from "./pages/Admin/AdminLogin";

/* =========================================================
   ADMIN PRODUCTS
========================================================= */

import AdminProducts from "./pages/Admin/Products/AdminProducts";
import AddProduct from "./pages/Admin/Products/AddProduct";
import EditProduct from "./pages/Admin/Products/EditProduct";

/* =========================================================
   ADMIN CONTACTS
========================================================= */

import AdminContacts from "./pages/Admin/AdminContacts/AdminContacts";

/* =========================================================
   ADMIN ORDERS
========================================================= */

import AdminOrders from "./pages/Admin/Orders/AdminOrders";
import AdminOrderDetails from "./pages/Admin/Orders/AdminOrderDetails";
import OrderStatusPage from "./pages/Admin/Orders/OrderStatusPage";

/* =========================================================
   ADMIN CUSTOMERS AND PAYMENTS
========================================================= */

import AdminCustomers from "./pages/Admin/Customers/AdminCustomers";
import AdminCustomerDetails from "./pages/Admin/Customers/AdminCustomerDetails";
import AdminPayments from "./pages/Admin/AdminPayments";

/* =========================================================
   ADMIN REVIEWS
========================================================= */

import AdminProductReviews from "./pages/Admin/ProductReviews";
import AdminReviews from "./pages/Admin/Reviews/AdminReviews";

/* =========================================================
   POLICIES
========================================================= */

import ReturnPolicy from "./pages/ReturnPolicy/ReturnPolicy";
import ShippingPolicy from "./pages/ShippingPolicy/ShippingPolicy";
import TermsOfSale from "./pages/TermsOfSale/TermsOfSale";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import FAQ from "./pages/FAQ/FAQ";

/* =========================================================
   APP CONTENT
========================================================= */

function AppContent() {
  const location = useLocation();

  /* =======================================================
     ADMIN ROUTES
  ======================================================= */

  if (location.pathname.startsWith("/admin")) {
    return (
      <Routes>
        {/* ADMIN LOGIN */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* ADMIN LAYOUT */}
        <Route element={<AdminLayout />}>
          {/* DASHBOARD */}
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          {/* PRODUCTS */}
          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          <Route
            path="/admin/products/add"
            element={<AddProduct />}
          />

          <Route
            path="/admin/products/edit/:id"
            element={<EditProduct />}
          />

          {/* ORDERS */}
          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          <Route
            path="/admin/orders/pending"
            element={<OrderStatusPage status="Pending" />}
          />

          <Route
            path="/admin/orders/processing"
            element={<OrderStatusPage status="Processing" />}
          />

          <Route
            path="/admin/orders/shipped"
            element={<OrderStatusPage status="Shipped" />}
          />

          <Route
            path="/admin/orders/delivered"
            element={<OrderStatusPage status="Delivered" />}
          />

          <Route
            path="/admin/orders/cancelled"
            element={<OrderStatusPage status="Cancelled" />}
          />

          <Route
            path="/admin/orders/:id"
            element={<AdminOrderDetails />}
          />

          {/* CONTACTS */}
          <Route
            path="/admin/contacts"
            element={<AdminContacts />}
          />

          {/* CUSTOMERS */}
          <Route
            path="/admin/customers"
            element={<AdminCustomers />}
          />

          <Route
            path="/admin/customers/:id"
            element={<AdminCustomerDetails />}
          />

          {/* PAYMENTS */}
          <Route
            path="/admin/payments"
            element={<AdminPayments />}
          />

          {/* ADMIN PRODUCT REVIEWS */}
          <Route
            path="/admin/reviews"
            element={<AdminProductReviews />}
          />

          {/* SEPARATE ADMIN REVIEWS PAGE */}
          <Route
            path="/admin/reviews-management"
            element={<AdminReviews />}
          />
        </Route>
      </Routes>
    );
  }

  /* =======================================================
     CUSTOMER WEBSITE
  ======================================================= */

  return (
    <>
      <Header />

      <MoveToTop />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* SHOP */}
        <Route path="/shop" element={<Shop />} />

        {/* CATEGORIES */}
        <Route path="/categories" element={<Categories />} />

        {/* PRODUCT CATEGORIES */}
        <Route
          path="/maternity-pillows"
          element={<MaternityPillows />}
        />

        <Route
          path="/baby-pillows"
          element={<BabyPillows />}
        />

        <Route
          path="/nursing-pillows"
          element={<NursingPillows />}
        />

        <Route
          path="/elder-pillows"
          element={<ElderPillows />}
        />

        <Route
          path="/accessories"
          element={<Accessories />}
        />

        {/* ABOUT */}
        <Route path="/about" element={<About />} />

        {/* CONTACT */}
        <Route path="/contact" element={<Contact />} />

        {/* AUTHENTICATION */}
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/email-sent" element={<EmailSent />} />

        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* ACCOUNT */}
        <Route path="/profile" element={<Account />} />

        {/* SEARCH */}
        <Route path="/search" element={<Search />} />

        {/* WISHLIST */}
        <Route path="/wishlist" element={<Wishlist />} />

        {/* CART */}
        <Route path="/cart" element={<Cart />} />

        {/* PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* CHECKOUT */}
        <Route path="/checkout" element={<Checkout />} />

        {/* ORDER SUCCESS */}
        <Route
          path="/order-success/:id"
          element={<OrderSuccess />}
        />

        {/* CUSTOMER ORDERS */}
        <Route path="/orders" element={<MyOrders />} />

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

        {/* PAYMENT SUCCESS */}
        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />

        {/* POLICIES */}
        <Route
          path="/return-policy"
          element={<ReturnPolicy />}
        />

        <Route
          path="/shipping-policy"
          element={<ShippingPolicy />}
        />

        <Route
          path="/terms-of-sale"
          element={<TermsOfSale />}
        />

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route path="/faq" element={<FAQ />} />
      </Routes>

      <WhatsAppButton />

      <Footer />
    </>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
