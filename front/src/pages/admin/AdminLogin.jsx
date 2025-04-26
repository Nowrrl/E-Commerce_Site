import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAdminUser } from "../../redux/user/userSlice";

export default function AdminLogin() {
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedAuth = localStorage.getItem("adminAuth");
    if (savedAuth) {
      axios.defaults.headers.common["Authorization"] = savedAuth;
    }
  }, []);

  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = creds;

    if (!username || !password) {
      setError("Both fields are required");
      return;
    }

    const token = btoa(`${username}:${password}`);
    const authHeader = `Basic ${token}`;
    localStorage.setItem("adminAuth", authHeader);
    axios.defaults.headers.common["Authorization"] = authHeader;

    try {
      const res = await axios.post("http://localhost:8085/user/worker/login", {
        username,
        password,
      });

      if (res.data.message === "Worker login successful") {
        const { id, role } = res.data.worker;

        const adminUser = {
          id,
          username,
          role,
        };

        dispatch(setAdminUser(adminUser));

        if (role === "PRODUCT_MANAGER" || role === "SALES_MANAGER") {
          navigate("/admin");
        } else {
          navigate("/admin/login");
        }

      } else {
        setError(res.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative overflow-hidden">
      {/* Fancy blurred background shapes */}
      <div className="absolute w-72 h-72 bg-purple-600 opacity-30 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-indigo-600 opacity-30 rounded-full blur-3xl bottom-10 right-10"></div>

      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-md bg-white/10 p-8 rounded-3xl shadow-2xl border border-gray-300/20 w-96 space-y-6 text-white relative z-10"
      >
        <h2 className="text-3xl font-extrabold text-center tracking-tight">
          Admin Portal Login
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <div>
          <label className="block mb-2 text-sm font-semibold">Username</label>
          <input
            name="username"
            value={creds.username}
            onChange={handleChange}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 p-3 rounded-lg placeholder-white focus:ring-2 focus:ring-purple-400 focus:outline-none text-black"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={creds.password}
            onChange={handleChange}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 p-3 rounded-lg placeholder-white focus:ring-2 focus:ring-purple-400 focus:outline-none text-black"
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 transition font-semibold py-3 rounded-lg text-white text-lg tracking-wide"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
