import React from "react";
import { useNavigate } from "react-router-dom";

const cardData = [
  {
    title: "Manage Products",
    subtitle: "Add, update, or delete products",
    icon: "📦",
    path: "/admin/products",
  },
  {
    title: "Manage Categories",
    subtitle: "Organize product categories",
    icon: "🗂️",
    path: "/admin/categories",
  },
  {
    title: "Manage Deliveries",
    subtitle: "View and update order delivery status",
    icon: "🚚",
    path: "/admin/orders",
  },
  {
    title: "Approve Comments",
    subtitle: "Moderate product reviews",
    icon: "📝",
    path: "/admin/comments",
  },
];

export default function ProductManagerHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white p-10">
      <h1 className="text-3xl font-bold mb-8 text-white">
        <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          🎁 Product Manager Dashboard
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
              className="mt-auto bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition shadow"
            >
              Go to {card.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
