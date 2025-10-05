// src/Components/AdminLayout/AdminLayout.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-gray-800 dark:bg-gray-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                👥 Manage Users
              </Link>
            </li>
            <li>
              <Link
                to="/admin/listings"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                📋 Manage Listings
              </Link>
            </li>

            {/* New Go to Home Button */}
            <li>
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-blue-600 hover:text-white rounded-lg transition-colors mt-4"
                onClick={() => setIsSidebarOpen(false)}
              >
                🏠 Go to Home
              </Link>
            </li>

            {/* Logout Button */}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors mt-4"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                {/* Mobile menu button */}
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white ml-2 lg:ml-0">
                  Welcome, Admin
                </h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Admin Dashboard
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
