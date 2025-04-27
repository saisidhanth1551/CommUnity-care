import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const AccessDenied = () => {
  const navigate = useNavigate();
  const selectedRole = localStorage.getItem('selectedRole');

  const handleGoToDashboard = () => {
    // Redirect to the dashboard for the selected role
    if (selectedRole === 'customer') {
      navigate('/customer-dashboard');
    } else if (selectedRole === 'worker') {
      navigate('/worker-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSwitchRole = () => {
    // Clear selected role and redirect to login
    localStorage.removeItem('selectedRole');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-red-600 py-6 px-6 flex justify-center">
          <ShieldAlert size={80} className="text-white" />
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page with your current role 
            {selectedRole ? ` (${selectedRole})` : ''}.
          </p>
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to My Dashboard
            </button>
            
            <button
              onClick={handleSwitchRole}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Switch Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied; 