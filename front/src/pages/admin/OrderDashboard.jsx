import React, { useEffect, useState } from 'react';
import axios from "axios";

axios.defaults.baseURL = `http://localhost:8085`;
axios.defaults.withCredentials = true;

export default function OrderDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    load();
  }, []);

  function load() {
    const authHeader = localStorage.getItem("adminAuth");
    axios.get('/admin/orders', {
      headers: { Authorization: authHeader }
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error("Failed to fetch admin orders:", err));
  }

  function updateStatus(id, status) {
    const authHeader = localStorage.getItem("adminAuth");
    axios.post(`/admin/orders/${id}/status?status=${status}`, null, {
      headers: { Authorization: authHeader }
    })
      .then(load)
      .catch(err => console.error(`Failed to update order #${id} to ${status}:`, err));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 p-10 text-white">
      <div className="bg-white rounded-2xl p-8 shadow-xl text-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-purple-700">🚚 Order & Delivery Management</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-purple-100 text-purple-800">
              <tr>
                {["ID", "Customer", "Product", "Qty", "Total", "Address", "Status", "Actions"].map((head) => (
                  <th key={head} className="px-4 py-3 text-left text-sm font-semibold border-b border-gray-200">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-purple-50 transition">
                  <td className="px-4 py-3 border-b border-gray-200">{o.id}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{o.customer}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{o.product}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{o.qty}</td>
                  <td className="px-4 py-3 border-b border-gray-200 font-semibold text-red-600">${o.total.toFixed(2)}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{o.address}</td>
                  <td className="px-4 py-3 border-b border-gray-200">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    o.status === "processing"
                      ? "bg-yellow-200 text-yellow-800"
                      : o.status === "in-transit"
                      ? "bg-blue-200 text-blue-800"
                      : o.status === "delivered"
                      ? "bg-green-200 text-green-800"
                      : o.status === "refunded"
                      ? "bg-red-200 text-red-800"
                      : "bg-gray-200 text-gray-800"
                  }`}>
                    {o.status}
                  </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200">
                  {o.status === "refunded" ? (
                    <span className="text-gray-400 italic text-sm">Status locked</span>
                  ) : (
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="processing">processing</option>
                      <option value="in-transit">in-transit</option>
                      <option value="delivered">delivered</option>
                    </select>
                  )}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
