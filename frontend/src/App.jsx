
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import MoveToTop from "./components/MoveToTop/MoveToTop";

/* =========================================================
   CUSTOMER PAGES
========================================================= */

import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Categories from "./pages/Categories/Categories";
import MaternityPillows from "./pages/MaternityPillows/MaternityPillows";
import BabyPillows from "./pages/BabyPillows/BabyPillows";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
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
   ADMIN
========================================================= */

import AdminLayout from "./components/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLogin from "./pages/Admin/AdminLogin";

/* =========================================================
   ADMIN PRODUCTS
========================================================= */

import AdminProducts from "./pages/Admin/Products/AdminProducts";
import AddProduct from "./pages/Admin/Products/AddProduct";
import EditProduct from "./pages/Admin/Products/EditProduct";
import AdminContacts from "./pages/Admin/AdminContacts/AdminContacts";
/* =========================================================
   ADMIN ORDERS
========================================================= */

import AdminOrders from "./pages/Admin/Orders/AdminOrders";
import AdminOrderDetails from "./pages/Admin/Orders/AdminOrderDetails";
import OrderStatusPage from "./pages/Admin/Orders/OrderStatusPage";
import AdminCustomers from "./pages/Admin/Customers/AdminCustomers";
import AdminCustomerDetails from "./pages/Admin/Customers/AdminCustomerDetails";
import AdminPayments from "./pages/Admin/AdminPayments";
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

        {/* =================================================
            ADMIN LOGIN
        ================================================= */}

        <Route
          path="/admin"
          element={<AdminLogin />}
        />


        {/* =================================================
            ADMIN LAYOUT
        ================================================= */}

        <Route element={<AdminLayout />}>

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />


          {/* =================================================
              PRODUCTS
          ================================================= */}

          {/* ALL PRODUCTS */}

          <Route
            path="/admin/products"
            element={<AdminProducts />}
          />

          {/* ADD PRODUCT */}

          <Route
            path="/admin/products/add"
            element={<AddProduct />}
          />

          {/* EDIT PRODUCT */}

          <Route
            path="/admin/products/edit/:id"
            element={<EditProduct />}
          />


          {/* =================================================
              ORDERS
          ================================================= */}

          {/* ALL ORDERS */}

          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          {/* PENDING ORDERS */}

          <Route
            path="/admin/orders/pending"
            element={
              <OrderStatusPage status="Pending" />
            }
          />

          {/* PROCESSING ORDERS */}

          <Route
            path="/admin/orders/processing"
            element={
              <OrderStatusPage status="Processing" />
            }
          />

          {/* SHIPPED ORDERS */}

          <Route
            path="/admin/orders/shipped"
            element={
              <OrderStatusPage status="Shipped" />
            }
          />

          {/* DELIVERED ORDERS */}

          <Route
            path="/admin/orders/delivered"
            element={
              <OrderStatusPage status="Delivered" />
            }
          />

          {/* CANCELLED ORDERS */}

          <Route
            path="/admin/orders/cancelled"
            element={
              <OrderStatusPage status="Cancelled" />
            }
          />

          {/* ORDER DETAILS */}

          <Route
            path="/admin/orders/:id"
            element={<AdminOrderDetails />}
          />
<Route
  path="/admin/contacts"
  element={<AdminContacts />}
/>

          {/* =================================================
              CUSTOMERS
          ================================================= */}
<Route
  path="/admin/customers"
  element={<AdminCustomers />}
/>

<Route
  path="/admin/customers/:id"
  element={<AdminCustomerDetails />}
/>


          {/* =================================================
              PAYMENTS
          ================================================= */}
<Route
  path="/admin/payments"
  element={<AdminPayments />}
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
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />

      {/* =====================================================
          MOVE TO TOP
      ===================================================== */}

      <MoveToTop />

      {/* =====================================================
          CUSTOMER ROUTES
      ===================================================== */}

      <Routes>

        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =================================================
            SHOP
        ================================================= */}

        <Route
          path="/shop"
          element={<Shop />}
        />


        {/* =================================================
            CATEGORIES
        ================================================= */}

        <Route
          path="/categories"
          element={<Categories />}
        />


        {/* =================================================
            MATERNITY PILLOWS
        ================================================= */}

        <Route
          path="/maternity-pillows"
          element={<MaternityPillows />}
        />


        {/* =================================================
            BABY PILLOWS
        ================================================= */}

        <Route
          path="/baby-pillows"
          element={<BabyPillows />}
        />


        {/* =================================================
            ABOUT
        ================================================= */}

        <Route
          path="/about"
          element={<About />}
        />


        {/* =================================================
            CONTACT
        ================================================= */}

        <Route
          path="/contact"
          element={<Contact />}
        />


        {/* =================================================
            LOGIN
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* =================================================
            REGISTER
        ================================================= */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =================================================
            PROFILE / ACCOUNT
        ================================================= */}

        <Route
          path="/profile"
          element={<Account />}
        />
<Route path="/search" element={<Search />} />
<Route path="/wishlist" element={<Wishlist />} />
        {/* =================================================
            CART
        ================================================= */}

        <Route
          path="/cart"
          element={<Cart />}
        />


        {/* =================================================
            PRODUCT DETAILS
        ================================================= */}

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />


        {/* =================================================
            CHECKOUT
        ================================================= */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />


        {/* =================================================
            ORDER SUCCESS
        ================================================= */}

        <Route
          path="/order-success/:id"
          element={<OrderSuccess />}
        />


        {/* =================================================
            MY ORDERS
        ================================================= */}

        <Route
          path="/orders"
          element={<MyOrders />}
        />


        {/* =================================================
            CUSTOMER ORDER DETAILS
        ================================================= */}

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />


        {/* =================================================
            PAYMENT SUCCESS
        ================================================= */}

        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />

      </Routes>


      {/* =====================================================
          FOOTER
      ===================================================== */}

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
