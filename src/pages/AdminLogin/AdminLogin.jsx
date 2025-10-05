// src/pages/AdminLogin/AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../Context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAdminLogin = (e) => {
    e.preventDefault();
    
    // Use correct admin credentials from AuthContext
    if (email === "admin@back2u.com" && password === "admin123") {
      const success = login(email, password);
      if (success) {
        navigate("/admin/dashboard");
      } else {
        setError("Login failed!");
      }
    } else {
      setError("Invalid admin credentials!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-2xl text-white">🛡️</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Secure access to administration panel
          </p>
        </div>
        
        {error && (
          <div className="p-4 rounded-xl text-center bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="admin@back2u.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter admin password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-bold rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Access Admin Panel
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Regular user?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-blue-500 hover:text-blue-600 hover:underline"
          >
            Switch to User Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;