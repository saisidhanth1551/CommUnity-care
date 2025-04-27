import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import ServiceRequestForm from './pages/ServiceRequestForm';
import Profile from './pages/Profile';
import AboutContact from './pages/About';
import ProtectedRoute from "./components/ProtectedRoute";
import AccessDenied from './pages/AccessDenied';

function App() {
  const authToken = localStorage.getItem("authToken");

  // Home page component with background
  const HomePageWithBackground = () => (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/CommUnity-carebg.png')" }}
    >
      <Home />
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Home Pages - both / and /home direct to the same component */}
        <Route path="/" element={<HomePageWithBackground />} />
        <Route path="/home" element={<HomePageWithBackground />} />

        {/* About & Contact Page */}
        <Route path="/about" element={<AboutContact />} />

        {/* Register Page */}
        <Route 
          path="/register" 
          element={
            <div
              className="min-h-screen bg-cover bg-center"
              style={{ backgroundImage: "url('/assets/CommUnity-carebg.png')" }}
            >
              <Register />
            </div>
          } 
        />

        {/* Login Page */}
        <Route 
          path="/login" 
          element={
            <div
              className="min-h-screen bg-cover bg-center"
              style={{ backgroundImage: "url('/assets/CommUnity-carebg.png')" }}
            >
              <Login />
            </div>
          } 
        />

        {/* Protected Routes for Dashboards */}
        <Route 
          path="/customer-dashboard" 
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/worker-dashboard" 
          element={
            <ProtectedRoute requiredRole="worker">
              <WorkerDashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* Access Denied Page */}
        <Route path="/access-denied" element={<AccessDenied />} />

        {/* Service Request Form */}
        <Route path="/request/new" element={<ServiceRequestForm />} />

        {/* Profile Page */}
        <Route 
          path="/profile" 
          element={
            authToken ? <Profile /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
