// src/pages/AdminPanel/ManageListings.js
import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useReports } from "../../Context/ReportsContext";
import { useNavigate } from "react-router-dom";

const ManageListings = () => {
  const { darkMode, user, addNotification } = useAuth();
  const { verifyReport } = useReports();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login");
      return;
    }
    loadListings();
  }, [user, navigate]);

  const loadListings = () => {
    const allListings = [];
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (key.startsWith("userReports_")) {
        const userReports = JSON.parse(localStorage.getItem(key)) || [];
        userReports.forEach((report) => {
          allListings.push({
            ...report,
            username: report.userEmail
              ? report.userEmail.split("@")[0]
              : "Unknown",
          });
        });
      }
    });

    setListings(allListings);
  };

  const verifyItem = async (listingId) => {
    setLoading(true);

    try {
      const keys = Object.keys(localStorage);
      let verifiedReport = null;

      keys.forEach((key) => {
        if (key.startsWith("userReports_")) {
          const userReports = JSON.parse(localStorage.getItem(key)) || [];
          const updatedReports = userReports.map((report) => {
            if (report.id === listingId) {
              verifiedReport = {
                ...report,
                verified: true,
                verificationDate: new Date().toISOString(),
                verifiedBy: user?.username || "Admin",
              };
              return verifiedReport;
            }
            return report;
          });
          localStorage.setItem(key, JSON.stringify(updatedReports));
        }
      });

      if (verifiedReport) {
        const allReports = JSON.parse(localStorage.getItem("allReports") || "[]");
        const updatedAllReports = allReports.map((report) =>
          report.id === listingId ? verifiedReport : report
        );
        localStorage.setItem("allReports", JSON.stringify(updatedAllReports));

        // Notify user
        addNotification(verifiedReport.userEmail, {
          type: "verification",
          title: "Item Verified! 🎉",
          message: `Your ${verifiedReport.status} item "${verifiedReport.itemName}" has been verified by Admin and is now visible to other users.`,
          itemName: verifiedReport.itemName,
          reportId: verifiedReport.id,
          status: verifiedReport.status,
        });

        alert(
          `Item "${verifiedReport.itemName}" has been verified successfully! The user has been notified.`
        );
      }

      loadListings();
    } catch (error) {
      console.error("Error verifying item:", error);
      alert("Error verifying item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const unverifyItem = (listingId) => {
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (key.startsWith("userReports_")) {
        const userReports = JSON.parse(localStorage.getItem(key)) || [];
        const updatedReports = userReports.map((report) => {
          if (report.id === listingId) {
            return {
              ...report,
              verified: false,
              verificationDate: null,
              verifiedBy: null,
            };
          }
          return report;
        });
        localStorage.setItem(key, JSON.stringify(updatedReports));
      }
    });

    const allReports = JSON.parse(localStorage.getItem("allReports") || "[]");
    const updatedAllReports = allReports.map((report) =>
      report.id === listingId
        ? { ...report, verified: false, verificationDate: null, verifiedBy: null }
        : report
    );
    localStorage.setItem("allReports", JSON.stringify(updatedAllReports));

    loadListings();
    alert("Item unverified successfully!");
  };

  const deleteItem = (listingId, itemName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
      )
    ) {
      const keys = Object.keys(localStorage);

      keys.forEach((key) => {
        if (key.startsWith("userReports_")) {
          const userReports = JSON.parse(localStorage.getItem(key)) || [];
          const updatedReports = userReports.filter(
            (report) => report.id !== listingId
          );
          localStorage.setItem(key, JSON.stringify(updatedReports));
        }
      });

      const allReports = JSON.parse(localStorage.getItem("allReports") || "[]");
      const updatedAllReports = allReports.filter(
        (report) => report.id !== listingId
      );
      localStorage.setItem("allReports", JSON.stringify(updatedAllReports));

      loadListings();
      alert(`"${itemName}" has been deleted successfully!`);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || listing.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    ...new Set(listings.map((listing) => listing.category).filter(Boolean)),
  ];

  const pageBg = darkMode
    ? "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
    : "bg-gradient-to-br from-cyan-50 via-blue-100 to-purple-100";

  const cardBg = darkMode
    ? "bg-gradient-to-br from-gray-900/80 to-blue-900/80 backdrop-blur-lg border border-cyan-500/30"
    : "bg-white/80 backdrop-blur-lg border border-blue-300";

  const textColor = darkMode ? "text-cyan-100" : "text-blue-900";

  const inputBg = darkMode
    ? "bg-gray-800/50 border-cyan-500/30 text-cyan-100"
    : "bg-white/50 border-blue-300 text-blue-900";

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${pageBg} font-['Inter']`}>
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-center sm:text-left">
          Manage Listings
        </h1>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className={`${cardBg} p-3 sm:p-4 rounded-2xl text-center`}>
            <div className="text-xl sm:text-2xl font-bold text-blue-500">{listings.length}</div>
            <div className={`text-sm sm:text-base ${textColor}`}>Total Listings</div>
          </div>
          <div className={`${cardBg} p-3 sm:p-4 rounded-2xl text-center`}>
            <div className="text-xl sm:text-2xl font-bold text-green-500">
              {listings.filter((l) => l.verified).length}
            </div>
            <div className={`text-sm sm:text-base ${textColor}`}>Verified</div>
          </div>
          <div className={`${cardBg} p-3 sm:p-4 rounded-2xl text-center`}>
            <div className="text-xl sm:text-2xl font-bold text-yellow-500">
              {listings.filter((l) => !l.verified).length}
            </div>
            <div className={`text-sm sm:text-base ${textColor}`}>Pending</div>
          </div>
          <div className={`${cardBg} p-3 sm:p-4 rounded-2xl text-center`}>
            <div className="text-xl sm:text-2xl font-bold text-purple-500">
              {new Set(listings.map((l) => l.userEmail)).size}
            </div>
            <div className={`text-sm sm:text-base ${textColor}`}>Users</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className={`${cardBg} p-4 sm:p-6 rounded-2xl shadow-2xl mb-6 sm:mb-8`}>
          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              placeholder="🔍 Search by item name or user email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 text-sm sm:text-lg ${inputBg} focus:border-cyan-500 transition-all`}
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full lg:w-auto px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 text-sm sm:text-lg ${inputBg} focus:border-cyan-500 transition-all`}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("All");
              }}
              className="w-full lg:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-xl hover:shadow-xl transition-all transform hover:scale-105 font-semibold"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Listings Table */}
        <div className={`${cardBg} rounded-2xl shadow-2xl p-4 sm:p-6`}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm sm:text-lg">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                  <th className="py-3 px-4 text-left rounded-l-2xl">Item</th>
                  <th className="py-3 px-4 text-left hidden md:table-cell">User</th>
                  <th className="py-3 px-4 text-left hidden lg:table-cell">Category</th>
                  <th className="py-3 px-4 text-left hidden xl:table-cell">Status</th>
                  <th className="py-3 px-4 text-left">Verification</th>
                  <th className="py-3 px-4 text-left rounded-r-2xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="border-b border-cyan-500/20 hover:bg-cyan-500/10 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-semibold">{listing.itemName}</div>
                        <div className="text-xs sm:text-sm opacity-80 md:hidden">
                          {listing.category} • {listing.status} • {listing.userEmail}
                        </div>
                        {listing.description && (
                          <div className="text-xs opacity-60 mt-1 line-clamp-2">
                            {listing.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell opacity-80">
                      <div>{listing.username}</div>
                      <div className="text-xs opacity-60">{listing.userEmail}</div>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          darkMode
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-blue-500/20 text-blue-600"
                        }`}
                      >
                        {listing.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden xl:table-cell">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          listing.status === "lost"
                            ? "bg-gradient-to-r from-red-500 to-pink-500"
                            : "bg-gradient-to-r from-green-500 to-cyan-500"
                        } text-white shadow-lg`}
                      >
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {listing.verified ? (
                        <div className="flex flex-col">
                          <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-full text-xs font-bold shadow-lg">
                            Verified ✓
                          </span>
                          <span className="text-[10px] opacity-70 mt-1">
                            {listing.verificationDate
                              ? new Date(listing.verificationDate).toLocaleDateString()
                              : "Recently"}
                          </span>
                        </div>
                      ) : (
                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                        {!listing.verified ? (
                          <button
                            onClick={() => verifyItem(listing.id)}
                            disabled={loading}
                            className={`px-3 py-1 rounded-xl font-semibold text-xs sm:text-sm transition-all transform hover:scale-105 ${
                              loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
                            }`}
                          >
                            {loading ? "Verifying..." : "Verify"}
                          </button>
                        ) : (
                          <button
                            onClick={() => unverifyItem(listing.id)}
                            className="px-3 py-1 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105 text-xs sm:text-sm"
                          >
                            Unverify
                          </button>
                        )}
                        <button
                          onClick={() => deleteItem(listing.id, listing.itemName)}
                          className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all transform hover:scale-105 text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredListings.length === 0 && (
              <div className="text-center py-8 text-sm sm:text-lg opacity-60">
                {listings.length === 0
                  ? "No listings found in the system"
                  : "No listings match your search criteria"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageListings;
