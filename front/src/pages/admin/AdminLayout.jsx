import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/user/userSlice';

export default function AdminLayout() {
  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const isProductManager = currentUser?.role === "PRODUCT_MANAGER";
  const isSalesManager = currentUser?.role === "SALES_MANAGER";

  const roleLabel = isProductManager
    ? "Product Manager Console"
    : isSalesManager
    ? "Sales Manager Console"
    : "Admin Console";

  return (
    <div className="flex flex-col h-screen">
      {/* Admin top bar */}
      <header className="bg-gray-800 text-white py-3 px-6 flex justify-between items-center">
        <h1
          onClick={() => navigate("/admin")}
          className="text-xl font-semibold cursor-pointer hover:underline"
        >
          {roleLabel}
        </h1>
        <div>
          <span className="mr-4">Logged in as: {currentUser?.username}</span>
          <button
            onClick={handleAdminLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white p-4 overflow-auto">
          <nav className="space-y-3">
            {isProductManager && (
              <>
                <NavLink
                  to="products"
                  className={({ isActive }) =>
                    isActive ? 'block font-semibold' : 'block hover:text-gray-300'
                  }
                >
                  Products
                </NavLink>
                <NavLink
                  to="categories"
                  className={({ isActive }) =>
                    isActive ? 'block font-semibold' : 'block hover:text-gray-300'
                  }
                >
                  Categories
                </NavLink>
                <NavLink
                  to="orders"
                  className={({ isActive }) =>
                    isActive ? 'block font-semibold' : 'block hover:text-gray-300'
                  }
                >
                  Orders
                </NavLink>
                <NavLink
                  to="comments"
                  className={({ isActive }) =>
                    isActive ? 'block font-semibold' : 'block hover:text-gray-300'
                  }
                >
                  Comments
                </NavLink>
              </>
            )}

            {isSalesManager && (
              <>
                <NavLink
                  to="pricing"
                  className={({ isActive }) =>
                    isActive ? 'block font-semibold' : 'block hover:text-gray-300'
                  }
                >
                  Pricing
                </NavLink>
                <NavLink
                  to="reports"
                  className={({ isActive }) =>
                    isActive ? 'block font-semibold' : 'block hover:text-gray-300'
                  }
                >
                  Reports
                </NavLink>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
