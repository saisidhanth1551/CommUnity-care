import React, { useState } from "react";
import axiosInstance from '../api/axiosInstance'; // Axios instance with base URL
import { useNavigate } from "react-router-dom";
import WorkerSelection from "../components/WorkerSelection";
import { 
  ArrowLeft, Clipboard, MessageSquare, ListFilter, 
  MapPin, AlertCircle, CheckCircle, Loader2,
  Wrench, Flame, HeartPulse, Hotel, Sparkles, 
  ServerCog, Hammer, Plug, Leaf, ShoppingCart,
  Truck, Scissors, Home, Info, Phone, LogOut
} from "lucide-react";

// Navbar Component
const Navbar = () => {
  // Detect current path
  const currentPath = window.location.pathname;
  
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
            currentPath === "/" 
              ? "text-blue-600 font-semibold" 
              : "text-blue-800 hover:text-blue-600"
          }`}
        >
          <Home size={16} className="mr-1" />
          Home
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
          href="/contact" 
          className={`inline-flex items-center ${
            currentPath === "/contact" 
              ? "text-blue-600 font-semibold" 
              : "text-blue-800 hover:text-blue-600"
          }`}
        >
          <Phone size={16} className="mr-1" />
          Contact
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

const ServiceRequestForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Electrical", // Default category
    location: "",
    status: "Pending", // Default status
    workerId: null, // For manually selecting a worker
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWorkerSelection, setShowWorkerSelection] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate(); // Hook for redirection after form submission

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Reset worker selection when category changes
    if (name === 'category') {
      setFormData(prev => ({ ...prev, workerId: null }));
    }
  };

  const handleWorkerSelect = (workerId) => {
    setFormData(prev => ({ ...prev, workerId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous error message if any

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to create a request.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/requests", // Use endpoint path only as axiosInstance has baseURL
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Show success message briefly before redirecting
        setSuccess(true);
        setTimeout(() => {
          // Redirect to the customer dashboard after short delay
          navigate("/customer-dashboard");
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create service request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/customer-dashboard");
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
      Tailoring: <Scissors size={18} className="text-purple-600" />,
      Other: <ListFilter size={18} className="text-gray-600" />,
    };
    return icons[category] || <ListFilter size={18} className="text-blue-600" />;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <button 
            onClick={handleBackToDashboard}
            className="flex items-center text-blue-700 hover:text-blue-900 mb-6 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Dashboard
          </button>
          
          <h1 className="text-4xl font-bold mb-3 text-blue-900 text-center">Create a Service Request</h1>
          <p className="text-gray-600 mb-8 text-center">
            Provide the details of your service request below and we'll connect you with the right professionals.
          </p>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
              <div className="flex items-center">
                <AlertCircle size={20} className="text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
              <div className="flex items-center">
                <CheckCircle size={20} className="text-green-500 mr-2" />
                <p className="text-green-700">Request created successfully! Redirecting...</p>
              </div>
            </div>
          )}

          <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <div className="flex items-center">
                    <Clipboard size={18} className="mr-2 text-blue-600" />
                    Request Title
                  </div>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="E.g., Fix leaking faucet, Computer setup assistance"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              {/* Category field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <div className="flex items-center">
                    <ListFilter size={18} className="mr-2 text-blue-600" />
                    Service Category
                  </div>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                  >
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
                    <option value="Tailoring">Tailoring</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {getCategoryIcon(formData.category)}
                  </div>
                </div>
                
                {/* Category Badge */}
                <div className="mt-2 flex">
                  <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                    {getCategoryIcon(formData.category)}
                    <span>{formData.category}</span>
                  </span>
                </div>
              </div>
              
              {/* Description field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <div className="flex items-center">
                    <MessageSquare size={18} className="mr-2 text-blue-600" />
                    Description
                  </div>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please provide detailed information about your service request..."
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include any specific requirements, issues, or details that will help the worker understand your needs.
                </p>
              </div>

              {/* Location field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2 text-blue-600" />
                    Location
                  </div>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="E.g., 123 Main St, Apartment 4B"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide your full address where the service is needed.
                </p>
              </div>

              {/* Status is hidden from user */}
              <input type="hidden" name="status" value={formData.status} />

              {/* Worker selection toggle */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="choose-worker"
                    checked={showWorkerSelection}
                    onChange={() => setShowWorkerSelection(!showWorkerSelection)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="choose-worker" className="text-blue-800 font-medium">
                    Select a specific worker for this request
                  </label>
                </div>
                <p className="text-xs text-blue-700 mt-1 ml-6">
                  If you've worked with someone before or have a preference, you can request them specifically.
                </p>
              </div>

              {/* Worker selection component */}
              {showWorkerSelection && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                  <WorkerSelection
                    category={formData.category}
                    onWorkerSelect={handleWorkerSelect}
                    selectedWorkerId={formData.workerId}
                  />
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-6 text-center">
                <button
                  type="submit"
                  className={`w-full max-w-md mx-auto ${
                    loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  } text-white py-3 px-6 rounded-lg flex items-center justify-center transition-colors font-medium shadow-md`}
                  disabled={loading || success}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Creating Request...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle size={20} className="mr-2" />
                      Request Created
                    </>
                  ) : (
                    "Submit Service Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceRequestForm;
