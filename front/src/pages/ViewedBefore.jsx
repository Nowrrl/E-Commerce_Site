import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ViewedBefore = () => {
  const [viewedProducts, setViewedProducts] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("viewedProducts");
    if (stored) {
      setViewedProducts(JSON.parse(stored));
    }
  }, []);

  if (viewedProducts.length === 0) {
    return (
      <div className="p-10 text-center text-white">
        You haven't viewed any products yet.
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-b from-black to-purple-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">👀 Products You've Viewed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {viewedProducts.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="bg-white text-black rounded-lg overflow-hidden shadow-md hover:scale-105 transition transform"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <h3 className="font-semibold text-lg truncate">{product.name}</h3>
              <p className="text-sm text-gray-700">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ViewedBefore;
