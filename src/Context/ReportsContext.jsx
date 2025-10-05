// src/Context/ReportsContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ReportsContext = createContext();

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const { isLoggedIn, user, authChecked, addNotification } = useAuth();

  useEffect(() => {
    if (authChecked) {
      if (isLoggedIn && user) {
        loadUserReports();
      } else {
        setReports([]);
      }
    }
  }, [isLoggedIn, user, authChecked]);

  const loadUserReports = () => {
    if (!user) return;
    
    const storedReports = localStorage.getItem(`userReports_${user.email}`);
    if (storedReports) {
      try {
        setReports(JSON.parse(storedReports));
      } catch (error) {
        console.error("Error parsing stored reports:", error);
        setReports([]);
      }
    } else {
      setReports([]);
    }
  };

  const addReport = (report) => {
    if (!user) return;

    const newReport = {
      ...report,
      id: Date.now(),
      userEmail: user.email,
      username: user.username,
      userId: user.id,
      timestamp: new Date().toISOString(),
      verified: false,
      verificationDate: null
    };

    const updatedReports = [...reports, newReport];
    setReports(updatedReports);

    // Save to user's specific storage
    localStorage.setItem(
      `userReports_${user.email}`,
      JSON.stringify(updatedReports)
    );

    // Also add to global reports for admin access
    const allReports = JSON.parse(localStorage.getItem('allReports') || '[]');
    allReports.push(newReport);
    localStorage.setItem('allReports', JSON.stringify(allReports));

    return newReport.id;
  };

  const verifyReport = (reportId, verifiedBy = "Admin") => {
    const allReports = getAllReports();
    const updatedReports = allReports.map(report => {
      if (report.id === reportId) {
        const updatedReport = {
          ...report,
          verified: true,
          verificationDate: new Date().toISOString(),
          verifiedBy: verifiedBy
        };

        // Send notification to user
        addNotification(report.userEmail, {
          type: 'verification',
          title: 'Item Verified!',
          message: `Your item "${report.itemName}" has been verified by ${verifiedBy}.`,
          itemName: report.itemName,
          reportId: report.id,
          status: report.status
        });

        return updatedReport;
      }
      return report;
    });

    // Update all reports storage
    localStorage.setItem('allReports', JSON.stringify(updatedReports));

    // Update user's specific report storage
    const userKeys = Object.keys(localStorage);
    userKeys.forEach(key => {
      if (key.startsWith('userReports_')) {
        const userReports = JSON.parse(localStorage.getItem(key)) || [];
        const updatedUserReports = userReports.map(report =>
          report.id === reportId ? { ...report, verified: true, verificationDate: new Date().toISOString() } : report
        );
        localStorage.setItem(key, JSON.stringify(updatedUserReports));
      }
    });

    return true;
  };

  const getAllReports = () => {
    // Get reports from all users for admin
    const allReports = JSON.parse(localStorage.getItem('allReports') || '[]');
    return allReports;
  };

  const getUserReports = (userEmail) => {
    const userReports = localStorage.getItem(`userReports_${userEmail}`);
    return userReports ? JSON.parse(userReports) : [];
  };

  return (
    <ReportsContext.Provider value={{ 
      reports, 
      addReport, 
      getAllReports,
      getUserReports,
      verifyReport,
      loadUserReports 
    }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error("useReports must be used inside a ReportsProvider");
  }
  return context;
};