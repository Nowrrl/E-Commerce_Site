import React, { useState } from "react";
import "./AuthPage.css";




function AuthPage() {
  // Toggle between "login" and "register"
  const [activeForm, setActiveForm] = useState("login");

  const handleFormSwitch = (formType) => {
    setActiveForm(formType);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // TODO: Call your backend API for login
    console.log("Login submitted");
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // TODO: Call your backend API for registration
    console.log("Register submitted");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={activeForm === "login" ? "active" : ""}
            onClick={() => handleFormSwitch("login")}
          >
            Login
          </button>
          <button
            className={activeForm === "register" ? "active" : ""}
            onClick={() => handleFormSwitch("register")}
          >
            Register
          </button>
        </div>

        {/* LOGIN FORM */}
        {activeForm === "login" && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <h2>Welcome Back</h2>
            <label>Username</label>
            <input type="text" placeholder="Enter username" required />

            <label>Password</label>
            <input type="password" placeholder="Enter password" required />

            <div className="auth-options">
              <div>
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="#forgot" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="btn-submit">Login</button>

            <p className="switch-link">
              Don’t have an account?{" "}
              <span onClick={() => handleFormSwitch("register")}>Register</span>
            </p>
          </form>
        )}

        {/* REGISTER FORM */}
        {activeForm === "register" && (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <h2>Create Account</h2>
            <label>Username</label>
            <input type="text" placeholder="Choose a username" required />

            <label>Email</label>
            <input type="email" placeholder="Enter your email" required />

            <label>Password</label>
            <input type="password" placeholder="Create a password" required />

            <button type="submit" className="btn-submit">Register</button>

            <p className="switch-link">
              Already have an account?{" "}
              <span onClick={() => handleFormSwitch("login")}>Login</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
