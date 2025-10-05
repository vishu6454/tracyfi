import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { useReports } from "../../Context/ReportsContext";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Report = () => {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [image, setImage] = useState(null);

  const { addReport } = useReports();
  const { isLoggedIn, darkMode, authChecked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authChecked && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, authChecked, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setImage(URL.createObjectURL(e.target.files[0]));
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        if (data && data.display_name) setLocation(data.display_name);
        else alert("Could not fetch location details.");
      } catch (err) {
        console.error("Error fetching address:", err);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!status) {
      alert("Please select a status (Lost or Found)");
      return;
    }

    const newReport = {
      itemName,
      description,
      category,
      dateTime: date,
      status,
      location,
      contactInfo,
      image,
    };

    addReport(newReport);
    alert("Report has been uploaded successfully!");

    // Reset form
    setItemName("");
    setDescription("");
    setCategory("Electronics");
    setDate("");
    setStatus("");
    setLocation("");
    setContactInfo("");
    setImage(null);
    
    const fileInput = document.getElementById("image");
    if (fileInput) fileInput.value = "";
  };

  if (!authChecked) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gradient-to-br from-gray-900 to-blue-900" : "bg-gradient-to-br from-cyan-50 to-blue-100"
      }`}>
        <div className="text-lg">Loading Cyber System...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

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
  const buttonBg = "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600";

  return (
    <div className={`${pageBg} min-h-screen flex items-center justify-center py-8 px-4 font-['Inter']`}>
      <div className={`w-full max-w-4xl ${cardBg} border-2 rounded-3xl p-6 lg:p-10 shadow-2xl`}>
        <h2 className={`text-3xl lg:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent`}>
          🚀 Cyber Report
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className={`block text-lg font-semibold mb-3 ${textColor}`} htmlFor="itemName">
                Item Name
              </label>
              <input
                type="text"
                id="itemName"
                className={`w-full mt-1 p-4 rounded-2xl border-2 text-lg ${inputBg} focus:border-cyan-500 transition-all`}
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Enter item name"
                required
              />
            </div>

            <div>
              <label className={`block text-lg font-semibold mb-3 ${textColor}`} htmlFor="category">
                Category
              </label>
              <select
                id="category"
                className={`w-full mt-1 p-4 rounded-2xl border-2 text-lg ${inputBg} focus:border-cyan-500 transition-all`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Electronics</option>
                <option>Documents</option>
                <option>Accessories</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-lg font-semibold mb-3 ${textColor}`} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className={`w-full mt-1 p-4 rounded-2xl border-2 text-lg ${inputBg} h-32 focus:border-cyan-500 transition-all`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the item in detail..."
              required
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className={`block text-lg font-semibold mb-3 ${textColor}`} htmlFor="date">
                Date & Time
              </label>
              <input
                type="datetime-local"
                id="date"
                className={`w-full mt-1 p-4 rounded-2xl border-2 text-lg ${inputBg} focus:border-cyan-500 transition-all`}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <label className={`block text-lg font-semibold mb-3 ${textColor}`} htmlFor="location">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="location"
                  className={`w-full mt-1 p-4 pr-12 rounded-2xl border-2 text-lg ${inputBg} focus:border-cyan-500 transition-all`}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location or use live detection"
                  required
                />
                <button
                  type="button"
                  onClick={detectLocation}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <MapPin size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className={`block text-lg font-semibold mb-3 ${textColor}`} htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className={`w-full mt-1 p-4 rounded-2xl border-2 text-lg ${inputBg} focus:border-cyan-500 transition-all`}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">-- Select Status --</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            <div>
              <label className={`block text-lg font-semibold mb-3 ${textColor}`} htmlFor="contactInfo">
                Contact Information
              </label>
              <input
                type="text"
                id="contactInfo"
                className={`w-full mt-1 p-4 rounded-2xl border-2 text-lg ${inputBg} focus:border-cyan-500 transition-all`}
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Enter your contact info"
                required
              />
            </div>
          </div>

          <div>
            <label className={`block text-lg font-semibold mb-3 ${textColor}`} htmlFor="image">
              Upload Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              className={`w-full mt-1 text-lg p-4 rounded-2xl border-2 ${inputBg} cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 transition-all`}
              onChange={handleFileChange}
            />
          </div>

          <div>
            <button type="submit" className={`w-full py-4 px-6 rounded-2xl font-bold text-xl text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 ${buttonBg}`}>
              🚀 Submit Cyber Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Report;