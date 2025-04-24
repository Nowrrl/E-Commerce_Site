import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { logout } from '../redux/user/userSlice';

export default function PublicLayout() {
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearCart());
    dispatch(logout());
    window.location.href = '/login';
  };

  return (
    <>
      <nav className="bg-[#0C0C0E] text-white py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="font-bold text-3xl">
            <Link to="/">Smart Electronics</Link>
          </h1>
          <div className="space-x-6 flex items-center">
            <Link to="/cart">Cart</Link>
            <Link to="/">Home</Link>
            <Link to="/profile">My Profile</Link>
            <span>Logged in as: {currentUser?.username ?? 'Guest'}</span>
            {currentUser?.username && currentUser.username !== 'Guest' ? (
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Render whatever public page is active */}
      <Outlet />
    </>
  );
}
