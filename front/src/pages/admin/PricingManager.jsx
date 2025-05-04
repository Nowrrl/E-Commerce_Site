import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = `http://localhost:8085`;
axios.defaults.withCredentials = true;

export default function PricingManager() {
  const [products, setProducts] = useState([]);
  const [priceUpdate, setPriceUpdate] = useState({ productId: '', discount: '' });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  function loadProducts() {
    const authHeader = localStorage.getItem("adminAuth");

    axios.get('/admin/products', {
      headers: { Authorization: authHeader }
    })
      .then(res => setProducts(res.data))
      .catch(err => console.error("Failed to load products:", err));
  }

  function calculateDiscountedPrice(productId, discountRate) {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product || !discountRate) return 0;

    const basePrice = product.originalPrice ?? product.price;
    const discountAmount = (basePrice * discountRate) / 100;
    return Math.max(0, basePrice - discountAmount);
  }

  function applyDiscount() {
    const authHeader = localStorage.getItem("adminAuth");
    const { productId, discount } = priceUpdate;
    const parsedDiscount = parseFloat(discount);

    if (!productId || isNaN(parsedDiscount) || parsedDiscount <= 0 || parsedDiscount >= 100) {
      setMessage("❗ Please select a product and a valid discount (1–99%).");
      return;
    }

    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return setMessage("❗ Product not found.");

    const basePrice = product.originalPrice ?? product.price;
    const discountedPrice = (basePrice * (1 - parsedDiscount / 100)).toFixed(2);

    axios.put(`/admin/products/${productId}/price`, { price: discountedPrice }, {
      headers: { Authorization: authHeader }
    })
      .then(() => {
        setMessage("✅ Discount applied and price updated.");
        setPriceUpdate({ productId: '', discount: '' });
        loadProducts();
      })
      .catch(err => {
        console.error("Failed to apply discount:", err);
        setMessage("❌ Failed to apply discount.");
      });
  }

  function removeDiscount(productId) {
    const authHeader = localStorage.getItem("adminAuth");

    axios.put(`/admin/products/${productId}/remove-discount`, null, {
      headers: { Authorization: authHeader }
    })
      .then(() => {
        setMessage("✅ Discount removed successfully.");
        loadProducts();
      })
      .catch(err => {
        console.error("Failed to remove discount:", err);
        setMessage("❌ Failed to remove discount.");
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">🛠️ Pricing & Discount Manager</h1>

      {message && (
        <div className="mb-6 p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg font-medium text-center">
          {message}
        </div>
      )}

      {/* Discount Form */}
      <div className="bg-white text-black rounded-2xl shadow-lg p-6 mb-10 max-w-3xl mx-auto">
        <h2 className="text-lg font-bold mb-4">📉 Apply Discount</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <select
            value={priceUpdate.productId}
            onChange={e => setPriceUpdate({ ...priceUpdate, productId: e.target.value })}
            className="border p-2 rounded w-full md:w-1/2"
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Discount %"
            className="border p-2 rounded w-full md:w-1/4"
            value={priceUpdate.discount}
            onChange={e => setPriceUpdate({ ...priceUpdate, discount: e.target.value })}
          />

          <button
            onClick={applyDiscount}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Apply Discount
          </button>
        </div>

        {priceUpdate.productId && priceUpdate.discount && (
          <p className="mt-4 text-gray-800 font-medium">
            Final price after {priceUpdate.discount}% discount:{" "}
            <span className="font-bold text-red-600">
              ${calculateDiscountedPrice(priceUpdate.productId, priceUpdate.discount).toFixed(2)}
            </span>
          </p>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white text-black rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4">📦 Product List</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-purple-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Current Price</th>
              <th className="p-2 text-left">Original Price</th>
              <th className="p-2 text-left">Discount %</th>
              <th className="p-2 text-left">Approved</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const discountPercent = p.originalPrice
                ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                : null;

              return (
                <tr key={p.id} className="border-t">
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2 text-red-600 font-bold">${p.price.toFixed(2)}</td>
                  <td className="p-2 text-gray-500 line-through">
                    {p.originalPrice ? `$${p.originalPrice.toFixed(2)}` : '-'}
                  </td>
                  <td className="p-2 text-sm text-purple-700 font-semibold">
                    {discountPercent ? `${discountPercent}%` : '–'}
                  </td>
                  <td className="p-2">{p.approvedBySales ? "✅ Yes" : "❌ No"}</td>
                  <td className="p-2">
                    {p.originalPrice && (
                      <button
                        onClick={() => removeDiscount(p.id)}
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove Discount
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
