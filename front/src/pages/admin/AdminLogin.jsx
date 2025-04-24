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

        // Redirect based on role
        if (role === "PRODUCT_MANAGER") {
          navigate("/admin/products");
        } else if (role === "SALES_MANAGER") {
          navigate("/admin/pricing");
        } else {
          navigate("/admin");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="block mb-1">Username</label>
          <input
            name="username"
            value={creds.username}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={creds.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
