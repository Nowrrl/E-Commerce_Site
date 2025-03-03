import React, { useState } from "react";
import { registerUser } from "../api/api";

const Register = () => {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(userData);
            alert("Registration Successful!");
            console.log(response);
        } catch (error) {
            alert("Registration Failed. Try again.");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
