// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ReportsProvider } from "./Context/ReportsContext";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import Navbar from './Components/Navbar/navbar';
import Home from './pages/HomePage/Home';
import Features from './pages/HomePage/Features';
import Report from './pages/ReportItem/Report';
import Listing from './pages/ViewListing/Listing';
import LoginPage from './pages/LoginPage/Login';
import SignupPage from './pages/Signuppagae/signup';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminDashboard from './pages/AdminPanel/Dashboard';
import ManageUsers from './pages/AdminPanel/ManageUsers';
import ManageListings from './pages/AdminPanel/ManageListings';
import AdminLayout from './Components/AdminLayout/AdminLayout';
import Notifications from './pages/Notifications/Notifications';
// Background images
import bgLight from './assets/background.jpg';
import bgDark from './assets/background2.jpg';

// Protected Route Component for Users
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authChecked } = useAuth();
  if (!authChecked) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  return isLoggedIn ? children : <Navigate to="/login" />;
};

// Protected Route Component for Admin
const AdminRoute = ({ children }) => {
  const { isLoggedIn, user, authChecked } = useAuth();
  if (!authChecked) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  const isAdmin = user && user.role === 'admin';
  return isLoggedIn && isAdmin ? children : <Navigate to="/admin/login" />;
};

// Background Wrapper for Home Page
function HomeBackgroundWrapper({ children }) {
  const { darkMode } = useAuth();

  return (
    <div className={`min-h-screen relative transition-all duration-500 ${darkMode ? 'dark' : ''}`}>
      {/* Background Image with Dark Mode Switch */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed transition-all duration-500"
        style={{
          backgroundImage: `url(${darkMode ? bgDark : bgLight})`,
        }}
      />
      <div className={`absolute inset-0 backdrop-blur-sm transition-all duration-500 ${darkMode ? 'bg-black/40' : 'bg-white/30'
        }`}></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Regular Wrapper for other pages
function RegularWrapper({ children }) {
  const { darkMode } = useAuth();

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {children}
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const { darkMode } = useAuth();

  const showNavbar = !location.pathname.startsWith('/admin') &&
    location.pathname !== '/login' &&
    location.pathname !== '/signup' &&
    location.pathname !== '/admin/login';

  const isHomePage = location.pathname === '/';

  // Use HomeBackgroundWrapper for home page, RegularWrapper for other pages
  const Wrapper = isHomePage ? HomeBackgroundWrapper : RegularWrapper;

  return (
    <Wrapper>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Home /><Features /></>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* User Protected Routes */}
        <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/view-listings" element={<ProtectedRoute><Listing /></ProtectedRoute>} />

         {/* In the Routes section, add this route: */}
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminLayout>
              <ManageUsers />
            </AdminLayout>
          </AdminRoute>
        } />
        <Route path="/admin/listings" element={
          <AdminRoute>
            <AdminLayout>
              <ManageListings />
            </AdminLayout>
          </AdminRoute>
        } />

        {/* Redirect to home for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Wrapper>
  );
}

function App() {
  return (
    <AuthProvider>
      <ReportsProvider>
        <Router>
          <AppContent />
        </Router>
      </ReportsProvider>
    </AuthProvider>
  );
}

export default App;