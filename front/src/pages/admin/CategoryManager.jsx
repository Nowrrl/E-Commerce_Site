import React, { useEffect, useState } from 'react';
import axios from "axios";

axios.defaults.baseURL = `http://localhost:8085`;
axios.defaults.withCredentials = true;

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [newCategory, setNewCategory] = useState("");

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

  function addCategory() {
    const authHeader = localStorage.getItem("adminAuth");

    axios.post('/admin/categories', { name: newCategory }, {
      headers: { Authorization: authHeader }
    })
      .then(() => {
        loadCategories();
        setNewCategory("");
      })
      .catch(err => console.error("Failed to add category:", err));
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
      <h1 className="text-3xl font-bold mb-8 text-white">🗂️ Category Management</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="New Category Name"
          className="p-2 rounded-md border mr-2"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          onClick={addCategory}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add Category
        </button>
      </div>

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
            className="w-full border border-gray-300 p-3 rounded-lg mb-4"
            value={editing.name}
            onChange={e => setEditing({ ...editing, name: e.target.value })}
            placeholder="Category Name"
            required
          />
          <div className="flex gap-4 justify-end">
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg">Save</button>
            <button onClick={() => setEditing(null)} className="px-6 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
          </div>
        </form>
      )}

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white text-black rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-semibold mb-4">{cat.name}</h3>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setEditing(cat)} className="px-4 py-1 bg-yellow-400">Edit</button>
                <button onClick={() => deleteCategory(cat.id)} className="px-4 py-1 bg-red-500 text-white">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-16">No Categories Found</div>
      )}
    </div>
  );
}
