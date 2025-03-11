import React, { useState } from "react";
import { registerUser } from "../api/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(userData);
            setShowModal(true); // Show modal on successful registration
            console.log(response);
        } catch (error) {
            alert("Registration Failed. Try again.");
        }
    };

    const goToLogin = () => {
        setShowModal(false);
        navigate("/login");
    };

    return (
        <>
            {showModal ? (
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-purple-600">
                    <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-lg shadow-black/40 w-96 border border-white/20">
                        <h2 className="text-3xl font-bold mb-4 text-white text-center">
                            Registration Successful!
                        </h2>
                        <p className="mb-6 text-gray-300 text-center">
                            Your account has been created. Please proceed to login.
                        </p>
                        <button
                            onClick={goToLogin}
                            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex border-t-1 border-white items-center justify-center min-h-screen bg-gradient-to-b from-black to-purple-900">
                    <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-lg shadow-black/40 w-96 border border-white/20">
                        <h2 className="text-2xl font-bold text-center text-white mb-6">Register</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20 text-white placeholder-white"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20 text-white placeholder-white"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20 text-white placeholder-white"
                            />
                            <button
                                type="submit"
                                className="w-1/2 mt-2 mx-auto block bg-purple-800 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                            >
                                Register
                            </button>
                        </form>
                        <p className="text-center text-white mt-4">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-300 hover:underline">Login</a>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Register;