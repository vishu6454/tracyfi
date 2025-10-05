// src/Components/Navbar/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

// Inline SVG for the 'MapPin' icon
const MapPinIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Notification Bell Icon
const BellIcon = ({ className, hasNotifications }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    {hasNotifications && (
      <circle cx="18" cy="6" r="3" fill="#ef4444" stroke="none" />
    )}
  </svg>
);

// Toggle Switch component
const ToggleSwitch = () => {
  const { darkMode, toggleDarkMode } = useAuth();
  
  return (
    <div
      onClick={toggleDarkMode}
      className={`relative w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
        darkMode ? 'bg-blue-500' : 'bg-gray-600'
      }`}
    >
      <div
        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          darkMode ? 'translate-x-6' : 'translate-x-0'
        }`}
      ></div>
    </div>
  );
};

// Main Navbar Component
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user, logout, unreadCount } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Report Item', href: '/report' },
    { name: 'View Listings', href: '/view-listings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
    setIsMenuOpen(false);
  };

  return (
    <div className="font-sans min-h-[64px] bg-gray-900">
      <nav className="bg-slate-900 border-b border-blue-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-white text-xl font-bold tracking-wider">
                <MapPinIcon className="w-6 h-6 text-blue-400 mr-2" />
                Trackify
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition duration-150 ease-in-out border-b-2 border-transparent hover:border-blue-500"
                >
                  {item.name}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="text-yellow-300 hover:text-yellow-200 px-3 py-2 text-sm font-medium transition duration-150 ease-in-out border-b-2 border-transparent hover:border-yellow-500"
                >
                  Admin Panel
                </Link>
              )}
            </div>

            {/* Right Side Elements */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 text-sm">Dark Mode</span>
                <ToggleSwitch />
              </div>
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  {/* Notification Bell */}
                  <button
                    onClick={handleNotificationClick}
                    className="relative p-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <BellIcon 
                      className="w-6 h-6" 
                      hasNotifications={unreadCount > 0}
                    />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <span className="text-gray-300 text-sm">Welcome, {user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition duration-150 ease-in-out hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-xl transition duration-150 ease-in-out hover:bg-blue-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-transparent text-blue-400 text-sm font-semibold px-4 py-1.5 rounded-xl border-2 border-blue-400 transition duration-150 ease-in-out hover:bg-blue-400 hover:text-white"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-start">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.name}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-yellow-300 hover:bg-gray-700 hover:text-yellow-200 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Admin Panel
                </Link>
              )}
              
              <div className="flex flex-col space-y-2 mt-4 w-full border-t border-gray-700 pt-3">
                {/* Mobile Notification Bell */}
                {isLoggedIn && (
                  <button
                    onClick={handleNotificationClick}
                    className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    <BellIcon 
                      className="w-5 h-5 mr-3" 
                      hasNotifications={unreadCount > 0}
                    />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                )}

                <div className='flex items-center justify-between px-3 py-1'>
                  <span className='text-gray-300'>Dark Mode</span>
                  <ToggleSwitch />
                </div>
                
                {isLoggedIn ? (
                  <>
                    <span className="text-gray-300 px-3 py-2">Welcome, {user?.username}</span>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 text-white text-sm font-semibold w-full px-4 py-2 rounded-xl transition duration-150 ease-in-out hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-blue-600 text-white text-sm font-semibold w-full px-4 py-2 rounded-xl transition duration-150 ease-in-out hover:bg-blue-700 text-center"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-transparent text-blue-400 text-sm font-semibold w-full px-4 py-2 rounded-xl border-2 border-blue-400 transition duration-150 ease-in-out hover:bg-blue-400 hover:text-white text-center"
                    >
                      Signup
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}