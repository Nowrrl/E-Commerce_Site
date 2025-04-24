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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Category Management</h1>

      {editing && (
        <form
          onSubmit={e => {
            e.preventDefault();
            saveCategory(editing);
          }}
          className="mb-6 space-y-4 bg-white p-4 rounded shadow"
        >
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={editing.name}
            onChange={e => setEditing({ ...editing, name: e.target.value })}
            placeholder="Category Name"
            required
          />
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

      <ul className="space-y-2">
        {categories.map(cat => (
          <li
            key={cat.id}
            className="flex justify-between items-center bg-white p-3 rounded shadow"
          >
            <span>{cat.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => setEditing(cat)}
                className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
