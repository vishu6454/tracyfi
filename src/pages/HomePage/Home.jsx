// src/pages/HomePage/Home.js
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../Context/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, darkMode } = useAuth();

  const handleReportClick = () => {
    if (isLoggedIn) {
      navigate("/report");
    } else {
      navigate("/login");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center text-center min-h-[40vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`text-4xl lg:text-6xl font-bold mb-6 leading-tight ${
            darkMode 
              ? 'text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text'
              : 'text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text'
          }`}
        >
          Lost & Found Platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`mb-8 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          Reuniting people with their lost items through our advanced platform. 
          Report lost items or help others find what they've lost.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 lg:px-12 lg:py-6 rounded-xl font-bold text-lg lg:text-xl transition-all duration-300
                      bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
                      text-white shadow-lg hover:shadow-xl"
          onClick={handleReportClick}
        >
          {isLoggedIn ? 'Report Lost Item' : 'Get Started'}
        </motion.button>
      </motion.div>
    </main>
  );
}

export default Home;