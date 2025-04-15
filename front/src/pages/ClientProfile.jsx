import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const ClientProfile = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [profile, setProfile] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [editingAddress, setEditingAddress] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!currentUser?.id) return;
        // Wrap URL in backticks for template literal interpolation.
        const res = await axios.get(`http://localhost:8085/user/${currentUser.id}`);
        setProfile(res.data);
        setDeliveryAddress(res.data.deliveryAddress || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleAddressSave = async () => {
    try {
      // Wrap URL in backticks for proper variable interpolation.
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

  if (!profile) {
    return <div className="text-center p-10 text-white">Loading profile...</div>;
  }

  return (
      <div className="bg-gradient-to-b from-black to-purple-900 min-h-screen text-white">
        <div className="border-t-1 border-white" />
        <div className="flex flex-col items-start p-10">
          <div className="bg-white text-black rounded-xl p-8 shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center">
              👨‍💼 My Profile
            </h2>
            <p className="mb-3">
              <strong>Name:</strong> {profile.username}
            </p>
            <p className="mb-3">
              <strong>Email:</strong> {profile.email}
            </p>

            <div className="mb-3">
              <strong>Delivery Address:</strong>{" "}
              {editingAddress ? (
                  <div className="flex mt-2 gap-2">
                    <input
                        type="text"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="flex-1 border p-2 rounded"
                        placeholder="Enter address"
                    />
                    <button
                        onClick={handleAddressSave}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
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
          </div>
          <div className="bg-white text-black rounded-xl p-6 shadow-md mt-8 w-full max-w-md">
            <h3 className="text-lg font-bold text-purple-700 mb-4">⭐ Special for Me</h3>
            <div className="flex flex-col gap-4">
              <button
                  className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg hover:opacity-90 transition w-full cursor-pointer hover:underline"
                  onClick={() => console.log("Wishlist clicked")}
              >
                📌 Wishlist
              </button>
              <button
                  className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg hover:opacity-90 transition w-full cursor-pointer hover:underline"
                  onClick={() => console.log("Viewed Before clicked")}
              >
                👀 Viewed Before
              </button>
            </div>
          </div>
          {/* New Section: My Orders */}
          <div className="bg-white text-black rounded-xl p-6 shadow-md mt-8 w-full max-w-md">
            <h3 className="text-lg font-bold text-purple-700 mb-4">⭐ My Orders</h3>
            <Link
                to="/clientorders"
                className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg hover:opacity-90 transition w-full text-center cursor-pointer hover:underline"
            >
              View Order History
            </Link>
          </div>
          <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar
              newestOnTop
              closeOnClick
          />
        </div>
      </div>
  );
};

export default ClientProfile;
