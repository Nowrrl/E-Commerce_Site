import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientOrders = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?.id) return;
      try {
        const response = await axios.get(`http://localhost:8085/orders/user/${currentUser.id}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("❌ Failed to load orders.");
      }
    };
    fetchOrders();
  }, [currentUser]);

  const handleSubmitReview = async (orderId, productId, text, rating) => {
    try {
      await axios.post("http://localhost:8085/comments/add", {
        userId: currentUser.id,
        productId,
        text,
        rating,
      });
      if (!text || text.trim() === "") {
        toast.success("✅ Review submitted successfully!");
      } else {
        toast.success("✅ Review submitted and awaiting approval.");
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error("❌ Failed to submit review.");
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:8085/invoice/${orderId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_order_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("📄 Invoice downloaded!");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("❌ Failed to download invoice.");
    }
  };

  const handleRefundRequest = async (orderId) => {
    try {
      await axios.post("http://localhost:8085/refunds/request", 
        { orderId: orderId },
        { withCredentials: true }
      );
      toast.success("✅ Refund request submitted successfully!");
      // Optionally, reload orders here if you want to update UI
    } catch (error) {
      console.error("Error requesting refund:", error);
      toast.error("❌ Failed to request refund.");
    }
  };


  return (
    <div className="bg-gradient-to-b from-black to-purple-900 min-h-screen p-6 flex flex-col items-center">
      <ToastContainer />
      <div className="bg-white text-black w-full max-w-5xl p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 border-b pb-4">📦 My Orders</h1>

        <Link
          to="/profile"
          className="inline-block mb-6 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          ← Back to Profile
        </Link>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-10">
            {orders.map((order) => {
              const isDelivered = order.status.toLowerCase() === "delivered";
              const isRefunded = order.status.toLowerCase() === "refunded";

              const deliveryDate = new Date(order.createdAt); // Assuming updatedAt is delivery date
              const isWithin30Days = (new Date() - deliveryDate) <= 30 * 24 * 60 * 60 * 1000;

              return (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="border border-gray-300 rounded-xl p-6 bg-gray-50 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={order.product.imageUrl || "/products_images/default_product_image.png"}
                      alt={order.product.name}
                      className="w-32 h-32 rounded-xl object-cover border"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{order.product.name}</h2>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "refunded"
                          ? "bg-red-100 text-red-700"
                          : order.status === "in-transit"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status}
                      </span>
                      </div>
                      <p><strong>Order ID:</strong> {order.orderId}</p>
                      <p><strong>Quantity:</strong> {order.quantity}</p>
                      <p><strong>Total:</strong> <span className="text-red-600 font-bold">${order.totalPrice.toFixed(2)}</span></p>
                      <p><strong>Ordered on:</strong> {new Date(order.createdAt).toLocaleString()}</p>

                      <button
                        onClick={() => handleDownloadInvoice(order.orderId)}
                        className="mt-2 inline-block bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-sm"
                      >
                        📄 Download Invoice
                      </button>

                      {/* Refund button */}
                      {isDelivered && !isRefunded && isWithin30Days && (
                        <button
                          onClick={() => handleRefundRequest(order.orderId)}
                          className="ml-4 mt-2 inline-block bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition text-sm"
                        >
                          💸 Request Refund
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Review form after delivery */}
                  {isDelivered && (
                    <ReviewForm
                      orderId={order.orderId}
                      productId={order.product.id}
                      onSubmit={handleSubmitReview}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewForm = ({ orderId, productId, onSubmit }) => {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 border-t pt-4"
    >
      <h4 className="text-lg font-semibold text-purple-700 mb-2">📝 Leave a Review</h4>
      <label className="block text-sm mb-1">Rating:</label>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
        rows="3"
        placeholder="Write your review here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => onSubmit(orderId, productId, text, rating)}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Submit Review
      </button>
      <p className="text-xs text-gray-500 mt-2 italic">
        Your review will be visible after it is approved by our moderation team.
      </p>
    </motion.div>
  );
};

export default ClientOrders;
