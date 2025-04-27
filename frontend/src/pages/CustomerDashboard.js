import React, { useEffect, useState } from "react";
import axiosInstance from '../api/axiosInstance';
import {
  Wrench, Flame, HeartPulse, Hotel, Clock, CheckCircle,
  Eye, XCircle, Hammer, ServerCog, Plug, Leaf, ShoppingCart,
  Truck, Sparkles, HelpCircle, X, Calendar, MapPin, Phone, Mail, User,
  Star
} from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { PageTransition, AnimatedButton, AnimatedList, AnimatedListItem, AnimatedModal } from "../components/AnimatedComponents";

// Star Rating Component
const StarRating = ({ initialRating = 0, onRatingChange, disabled = false }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    if (disabled) return;
    setRating(value);
    onRatingChange(value);
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          className={`${disabled ? 'cursor-default' : 'cursor-pointer'} p-1`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
          disabled={disabled}
          whileHover={{ scale: disabled ? 1 : 1.2 }}
          whileTap={{ scale: disabled ? 1 : 0.9 }}
        >
          <Star
            size={24}
            className={`${
              star <= (hover || rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </motion.button>
      ))}
    </div>
  );
};

// Rating Modal Component
const RatingModal = ({ isOpen, onClose, request, onSubmitRating }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setRating(0);
      setFeedback('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !request) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmitRating(request._id, request.worker._id, rating, feedback);
      onClose();
    } catch (err) {
      setError('Failed to submit rating. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800">Rate Worker</h3>
          <motion.button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            disabled={isSubmitting}
            whileHover={{ scale: 1.1, backgroundColor: "rgb(243,244,246)" }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={24} className="text-gray-500" />
          </motion.button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg flex items-center space-x-3">
            {request.worker.profilePicture ? (
              <img 
                src={`http://localhost:5000${request.worker.profilePicture}`} 
                alt={request.worker.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                <User size={24} className="text-blue-600" />
              </div>
            )}
            <div>
              <h4 className="font-semibold text-blue-900">{request.worker.name}</h4>
              <p className="text-sm text-blue-700">{request.category}</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-gray-700 font-medium">
              How would you rate your experience?
            </label>
            <div className="flex justify-center py-2">
              <StarRating onRatingChange={setRating} initialRating={rating} disabled={isSubmitting} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Additional feedback (optional)
            </label>
            <motion.textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
              rows="3"
              placeholder="Share your experience with this worker..."
              disabled={isSubmitting}
              whileFocus={{ borderColor: "rgb(59, 130, 246)", boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
            ></motion.textarea>
          </div>

          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-3">
            <AnimatedButton
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </AnimatedButton>
            <AnimatedButton
              className={`px-4 py-2 ${
                isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded-lg disabled:opacity-50`}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </AnimatedButton>
          </div>
        </div>
      </div>
    </AnimatedModal>
  );
};

// Detailed Request Modal Component
const RequestDetailsModal = ({ isOpen, onClose, request, onRateWorker }) => {
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

  // Check if this request is completed and hasn't been rated yet
  const canRateWorker = request.status === 'Completed' && !request.workerRating;

  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-6">
          <motion.h3 
            className="text-2xl font-bold text-gray-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Request Details
          </motion.h3>
          <motion.button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            whileHover={{ scale: 1.1, backgroundColor: "rgb(243,244,246)" }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={24} className="text-gray-500" />
          </motion.button>
        </div>
        
        <div className="space-y-6">
          {/* Request Status */}
          <motion.div 
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-gray-700">Status</h4>
            <motion.span 
              className={`px-3 py-1 rounded-full ${getStatusClass(request.status)}`}
              whileHover={{ scale: 1.05 }}
            >
              {request.status}
            </motion.span>
          </motion.div>
          
          {/* Request Information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Request Information</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
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
          </motion.div>
          
          {/* Worker Information - only show if assigned */}
          {request.worker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Worker Information</h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-4 mb-3">
                  {request.worker.profilePicture ? (
                    <img 
                      src={`http://localhost:5000${request.worker.profilePicture}`} 
                      alt={request.worker.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                      <User size={24} className="text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h5 className="font-semibold text-blue-900">{request.worker.name}</h5>
                    <div className="text-sm text-blue-700 mt-1">
                      {request.worker.rating ? (
                        <div className="flex items-center">
                          <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                          <span>{request.worker.rating} / 5</span>
                        </div>
                      ) : (
                        <span>New Worker</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail size={14} className="text-blue-600 mr-2" />
                    <span>{request.worker.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={14} className="text-blue-600 mr-2" />
                    <span>{request.worker.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Rejection Message - only show if rejected */}
          {request.status === 'Rejected' && request.rejectionMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-red-50 border border-red-100 rounded-lg p-4"
            >
              <h4 className="font-semibold text-red-800 mb-2">Rejection Reason:</h4>
              <p className="text-red-700">{request.rejectionMessage}</p>
            </motion.div>
          )}
          
          {/* Action Buttons */}
          <motion.div 
            className="flex justify-end mt-6 space-x-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {canRateWorker && (
              <AnimatedButton
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                onClick={() => onRateWorker(request)}
              >
                Rate Worker
              </AnimatedButton>
            )}
            <AnimatedButton
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              onClick={onClose}
            >
              Close
            </AnimatedButton>
          </motion.div>
        </div>
      </div>
    </AnimatedModal>
  );
};

const CustomerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axiosInstance.get("/requests/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch your service requests.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

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
    switch (status.toLowerCase()) {
      case "pending": return <Clock size={14} />;
      case "assigned": return <Clock size={14} className="text-blue-600" />;
      case "accepted": return <CheckCircle size={14} />;
      case "completed": return <CheckCircle size={14} />;
      case "rejected": return <XCircle size={14} className="text-red-600" />;
      default: return null;
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = statusFilter === "All" || request.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === "All" || request.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesStatus && matchesCategory;
  });

  const handleViewClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCancelClick = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this request? This action cannot be undone.")) {
      return;
    }
    
    try {
      setIsCancelling(true);
      
      const token = localStorage.getItem("authToken");
      await axiosInstance.delete(`/requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Refresh the requests after cancellation
      await fetchRequests();
      
      // Close the modal if it was open
      if (isModalOpen && selectedRequest && selectedRequest._id === requestId) {
        setIsModalOpen(false);
      }
    } catch (err) {
      // Handle specific error codes
      if (err.response) {
        if (err.response.status === 404) {
          toast.error("Request not found. It may have already been cancelled.");
        } else if (err.response.status === 403) {
          toast.error("You are not authorized to cancel this request.");
        } else if (err.response.status === 400) {
          toast.error(err.response.data.message || "This request cannot be cancelled.");
        } else {
          toast.error(err.response.data.message || "Failed to cancel the request. Please try again later.");
        }
      } else {
        toast.error("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsCancelling(false);
    }
  };

  // Check if a request can be cancelled
  const canBeCancelled = (status) => {
    // Only pending or assigned requests can be cancelled
    return status === 'Pending' || status === 'Assigned';
  };

  // New function to handle opening the rating modal
  const handleRateWorker = (request) => {
    setSelectedRequest(request);
    setIsRatingModalOpen(true);
  };

  // New function to submit rating
  const handleSubmitRating = async (requestId, workerId, rating, feedback) => {
    try {
      await axiosInstance.post('/ratings', {
        requestId,
        workerId,
        rating,
        feedback,
      });
      
      setRequests(requests.map(req => 
        req._id === requestId 
        ? { ...req, isRated: true, workerRating: rating, workerFeedback: feedback } 
        : req
      ));
      
      toast.success('Rating submitted successfully');
      // Refresh requests to get updated data
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    }
  };

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
            Customer Dashboard
          </motion.h1>
          <motion.p 
            className="text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Manage your service requests and track their status
          </motion.p>
          
          {/* Filter Controls */}
          <motion.div 
            className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <select value={statusFilter} onChange={handleStatusFilterChange} className="p-3 w-1/4 rounded-lg border border-gray-300 mx-2">
              <option value="All">All Requests</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="Accepted">Accepted</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select value={categoryFilter} onChange={handleCategoryFilterChange} className="p-3 w-1/4 rounded-lg border border-gray-300 mx-2">
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
          
          <div className="mb-4 flex justify-between items-center">
            <motion.h2 
              className="text-xl font-semibold text-gray-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Your Requests
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <AnimatedButton
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => window.location.href = '/request/new'}
              >
                New Request
              </AnimatedButton>
            </motion.div>
          </div>
          
          {/* Requests Grid */}
          <AnimatedList>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p className="text-gray-600 text-center">Loading your requests...</p>
              ) : filteredRequests.length === 0 ? (
                <p className="text-gray-500 text-center">You have no requests matching your filters.</p>
              ) : (
                filteredRequests.map((req) => {
                  const isCompleted = req.status === 'Completed';
                  const needsRating = isCompleted && !req.workerRating;
                  
                  return (
                    <AnimatedListItem key={req._id}>
                      <div 
                        className={`bg-white border border-gray-200 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                          isCompleted ? 'border-green-300 bg-green-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-2 text-blue-800 text-xl font-semibold capitalize">
                            {getCategoryIcon(req.category)}
                            <span>{req.category}</span>
                          </div>
                          <span
                            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
                              req.status.toLowerCase() === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                              : req.status.toLowerCase() === "assigned"
                                ? "bg-blue-100 text-blue-600"
                              : req.status.toLowerCase() === "accepted"
                                ? "bg-green-100 text-green-700"
                              : req.status.toLowerCase() === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {getStatusIcon(req.status)}
                            {req.status}
                          </span>
                        </div>

                        <h3 className="text-gray-800 font-medium mb-2">{req.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{req.location}</p>

                        {/* Rate Worker Button */}
                        {needsRating && (
                          <div className="mt-2 mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="text-yellow-700 text-sm">Please rate this service</span>
                              <button
                                onClick={() => handleRateWorker(req)}
                                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600"
                              >
                                Rate Now
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Show the completed banner for completed requests that have been rated */}
                        {isCompleted && !needsRating && (
                          <div className="mt-2 mb-3 p-2 bg-green-100 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                              <CheckCircle size={16} className="text-green-600 mr-2" />
                              <span className="text-green-700 text-sm font-medium">Service Completed</span>
                              {req.workerRating && (
                                <div className="ml-auto flex items-center">
                                  <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                                  <span className="text-yellow-700">{req.workerRating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Worker Preview - simplified version */}
                        {req.worker && (
                          <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded-lg">
                            <div className="flex items-center">
                              {req.worker.profilePicture ? (
                                <img src={`http://localhost:5000${req.worker.profilePicture}`} alt="Worker" className="w-6 h-6 rounded-full mr-2" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 font-bold flex items-center justify-center mr-2">
                                  {req.worker.name ? req.worker.name.charAt(0) : '?'}
                                </div>
                              )}
                              <span className="text-sm">{req.worker.name}</span>
                              {req.status === 'Assigned' && (
                                <span className="ml-2 text-xs text-orange-600 animate-pulse">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 flex justify-between text-blue-600">
                          <button
                            onClick={() => handleViewClick(req)}
                            className="flex items-center gap-1 hover:text-blue-800"
                          >
                            <Eye size={18} />
                            View Details
                          </button>
                          {canBeCancelled(req.status) && (
                            <button
                              onClick={() => handleCancelClick(req._id)}
                              disabled={isCancelling}
                              className={`flex items-center gap-1 ${
                                isCancelling ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-800"
                              }`}
                            >
                              <XCircle size={18} />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </AnimatedListItem>
                  );
                })
              )}
            </div>
          </AnimatedList>
        </div>
        
        {/* Rating Modal */}
        <RatingModal 
          isOpen={isRatingModalOpen} 
          onClose={() => setIsRatingModalOpen(false)} 
          request={selectedRequest}
          onSubmitRating={handleSubmitRating} 
        />
        
        {/* Request Details Modal */}
        <RequestDetailsModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          request={selectedRequest}
          onRateWorker={handleRateWorker}
        />
      </div>
    </PageTransition>
  );
};

export default CustomerDashboard;
