import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RefundRequests() {
  const [refunds, setRefunds] = useState([]);
  const [loadingActionId, setLoadingActionId] = useState(null); // new: handle button loading state

  useEffect(() => {
    loadRefunds();
  }, []);

  const loadRefunds = () => {
    const authHeader = localStorage.getItem("adminAuth");
    axios.get('http://localhost:8085/admin/refunds', {
      headers: { Authorization: authHeader },
      withCredentials: true,
    })
      .then(res => setRefunds(res.data))
      .catch(err => {
        console.error("Failed to fetch refund requests:", err);
        toast.error("❌ Failed to load refund requests.");
      });
  };

  const approveRefund = async (refundId) => {
    try {
      setLoadingActionId(refundId);
      const authHeader = localStorage.getItem("adminAuth");
      await axios.put(`http://localhost:8085/admin/refunds/${refundId}/approve`, null, {
        headers: { Authorization: authHeader },
        withCredentials: true,
      });
      toast.success("✅ Refund approved successfully!");
      loadRefunds(); // reload table
    } catch (err) {
      console.error(`Failed to approve refund ${refundId}:`, err);
      toast.error("❌ Failed to approve refund.");
    } finally {
      setLoadingActionId(null);
    }
  };

  const rejectRefund = async (refundId) => {
    try {
      setLoadingActionId(refundId);
      const authHeader = localStorage.getItem("adminAuth");
      await axios.put(`http://localhost:8085/admin/refunds/${refundId}/reject`, null, {
        headers: { Authorization: authHeader },
        withCredentials: true,
      });
      toast.success("✅ Refund rejected successfully!");
      loadRefunds(); // reload table
    } catch (err) {
      console.error(`Failed to reject refund ${refundId}:`, err);
      toast.error("❌ Failed to reject refund.");
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 p-10 text-white">
      <ToastContainer />
      <div className="bg-white rounded-2xl p-8 shadow-xl text-gray-900">
        <h1 className="text-3xl font-bold mb-6 text-purple-700">💸 Refund Requests Management</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-purple-100 text-purple-800">
              <tr>
                {["Refund ID", "Order ID", "Product", "Customer", "Price", "Requested", "Status", "Actions"].map((head) => (
                  <th key={head} className="px-4 py-3 text-left text-sm font-semibold border-b border-gray-200">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {refunds.map((r) => (
                <tr key={r.refundId} className="hover:bg-purple-50 transition">
                  <td className="px-4 py-3 border-b border-gray-200">{r.refundId}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{r.orderId}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{r.productName}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{r.customerName}</td>
                  <td className="px-4 py-3 border-b border-gray-200 font-semibold text-red-600">${r.priceAtPurchase.toFixed(2)}</td>
                  <td className="px-4 py-3 border-b border-gray-200">{new Date(r.requestDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 border-b border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      r.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : r.status === "Approved"
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-200 space-x-2">
                    {r.status === "Pending" && (
                      <>
                        <button
                          onClick={() => approveRefund(r.refundId)}
                          disabled={loadingActionId === r.refundId}
                          className={`bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition ${loadingActionId === r.refundId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectRefund(r.refundId)}
                          disabled={loadingActionId === r.refundId}
                          className={`bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition ${loadingActionId === r.refundId ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {(r.status === "Approved" || r.status === "Rejected") && (
                      <span className="text-gray-500 text-xs italic">No action</span>
                    )}
                  </td>
                </tr>
              ))}
              {refunds.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-gray-500 py-10">
                    No refund requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
