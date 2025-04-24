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
      }
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Product Management</h1>

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
          className="mb-6 space-y-4 bg-white p-4 rounded shadow"
        >
          {/** Form fields remain unchanged */}
          {/* Name */}
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={editing.name}
              onChange={e => setEditing({ ...editing, name: e.target.value })}
              required
            />
          </div>

          {/* Model */}
          <div>
            <label className="block mb-1">Model</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={editing.model}
              onChange={e => setEditing({ ...editing, model: e.target.value })}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1">Category</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={editing.category?.name || ''}
              onChange={e => setEditing({ ...editing, category: { name: e.target.value } })}
              required
            />
          </div>

          {/* Serial Number */}
          <div>
            <label className="block mb-1">Serial Number</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={editing.serialNumber}
              onChange={e => setEditing({ ...editing, serialNumber: e.target.value })}
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block mb-1">Image URL</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={editing.imageUrl}
              onChange={e => setEditing({ ...editing, imageUrl: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              className="w-full border p-2 rounded"
              value={editing.description}
              onChange={e => setEditing({ ...editing, description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block mb-1">Quantity in Stock</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={isNaN(editing.quantity) ? '' : editing.quantity}
              onChange={e => {
                const value = e.target.value;
                setEditing({ ...editing, quantity: value === '' ? '' : parseInt(value, 10) });
              }}
              min={0}
              required
            />
          </div>


          {/* Warranty Status */}
          <div>
            <label className="block mb-1">Warranty Status</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={editing.warrantyStatus}
              onChange={e => setEditing({ ...editing, warrantyStatus: e.target.value })}
            />
          </div>

          {/* Distributor Info */}
          <div>
            <label className="block mb-1">Distributor Info</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={editing.distributorInfo}
              onChange={e => setEditing({ ...editing, distributorInfo: e.target.value })}
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="w-full table-auto border-collapse bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-200">
            {['ID', 'Name', 'Model', 'Category', 'Stock', 'Price', 'Actions'].map(h => (
              <th key={h} className="border p-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.model}</td>
              <td className="border p-2">{p.categoryName || "—"}</td>
              <td className="border p-2">{p.quantity}</td>
              <td className="border p-2">${p.price.toFixed(2)}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => setEditing({
                    ...p,
                    category: { name: p.categoryName || '' } 
                  })}
                  className="px-2 bg-yellow-400 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="px-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
