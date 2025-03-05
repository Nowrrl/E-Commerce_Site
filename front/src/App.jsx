import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
    return (
        <Router>
            {/* Navigation Bar */}
            <nav className="bg-blue-600 text-white py-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <h1 className="text-2xl font-bold">MyApp</h1>
                    <div className="space-x-6">
                        <Link to="/" className="hover:underline">Home</Link>
                        <Link to="/login" className="hover:underline">Login</Link>
                        <Link to="/register" className="hover:underline">Register</Link>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
                <div className="bg-white p-10 shadow-lg rounded-lg max-w-lg text-center">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome!</h1>
                                <p className="text-gray-600">Please <Link to="/login" className="font-bold hover:underline">Login</Link> or  <Link to="/register" className="font-bold hover:underline">Register</Link> to continue.</p>
                            </div>
                        } />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
