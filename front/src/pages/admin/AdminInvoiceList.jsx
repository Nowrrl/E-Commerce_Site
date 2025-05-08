// front/src/pages/admin/AdminInvoiceList.jsx
import React, { useState } from 'react';
import axios from 'axios';

// if you haven't already, set this once in your app entrypoint (e.g. index.jsx):
// axios.defaults.baseURL = 'http://localhost:8085';
// axios.defaults.withCredentials = true;

export default function AdminInvoiceList() {
    const [range, setRange]     = useState({ from:'', to:'' });
    const [invoices, setInvoices] = useState([]);

    function loadInvoices() {
        axios.get('/admin/invoices', {
            params: { from: range.from, to: range.to }
        })
            .then(res => setInvoices(res.data))
            .catch(console.error);
    }

    function downloadInvoice(orderId) {
        axios.get(`/admin/invoices/${orderId}/download`, {
            responseType: 'blob'
        })
            .then(({ data }) => {
                const url = URL.createObjectURL(data);
                const a   = document.createElement('a');
                a.href    = url;
                a.download = `invoice_order_${orderId}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
            })
            .catch(console.error);
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl mb-4">Invoices</h1>
            <div className="flex space-x-4 mb-6">
                <div>
                    <label>From</label>
                    <input
                        type="date"
                        value={range.from}
                        onChange={e=> setRange({...range, from:e.target.value})}
                        className="border p-2 rounded"
                    />
                </div>
                <div>
                    <label>To</label>
                    <input
                        type="date"
                        value={range.to}
                        onChange={e=> setRange({...range, to:e.target.value})}
                        className="border p-2 rounded"
                    />
                </div>
                <button
                    onClick={loadInvoices}
                    className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                    Load
                </button>
            </div>

            {invoices.length > 0 && (
                <table className="w-full bg-white">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 text-left">Order ID</th>
                        <th className="p-2 text-left">Customer</th>
                        <th className="p-2 text-right">Total</th>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-center">Download</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoices.map(inv => (
                        <tr key={inv.orderId} className="border-t">
                            <td className="p-2">{inv.orderId}</td>
                            <td className="p-2">{inv.customerName}</td>
                            <td className="p-2 text-right">${inv.totalPrice.toFixed(2)}</td>
                            <td className="p-2">
                                {new Date(inv.createdAt).toLocaleString()}
                            </td>
                            <td className="p-2 text-center">
                                <button
                                    onClick={() => downloadInvoice(inv.orderId)}
                                    className="text-blue-600 underline cursor-pointer"
                                >
                                    PDF
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
