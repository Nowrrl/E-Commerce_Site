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

    console.log("AUTH header before fetching orders:", authHeader); // ✅ Debug line

    axios.get('/admin/orders', {
      headers: {
        Authorization: authHeader
      }
    })
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error("Failed to fetch admin orders:", err);
      });
  }

  function updateStatus(id, status) {
    const authHeader = localStorage.getItem("adminAuth");

    axios.post(`/admin/orders/${id}/status?status=${status}`, null, {
      headers: {
        Authorization: authHeader
      }
    })
      .then(load)
      .catch(err => {
        console.error(`Failed to update order #${id} to ${status}:`, err);
      });
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Order Management</h1>
      <table className="w-full table-auto border-collapse bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            {['ID', 'Customer', 'Product', 'Qty', 'Total', 'Address', 'Status', 'Actions'].map(h => (
              <th key={h} className="border p-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="hover:bg-gray-50">
              <td className="border p-2">{o.id}</td>
              <td className="border p-2">{o.customer}</td>
              <td className="border p-2">{o.product}</td>
              <td className="border p-2">{o.qty}</td>
              <td className="border p-2">${o.total.toFixed(2)}</td>
              <td className="border p-2">{o.address}</td>
              <td className="border p-2">{o.status}</td>
              <td className="border p-2 space-x-2">
                <select
                  value={o.status}
                  onChange={e => updateStatus(o.id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="processing">processing</option>
                  <option value="in-transit">in-transit</option>
                  <option value="delivered">delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
