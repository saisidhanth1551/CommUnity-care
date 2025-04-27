import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Wrench, Flame, HeartPulse, Hotel, Clock, CheckCircle,
  Hammer, ServerCog, Plug, Leaf, ShoppingCart,
  Truck, Sparkles, HelpCircle, XCircle, AlertCircle,
  Eye, X, Calendar, MapPin, Phone, Mail, User
} from "lucide-react";
import Navbar from "../components/Navbar";

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
          console.log("Current user ID:", currentUserId);
        }
        
        console.log("Fetched requests:", data);
        
        // Debug assigned requests
        const assignedToMe = data.filter(req => 
          req.status === 'Assigned' && 
          req.worker && 
          req.worker._id === localStorage.getItem('userId')
        );
        
        console.log("Requests assigned to me:", assignedToMe);
        
        if (assignedToMe.length > 0) {
          assignedToMe.forEach(req => {
            console.log(`Request ${req._id} worker ID:`, req.worker._id);
            console.log(`My user ID from localStorage:`, localStorage.getItem('userId'));
            console.log(`Do they match?`, req.worker._id === localStorage.getItem('userId'));
          });
        }
        
        setRequests(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to fetch service requests.");
      } finally {
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

  const getCategoryIcon = (category) => {
    const icons = {
      Electrical: <Plug size={18} className="text-yellow-600" />,
      Gas: <Flame size={18} className="text-red-500" />,
      Medical: <HeartPulse size={18} className="text-pink-600" />,
      Hospitality: <Hotel size={18} className="text-purple-500" />,
      Plumbing: <Wrench size={18} className="text-blue-500" />,
      Cleaning: <Sparkles size={18} className="text-green-500" />,
      "IT Support": <ServerCog size={18} className="text-indigo-500" />,
      Carpentry: <Hammer size={18} className="text-amber-700" />,
      "Appliance Repair": <Plug size={18} className="text-gray-500" />,
      Gardening: <Leaf size={18} className="text-green-600" />,
      "Moving Help": <Truck size={18} className="text-blue-700" />,
      Groceries: <ShoppingCart size={18} className="text-orange-600" />,
      Other: <HelpCircle size={18} className="text-gray-600" />,
    };
    return icons[category] || null;
  };

  const getStatusIcon = (status) => {
    const lower = status.toLowerCase();
    if (lower === "pending") return <Clock size={14} />;
    if (lower === "assigned") return <AlertCircle size={14} />;
    if (lower === "accepted") return <CheckCircle size={14} />;
    if (lower === "completed") return <CheckCircle size={14} />;
    if (lower === "rejected") return <XCircle size={14} />;
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
    const matchStatus = statusFilter === "All" || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchCategory = categoryFilter === "All" || r.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchStatus && matchCategory;
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
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-blue-900 mb-10">Worker Dashboard</h1>

          <div className="mb-6 text-center">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-3 w-1/4 rounded-lg border border-gray-300 mx-2">
              {["All", "Pending", "Assigned", "Accepted", "Completed", "Rejected"].map((status) => (
                <option key={status} value={status}>{status} Jobs</option>
              ))}
            </select>

            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="p-3 w-1/4 rounded-lg border border-gray-300 mx-2">
              {["All", "Electrical", "Gas", "Medical", "Hospitality", "Plumbing", "Cleaning", "IT Support", "Carpentry", "Appliance Repair", "Gardening", "Moving Help", "Groceries", "Other"]
                .map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Assigned requests notification */}
          {sortedRequests.some(req => req.status === 'Assigned' && req.worker && req.worker._id === localStorage.getItem('userId')) && (
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-blue-800 font-semibold">
                <AlertCircle className="inline-block mr-2" size={20} />
                You have requests waiting for your confirmation!
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Customers have specifically requested your services. Please accept or reject these requests.
              </p>
            </div>
          )}

          {loading ? (
            <p className="text-center text-gray-500">Loading service requests...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : sortedRequests.length === 0 ? (
            <p className="text-center text-gray-500">No service requests found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedRequests.map((req) => {
                // Check if this request is assigned to this worker
                const isAssignedToMe = req.status === 'Assigned' && 
                                     req.worker && 
                                     req.worker._id === localStorage.getItem('userId');
                
                // Check if this is an accepted request by this worker
                const isAcceptedByMe = req.status === 'Accepted' && 
                                    req.worker && 
                                    req.worker._id === localStorage.getItem('userId');
                
                return (
                  <div 
                    key={req._id} 
                    className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all ${
                      isAssignedToMe ? 'border-2 border-blue-400 ring-2 ring-blue-200' : 
                      isAcceptedByMe ? 'border-2 border-green-400' : ''
                    }`}
                  >
                    {isAssignedToMe && (
                      <div className="mb-3 p-2 bg-blue-50 rounded-lg text-blue-800 text-sm">
                        <AlertCircle className="inline-block mr-1" size={16} />
                        A customer has selected you specifically for this job
                      </div>
                    )}
                    
                    {isAcceptedByMe && (
                      <div className="mb-3 p-2 bg-green-50 rounded-lg text-green-800 text-sm">
                        <CheckCircle className="inline-block mr-1" size={16} />
                        You're working on this request
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 text-blue-800 text-xl font-semibold capitalize">
                        {getCategoryIcon(req.category)}
                        {req.category}
                      </div>
                      <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${getStatusClass(req.status)}`}>
                        {getStatusIcon(req.status)} {req.status}
                      </span>
                    </div>

                    <h3 className="text-gray-800 font-medium mb-2">{req.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{req.location}</p>

                    <div className="mt-4 text-gray-700 text-sm">
                      <p><strong>Customer:</strong> {req.customer?.name}</p>
                      <p><strong>Phone:</strong> {req.customer?.phoneNumber || 'N/A'}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 flex justify-between items-center">
                      {/* View Details Button - Always visible */}
                      <button
                        onClick={() => handleViewDetails(req._id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={18} />
                        View Details
                      </button>
                      
                      <div className="flex space-x-2">
                        {/* Show accept button for pending requests */}
                        {req.status === 'Pending' && (
                          <button
                            onClick={() => handleAccept(req._id)}
                            disabled={processingRequestId === req._id}
                            className={`px-4 py-2 ${
                              processingRequestId === req._id && processingAction === 'accepting'
                                ? "bg-gray-500 cursor-not-allowed" 
                                : "bg-green-600 hover:bg-green-700"
                            } text-white rounded-lg`}
                          >
                            {processingRequestId === req._id && processingAction === 'accepting' ? "Accepting..." : "Accept"}
                          </button>
                        )}
                        
                        {/* For assigned requests to this worker */}
                        {isAssignedToMe && (
                          <>
                            <button
                              onClick={() => handleAccept(req._id)}
                              disabled={processingRequestId === req._id}
                              className={`px-3 py-2 ${
                                processingRequestId === req._id && processingAction === 'accepting'
                                  ? "bg-gray-500 cursor-not-allowed" 
                                  : "bg-green-600 hover:bg-green-700"
                              } text-white text-sm rounded-lg`}
                            >
                              {processingRequestId === req._id && processingAction === 'accepting' ? "Accepting..." : "Accept Job"}
                            </button>
                            
                            <button
                              onClick={() => openRejectDialog(req._id)}
                              disabled={processingRequestId === req._id}
                              className={`px-3 py-2 ${
                                processingRequestId === req._id && processingAction === 'rejecting'
                                  ? "bg-gray-500 cursor-not-allowed" 
                                  : "bg-red-600 hover:bg-red-700"
                              } text-white text-sm rounded-lg`}
                            >
                              {processingRequestId === req._id && processingAction === 'rejecting' ? "Rejecting..." : "Decline"}
                            </button>
                          </>
                        )}
                        
                        {/* Show complete button for accepted requests by this worker */}
                        {isAcceptedByMe && (
                          <button
                            onClick={() => openCompletionDialog(req._id)}
                            disabled={processingRequestId === req._id}
                            className={`px-4 py-2 ${
                              processingRequestId === req._id && processingAction === 'completing'
                                ? "bg-gray-500 cursor-not-allowed" 
                                : "bg-green-600 hover:bg-green-700"
                            } text-white rounded-lg`}
                          >
                            {processingRequestId === req._id && processingAction === 'completing' 
                              ? "Completing..." 
                              : "Mark Complete"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      
      {/* Rejection Dialog */}
      <RejectionDialog 
        isOpen={rejectionDialogOpen}
        onClose={() => setRejectionDialogOpen(false)}
        onConfirm={handleReject}
        requestId={requestToReject}
      />
      
      {/* Completion Dialog */}
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
    </>
  );
};

export default WorkerDashboard;
