// src/pages/HomePage/Features.js
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../Context/AuthContext';

function Features() {
  const { darkMode } = useAuth();

  const features = [
    {
      title: "Quick Reporting",
      description: "Instantly report lost or found items with our easy-to-use form.",
      icon: "🚀"
    },
    {
      title: "Secure Platform",
      description: "Your data is protected with advanced security measures.",
      icon: "🔒"
    },
    {
      title: "Community Driven",
      description: "Connect with others to help reunite items with their owners.",
      icon: "👥"
    }
  ];

  return (
    <div className="py-0 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`text-3xl lg:text-4xl font-bold text-center mb-12 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          Why Choose Our Platform?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-6 rounded-xl text-center group transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/70 backdrop-blur-sm border border-gray-700 hover:bg-gray-800/90' 
                  : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white/90'
              } shadow-lg hover:shadow-xl`}
            >
              <div className={`text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 ${
                darkMode ? 'text-cyan-400' : 'text-blue-600'
              }`}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {feature.title}
              </h3>
              <p className={`leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Features;