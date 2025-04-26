import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { clearBackendCart } from "../api/api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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

    if (name === "cardNumber") {
      const cleaned = value.replace(/\D/g, "").slice(0, 16);
      const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();
      setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    } else if (name === "expiry") {
      let cleaned = value.replace(/\D/g, "").slice(0, 4);
      if (cleaned.length >= 3) cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
      setFormData((prev) => ({ ...prev, expiry: cleaned }));
    } else if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "").slice(0, 3);
      setFormData((prev) => ({ ...prev, cvv: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const cardDigits = formData.cardNumber.replace(/\s/g, "");
    const cvvValid = /^\d{3}$/.test(formData.cvv);
    const expiryValid = /^(\d{2})\/(\d{2})$/.test(formData.expiry);

    if (!formData.name || !formData.address || !cardDigits) {
      toast.error("❗ Please fill in all required fields.");
      return;
    }

    if (cardDigits.length !== 16) {
      toast.error("❗ Card number must be 16 digits.");
      return;
    }

    if (!cvvValid) {
      toast.error("❗ CVV must be exactly 3 digits.");
      return;
    }

    if (!expiryValid) {
      toast.error("❗ Expiry must be in MM/YY format.");
      return;
    }

    const [expMonth, expYear] = formData.expiry.split("/").map(Number);
    if (expMonth < 1 || expMonth > 12) {
      toast.error("❗ Invalid expiry month. Must be between 01 and 12.");
      return;
    }
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      toast.error("❗ Card has expired.");
      return;
    }

    try {
      const { data: message } = await axios.post(
        "/checkout",
        null,
        {
          params: {
            userId: currentUser.id,
            deliveryAddress: formData.address,
            email: currentUser.email,
          },
        }
      );

      const { data: allOrders } = await axios.get(`/orders/user/${currentUser.id}`);
      const lastOrder = allOrders[allOrders.length - 1];
      const lastOrderId = lastOrder.orderId;

      const res = await axios.get(`/invoice/${lastOrderId}`, {
        responseType: "blob",
      });

      const blobUrl = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));

      if (currentUser?.id) await clearBackendCart(currentUser.id);
      dispatch(clearCart());

      navigate("/invoice-preview", {
        state: {
          invoiceUrl: blobUrl,
          orderId: lastOrderId,
        },
      });

      toast.success("✅ Order placed! Showing invoice...");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("❌ Order failed, please try again.");
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
