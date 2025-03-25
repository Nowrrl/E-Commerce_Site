import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import ProductDetails from "./pages/Productdetails.jsx";

function App() {
    return (
        <Router>
            {/* Navigation Bar */}
            <nav className="bg-[#0C0C0E] text-white py-4 p-6 shadow-lg">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <Link to="/" className="font-bold text-3xl">
                        Smart Electronics
                    </Link>
                    <div className="space-x-6">
                        <Link to="/" className="hover:underline">Home</Link>
                        <Link to="/login" className="hover:underline">Login</Link>
                        <Link to="/register" className="hover:underline">Register</Link>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* Updated dynamic route for product details */}
                <Route path="/product/:productId" element={<ProductDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
