// src/pages/Login.jsx
import React, { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";           // <-- Import useDispatch
import { setUser } from "../redux/user/userSlice";   // <-- Import setUser

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // <-- Initialize dispatch

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser(credentials);
      // Example response from backend might look like:
      // { message: "Login successful", user: { username: "john", email: "john@example.com" } }

      if (response.message === "Login successful") {
        // 1) Dispatch user info to Redux so the rest of the app knows we're logged in
        if (response.user) {
          dispatch(setUser(response.user)); 
        } else {
          // fallback if your backend doesn't return user data
          dispatch(setUser({ username: credentials.username }));
        }

        // 2) Navigate to home or wherever
        navigate("/");
        setErrorMessage("");
      } else {
        setErrorMessage(response.message);
      }

      console.log(response);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex border-t-1 border-white items-center justify-center min-h-screen w-full bg-gradient-to-b from-black to-purple-900">
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
          {errorMessage && (
            <p className="text-red-400 text-sm text-center">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-1/2 mt-2 mx-auto block bg-purple-800 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
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
