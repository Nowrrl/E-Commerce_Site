import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = `http://localhost:8085`;
axios.defaults.withCredentials = true;

export default function PricingManager() {
  const [products, setProducts] = useState([]);
  const [priceUpdate, setPriceUpdate] = useState({ productId: '', price: '', discount: '' });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  function loadProducts() {
    const authHeader = localStorage.getItem("adminAuth");

    axios.get('/admin/products', {
      headers: { Authorization: authHeader }
    })
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          setProducts([]);
          console.error("Invalid response format:", res.data);
        }
      })
      .catch(err => {
        console.error("Failed to load products:", err);
        setProducts([]);
      });
  }

  function applyPriceUpdate() {
    const authHeader = localStorage.getItem("adminAuth");
    const { productId, price } = priceUpdate;

    if (!productId || isNaN(price) || price <= 0) {
      setMessage("❗ Please select a product and enter a valid price.");
      return;
    }

    axios.put(`/admin/products/${productId}/price`, 
      { price: parseFloat(price) }, 
      {
        headers: { Authorization: authHeader }
      }
    )
    .then(() => {
      setMessage("✅ Price updated successfully.");
      setPriceUpdate({ productId: '', price: '', discount: '' });
      loadProducts();
    })
    .catch(err => {
      console.error("Failed to update price:", err.response?.data || err.message);
      setMessage("❌ Failed to update price.");
    });
  }

  function applyDiscountUpdate() {
  const authHeader = localStorage.getItem("adminAuth");
  const { productId, discount } = priceUpdate;

  if (!productId || isNaN(discount) || discount <= 0 || discount >= 100) {
    setMessage("❗ Please enter a valid discount (1-99%).");
    return;
  }

  const product = products.find(p => p.id === parseInt(productId));
  if (!product) return;

  // Check if original price is already stored
  const basePrice = product.originalPrice ?? product.price;
  
  // If the original price is not set, use the current price as the base price
  const originalPrice = product.originalPrice ? product.originalPrice : product.price;

  // Calculate the discounted price
  const discountedPrice = (originalPrice * (1 - discount / 100)).toFixed(2);

  axios.put(`/admin/products/${productId}/price`, 
    { 
      price: parseFloat(discountedPrice),
      originalPrice: parseFloat(originalPrice) // Preserve the original price
    }, 
    {
      headers: { Authorization: authHeader }
    }
  )
  .then(() => {
    setMessage("✅ Discount applied successfully.");
    setPriceUpdate({ productId: '', price: '', discount: '' });
    loadProducts();
  })
  .catch(err => {
    console.error("Failed to apply discount:", err.response?.data || err.message);
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
      console.error("Failed to remove discount:", err.response?.data || err.message);
      setMessage("❌ Failed to remove discount.");
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">🛠️ Pricing & Discount Manager</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg font-medium text-center ${message.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}

      <div className="bg-white text-black rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4">📦 Product List</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-purple-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Current Price</th>
              <th className="p-2 text-left">New Price</th>
              <th className="p-2 text-left">Discount %</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2 font-bold text-green-700">${p.price ? p.price.toFixed(2) : 'Not Set'}</td>
                <td className="p-2">
                  <input
                    type="number"
                    placeholder="Set Price"
                    className="border p-2 rounded w-full"
                    value={priceUpdate.productId === p.id ? priceUpdate.price : ''}
                    onChange={(e) => setPriceUpdate({ ...priceUpdate, productId: p.id, price: e.target.value })}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    placeholder="Discount %"
                    className="border p-2 rounded w-full"
                    value={priceUpdate.productId === p.id ? priceUpdate.discount : ''}
                    onChange={(e) => setPriceUpdate({ ...priceUpdate, productId: p.id, discount: e.target.value })}
                  />
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={applyPriceUpdate}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={applyDiscountUpdate}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Discount
                  </button>
                  <button
                    onClick={() => removeDiscount(p.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
