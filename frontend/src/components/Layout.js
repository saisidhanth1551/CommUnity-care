// src/components/Layout.js
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center" // Full screen height with cover and centered background
      style={{ backgroundImage: 'url("/assets/CommUnity-carebg.png")' }} // Path to your background image
    >
      {children} {/* Render the child components (pages) */}
    </div>
  );
};

export default Layout;
