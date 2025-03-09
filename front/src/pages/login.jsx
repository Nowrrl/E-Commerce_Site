import React, { useState } from "react";
import { loginUser } from "../api/api";

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(credentials);
            alert("Login Successful!");
            console.log(response);
        } catch (error) {
            alert("Login Failed. Check your credentials.");
        }
    };

    return (
        <div className="flex border-t-4 border-white  items-center justify-center min-h-screen w-full bg-gradient-to-b from-black to-purple-600">
            <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-lg shadow-black/40 w-96 border border-white/20">

                <h2 className="text-2xl font-bold text-center text-white mb-6">Welcome Back</h2>
                
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
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/20 text-white placeholder-white"
                    />
                    <button
                        type="submit"
                        className="w-1/2 mt-2 mx-auto block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-white mt-4">
                    Don't have an account?{" "}
                    <a href="/register" className="text-blue-300 hover:underline">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;