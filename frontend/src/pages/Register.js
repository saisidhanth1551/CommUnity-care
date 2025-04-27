import React, { useState } from "react";
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">Register</h2>
        
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {apiError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Phone Input */}
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
              placeholder="10 digits, no spaces or dashes"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-gray-700">Register As</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="checkbox"
                  name="role"
                  value="customer"
                  checked={formData.roles.includes("customer")}
                  onChange={handleChange}
                  className="mr-2"
                />
                Customer
              </label>
              <label>
                <input
                  type="checkbox"
                  name="role"
                  value="worker"
                  checked={formData.roles.includes("worker")}
                  onChange={handleChange}
                  className="mr-2"
                />
                Worker
              </label>
            </div>
          </div>

          {/* Categories Selection - Only show if worker role is selected */}
          {formData.roles.includes("worker") && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select Service Categories</label>
              <div className="grid grid-cols-2 gap-2">
                {availableCategories.map((category) => (
                  <label key={category} className="flex items-start">
                    <input
                      type="checkbox"
                      name="category"
                      value={category}
                      checked={formData.categories.includes(category)}
                      onChange={handleChange}
                      className="mr-2 mt-1"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
              {errors.categories && <p className="text-red-500 text-sm mt-1">{errors.categories}</p>}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded"
          >
            {loading ? "Registering..." : "Register"}
          </button>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-700 hover:underline">
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
