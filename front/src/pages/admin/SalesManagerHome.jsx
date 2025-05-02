import React from "react";
import { useNavigate } from "react-router-dom";

const cardData = [
  {
    title: "Manage Pricing",
    subtitle: "Set and update product prices",
    icon: "💰",
    path: "/admin/pricing",
  },
  {
    title: "Reports & Revenue",
    subtitle: "Analyze performance and profit",
    icon: "📈",
    path: "/admin/reports",
  },
  {
    title: "Export Invoices",
    subtitle: "Generate and download invoices",
    icon: "🧾",
    path: "/admin/reports", // You can split this later if needed
  },
  {
    title: "Notify Discounts",
    subtitle: "Alert customers about sales",
    icon: "🔔",
    path: "/admin/pricing", // Reusing pricing path for now
  },
  {
    title: "Manage Refund Requests",
    subtitle: "Approve or reject refund requests",
    icon: "💸",
    path: "/admin/refunds",
  },
];

export default function SalesManagerHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white p-10">
      <h1 className="text-3xl font-bold mb-8 text-white">
        <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          📊 Sales Manager Dashboard
        </span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="bg-white text-black rounded-2xl shadow-xl p-6 flex flex-col justify-between hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{card.icon}</span>
              <div>
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <p className="text-gray-600 text-sm">{card.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => navigate(card.path)}
              className="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition shadow"
            >
              Go to {card.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
