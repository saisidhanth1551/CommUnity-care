import React, { useState } from "react";
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition, AnimatedButton } from "../components/AnimatedComponents";
import { UserPlus, Mail, Lock, Briefcase, Phone, User, AlertCircle, Loader2 } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    roles: ["customer"],
    categories: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Available service categories - updated to match ServiceRequestForm
  const availableCategories = [
    "Electrical",
    "Gas",
    "Medical",
    "Hospitality",
    "Plumbing",
    "Cleaning",
    "IT Support",
    "Carpentry",
    "Appliance Repair",
    "Gardening",
    "Moving Help",
    "Groceries",
    "Tailoring",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === "role") {
      setFormData((prevData) => {
        const updatedRoles = checked
          ? [...prevData.roles, value]
          : prevData.roles.filter((role) => role !== value);
        
        return { 
          ...prevData, 
          roles: updatedRoles.length > 0 ? updatedRoles : ["customer"]
        };
      });
    } else if (name === "category") {
      setFormData((prevData) => {
        const updatedCategories = checked
          ? [...prevData.categories, value]
          : prevData.categories.filter((category) => category !== value);
        
        return { 
          ...prevData, 
          categories: updatedCategories
        };
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    if (apiError) setApiError("");
  };

  const validateForm = () => {
    const errors = {};
    if (formData.name.trim().length < 3) {
      errors.name = "Full name should be at least 3 characters long.";
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = "Please enter a valid 10-digit phone number.";
    }

    if (formData.password.length < 8) {
      errors.password = "Password should be at least 8 characters long.";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    // If user is a worker, make sure they've selected at least one category
    if (formData.roles.includes("worker") && formData.categories.length === 0) {
      errors.categories = "Please select at least one service category.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (validateForm()) {
      try {
        setLoading(true);
        
        const userData = {
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          roles: formData.roles
        };
        
        // Only include categories if user is a worker
        if (formData.roles.includes("worker")) {
          userData.categories = formData.categories;
        }
        
        console.log("Submitting registration data:", userData);
        
        const response = await axiosInstance.post("/auth/register", userData);
        
        if (response.data && response.data.token) {
          // Redirect to login page instead of storing token and redirecting to dashboard
          navigate("/login", { 
            state: { 
              message: "Registration successful! Please log in with your credentials." 
            } 
          });
        } else {
          throw new Error("No token received from server");
        }
      } catch (error) {
        console.error("Registration error:", error);
        setApiError(
          error.response?.data?.message || 
          "Registration failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Animation variants for staggered form fields
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <PageTransition>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br">
        <motion.div 
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
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
            className="text-center mb-6"
          >
            <UserPlus size={40} className="mx-auto text-blue-900 mb-2" />
            <h2 className="text-2xl font-bold text-blue-900">Register</h2>
          </motion.div>
          
          {apiError && (
            <motion.div 
              className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <AlertCircle size={18} className="mr-2 text-red-600" />
              {apiError}
            </motion.div>
          )}
          
          <motion.form 
            onSubmit={handleSubmit}
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Full Name Input */}
            <motion.div className="mb-4" variants={itemVariants}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Full Name"
                />
              </div>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </motion.div>

            {/* Email Input */}
            <motion.div className="mb-4" variants={itemVariants}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Email Address"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </motion.div>

            {/* Phone Input */}
            <motion.div className="mb-4" variants={itemVariants}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Phone Number (10 digits)"
                />
              </div>
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </motion.div>
            
            {/* Password Fields */}
            <motion.div className="mb-4" variants={itemVariants}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Password (min. 8 characters)"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </motion.div>
            
            <motion.div className="mb-5" variants={itemVariants}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm Password"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </motion.div>

            {/* Role Selection */}
            <motion.div className="mb-5" variants={itemVariants}>
              <label className="text-gray-700 font-semibold mb-2 flex items-center">
                <Briefcase size={18} className="mr-2 text-blue-900" />
                User Role
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="customer-role"
                    name="role"
                    value="customer"
                    checked={formData.roles.includes("customer")}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <label htmlFor="customer-role" className="text-gray-700">Customer (request services)</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="worker-role"
                    name="role"
                    value="worker"
                    checked={formData.roles.includes("worker")}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <label htmlFor="worker-role" className="text-gray-700">Worker (provide services)</label>
                </div>
              </div>
            </motion.div>

            {/* Service Categories (for workers) */}
            {formData.roles.includes("worker") && (
              <motion.div 
                className="mb-6 bg-blue-50 p-5 rounded-lg border border-blue-100"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="font-semibold text-blue-900 mb-3">Select Service Categories:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableCategories.map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        name="category"
                        value={category}
                        checked={formData.categories.includes(category)}
                        onChange={handleChange}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <label htmlFor={`category-${category}`} className="text-sm text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.categories && (
                  <p className="text-red-500 text-sm mt-2">{errors.categories}</p>
                )}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div 
              variants={itemVariants}
              className="mt-6"
            >
              <AnimatedButton
                type="submit"
                className={`w-full py-3 ${
                  loading ? "bg-gray-400" : "bg-blue-900 hover:bg-blue-800"
                } text-white rounded-lg shadow-md transition-colors duration-200`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Registering...
                  </div>
                ) : (
                  "Create Account"
                )}
              </AnimatedButton>
            </motion.div>
            
            <motion.div 
              className="mt-5 text-center text-sm text-gray-600"
              variants={itemVariants}
            >
              Already have an account?{" "}
              <motion.a 
                href="/login" 
                className="text-blue-600 hover:underline font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Log in here
              </motion.a>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Register;
