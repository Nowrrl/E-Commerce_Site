import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const ClientOrders = () => {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!currentUser?.id) return;
            try {
                const response = await axios.get(
                    `http://localhost:8085/orders/user/${currentUser.id}`
                );
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [currentUser]);

    // We'll treat orders with "processing" or "shipped" as active.
    const activeOrders = orders.filter((order) => {
        const status = order.status.toLowerCase();
        return status === "processing" || status === "shipped";
    });
    const previousOrders = orders.filter((order) => {
        const status = order.status.toLowerCase();
        return status !== "processing" && status !== "shipped";
    });

    return (
        <div className="bg-gradient-to-b from-black to-purple-900 min-h-screen p-6 flex flex-col items-center">
            {/* Outer white container for the orders page */}
            <div className="bg-white text-black w-full max-w-4xl p-6 rounded-md shadow-md border border-gray-300">
                {/* Header */}
                <div className="border-b border-gray-300 pb-2 mb-6">
                    <h1 className="text-3xl font-bold">My Orders</h1>
                </div>

                {/* Back to Profile Button */}
                <Link
                    to="/profile"
                    className="inline-block bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg hover:opacity-90 transition cursor-pointer hover:underline mb-6"
                >
                    Back to Profile
                </Link>

                {/* Active Orders Section */}
                <div className="border-b border-gray-300 pb-2 mb-6">
                    <h2 className="text-xl font-semibold mb-3">Current Orders</h2>
                    {activeOrders.length > 0 ? (
                        <div className="space-y-6">
                            {activeOrders.map((order) => (
                                <div
                                    key={order.orderId}
                                    className="bg-white border border-gray-300 rounded-md shadow-sm p-4"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row md:justify-between mb-2">
                                        <p className="font-bold text-gray-900">
                                            Order ID: {order.orderId}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            Ordered on:{" "}
                                            <span className="font-medium">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                                        </p>
                                    </div>
                                    {/* Order Details */}
                                    <div className="text-sm space-y-2">
                                        <p>
                                            <strong>Product:</strong> {order.product.name}
                                        </p>
                                        <p>
                                            <strong>Quantity:</strong> {order.quantity}
                                        </p>
                                        <p>
                                            <strong>Total Price:</strong>{" "}
                                            <span className="text-red-600">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                                        </p>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            <span className="text-green-600">{order.status}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 ml-2">No current orders found.</p>
                    )}
                </div>

                {/* Previous Orders Section */}
                <div>
                    <div className="border-b border-gray-300 pb-2 mb-4">
                        <h2 className="text-xl font-semibold mb-3">Previous Orders</h2>
                    </div>
                    {previousOrders.length > 0 ? (
                        <div className="space-y-6">
                            {previousOrders.map((order) => (
                                <div
                                    key={order.orderId}
                                    className="bg-white border border-gray-300 rounded-md shadow-sm p-4"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row md:justify-between mb-2">
                                        <p className="font-bold text-gray-900">
                                            Order ID: {order.orderId}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            Ordered on:{" "}
                                            <span className="font-medium">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                                        </p>
                                    </div>
                                    {/* Order Details */}
                                    <div className="text-sm space-y-2">
                                        <p>
                                            <strong>Product:</strong> {order.product.name}
                                        </p>
                                        <p>
                                            <strong>Quantity:</strong> {order.quantity}
                                        </p>
                                        <p>
                                            <strong>Total Price:</strong>{" "}
                                            <span className="text-red-600">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                                        </p>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            <span className="text-purple-600">{order.status}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 ml-2">No previous orders found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientOrders;
