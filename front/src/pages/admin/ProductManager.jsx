import React, { useEffect, useState } from 'react';
import axios from "axios";

axios.defaults.baseURL = `http://localhost:8085`;
axios.defaults.withCredentials = true;

export default function ProductManager() {
  const emptyProduct = {
    name: '',
    model: '',
    category: '',
    serialNumber: '',
    imageUrl: '',
    description: '',
    quantity: 0,
    price: 0,
    warrantyStatus: '',
    distributorInfo: '',
    approvedBySales: false
  };

  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    load();
  }, []);

  function load() {
    const authHeader = localStorage.getItem("adminAuth");

    axios
      .get('/admin/products', {
        headers: {
          Authorization: authHeader
        }
      })
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error("Failed to load products:", err);
      });
  }

  function save(product) {
    const authHeader = localStorage.getItem("adminAuth");

    // Exclude price and approval status from being updated
    const preparedProduct = {
      ...product,
      category: {
        name: typeof product.category === 'string'
          ? product.category.trim()
          : product.category?.name?.trim() || ""
      },
      approvedBySales: product.approvedBySales ?? false,
      price: product.price // Keep the existing price without allowing updates
    };

    const req = preparedProduct.id
      ? axios.put(`/admin/products/${preparedProduct.id}`, preparedProduct, {
        headers: { Authorization: authHeader }
      })
      : axios.post('/admin/products', preparedProduct, {
        headers: { Authorization: authHeader }
      });

    req.then(() => {
      load();
      setEditing(null);
      alert("Product saved successfully.");
    }).catch(err => {
      console.error("Failed to save product:", err);
    });
  }

  function remove(id) {
    const authHeader = localStorage.getItem("adminAuth");

    axios
      .delete(`/admin/products/${id}`, {
        headers: { Authorization: authHeader }
      })
      .then(() => setProducts(ps => ps.filter(p => p.id !== id)))
      .catch(err => {
        console.error("Failed to delete product:", err);
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">🛒 Product Management</h1>

      <button
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setEditing({ ...emptyProduct })}
      >
        + Add New Product
      </button>

      {editing && (
        <form
          onSubmit={e => {
            e.preventDefault();
            save(editing);
          }}
          className="bg-white text-gray-800 rounded-2xl shadow-2xl p-8 mb-10 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {editing.id ? "✏️ Edit Product" : "🆕 Add New Product"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(emptyProduct).map((key) => (
              <div key={key}>
                <label className="block mb-1 text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3"
                  value={editing[key] || ''}
                  onChange={e => setEditing({ ...editing, [key]: e.target.value })}
                  disabled={key === 'price' || key === 'approvedBySales'} // Restrict editing
                  readOnly={key === 'price' || key === 'approvedBySales'} // Display as read-only
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-8">
        <h2 className="text-lg font-bold mb-4">📦 Product List</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-purple-100">
              {['ID', 'Name', 'Model', 'Category', 'Serial Number',  'Quantity', 'Price', 'Warranty Status', 'Distributor Info', 'Approval Status', 'Actions'].map(h => (
                <th key={h} className="p-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.model}</td>
                <td className="p-2">{p.categoryName || "—"}</td>
                <td className="p-2">{p.serialNumber}</td>
                
                <td className="p-2">{p.quantity}</td>
                <td className="p-2">${p.price.toFixed(2)}</td>
                <td className="p-2">{p.warrantyStatus}</td>
                <td className="p-2">{p.distributorInfo}</td>
                <td className="p-2">{p.approvedBySales ? "✅ Yes" : "❌ No"}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => setEditing({ ...p, category: { name: p.categoryName || '' } })}
                    className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
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
