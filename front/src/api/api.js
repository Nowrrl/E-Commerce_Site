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

// Product cart API call
export const addToBackendCart = async (emailOrUsername, productIdentifier, quantity) => {
    try {
      const response = await axios.post("http://localhost:8085/cart/add", {
        emailOrUsername,
        productIdentifier,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };


  // Remove a specific product from cart
export const removeFromBackendCart = async (userId, productId) => {
  return await axios.delete(`http://localhost:8085/cart/remove`, {
    params: { userId, productId },
  });
};

// Clear entire cart
export const clearBackendCart = async (userId) => {
  try {
    const response = await axios.delete(`http://localhost:8085/cart/clear`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error("Error clearing backend cart:", error);
    throw error;
  }
};




  
