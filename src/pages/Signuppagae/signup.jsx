// src/pages/Signuppage/signup.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../Context/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { darkMode, register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      return setError("All fields are required!");
    }
    if (password !== confirmPassword) return setError("Passwords do not match!");
    if (password.length < 6) return setError("Password must be at least 6 characters long!");

    const storedUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    if (storedUsers.find(user => user.email === email)) {
      return setError("Email already exists!");
    }

    const newUser = register({ username, email, password });
    
    if (newUser) {
      navigate("/login");
    } else {
      setError("Error during registration. Please try again.");
    }
  };

  // Cyberpunk Theme
  const pageBg = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
    : 'bg-gradient-to-br from-cyan-50 via-blue-100 to-purple-100';
  const cardBg = darkMode 
    ? 'bg-gradient-to-br from-gray-900/80 to-blue-900/80 backdrop-blur-lg border border-cyan-500/30' 
    : 'bg-white/80 backdrop-blur-lg border border-blue-300';
  const textColor = darkMode ? 'text-cyan-100' : 'text-blue-900';
  const inputBg = darkMode 
    ? 'bg-gray-800/50 border-cyan-500/30 text-cyan-100 placeholder-cyan-300/50' 
    : 'bg-white/50 border-blue-300 text-blue-900 placeholder-blue-400/50';
  const buttonBg = 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600';

  return (
    <div className={`flex items-center justify-center min-h-screen p-4 ${pageBg} font-['Inter']`}>
      <div className={`w-full max-w-md p-8 space-y-8 rounded-3xl shadow-2xl ${cardBg}`}>
        
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center shadow-2xl">
            <span className="text-2xl text-white">🚀</span>
          </div>
          <h2 className={`text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent`}>
            Cyber Signup
          </h2>
          <p className={`mt-2 text-sm ${textColor} opacity-80`}>Join the future of lost and found</p>
        </div>

        {error && (
          <div className={`p-4 rounded-xl text-center border ${
            darkMode ? 'bg-red-900/50 border-red-700 text-red-200' : 'bg-red-100 border-red-300 text-red-700'
          }`}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Username */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${textColor}`}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a cyber username"
              className={`w-full px-4 py-4 text-sm border-2 rounded-xl focus:outline-none focus:border-cyan-500 transition-all duration-300 ${inputBg}`}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${textColor}`}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full px-4 py-4 text-sm border-2 rounded-xl focus:outline-none focus:border-cyan-500 transition-all duration-300 ${inputBg}`}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${textColor}`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className={`w-full px-4 py-4 text-sm border-2 rounded-xl focus:outline-none focus:border-cyan-500 transition-all duration-300 ${inputBg} pr-12`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${textColor}`}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className={`w-full px-4 py-4 text-sm border-2 rounded-xl focus:outline-none focus:border-cyan-500 transition-all duration-300 ${inputBg} pr-12`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-4 font-bold rounded-xl text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 ${buttonBg}`}
          >
            🚀 Create Cyber Account
          </button>
        </form>

        <div className={`text-center text-sm ${textColor} opacity-80`}>
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className={`font-semibold hover:underline bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent`}
          >
            Cyber Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;