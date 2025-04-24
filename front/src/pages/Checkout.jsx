import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { clearBackendCart } from "../api/api";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ import axios

function Checkout() {
  const cartItems = useSelector((state) => state.cart.items);
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.cardNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await axios.post(
        "/checkout", // ✅ this works with baseURL already set in App.jsx
        null,
        {
          params: {
            userId: currentUser.id,
            deliveryAddress: formData.address
          }
        }
      );

      if (currentUser?.id) await clearBackendCart(currentUser.id);
      dispatch(clearCart());

      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("There was an error processing your order. Please check console.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 to-black p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <div className="max-w-3xl mx-auto bg-white text-black rounded-xl shadow-xl p-6 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between py-2 border-b">
              <div>
                <p>{item.product.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p>${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="text-right font-bold mt-4">
            Total: ${totalPrice.toFixed(2)}
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Payment & Shipping</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded border border-gray-300"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Shipping Address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded border border-gray-300"
            required
          />
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={formData.cardNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded border border-gray-300"
            required
          />
          <div className="flex gap-4">
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={formData.expiry}
              onChange={handleInputChange}
              className="w-1/2 px-4 py-2 rounded border border-gray-300"
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={formData.cvv}
              onChange={handleInputChange}
              className="w-1/2 px-4 py-2 rounded border border-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold py-2 rounded hover:brightness-110 transition"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
