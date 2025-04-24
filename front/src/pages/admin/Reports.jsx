import React, { useState } from 'react';
import axios from "axios";


axios.defaults.baseURL = `http://localhost:8085`;
axios.defaults.withCredentials = true;

export default function Reports() {
  const [range, setRange] = useState({ from: '', to: '' });
  const [data, setData] = useState(null);

  function fetchReport() {
    axios.get('/admin/reports', { params: range })
      .then(res => setData(res.data))
      .catch(console.error);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Revenue & Profit Reports</h1>

      <div className="mb-6 flex space-x-4 items-end">
        <div>
          <label className="block mb-1">From</label>
          <input
            type="date"
            value={range.from}
            onChange={e => setRange({ ...range, from: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">To</label>
          <input
            type="date"
            value={range.to}
            onChange={e => setRange({ ...range, to: e.target.value })}
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

      {data && (
        <div className="bg-white p-6 rounded shadow space-y-4">
          <p><strong>Total Revenue:</strong> ${data.revenue.toFixed(2)}</p>
          <p><strong>Total Profit:</strong> ${data.profit.toFixed(2)}</p>
          {/* Later: render a chart here */}
        </div>
      )}
    </div>
  );
}
