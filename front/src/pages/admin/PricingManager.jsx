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
    <div>
      <h1 className="text-2xl font-semibold mb-4">Pricing & Approval</h1>

      {message && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded">
          {message}
        </div>
      )}

      <div className="mb-6 flex space-x-4 items-end">
        <select
          value={priceUpdate.productId}
          onChange={e => setPriceUpdate({ ...priceUpdate, productId: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Set Price"
          className="border p-2 rounded w-32"
          value={priceUpdate.price}
          onChange={e => setPriceUpdate({ ...priceUpdate, price: e.target.value })}
        />
        <button
          onClick={updatePrice}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Approve & Set Price
        </button>
      </div>

      {priceUpdate.productId && (
        <div className="text-gray-700">
          Suggested price after {priceUpdate.price}% discount:{" "}
          <span className="font-semibold">
            ${calculateDiscountedPrice(priceUpdate.productId, priceUpdate.price).toFixed(2)}
          </span>
        </div>
      )}


      <table className="w-full table-auto border-collapse bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            {['ID', 'Name', 'Price', 'Approved?'].map(h => (
              <th key={h} className="border p-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">${p.price.toFixed(2)}</td>
              <td className="border p-2">{p.approvedBySales ? "✅ Yes" : "❌ No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
