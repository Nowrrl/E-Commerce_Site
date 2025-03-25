import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./redux/user/userSlice";

import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";

function App() {
  // Grab the user from Redux
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Router>
      {/* Navigation Bar */}
      <nav className="bg-[#0C0C0E] text-white py-4 p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6">
          <Link to="/" className="font-bold text-3xl">
            Smart Electronics
          </Link>
          
          {/* Conditionally show links based on currentUser */}
          <div className="space-x-6">
            {/* Always show "Home" */}
            <Link to="/" className="hover:underline">Home</Link>
            
            {currentUser ? (
              <>
                {/* If logged in, show username & Logout button */}
                <span>Logged in as:    {currentUser.username}</span>
                <button onClick={handleLogout} className="hover:underline">
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* If NOT logged in, show Login/Register */}
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}

export default App;