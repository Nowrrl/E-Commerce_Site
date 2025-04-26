import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function InvoiceView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { invoiceUrl, orderId } = location.state || {};

  if (!invoiceUrl) {
    return <p className="text-center mt-10 text-white">No invoice found.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-800 to-black p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Invoice Preview</h1>
      <div className="max-w-4xl mx-auto bg-white text-black rounded-xl shadow-lg p-4">
        <h2 className="text-xl font-semibold text-black mb-4">Invoice for Order #{orderId}</h2>
        <iframe
          src={invoiceUrl}
          title="Invoice"
          width="100%"
          height="600px"
          className="rounded border"
        />
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate("/clientorders")}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
          >
            Go to My Orders
          </button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceView;
