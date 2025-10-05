// src/pages/Notifications/Notifications.js
import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, clearAllNotifications, darkMode } = useAuth();
  const navigate = useNavigate();

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'verification':
        return '✅';
      case 'system':
        return 'ℹ️';
      default:
        return '🔔';
    }
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className={`min-h-screen py-8 px-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Notifications
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {unreadCount > 0 
                ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up!'
              }
            </p>
          </div>
          
          {notifications.length > 0 && (
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={clearAllNotifications}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className={`rounded-2xl shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className={`text-xl font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                No notifications yet
              </h3>
              <p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Notifications about your reports will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 transition-colors ${
                    notification.read 
                      ? (darkMode ? 'bg-gray-800' : 'bg-white')
                      : (darkMode ? 'bg-blue-900/20' : 'bg-blue-50')
                  } ${
                    !notification.read ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      
                      <p className={`mt-1 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      
                      {notification.itemName && (
                        <div className={`mt-2 px-3 py-1 rounded-lg inline-block ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          📦 {notification.itemName}
                        </div>
                      )}
                    </div>
                    
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          darkMode 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;