// src/pages/AdminPanel/ManageUsers.js
import React, { useState, useEffect } from "react";
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const { darkMode, user, getAllUsers, deleteUser, updateUserRole } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    loadUsers();
  }, [user, navigate]);

  const loadUsers = () => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
  };

  const handleUpdateUserRole = (userId, newRole) => {
    updateUserRole(userId, newRole);
    loadUsers();
    setEditingUser(null);
  };

  const handleDeleteUser = (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"? All their reports will also be deleted.`)) {
      const success = deleteUser(userId);
      if (success) {
        loadUsers();
      }
    }
  };

  const filteredUsers = users.filter(userItem => 
    userItem.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    userItem.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Manage user accounts and permissions
          </p>
        </div>

        {/* Search and Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 lg:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                {filteredUsers.length} users
              </span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {userItem.username}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden mt-1">
                          {userItem.email}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          ID: {userItem.id}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {userItem.email}
                    </td>
                    <td className="py-4 px-4">
                      {editingUser === userItem.id ? (
                        <select 
                          value={userItem.role}
                          onChange={(e) => handleUpdateUserRole(userItem.id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userItem.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {userItem.role}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button 
                          onClick={() => setEditingUser(editingUser === userItem.id ? null : userItem.id)}
                          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                            userItem.id === user?.id 
                              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                          disabled={userItem.id === user?.id}
                          title={userItem.id === user?.id ? "Cannot edit your own role" : "Edit Role"}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(userItem.id, userItem.username)}
                          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                            userItem.id === user?.id 
                              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                          disabled={userItem.id === user?.id}
                          title={userItem.id === user?.id ? "Cannot delete yourself" : "Delete User"}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                {users.length === 0 ? 'No users found' : 'No users match your search'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;