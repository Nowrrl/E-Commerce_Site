// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import ProductDetails from "./pages/Productdetails";
import ShoppingCart from "./pages/ShoppingCart";
import ClientProfile from "./pages/ClientProfile";
import ClientOrders from "./pages/ClientOrders";
import ClientWishlist from "./pages/ClientWishlist";
import Checkout from "./pages/Checkout";
import ViewedBefore from "./pages/ViewedBefore";
import CategoryProducts from "./pages/CategoryProducts";
import InvoiceView from "./pages/InvoiceView";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import ProductManager from "./pages/admin/ProductManager";
import CategoryManager from "./pages/admin/CategoryManager";
import OrderDashboard from "./pages/admin/OrderDashboard";
import CommentApproval from "./pages/admin/CommentApproval";
import PricingManager from "./pages/admin/PricingManager";
import Reports from "./pages/admin/Reports";
import ProductManagerHome from "./pages/admin/ProductManagerHome";
import SalesManagerHome from "./pages/admin/SalesManagerHome";
import RefundRequests from "./pages/admin/RefundRequests";
import AdminInvoiceList from './pages/admin/AdminInvoiceList';



import { clearCart, setCartFromBackend } from "./redux/cartSlice";
import { logoutUser } from "./redux/user/userSlice";
import { logoutAdmin } from "./redux/user/userSlice";

// Axios config
axios.defaults.baseURL = "http://localhost:8085";
axios.defaults.withCredentials = true;

const NotFound = () => (
  <div className="p-10 text-white text-center text-2xl">404 - Page Not Found</div>
);

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const isAdminPath = location.pathname.startsWith("/admin");

  // Admin role check from redux or localStorage
  const adminJSON = localStorage.getItem("admin");
  const savedAdmin = adminJSON ? JSON.parse(adminJSON) : null;
  const isAdmin =
    ["PRODUCT_MANAGER", "SALES_MANAGER"].includes(currentUser?.role) ||
    ["PRODUCT_MANAGER", "SALES_MANAGER"].includes(savedAdmin?.role);

  // Load cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser?.id) return;
      try {
        const { data } = await axios.get("/cart/view", {
          params: { userId: currentUser.id },
        });
        const cartItems = await Promise.all(
          data.map(async (item) => {
            const prod = await axios.get(`/products/${item.productId}`);
            return { product: prod.data, quantity: item.quantity };
          })
        );
        dispatch(setCartFromBackend(cartItems));
      } catch (err) {
        console.error("Error loading cart:", err);
      }
    };
    fetchCart();
  }, [currentUser?.id, dispatch]);

  // Restore admin Authorization header from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem("adminAuth");
    if (savedAuth) {
      axios.defaults.headers.common["Authorization"] = savedAuth;
      console.log("Current Authorization:", axios.defaults.headers.common["Authorization"]);
    }
  }, []);

  const handleLogout = () => {
    dispatch(clearCart());

    if (isAdminPath) {
      dispatch(logoutAdmin());
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("admin");
      navigate("/admin/login");
    } else {
      dispatch(logoutUser());
      navigate("/login")
    }

    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("admin");

    if (isAdminPath) {
      navigate("/admin/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {/* Show nav only for users, not admins */}
      {!isAdminPath && (
        <nav className="bg-[#0C0C0E] text-white py-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center px-6">
            <h1 className="font-bold text-3xl">
              <Link to="/">Smart Electronics</Link>
            </h1>
            <div className="space-x-6 flex items-center">
              <Link to="/cart">Cart</Link>
              <Link to="/">Home</Link>
              <Link to="/profile">My Profile</Link>
              <span>Logged in as: {currentUser?.username ?? "Guest"}</span>
              {currentUser?.username && currentUser?.username !== "Guest" ? (
                <button onClick={handleLogout} className="hover:underline">
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="hover:underline">Login</Link>
                  <Link to="/register" className="hover:underline">Register</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/profile" element={<ClientProfile />} />
        <Route path="/clientorders" element={<ClientOrders />} />
        <Route path="/wishlist" element={<ClientWishlist />} />
        <Route path="/checkout" element={currentUser?.id ? <Checkout /> : <Navigate to="/login" replace state={{ from: "/checkout" }} />} />
        <Route path="/viewed" element={<ViewedBefore />} />
        <Route path="/category/:categoryName" element={<CategoryProducts />} />
        <Route path="/invoice-preview" element={<InvoiceView />} />




        {/* Admin login page */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin protected routes */}
        {isAdmin ? (
          <Route path="/admin" element={<AdminLayout />}>
            {/* Split homepages */}
            {savedAdmin?.role === "PRODUCT_MANAGER" && (
              <Route index element={<ProductManagerHome />} />
            )}
            {savedAdmin?.role === "SALES_MANAGER" && (
              <Route index element={<SalesManagerHome />} />
            )}

            {/* Admin Subpages */}
            <Route path="products" element={<ProductManager />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="orders" element={<OrderDashboard />} />
            <Route path="comments" element={<CommentApproval />} />
            <Route path="pricing" element={<PricingManager />} />
            <Route path="reports" element={<Reports />} />
            <Route path="/admin/refunds" element={<RefundRequests />} />
            <Route path="/admin/invoices" element={<AdminInvoiceList />} />
          </Route>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
        )}


        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
