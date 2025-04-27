import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Wrench, Flame, HeartPulse, Hotel, Clock, CheckCircle,
  Hammer, ServerCog, Plug, Leaf, ShoppingCart,
  Truck, Sparkles, HelpCircle, XCircle, AlertCircle,
  Eye, X, Calendar, MapPin, Phone, Mail, User
} from "lucide-react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { PageTransition, AnimatedButton, AnimatedList, AnimatedListItem } from "../components/AnimatedComponents";
import { toast, Toaster } from "react-hot-toast";

// Rejection Dialog Component
const RejectionDialog = ({ isOpen, onClose, onConfirm, requestId }) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onConfirm(requestId, message);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Reject Request</h3>
        <p className="text-gray-600 mb-4">
          Please provide a reason for rejecting this request. This message will be shown to the customer.
        </p>
        
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 mb-4"
          rows="4"
          placeholder="Explain why you're unable to take this job..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 ${
              isSubmitting ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"
            } text-white rounded-lg`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Rejection"}
          </button>
        </div>
      </div>
    </div>
  );
};

// New CompletionDialog Component
const CompletionDialog = ({ isOpen, onClose, onConfirm, requestId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onConfirm(requestId);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Request</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to mark this request as completed? This action will finalize the service and notify the customer.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 ${
              isSubmitting ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
            } text-white rounded-lg`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Mark as Completed"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Request Details Modal Component
