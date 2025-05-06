import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClientProfile = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [profile, setProfile] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [editingAddress, setEditingAddress] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topCategory, setTopCategory] = useState(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8085/user/${currentUser.id}`);
      setProfile(res.data);
      setDeliveryAddress(res.data.deliveryAddress || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:8085/orders/user/${currentUser.id}`);
      const orders = res.data;
      setRecentOrders(orders.slice(-5).reverse());
      const categoryCounts = {};
      orders.forEach(order => {
        const cat = order.product.category?.name;
        if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
      const top = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
      setTopCategory(top?.[0]);
    } catch (err) {
      console.error("Error loading orders", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:8085/notifications/${currentUser.id}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchProfile();
      fetchRecentOrders();
      fetchNotifications();
    }
  }, [currentUser]);

  const handleAddressSave = async () => {
    try {
      await axios.put(
          `http://localhost:8085/user/update-address/${currentUser.id}`,
          null,
          { params: { address: newAddress } }
      );
      setDeliveryAddress(newAddress);
      setEditingAddress(false);
      toast.success("Address updated successfully!");
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  };

  const gradientPage = "bg-gradient-to-b from-black to-purple-900 text-white";

  if (!profile) return <div className="text-center p-10 text-white">Loading profile...</div>;

  return (
      <div className={`${gradientPage} border-t-1 border-white min-h-screen`}>
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Profile Info Card */}
          <motion.div
              className="bg-white text-black p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-purple-600 mb-4">👤 Profile</h2>
            <p><strong>Name:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <div className="mt-4">
              <strong>Delivery Address:</strong>{" "}
              {editingAddress ? (
                  <div className="flex gap-2 mt-2">
                    <input
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="p-2 border rounded flex-1"
                        placeholder="Enter new address"
                    />
                    <button onClick={handleAddressSave} className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-2 rounded">
                      Save
                    </button>
                  </div>
              ) : (
                  <div className="flex justify-between items-center mt-2">
                    <span>{deliveryAddress || "Not set"}</span>
                    <button
                        onClick={() => {
                          setNewAddress(deliveryAddress);
                          setEditingAddress(true);
                        }}
                        className="text-sm text-purple-600 underline ml-4 cursor-pointer"
                    >
                      Edit Address
                    </button>
                  </div>
              )}
            </div>
          </motion.div>

          {/* Notification Card */}
          <motion.div
              className="bg-white text-black p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-pink-500 mb-4">🔔 Notifications</h2>
            {notifications.length === 0 ? (
                <p>No new notifications.</p>
            ) : (
                <ul className="space-y-3">
                  {notifications.map((note) => (
                      <li key={note.id} className="p-3 border rounded-lg shadow-sm">
                        <p className="text-sm">{note.message}</p>
                        <p className="text-xs text-gray-400">{new Date(note.timestamp).toLocaleString()}</p>
                      </li>
                  ))}
                </ul>
            )}
          </motion.div>

          {/* Loyalty Card */}
          <motion.div
              className="bg-white text-black p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-yellow-500 mb-4">🎖️ Loyalty</h2>
            <p className="mb-2">You’ve earned <strong>{profile.loyaltyPoints}</strong> points.</p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div
                  className="bg-yellow-400 h-4 rounded-full"
                  style={{ width: `${Math.min(profile.loyaltyPoints, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">Reach 100 points for Silver Tier</p>
          </motion.div>

          {/* Insights Panel */}
          <motion.div
              className="bg-white text-black p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-blue-500 mb-4">📊 Insights</h2>
            <p><strong>Total Orders:</strong> {profile.totalOrders}</p>
            <p><strong>Most Purchased Category:</strong> {topCategory || "–"}</p>
          </motion.div>

          {/* Recent Orders Preview */}
          <motion.div
              className="bg-white text-black p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-green-500 mb-4">🛒 Recent Orders</h2>
            {recentOrders.length === 0 ? (
                <p>No recent orders found.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {recentOrders.map(order => (
                      <Link
                          key={order.orderId}
                          to={`/product/${order.product.id}`}
                          className="border p-2 rounded-lg hover:shadow-md transition cursor-pointer"
                      >
                        <img
                            src={order.product.imageUrl}
                            alt={order.product.name}
                            className="w-full h-32 object-cover rounded"
                        />
                        <p className="mt-2 text-sm font-semibold truncate">{order.product.name}</p>
                        <p className="text-xs text-gray-500">{order.status}</p>
                      </Link>
                  ))}
                </div>
            )}
          </motion.div>

          {/* Shortcut Buttons */}
          <motion.div
              className="flex gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
          >
            <button
                onClick={() => navigate("/wishlist")}
                className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
            >
              ❤️ My Wishlist
            </button>
            <button
                onClick={() => navigate("/clientorders")}
                className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
            >
              📦 Order History
            </button>
          </motion.div>

          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
      </div>
  );
};

export default ClientProfile;
