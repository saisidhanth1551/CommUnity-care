import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { UserCircle2, Users, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const [roles, setRoles] = useState([]);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const selectedRole = localStorage.getItem('selectedRole');

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        // Decode the token
        const decoded = jwtDecode(token);
        
        // Set the user's name if available
        if (decoded.name) {
          setUserName(decoded.name);
        }
        
        // Set the roles from the token (it should be an array)
        const userRoles = decoded.roles || []; // Ensure roles is always an array
        setRoles(userRoles);
        
        // If user already has a selected role, redirect to appropriate dashboard
        if (selectedRole) {
          if (selectedRole === 'customer' && userRoles.includes('customer')) {
            navigate('/customer-dashboard');
          } else if (selectedRole === 'worker' && userRoles.includes('worker')) {
            navigate('/worker-dashboard');
          }
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        navigate('/login');  // Redirect to login if there is an error
      }
    } else {
      navigate('/login');  // Redirect to login if no token is found
    }
  }, [navigate, selectedRole]); // We don't need roles in dependency array as we use decoded data directly

  const handleRoleSelect = (role) => {
    localStorage.setItem('selectedRole', role);
    if (role === 'customer') {
      navigate('/customer-dashboard');
    } else if (role === 'worker') {
      navigate('/worker-dashboard');
    }
  };

  // Display role selection UI if user has multiple roles
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img
            src="/assets/CommUnity-care.jpg"
            alt="CommUnity Care Logo"
            className="w-16 h-16 rounded-full object-cover"
          />
          <span className="text-2xl font-bold text-blue-900">CommUnity Care</span>
        </div>
        <div className="space-x-6 text-sm font-medium text-blue-800">
          <a href="/" className="hover:text-blue-600">Home</a>
          <a href="/about" className="hover:text-blue-600">About</a>
          <a href="/contact" className="hover:text-blue-600">Contact Us</a>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("selectedRole");
              window.location.href = "/login";
            }}
            className="hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome{userName ? `, ${userName}` : ''}!</h1>
            <p className="text-gray-600 mt-2">Please select which dashboard you would like to access</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {roles.includes('customer') && (
              <div 
                className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex flex-col items-center hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleRoleSelect('customer')}
              >
                <UserCircle2 size={64} className="text-blue-600 mb-4" />
                <h2 className="text-xl font-semibold text-blue-900 mb-2">Customer Dashboard</h2>
                <p className="text-blue-700 text-center mb-4">Access your service requests and profile</p>
                <button className="flex items-center text-blue-600 font-medium">
                  Go to Dashboard <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
            )}
            
            {roles.includes('worker') && (
              <div 
                className="bg-green-50 border border-green-100 p-6 rounded-xl flex flex-col items-center hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleRoleSelect('worker')}
              >
                <Users size={64} className="text-green-600 mb-4" />
                <h2 className="text-xl font-semibold text-green-900 mb-2">Worker Dashboard</h2>
                <p className="text-green-700 text-center mb-4">Manage service requests and assignments</p>
                <button className="flex items-center text-green-600 font-medium">
                  Go to Dashboard <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
            )}
          </div>
          
          {roles.length === 0 && (
            <div className="text-center p-6 bg-red-50 rounded-lg mt-6">
              <p className="text-red-600">No roles assigned to your account. Please contact support.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
