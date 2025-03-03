import axios from "axios";

const API_BASE_URL = "http://localhost:8085/user"; // Correct base URL

// Register API call
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};

// Login API call
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};
