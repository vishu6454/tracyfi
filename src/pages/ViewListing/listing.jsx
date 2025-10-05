import React, { useState, useEffect } from "react";
import { useReports } from "../../Context/ReportsContext";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Listing = () => {
  const { reports } = useReports();
  const { isLoggedIn, darkMode, authChecked } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    if (authChecked && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, authChecked, navigate]);

  if (!authChecked) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gradient-to-br from-gray-900 to-blue-900" : "bg-gradient-to-br from-cyan-50 to-blue-100"
      }`}>
        <div className="text-lg">Loading Cyber Database...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const filteredReports = reports.filter((report) => {
    return (
      report.itemName.toLowerCase().includes(search.toLowerCase()) &&
      (filterCategory === "All" || report.category === filterCategory) &&
      (filterStatus === "All" || report.status === filterStatus)
    );
  });

  // Cyberpunk Theme
  const pageBg = darkMode 
    ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" 
    : "bg-gradient-to-br from-cyan-50 via-blue-100 to-purple-100";
  const cardBg = darkMode 
    ? "bg-gradient-to-br from-gray-900/80 to-blue-900/80 backdrop-blur-lg border border-cyan-500/30" 
    : "bg-white/80 backdrop-blur-lg border border-blue-300";
  const textColor = darkMode ? "text-cyan-100" : "text-blue-900";
  const inputBg = darkMode 
    ? "bg-gray-800/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-300/50" 
    : "bg-white/50 border-blue-300 text-blue-900 placeholder-blue-400/50";

  return (
    <div className={`${pageBg} min-h-screen py-8 px-4 font-['Inter']`}>
      <div className="container mx-auto max-w-7xl">
        <h1 className={`text-4xl font-bold mb-8 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent`}>
          🔍 Cyber Database
        </h1>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row justify-center mb-8 gap-4">
          <input
            type="text"
            placeholder="🔍 Search cyber items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`px-6 py-4 rounded-2xl border-2 text-lg ${inputBg} focus:border-cyan-500 transition-all flex-1 max-w-md`}
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`px-6 py-4 rounded-2xl border-2 text-lg ${inputBg} focus:border-cyan-500 transition-all`}
          >
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Documents</option>
            <option>Accessories</option>
            <option>Other</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-6 py-4 rounded-2xl border-2 text-lg ${inputBg} focus:border-cyan-500 transition-all`}
          >
            <option>All Status</option>
            <option>lost</option>
            <option>found</option>
          </select>
        </div>

        {/* Reports List */}
        <div className="overflow-x-auto rounded-2xl shadow-2xl">
          <table className={`min-w-full ${cardBg} rounded-2xl text-lg`}>
            <thead>
              <tr className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                <th className="py-6 px-8 font-bold text-left rounded-tl-2xl">Item Name</th>
                <th className="py-6 px-8 font-bold text-left hidden lg:table-cell">Category</th>
                <th className="py-6 px-8 font-bold text-left hidden xl:table-cell">Description</th>
                <th className="py-6 px-8 font-bold text-left hidden 2xl:table-cell">Date & Time</th>
                <th className="py-6 px-8 font-bold text-left">Status</th>
                <th className="py-6 px-8 font-bold text-left hidden md:table-cell">Contact Info</th>
                <th className="py-6 px-8 font-bold text-left rounded-tr-2xl">Image</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <tr key={report.id || index} className={`border-b border-cyan-500/20 hover:bg-cyan-500/10 transition-colors`}>
                    <td className="py-6 px-8">
                      <div>
                        <div className="font-semibold text-xl">{report.itemName}</div>
                        <div className="text-sm opacity-80 lg:hidden">{report.category}</div>
                      </div>
                    </td>
                    <td className="py-6 px-8 hidden lg:table-cell">
                      <span className={`px-4 py-2 rounded-full text-sm ${
                        darkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-500/20 text-blue-600'
                      }`}>
                        {report.category}
                      </span>
                    </td>
                    <td className="py-6 px-8 hidden xl:table-cell opacity-80">{report.description}</td>
                    <td className="py-6 px-8 hidden 2xl:table-cell opacity-80">{report.dateTime}</td>
                    <td className="py-6 px-8">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        report.status === "lost" 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                          : 'bg-gradient-to-r from-green-500 to-cyan-500'
                      } text-white shadow-lg`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-6 px-8 hidden md:table-cell opacity-80">{report.contactInfo}</td>
                    <td className="py-6 px-8">
                      {report.image && (
                        <img
                          src={report.image}
                          alt={report.itemName}
                          className="w-16 h-16 object-cover rounded-xl border-2 border-cyan-500/30 shadow-lg"
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-16 text-xl opacity-60">
                    🕵️‍♂️ No cyber reports found in the database
                  </td>      
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Listing;