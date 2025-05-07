import React, { useState } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8085';
axios.defaults.withCredentials = true;

export default function Reports() {
  const [range, setRange] = useState({ from: '', to: '' });
  const [data, setData] = useState([]);

  const fetchReport = () => {
    axios.get('/admin/reports/profit', {
      params: {
      from: range.from,   // e.g. "2025-05-05"
      to:   range.to      // e.g. "2025-05-08"
      }
    })
        .then((res) => setData(res.data))
        .catch(console.error);
  };

  // calculate totals
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalProfit  = data.reduce((sum, d) => sum + d.profit,  0);

  return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Revenue & Profit Reports
        </h1>

        <div className="mb-6 flex space-x-4 items-end">
          <div>
            <label className="block mb-1">From</label>
            <input
                type="date"
                value={range.from}
                onChange={(e) => setRange({ ...range, from: e.target.value })}
                className="border p-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">To</label>
            <input
                type="date"
                value={range.to}
                onChange={(e) => setRange({ ...range, to: e.target.value })}
                className="border p-2 rounded"
            />
          </div>
          <button
              onClick={fetchReport}
              className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Run
          </button>
        </div>

        {data.length > 0 && (
            <>
              <div className="bg-white p-6 rounded shadow mb-6">
                <p><strong>Total Revenue:</strong> ${totalRevenue.toFixed(2)}</p>
                <p><strong>Total Profit:</strong>  ${totalProfit.toFixed(2)}</p>
              </div>

              <div className="bg-white p-6 rounded shadow">
                <h2 className="font-semibold mb-4">Daily Revenue & Profit</h2>
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                  <tr>
                    <th className="p-1 text-left">Date</th>
                    <th className="p-1 text-right">Revenue</th>
                    <th className="p-1 text-right">Cost</th>
                    <th className="p-1 text-right">Profit</th>
                  </tr>
                  </thead>
                  <tbody>
                  {data.map((d, i) => (
                      <tr key={i} className={i % 2 ? 'bg-gray-50' : ''}>
                        <td className="p-1">{d.date}</td>
                        <td className="p-1 text-right">${d.revenue.toFixed(2)}</td>
                        <td className="p-1 text-right">${d.cost.toFixed(2)}</td>
                        <td className="p-1 text-right">${d.profit.toFixed(2)}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </>
        )}
      </div>
  );
}
