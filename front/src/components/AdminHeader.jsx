// src/components/AdminHeader.jsx
import { useSelector } from 'react-redux';

export default function AdminHeader({ title }) {
  // assuming you keep the logged-in user in Redux state:
  const currentUser = useSelector(s => s.user.currentUser);

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow">
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="text-sm text-gray-600">
        Logged in as: <span className="font-medium">{currentUser?.username}</span>
      </div>
    </header>
  );
}
