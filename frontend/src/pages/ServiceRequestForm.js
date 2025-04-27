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
import { motion } from "framer-motion";
import { PageTransition, AnimatedButton } from "../components/AnimatedComponents";

// Navbar Component with animations
const Navbar = () => {
  // Detect current path
  const currentPath = window.location.pathname;
  
  return (
    <motion.nav 
      className="bg-white shadow-md py-4 px-8 flex justify-between items-center"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <div className="flex items-center space-x-3">
        <motion.img
          src="/assets/CommUnity-care.jpg"
          alt="CommUnity Care Logo"
          className="w-16 h-16 rounded-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        />
        <span className="text-2xl font-bold text-blue-900">CommUnity Care</span>
      </div>
      <div className="flex items-center space-x-6 text-sm font-medium">
        <motion.a 
          href="/" 
          className={`inline-flex items-center ${
            currentPath === "/" 
              ? "text-blue-600 font-semibold" 
              : "text-blue-800 hover:text-blue-600"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Home size={16} className="mr-1" />
          Home
        </motion.a>
        <motion.a 
          href="/about" 
          className={`inline-flex items-center ${
            currentPath === "/about" 
              ? "text-blue-600 font-semibold" 
              : "text-blue-800 hover:text-blue-600"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Info size={16} className="mr-1" />
          About
        </motion.a>
        <motion.a 
          href="/contact" 
          className={`inline-flex items-center ${
            currentPath === "/contact" 
              ? "text-blue-600 font-semibold" 
              : "text-blue-800 hover:text-blue-600"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Phone size={16} className="mr-1" />
          Contact
        </motion.a>
        <motion.button
          onClick={() => {
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          }}
          className="text-red-600 hover:text-red-700 inline-flex items-center ml-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut size={16} className="mr-1" />
          Logout
        </motion.button>
      </div>
    </motion.nav>
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
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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
    console.log("Worker selected:", workerId);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validate required fields for final submission
    if (!formData.title || !formData.category || !formData.location || !formData.description) {
      setError("Please fill out all required fields before submitting.");
      return;
    }
    
    setLoading(true);
    setError(""); // Clear previous error message if any

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to create a request.");
      setLoading(false);
      return;
    }

    try {
      // Create a copy of formData to submit
      // If workerId is null, it will be handled by the backend to find any available worker
      const dataToSubmit = {
        ...formData
      };
      
      console.log("Submitting request with data:", dataToSubmit);
      
      const response = await axiosInstance.post(
        "/requests",
        dataToSubmit,
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
      console.error("Form submission error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create service request. Please try again."
      );
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/customer-dashboard");
  };
  
  const nextStep = () => {
    if (currentStep === 1 && (!formData.title || !formData.category || !formData.location)) {
      setError("Please fill out all required fields before proceeding.");
      return;
    }
    if (currentStep === 2 && !formData.description) {
      setError("Please provide a description of your service request.");
      return;
    }
    setError("");
    setCurrentStep(current => current + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(current => current - 1);
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

  // Progress indicator component
  const ProgressIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <motion.div 
              className={`rounded-full h-10 w-10 flex items-center justify-center ${
                step === currentStep 
                  ? "bg-blue-600 text-white" 
                  : step < currentStep 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-200 text-gray-600"
              }`}
              whileHover={{ scale: 1.1 }}
              animate={{ scale: step === currentStep ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5, repeat: step === currentStep ? Infinity : 0, repeatType: "reverse" }}
            >
              {step < currentStep ? <CheckCircle size={18} /> : step}
            </motion.div>
            {step < 3 && (
              <motion.div 
                className={`h-1 w-16 ${
                  step < currentStep ? "bg-green-500" : "bg-gray-200"
                }`}
                initial={{ width: 0 }}
                animate={{ width: "4rem" }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.button 
            onClick={handleBackToDashboard}
            className="flex items-center text-blue-700 hover:text-blue-900 mb-6 transition-colors"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Dashboard
          </motion.button>
          
          <motion.h1 
            className="text-4xl font-bold mb-3 text-blue-900 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Create a Service Request
          </motion.h1>
          <motion.p 
            className="text-gray-600 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Provide the details of your service request below and we'll connect you with the right professionals.
          </motion.p>
          
          <ProgressIndicator />
          
          {error && (
            <motion.div 
              className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <AlertCircle size={20} className="text-red-500 mr-2" />
                <p className="text-red-700">{error}</p>
              </div>
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <CheckCircle size={20} className="text-green-500 mr-2" />
                <p className="text-green-700">Your service request has been created successfully! Redirecting...</p>
              </div>
            </motion.div>
          )}
          
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-blue-800">Step 1: Basic Information</h2>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                      Request Title <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <Clipboard size={20} className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Fix Leaking Bathroom Sink"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="category">
                      Service Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="Electrical">Electrical</option>
                        <option value="Gas">Gas</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="IT Support">IT Support</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Appliance Repair">Appliance Repair</option>
                        <option value="Gardening">Gardening</option>
                        <option value="Moving Help">Moving Help</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Medical">Medical</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Tailoring">Tailoring</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        {getCategoryIcon(formData.category)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <MapPin size={20} className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 123 Main St, Apartment 4B"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Step 2: Detailed Description */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-blue-800">Step 2: Detailed Description</h2>
                  
                  <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <MessageSquare size={20} className="text-gray-400 mr-2 mt-3" />
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Please provide details about your service request. The more information you provide, the better we can match you with the right professional."
                        required
                      ></textarea>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Step 3: Worker Selection */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-semibold mb-6 text-blue-800">Step 3: Choose a Worker (Optional)</h2>
                  
                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      You can select a specific worker for your service request or leave unselected to let our system match you with an available professional.
                    </p>
                    
                    <WorkerSelection 
                      category={formData.category}
                      onSelect={handleWorkerSelect}
                      selectedWorkerId={formData.workerId}
                    />
                  </div>
                </motion.div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <AnimatedButton
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
                    onClick={prevStep}
                  >
                    Previous
                  </AnimatedButton>
                ) : (
                  <div></div> // Empty div for spacing
                )}
                
                {currentStep < 3 ? (
                  <AnimatedButton
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    onClick={nextStep}
                  >
                    Next
                  </AnimatedButton>
                ) : (
                  <AnimatedButton
                    className={`px-6 py-2 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <Loader2 size={20} className="animate-spin mr-2" />
                        Submitting...
                      </div>
                    ) : (
                      "Submit Request"
                    )}
                  </AnimatedButton>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ServiceRequestForm;
