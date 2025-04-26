import React, { useEffect, useState } from 'react';
import axios from "axios";

axios.defaults.baseURL = `http://localhost:8085`;
axios.defaults.withCredentials = true;

export default function PricingManager() {
  const [products, setProducts] = useState([]);
  const [priceUpdate, setPriceUpdate] = useState({ productId: '', price: '' });
  const [message, setMessage] = useState("");

  function calculateDiscountedPrice(productId, discountRate) {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product || !discountRate) return 0;

    const discountAmount = (product.price * discountRate) / 100;
    return Math.max(0, product.price - discountAmount);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function loadProducts() {
    const authHeader = localStorage.getItem("adminAuth");

    axios.get('/admin/products', {
      headers: {
        Authorization: authHeader
      }
    })
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error("Failed to load products:", err);
      });
  }

  function updatePrice() {
    const authHeader = localStorage.getItem("adminAuth");
    const { productId, price } = priceUpdate;
    const parsedPrice = parseFloat(price);

    if (!productId) {
      setMessage("❗ Please select a product.");
      return;
    }
    if (!price || isNaN(parsedPrice) || parsedPrice <= 0) {
      setMessage("❗ Please enter a valid price.");
      return;
    }

    axios.put(`/admin/products/${productId}/price`, {
      price: parsedPrice
    }, {
      headers: {
        Authorization: authHeader
      }
    })
      .then(() => {
        setMessage("✅ Price updated and product approved!");
        loadProducts();
        setPriceUpdate({ productId: '', price: '' });
      })
      .catch(err => {
        console.error("Failed to update price:", err);
        setMessage("❌ Failed to update price.");
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">Pricing & Product Approval</h1>

      {/* Top message */}
      {message && (
        <div className="mb-8 p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg text-center font-medium">
          {message}
        </div>
      )}

      {/* Form area */}
      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-8 mb-10 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Set Product Price</h2>

        <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
          <select
            value={priceUpdate.productId}
            onChange={e => setPriceUpdate({ ...priceUpdate, productId: e.target.value })}
            className="border border-gray-300 p-2 rounded w-full md:w-1/2"
          >
            <option value="">Select product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Set Price"
            className="border border-gray-300 p-2 rounded w-full md:w-1/4"
            value={priceUpdate.price}
            onChange={e => setPriceUpdate({ ...priceUpdate, price: e.target.value })}
          />

          <button
            onClick={updatePrice}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
          >
            Approve & Set Price
          </button>
        </div>

        {/* Show discounted price suggestion */}
        {priceUpdate.productId && priceUpdate.price && (
          <div className="text-gray-700 font-medium">
            Suggested final price after {priceUpdate.price}% discount:{" "}
            <span className="font-bold">
              ${calculateDiscountedPrice(priceUpdate.productId, priceUpdate.price).toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white text-gray-800 rounded-2xl shadow-2xl p-8">
        <h2 className="text-xl font-semibold mb-6">All Products</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              {['ID', 'Name', 'Price', 'Approved?'].map(h => (
                <th key={h} className="text-left text-gray-600 font-semibold p-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">${p.price.toFixed(2)}</td>
                <td className="p-3">{p.approvedBySales ? "✅ Yes" : "❌ No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
