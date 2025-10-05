// src/Context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Predefined users including admin
  const predefinedUsers = [
    { id: 1, username: "admin", email: "admin@back2u.com", password: "admin123", role: "admin" },
    { id: 2, username: "vishu", email: "vishukanoujiya820@gmail.com", password: "vk@12345", role: "user" }
  ];

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Load all users from localStorage
        const storedUsers = localStorage.getItem("allUsers");
        if (storedUsers) {
          setAllUsers(JSON.parse(storedUsers));
        } else {
          // Initialize with predefined users
          setAllUsers(predefinedUsers);
          localStorage.setItem("allUsers", JSON.stringify(predefinedUsers));
        }

        const storedUser = localStorage.getItem("currentUser");
        const storedLoginStatus = localStorage.getItem("isLoggedIn");
        const storedDarkMode = localStorage.getItem("darkMode");

        if (storedUser && storedLoginStatus === "true") {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsLoggedIn(true);
          
          // Load user notifications
          loadUserNotifications(userData.email);
        }

        // Initialize dark mode
        if (storedDarkMode) {
          const darkModeValue = JSON.parse(storedDarkMode);
          setDarkMode(darkModeValue);
          if (darkModeValue) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        } else {
          // Default to light mode
          setDarkMode(false);
          document.documentElement.classList.remove("dark");
          localStorage.setItem("darkMode", JSON.stringify(false));
        }
      } catch (error) {
        console.error("Error loading auth state:", error);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuthStatus();
  }, []);

  const loadUserNotifications = (userEmail) => {
    const storedNotifications = localStorage.getItem(`notifications_${userEmail}`);
    if (storedNotifications) {
      const userNotifications = JSON.parse(storedNotifications);
      setNotifications(userNotifications);
      
      // Calculate unread count
      const unread = userNotifications.filter(notification => !notification.read).length;
      setUnreadCount(unread);
    }
  };

  const addNotification = (userEmail, notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false
    };

    const storedNotifications = localStorage.getItem(`notifications_${userEmail}`);
    const existingNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
    const updatedNotifications = [newNotification, ...existingNotifications];
    
    localStorage.setItem(`notifications_${userEmail}`, JSON.stringify(updatedNotifications));

    // Update state if it's the current user
    if (user && user.email === userEmail) {
      setNotifications(updatedNotifications);
      setUnreadCount(prev => prev + 1);
    }
  };

  const markAsRead = (notificationId) => {
    if (!user) return;

    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );

    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifications));
    
    // Update unread count
    const unread = updatedNotifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
  };

  const markAllAsRead = () => {
    if (!user) return;

    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));

    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updatedNotifications));
    setUnreadCount(0);
  };

  const clearAllNotifications = () => {
    if (!user) return;

    setNotifications([]);
    localStorage.setItem(`notifications_${user.email}`, JSON.stringify([]));
    setUnreadCount(0);
  };

  const register = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      role: "user"
    };

    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
    
    return newUser;
  };

  const login = (email, password) => {
    const user = allUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setUser(user);
      setIsLoggedIn(true);
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      
      // Load user notifications
      loadUserNotifications(user.email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
  };

  const getAllUsers = () => {
    return allUsers;
  };

  const deleteUser = (userId) => {
    if (user && user.id === userId) {
      alert("Cannot delete currently logged in user");
      return false;
    }

    const updatedUsers = allUsers.filter(u => u.id !== userId);
    setAllUsers(updatedUsers);
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));

    // Also delete user's reports and notifications
    const userToDelete = allUsers.find(u => u.id === userId);
    if (userToDelete) {
      localStorage.removeItem(`userReports_${userToDelete.email}`);
      localStorage.removeItem(`notifications_${userToDelete.email}`);
    }
    
    return true;
  };

  const updateUserRole = (userId, newRole) => {
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    );
    setAllUsers(updatedUsers);
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
    
    // Update current user if it's the same user
    if (user && user.id === userId) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newMode;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      register,
      login, 
      logout, 
      darkMode, 
      toggleDarkMode,
      authChecked,
      getAllUsers,
      deleteUser,
      updateUserRole,
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAllNotifications,
      loadUserNotifications
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
};