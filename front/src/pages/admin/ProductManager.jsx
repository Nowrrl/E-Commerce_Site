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
    distributorInfo: ''
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

    // Wrap category as object
    const preparedProduct = {
      ...product,
      category: {
        name: typeof product.category === 'string'
          ? product.category.trim()
          : product.category?.name?.trim() || ""
      },
      price: null, // Set price to null initially
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
      alert("Product created. Please assign a price in the Pricing Manager.");
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
      <h1 className="text-3xl font-bold mb-8">Product Management</h1>

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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🛠️ {editing.id ? "Edit Product" : "Add New Product"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block mb-1 text-gray-600">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                value={editing.name}
                onChange={e => setEditing({ ...editing, name: e.target.value })}
                required
              />
            </div>

            {/* Model */}
            <div>
              <label className="block mb-1 text-gray-600">Model</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3"
                value={editing.model}
                onChange={e => setEditing({ ...editing, model: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1 text-gray-600">Category</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3"
                value={editing.category?.name || ''}
                onChange={e => setEditing({ ...editing, category: { name: e.target.value } })}
                required
              />
            </div>

            {/* Serial Number */}
            <div>
              <label className="block mb-1 text-gray-600">Serial Number</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3"
                value={editing.serialNumber}
                onChange={e => setEditing({ ...editing, serialNumber: e.target.value })}
                required
              />
            </div>

            {/* Image URL */}
            <div className="col-span-2">
              <label className="block mb-1 text-gray-600">Image URL</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3"
                value={editing.imageUrl}
                onChange={e => setEditing({ ...editing, imageUrl: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block mb-1 text-gray-600">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3"
                rows={3}
                value={editing.description}
                onChange={e => setEditing({ ...editing, description: e.target.value })}
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block mb-1 text-gray-600">Quantity in Stock</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-3"
                min={0}
                value={isNaN(editing.quantity) ? '' : editing.quantity}
                onChange={e => {
                  const value = e.target.value;
                  setEditing({ ...editing, quantity: value === '' ? '' : parseInt(value, 10) });
                }}
                required
              />
            </div>

            {/* Warranty */}
            <div>
              <label className="block mb-1 text-gray-600">Warranty Status</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3"
                value={editing.warrantyStatus}
                onChange={e => setEditing({ ...editing, warrantyStatus: e.target.value })}
              />
            </div>

            {/* Distributor Info */}
            <div className="col-span-2">
              <label className="block mb-1 text-gray-600">Distributor Info</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3"
                value={editing.distributorInfo}
                onChange={e => setEditing({ ...editing, distributorInfo: e.target.value })}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white text-gray-800 rounded-2xl shadow-2xl p-8">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              {['ID', 'Name', 'Model', 'Category', 'Stock', 'Price', 'Actions'].map(h => (
                <th key={h} className="text-left text-gray-600 font-semibold p-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.model}</td>
                <td className="p-3">{p.categoryName || "—"}</td>
                <td className="p-3">{p.quantity}</td>
                <td className="p-3">${p.price.toFixed(2)}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => setEditing({
                      ...p,
                      category: { name: p.categoryName || '' }
                    })}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
