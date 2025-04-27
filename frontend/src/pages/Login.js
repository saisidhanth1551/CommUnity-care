import React, { useState, useEffect } from "react";
import axiosInstance from '../api/axiosInstance';
import { useNavigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

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
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Login</h2>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Select Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            >
              <option value="customer">Customer</option>
              <option value="worker">Worker</option>
            </select>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
