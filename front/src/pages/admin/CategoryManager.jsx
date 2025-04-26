import React, { useEffect, useState } from 'react';
import axios from "axios";

axios.defaults.baseURL = `http://localhost:8085`;
axios.defaults.withCredentials = true;

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  function loadCategories() {
    const authHeader = localStorage.getItem("adminAuth");

    axios.get('/admin/categories', {
      headers: {
        Authorization: authHeader
      }
    })
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => console.error("Failed to load categories:", err));
  }

  function saveCategory(category) {
    const authHeader = localStorage.getItem("adminAuth");

    axios.put(`/admin/categories/${category.id}`, category, {
      headers: { Authorization: authHeader }
    })
      .then(() => {
        loadCategories();
        setEditing(null);
      })
      .catch(err => {
        console.error("Failed to save category:", err);
      });
  }

  function deleteCategory(id) {
    const authHeader = localStorage.getItem("adminAuth");

    axios.delete(`/admin/categories/${id}`, {
      headers: { Authorization: authHeader }
    })
      .then(loadCategories)
      .catch(err => {
        console.error("Failed to delete category:", err);
      });
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-900 to-black text-white">
      <h1 className="text-3xl font-bold mb-8 text-white">
        🗂️ <span className="bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
          Category Management
        </span>
      </h1>

      {editing && (
        <form
          onSubmit={e => {
            e.preventDefault();
            saveCategory(editing);
          }}
          className="bg-white rounded-2xl shadow-2xl p-6 mb-8 max-w-md mx-auto"
        >
          <h2 className="text-xl font-bold text-black mb-4">✏️ Edit Category</h2>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-black placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            value={editing.name}
            onChange={e => setEditing({ ...editing, name: e.target.value })}
            placeholder="Category Name"
            required
          />
          <div className="flex gap-4 justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="bg-white text-black rounded-2xl shadow-xl p-6 flex flex-col justify-between hover:shadow-2xl transition-transform hover:scale-105"
            >
              <h3 className="text-xl font-semibold mb-4">{cat.name}</h3>
              <div className="flex gap-2 justify-end mt-auto">
                <button
                  onClick={() => setEditing(cat)}
                  className="px-4 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-16">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-semibold text-white mb-2">No Categories Found</h2>
          <p className="text-gray-300">Start by adding a new category!</p>
        </div>
      )}
    </div>
  );
}
