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
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-gray-300">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800">
                            Registration Successful!
                        </h2>
                        <p className="mb-6 text-gray-600">
                            Your account has been created. Please proceed to login.
                        </p>
                        <button
                            onClick={goToLogin}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition duration-300"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
                    <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Register</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                            >
                                Register
                            </button>
                        </form>
                        <p className="text-sm text-gray-600 text-center mt-4">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-500 hover:underline">Login</a>
                        </p>
                    </div>
                </div>
            )}
        </>
    );


}

export default Register;
