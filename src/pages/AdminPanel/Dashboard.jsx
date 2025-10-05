// src/pages/AdminPanel/Dashboard.js
import React, { useState, useEffect } from "react";
import { useAuth } from '../../Context/AuthContext';
import { useReports } from '../../Context/ReportsContext';
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { darkMode, user } = useAuth();
  const { getAllReports } = useReports();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalReports: 0,
    resolvedCases: 0,
    pendingReports: 0,
    totalUsers: 0
  });
  const [verifiedReports, setVerifiedReports] = useState([]);
  const [mailPanel, setMailPanel] = useState(null);
  const [mailForm, setMailForm] = useState({
    email: "",
    status: "",
    description: ""
  });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = () => {
    const allReports = getAllReports();
    const storedUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");

    const totalReports = allReports.length;
    const resolvedCases = allReports.filter(report => report.verified).length;
    const pendingReports = totalReports - resolvedCases;
    const totalUsers = storedUsers.length;

    setStats({ totalReports, resolvedCases, pendingReports, totalUsers });
    setVerifiedReports(allReports.filter(report => report.verified));
  };

  const verifyReport = (reportId) => {
    const allReports = getAllReports();
    const updatedReports = allReports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          verified: true,
          verificationDate: new Date().toISOString()
        };
      }
      return report;
    });

    localStorage.setItem('allReports', JSON.stringify(updatedReports));
    loadDashboardData();
  };

  const openMailPanel = (report) => {
    setMailPanel(report.id);
    setMailForm({
      email: report.userEmail,
      status: "",
      description: ""
    });
  };

  const sendMail = () => {
    if (!mailForm.status || !mailForm.description) {
      alert("Please fill in all fields before sending the mail.");
      return;
    }
    alert(`Mail successfully sent to ${mailForm.email}`);
    setMailPanel(null);
  };

  // Stats cards data
  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "from-cyan-500 to-blue-500" },
    { label: "Total Reports", value: stats.totalReports, icon: "📊", color: "from-purple-500 to-pink-500" },
    { label: "Resolved Cases", value: stats.resolvedCases, icon: "✅", color: "from-green-500 to-cyan-500" },
    { label: "Pending Reports", value: stats.pendingReports, icon: "⏳", color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Overview of system statistics and reports
          </p>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden mb-6">
          <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            {['overview', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab === 'overview' ? 'Overview' : 'Reports'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8 ${
          activeTab !== 'overview' ? 'lg:block hidden' : ''
        }`}>
          {statCards.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white text-xl lg:text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reports Table */}
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${
          activeTab !== 'reports' ? 'lg:block hidden' : ''
        }`}>
          <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                Verified Reports
              </h3>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                {verifiedReports.length} items
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    User
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden xl:table-cell">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {verifiedReports.length > 0 ? (
                  verifiedReports.map((report, index) => (
                    <React.Fragment key={report.id}>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {report.itemName}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden mt-1">
                              {report.status} • {report.userEmail?.split('@')[0]}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden sm:table-cell">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            report.status === 'lost' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-500 dark:text-gray-400 hidden lg:table-cell text-sm">
                          {report.userEmail}
                        </td>
                        <td className="py-4 px-4 text-gray-500 dark:text-gray-400 hidden xl:table-cell text-sm">
                          {report.verificationDate ? new Date(report.verificationDate).toLocaleDateString() : 'Not verified'}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col sm:flex-row gap-2">
                            {!report.verified ? (
                              <button
                                onClick={() => verifyReport(report.id)}
                                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded transition-colors"
                              >
                                Verify
                              </button>
                            ) : (
                              <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded text-center">
                                Verified ✓
                              </span>
                            )}
                            <button
                              onClick={() => openMailPanel(report)}
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors"
                            >
                              ✉️ Mail
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Mail Panel */}
                      {mailPanel === report.id && (
                        <tr>
                          <td colSpan="5" className="p-4">
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Send Notification</h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    User Email
                                  </label>
                                  <input
                                    type="email"
                                    value={mailForm.email}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Status Update
                                  </label>
                                  <select
                                    value={mailForm.status}
                                    onChange={(e) => setMailForm({ ...mailForm, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                                  >
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="rejected">Rejected</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Message
                                  </label>
                                  <textarea
                                    value={mailForm.description}
                                    onChange={(e) => setMailForm({ ...mailForm, description: e.target.value })}
                                    placeholder="Enter notification details..."
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm"
                                    rows="3"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={sendMail}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded transition-colors"
                                  >
                                    Send Message
                                  </button>
                                  <button
                                    onClick={() => setMailPanel(null)}
                                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <div className="text-gray-500 dark:text-gray-400 text-lg">
                        No verified reports in the system
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;