const RequestDetailsModal = ({ isOpen, onClose, request }) => {
  if (!isOpen || !request) return null;

  const getStatusClass = (status) => {
    const lower = status.toLowerCase();
    if (lower === "pending") return "bg-yellow-100 text-yellow-700";
    if (lower === "assigned") return "bg-blue-100 text-blue-600";
    if (lower === "accepted") return "bg-green-100 text-green-700";
    if (lower === "completed") return "bg-green-100 text-green-700";
    if (lower === "rejected") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
            <h3 className="text-2xl font-bold text-gray-800">Request Details</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Request Status */}
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-700">Status</h4>
              <span className={`px-3 py-1 rounded-full ${getStatusClass(request.status)}`}>
                {request.status}
              </span>
            </div>
            
            {/* Completed Request Banner */}
            {request.status === 'Completed' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                <CheckCircle size={24} className="text-green-600 mr-3 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-green-800">Service Completed</h5>
                  <p className="text-green-700 text-sm mt-1">
                    You have marked this service request as completed.
                  </p>
                  <p className="text-green-600 text-sm mt-2">
                    Completed on: {formatDate(request.updatedAt)}
                  </p>
                </div>
              </div>
            )}
            
            {/* Request Details */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Request Information</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-start">
                  <span className="font-medium w-32 text-gray-600">Title:</span>
                  <span className="text-gray-800">{request.title}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium w-32 text-gray-600">Category:</span>
                  <span className="text-gray-800">{request.category}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium w-32 text-gray-600">Description:</span>
                  <span className="text-gray-800">{request.description}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium w-32 text-gray-600">Location:</span>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1 text-gray-500" />
                    <span className="text-gray-800">{request.location}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="font-medium w-32 text-gray-600">Created:</span>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1 text-gray-500" />
                    <span className="text-gray-800">{formatDate(request.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Customer Details */}
            {request.customer && (
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Customer Information</h4>
                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center mb-3">
                    {request.customer.profilePicture ? (
                      <img 
                        src={`http://localhost:5000${request.customer.profilePicture}`} 
                        alt={request.customer.name} 
                        className="w-12 h-12 rounded-full mr-3 object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center mr-3">
                        <User size={24} className="text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h5 className="font-semibold text-blue-800">{request.customer.name}</h5>
                    </div>
                  </div>
                  
                  {/* Show contact details */}
                  <div className="space-y-2 border-t border-blue-100 pt-3">
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2 text-blue-500" />
                      <span className="font-medium mr-2">Phone:</span>
                      <span>{request.customer.phoneNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2 text-blue-500" />
                      <span className="font-medium mr-2">Email:</span>
                      <span>{request.customer.email || 'Not provided'}</span>
                    </div>
                  </div>
                  
                  {/* Rejection Message */}
                  {request.status === 'Rejected' && request.rejectionMessage && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <p className="font-medium text-red-800 mb-1">Your reason for declining:</p>
                      <p className="text-red-700">{request.rejectionMessage}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Worker Dashboard
const WorkerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [processingRequestId, setProcessingRequestId] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [requestToReject, setRequestToReject] = useState(null);
  // New state for completion dialog
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [requestToComplete, setRequestToComplete] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Add state for tabs and active tab
  const [activeTab, setActiveTab] = useState("all");
  
  // Define tabs for the dashboard
  const tabs = [
    { id: "all", name: "All Requests", count: requests.length },
    { id: "pending", name: "Pending", count: requests.filter(r => r.status === 'Pending').length },
    { id: "assigned", name: "Assigned to Me", count: requests.filter(r => r.status === 'Assigned' && r.worker && r.worker._id === localStorage.getItem('userId')).length },
    { id: "accepted", name: "Accepted", count: requests.filter(r => r.status === 'Accepted').length },
    { id: "completed", name: "Completed", count: requests.filter(r => r.status === 'Completed').length }
  ];

  // Fetch Service Requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const { data } = await axiosInstance.get('/requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Get the current user's profile to ensure we have the correct ID
        const userResponse = await axiosInstance.get('/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Store the user ID in localStorage for later comparison
        if (userResponse.data && userResponse.data._id) {
          const currentUserId = userResponse.data._id;
          localStorage.setItem("userId", currentUserId);
        }
        
        setRequests(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to fetch service requests.");
        toast.error("Failed to load service requests");
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);
  
  // Accept a service request
  const handleAccept = async (requestId) => {
    setProcessingRequestId(requestId);
    setProcessingAction("accepting");
    setError(""); // Clear any previous errors
    
    try {
      const token = localStorage.getItem("authToken");
      const currentUserId = localStorage.getItem("userId");
      
      // Find the specific request
      const requestToAccept = requests.find(r => r._id === requestId);
      
      if (!requestToAccept) {
        throw new Error("Request not found in local state");
      }
      
      console.log(`Attempting to accept request ${requestId}`);
      console.log("Request details:", requestToAccept);
      console.log("Current user ID from localStorage:", currentUserId);
      
      // For assigned requests, do extra checking
      if (requestToAccept.status === 'Assigned' && requestToAccept.worker) {
        console.log("Request is assigned to worker:", requestToAccept.worker._id);
        console.log("Do IDs match?", requestToAccept.worker._id === currentUserId);
        
        if (requestToAccept.worker._id !== currentUserId) {
          setError("This request is assigned to another worker.");
          return;
        }
      }
      
      // Debug the token (safely - just show it exists)
      console.log("Auth token exists:", !!token);
      
      const response = await axiosInstance.put(`/requests/accept/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Accept response:", response.data);
      
      // Refresh the list of requests to ensure we have the most up-to-date data
      const { data: updatedRequests } = await axiosInstance.get('/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setRequests(updatedRequests);
    } catch (err) {
      console.error("Error accepting request:", err);
      setError(err.response?.data?.message || "Failed to accept request. Please try again.");
      
      // More detailed error logging
      if (err.response) {
        console.log("Error status:", err.response.status);
        console.log("Error data:", err.response.data);
      }
    } finally {
      setProcessingRequestId(null);
      setProcessingAction(null);
    }
  };

  // Open rejection dialog
  const openRejectDialog = (requestId) => {
    setRequestToReject(requestId);
    setRejectionDialogOpen(true);
  };

  // Reject a service request
  const handleReject = async (requestId, rejectionMessage) => {
    setProcessingRequestId(requestId);
    setProcessingAction("rejecting");
    setError(""); // Clear any previous errors
    
    try {
      const token = localStorage.getItem("authToken");
      const currentUserId = localStorage.getItem("userId");
      
      // Find the specific request
      const requestToReject = requests.find(r => r._id === requestId);
      
      if (!requestToReject) {
        throw new Error("Request not found in local state");
      }
      
      console.log(`Attempting to reject request ${requestId}`);
      console.log("Request details:", requestToReject);
      console.log("Current user ID from localStorage:", currentUserId);
      console.log("Rejection message:", rejectionMessage);
      
      // For assigned requests, do extra checking
      if (requestToReject.status === 'Assigned' && requestToReject.worker) {
        console.log("Request is assigned to worker:", requestToReject.worker._id);
        console.log("Do IDs match?", requestToReject.worker._id === currentUserId);
        
        if (requestToReject.worker._id !== currentUserId) {
          setError("This request is assigned to another worker.");
          return;
        }
      }
      
      // Debug the token (safely - just show it exists)
      console.log("Auth token exists:", !!token);
      
      const response = await axiosInstance.put(`/requests/reject/${requestId}`, 
        { rejectionMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log("Reject response:", response.data);
      
      // Refresh the list of requests to ensure we have the most up-to-date data
      const { data: updatedRequests } = await axiosInstance.get('/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setRequests(updatedRequests);
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError(err.response?.data?.message || "Failed to reject request. Please try again.");
      
      // More detailed error logging
      if (err.response) {
        console.log("Error status:", err.response.status);
        console.log("Error data:", err.response.data);
      }
    } finally {
      setProcessingRequestId(null);
      setProcessingAction(null);
    }
  };

  // New function to open completion dialog
  const openCompletionDialog = (requestId) => {
    setRequestToComplete(requestId);
    setCompletionDialogOpen(true);
  };

  // New function to handle request completion
  const handleComplete = async (requestId) => {
    setProcessingRequestId(requestId);
    setProcessingAction("completing");
    setError(""); // Clear any previous errors
    
    try {
      const token = localStorage.getItem("authToken");
      const currentUserId = localStorage.getItem("userId");
      
      // Find the specific request
      const requestToComplete = requests.find(r => r._id === requestId);
      
      if (!requestToComplete) {
        throw new Error("Request not found in local state");
      }
      
      console.log(`Attempting to complete request ${requestId}`);
      
      // For accepted requests, verify this worker is assigned
      if (requestToComplete.worker._id !== currentUserId) {
        setError("You are not authorized to complete this request.");
        return;
      }
      
      const response = await axiosInstance.put(`/requests/complete/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Complete response:", response.data);
      
      // Refresh the list of requests to ensure we have the most up-to-date data
      const { data: updatedRequests } = await axiosInstance.get('/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setRequests(updatedRequests);
    } catch (err) {
      console.error("Error completing request:", err);
      setError(err.response?.data?.message || "Failed to complete request. Please try again.");
    } finally {
      setProcessingRequestId(null);
      setProcessingAction(null);
    }
  };

  // View request details
  const handleViewDetails = (requestId) => {
    const request = requests.find(req => req._id === requestId);
    if (request) {
      setSelectedRequest(request);
      setIsModalOpen(true);
    }
  };

  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);
  const handleCategoryFilterChange = (e) => setCategoryFilter(e.target.value);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Electrical": return <Plug size={18} className="text-yellow-600" />;
      case "Gas": return <Flame size={18} className="text-red-500" />;
      case "Medical": return <HeartPulse size={18} className="text-pink-600" />;
      case "Hospitality": return <Hotel size={18} className="text-purple-500" />;
      case "Plumbing": return <Wrench size={18} className="text-blue-500" />;
      case "Cleaning": return <Sparkles size={18} className="text-green-500" />;
      case "IT Support": return <ServerCog size={18} className="text-indigo-500" />;
      case "Carpentry": return <Hammer size={18} className="text-amber-700" />;
      case "Appliance Repair": return <Plug size={18} className="text-gray-500" />;
      case "Gardening": return <Leaf size={18} className="text-green-600" />;
      case "Moving Help": return <Truck size={18} className="text-blue-700" />;
      case "Groceries": return <ShoppingCart size={18} className="text-orange-600" />;
      case "Other": return <HelpCircle size={18} className="text-gray-600" />;
      default: return null;
    }
  };

  const getStatusIcon = (status) => {
    const lower = status.toLowerCase();
    if (lower === "pending") return <Clock size={14} className="mr-1" />;
    if (lower === "assigned") return <AlertCircle size={14} className="mr-1" />;
    if (lower === "accepted") return <CheckCircle size={14} className="mr-1" />;
    if (lower === "completed") return <CheckCircle size={14} className="mr-1" />;
    if (lower === "rejected") return <XCircle size={14} className="mr-1" />;
    return null;
  };

  const getStatusClass = (status) => {
    const lower = status.toLowerCase();
    if (lower === "pending") return "bg-yellow-100 text-yellow-700";
    if (lower === "assigned") return "bg-blue-100 text-blue-600";
    if (lower === "accepted") return "bg-green-100 text-green-700";
    if (lower === "completed") return "bg-green-100 text-green-700";
    if (lower === "rejected") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const filteredRequests = requests.filter((r) => {
    if (activeTab === "all") {
      // When "all" is selected, apply the status and category filters
      const matchStatus = statusFilter === "All" || r.status.toLowerCase() === statusFilter.toLowerCase();
      const matchCategory = categoryFilter === "All" || r.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchStatus && matchCategory;
    } else if (activeTab === "pending") {
      return r.status === "Pending";
    } else if (activeTab === "assigned") {
      return r.status === "Assigned" && r.worker && r.worker._id === localStorage.getItem('userId');
    } else if (activeTab === "accepted") {
      return r.status === "Accepted";
    } else if (activeTab === "completed") {
      return r.status === "Completed";
    }
    return true;
  });

  // Add a filter to show assigned requests for this worker at the top
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    // First, show assigned requests for this worker
    const aIsAssignedToMe = a.status === 'Assigned' && a.worker && a.worker._id === localStorage.getItem('userId');
    const bIsAssignedToMe = b.status === 'Assigned' && b.worker && b.worker._id === localStorage.getItem('userId');
    
    if (aIsAssignedToMe && !bIsAssignedToMe) return -1;
    if (!aIsAssignedToMe && bIsAssignedToMe) return 1;
    
    // Then sort by status (pending first)
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    
    // Then by date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Toaster position="top-center" />
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Worker Dashboard
          </motion.h1>
          <motion.p 
            className="text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Manage service requests and track your work
          </motion.p>
          
          {/* Dashboard Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">New Requests</h3>
              <p className="text-3xl font-bold text-blue-600">
                {requests.filter(r => r.status === 'Pending' || r.status === 'Assigned').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Accepted</h3>
              <p className="text-3xl font-bold text-green-600">
                {requests.filter(r => r.status === 'Accepted').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-purple-600">
                {requests.filter(r => r.status === 'Completed').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Rejected</h3>
              <p className="text-3xl font-bold text-gray-600">
                {requests.filter(r => r.status === 'Rejected').length}
              </p>
            </div>
          </motion.div>

          {/* Filter Controls */}
          <motion.div 
            className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <select 
              value={statusFilter} 
              onChange={handleStatusFilterChange} 
              className="p-3 w-1/4 rounded-lg border border-gray-300 mx-2"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="Accepted">Accepted</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select 
              value={categoryFilter} 
              onChange={handleCategoryFilterChange} 
              className="p-3 w-1/4 rounded-lg border border-gray-300 mx-2"
            >
              <option value="All">All Categories</option>
              <option value="Electrical">Electrical</option>
              <option value="Gas">Gas</option>
              <option value="Medical">Medical</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Cleaning">Cleaning</option>
              <option value="IT Support">IT Support</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Appliance Repair">Appliance Repair</option>
              <option value="Gardening">Gardening</option>
              <option value="Moving Help">Moving Help</option>
              <option value="Groceries">Groceries</option>
              <option value="Other">Other</option>
            </select>
          </motion.div>
          
          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {tabs.map((tab, index) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-3 text-center border-b-2 font-medium text-sm sm:text-base ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    {tab.name} {tab.count > 0 && <span className="ml-2 bg-blue-100 text-blue-600 py-1 px-2 rounded-full text-xs">{tab.count}</span>}
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Requests */}
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Requests</h2>
            
            {loading ? (
              <div className="text-center py-10">
                <p className="text-gray-600">Loading requests...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <motion.div 
                className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <HelpCircle size={40} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">No requests found</h3>
                <p className="text-gray-500">There are no {tabs.find(tab => tab.id === activeTab)?.name.toLowerCase() || ''} at the moment.</p>
              </motion.div>
            ) : (
              <AnimatedList>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedRequests.map((request, index) => {
                    const isAssignedToMe = request.status === 'Assigned' && request.worker && request.worker._id === localStorage.getItem('userId');
                    
                    return (
                      <AnimatedListItem key={request._id}>
                        <div className={`bg-white border border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                          isAssignedToMe ? 'border-blue-300 bg-blue-50' : ''
                        }`}>
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-blue-800 text-xl font-semibold capitalize">
                              {getCategoryIcon(request.category)}
                              <span>{request.category}</span>
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${getStatusClass(request.status)}`}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </span>
                          </div>

                          <h3 className="text-gray-800 font-medium mb-2">{request.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">
                            <MapPin size={14} className="inline mr-1" /> 
                            {request.location}
                          </p>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{request.description}</p>

                          {isAssignedToMe && (
                            <div className="mb-3 p-2 bg-blue-100 rounded-lg text-blue-800 text-sm flex items-center">
                              <AlertCircle className="inline-block mr-2" size={16} />
                              A customer has selected you specifically for this job
                            </div>
                          )}
                          
                          {request.status === 'Accepted' && (
                            <div className="mb-3 p-2 bg-green-100 rounded-lg text-green-800 text-sm flex items-center">
                              <CheckCircle className="inline-block mr-2" size={16} />
                              You're working on this request
                            </div>
                          )}

                          {/* Customer Preview */}
                          {request.customer && (
                            <div className="mt-3 p-2 bg-gray-50 border border-gray-100 rounded-lg">
                              <div className="flex items-center">
                                {request.customer.profilePicture ? (
                                  <img src={`http://localhost:5000${request.customer.profilePicture}`} alt="Customer" className="w-6 h-6 rounded-full mr-2" />
                                ) : (
                                  <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-800 font-bold flex items-center justify-center mr-2">
                                    {request.customer.name ? request.customer.name.charAt(0) : '?'}
                                  </div>
                                )}
                                <span className="text-sm">Customer: {request.customer.name}</span>
                              </div>
                            </div>
                          )}

                          <div className="mt-4 flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              <Calendar size={14} className="inline mr-1" />
                              {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                            
                            <div className="flex space-x-2">
                              <AnimatedButton
                                onClick={() => handleViewDetails(request._id)}
                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 flex items-center text-sm"
                              >
                                <Eye size={14} className="mr-1" /> View
                              </AnimatedButton>
                              
                              {request.status === 'Pending' || request.status === 'Assigned' ? (
                                <>
                                  <AnimatedButton
                                    onClick={() => handleAccept(request._id)}
                                    className="px-3 py-1 bg-green-50 text-green-600 rounded-md hover:bg-green-100 flex items-center text-sm"
                                    disabled={processingRequestId === request._id}
                                  >
                                    <CheckCircle size={14} className="mr-1" /> 
                                    {processingRequestId === request._id && processingAction === 'accepting' ? 'Accepting...' : 'Accept'}
                                  </AnimatedButton>
                                  
                                  <AnimatedButton
                                    onClick={() => openRejectDialog(request._id)}
                                    className="px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center text-sm"
                                    disabled={processingRequestId === request._id}
                                  >
                                    <XCircle size={14} className="mr-1" /> 
                                    {processingRequestId === request._id && processingAction === 'rejecting' ? 'Rejecting...' : 'Reject'}
                                  </AnimatedButton>
                                </>
                              ) : request.status === 'Accepted' ? (
                                <AnimatedButton
                                  onClick={() => openCompletionDialog(request._id)}
                                  className="px-3 py-1 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 flex items-center text-sm"
                                  disabled={processingRequestId === request._id}
                                >
                                  <CheckCircle size={14} className="mr-1" /> 
                                  {processingRequestId === request._id && processingAction === 'completing' ? 'Completing...' : 'Complete'}
                                </AnimatedButton>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </AnimatedListItem>
                    );
                  })}
                </div>
              </AnimatedList>
            )}
          </motion.div>
        </div>
        
        {/* Dialogs */}
        <RejectionDialog
          isOpen={rejectionDialogOpen}
          onClose={() => setRejectionDialogOpen(false)}
          onConfirm={handleReject}
          requestId={requestToReject}
        />
        
        <CompletionDialog
          isOpen={completionDialogOpen}
          onClose={() => setCompletionDialogOpen(false)}
          onConfirm={handleComplete}
          requestId={requestToComplete}
        />
        
        {/* Request Details Modal */}
        <RequestDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          request={selectedRequest}
        />
      </div>
    </PageTransition>
  );
};

export default WorkerDashboard;
