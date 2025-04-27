import React, { useState, useEffect } from "react";
import axiosInstance from '../api/axiosInstance';
import { useNavigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { motion } from "framer-motion";
import { PageTransition, AnimatedButton } from "../components/AnimatedComponents";
import { LogIn, Mail, Lock, UserCheck } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "customer", // This is for UI display only, not sent to backend
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from registration page
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent the message from reappearing on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear any error message when user starts typing
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
  
    try {
      // Only send email and password - role is not expected by the backend
      const response = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });
  
      // If login is successful, extract the token from the response
      const { token } = response.data;
  
      // Decode the token to get user information
      const decodedToken = jwtDecode(token);
      
      // Store the token in localStorage
      localStorage.setItem("authToken", token);
      
      // Save user roles if they exist in the token
      if (decodedToken.roles) {
        localStorage.setItem("userRoles", JSON.stringify(decodedToken.roles));
      }
  
      // Check if the selected role exists in the user's roles
      const userRoles = decodedToken.roles || [];
      
      if (!userRoles.includes(formData.role)) {
        setError(`You do not have access as a ${formData.role}. Your roles: ${userRoles.join(', ')}`);
        return;
      }
      
      // Store the selected role in localStorage for route protection
      localStorage.setItem("selectedRole", formData.role);
      
      // Redirect to the correct dashboard based on the selected role
      if (formData.role === "customer") {
        navigate("/customer-dashboard");
      } else if (formData.role === "worker") {
        navigate("/worker-dashboard");
      } else {
        navigate("/dashboard"); // Default fallback
      }
  
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
  
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Invalid credentials.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };
  
  return (
    <PageTransition>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br">
        <motion.div 
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 120,
            damping: 15
          }}
        >
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="text-center mb-6">
              <LogIn size={40} className="mx-auto text-blue-900 mb-2" />
              <h2 className="text-2xl font-bold text-blue-900">Login</h2>
            </div>
          </motion.div>

          {/* Success Message */}
          {successMessage && (
            <motion.div 
              className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <UserCheck size={18} className="mr-2 text-green-600" />
                {successMessage}
              </div>
            </motion.div>
          )}

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </motion.div>

            {/* Role Selection */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <label className="block text-gray-700 font-semibold mb-1">Select Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="customer">Customer</option>
                <option value="worker">Worker</option>
              </select>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.p 
                className="text-red-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.p>
            )}

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <AnimatedButton
                type="submit"
                className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
              >
                Login
              </AnimatedButton>
            </motion.div>
          </motion.form>

          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <motion.a 
                href="/register" 
                className="text-blue-600 hover:underline font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register here
              </motion.a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Login;
