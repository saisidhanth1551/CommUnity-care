// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("authToken");
  const selectedRole = localStorage.getItem("selectedRole");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If requiredRole is specified, check if the user has that role
  if (requiredRole) {
    try {
      // Decode the token to get user roles
      const decoded = jwtDecode(token);
      const userRoles = decoded.roles || [];

      // If user doesn't have the required role, redirect to dashboard or show access denied
      if (!userRoles.includes(requiredRole)) {
        // Check if the selected role doesn't match required role
        if (selectedRole && selectedRole !== requiredRole) {
          return <Navigate to="/access-denied" replace />;
        }
        
        // If no specific role was selected or available, redirect to main dashboard
        return <Navigate to="/dashboard" replace />;
      }
      
      // Check if the selected role matches the required role for the route
      if (selectedRole && selectedRole !== requiredRole) {
        return <Navigate to="/access-denied" replace />;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
