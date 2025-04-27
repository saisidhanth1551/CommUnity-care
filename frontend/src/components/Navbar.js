// src/components/Navbar.js
import React from 'react';
import { Home, Info, LogOut, User, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  // Detect current path
  const currentPath = window.location.pathname;
  
  // Check if we're on any home path
  const isHomePath = currentPath === "/" || currentPath === "/home";
  // Check if we're on any dashboard path
  const isDashboardPath = currentPath === "/dashboard" || 
                          currentPath === "/worker-dashboard" || 
                          currentPath === "/customer-dashboard";
  
  return (
    <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img
          src="/assets/CommUnity-care.jpg"
          alt="CommUnity Care Logo"
          className="w-16 h-16 rounded-full object-cover"
        />
        <span className="text-2xl font-bold text-blue-900">CommUnity Care</span>
      </div>
      <div className="flex items-center space-x-6 text-sm font-medium">
        <a 
          href="/" 
          className={`inline-flex items-center ${
            isHomePath
              ? "text-blue-600 font-semibold" 
              : "text-blue-800 hover:text-blue-600"
          }`}
        >
          <Home size={16} className="mr-1" />
          Home
        </a>
        <a 
          href="/dashboard" 
          className={`inline-flex items-center ${
            isDashboardPath
              ? "text-blue-600 font-semibold" 
              : "text-blue-800 hover:text-blue-600"
          }`}
        >
          <LayoutDashboard size={16} className="mr-1" />
          Dashboard
        </a>
        <a 
          href="/about" 
          className={`inline-flex items-center ${
            currentPath === "/about" 
              ? "text-blue-600 font-semibold" 
              : "text-blue-800 hover:text-blue-600"
          }`}
        >
          <Info size={16} className="mr-1" />
          About
        </a>
        <a 
          href="/profile" 
          className={`inline-flex items-center ${
            currentPath === "/profile" 
              ? "text-blue-600 font-semibold" 
              : "text-blue-800 hover:text-blue-600"
          }`}
        >
          <User size={16} className="mr-1" />
          Profile
        </a>
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          }}
          className="text-red-600 hover:text-red-700 inline-flex items-center ml-4"
        >
          <LogOut size={16} className="mr-1" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
