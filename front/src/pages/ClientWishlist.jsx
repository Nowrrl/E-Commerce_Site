// src/pages/ClientWishlist.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
    fetchWishlist,
    removeFromWishlist,
} from "../redux/wishlistSLice";

const ClientWishlist = () => {
    const dispatch   = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);
    const { items: wishlistItems, status } = useSelector((state) => state.wishlist);


    useEffect(() => {
        if (currentUser?.id) {
            dispatch(fetchWishlist(currentUser.id));
        }
    }, [currentUser?.id, dispatch]);


    const handleRemove = (productId) => {
        dispatch(
            removeFromWishlist({ userId: currentUser.id, productId })
        );
    };

    return (
        <div className="bg-gradient-to-b from-black to-purple-900 min-h-screen p-6 text-white">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

                {/* Back link */}
                <Link
                    to="/profile"
                    className="inline-block mb-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
                >
                    ← Back to Profile
                </Link>

                {/* Loading / empty states */}
                {status === "loading" && <p>Loading…</p>}

                {status === "succeeded" && wishlistItems.length === 0 && (
                    <div className="text-center">
                        <p className="text-lg">Your wishlist is empty.</p>
                        <Link to="/" className="text-blue-300 hover:underline">
                            Browse products
                        </Link>
                    </div>
                )}

                {/* Wishlist grid */}
                {wishlistItems.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {wishlistItems.map((wish) => {
                            const { id, product } = wish; // id = wishlist id
                            return (
                                <div
                                    key={id}
                                    className="bg-white text-black rounded-lg shadow-md flex overflow-hidden"
                                >
                                    <img
                                        src={product.imageUrl || "default_product_image.png"}
                                        alt={product.name}
                                        className="w-32 h-32 object-cover"
                                    />
                                    <div className="flex-1 p-4">
                                        <h2 className="font-bold text-lg">{product.name}</h2>
                                        <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                                        <div className="mt-4 flex justify-between items-center">
                                            <Link
                                                to={`/product/${product.id}`}
                                                className="text-purple-700 hover:underline text-sm"
                                            >
                                                View Details
                                            </Link>
                                            <button
                                                onClick={() => handleRemove(product.id)}
                                                className="text-red-500 text-sm hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientWishlist;
