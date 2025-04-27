// src/pages/Profile.js
import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from '../api/axiosInstance';
import { toast, Toaster } from "react-hot-toast";
import { User, Upload, Mail, Phone, Save, Edit, X, Briefcase } from "lucide-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    categories: [],
    roles: []
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removingPhoto, setRemovingPhoto] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Available service categories
  const availableCategories = [
    "Electrical", "Gas", "Medical", "Hospitality", "Plumbing", 
    "Cleaning", "IT Support", "Carpentry", "Appliance Repair", 
    "Gardening", "Moving Help", "Groceries", "Other"
  ];

  // Get token from localStorage
  const token = localStorage.getItem("authToken");

  // Use useCallback to memoize the fetchProfile function
  const fetchProfile = useCallback(async () => {
    if (!token) {
      setError("You need to be logged in to access your profile.");
      setLoading(false);
      return;
    }

    try {
      const res = await axiosInstance.get("/auth/user");
      setUser(res.data);
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        phoneNumber: res.data.phoneNumber || "",
        categories: res.data.categories || [],
        roles: res.data.roles || ["customer"]
      });
    } catch (err) {
      setError("There was an error fetching your profile.");
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCategoryChange = (category) => {
    if (formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: formData.categories.filter(cat => cat !== category)
      });
    } else {
      setFormData({
        ...formData,
        categories: [...formData.categories, category]
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      setRemovingPhoto(true);
      
      // Call API to remove profile picture
      const response = await axiosInstance.post("/auth/remove-profile-image");
      
      // Update the user state
      if (response.data && response.data.user) {
        setUser(response.data.user);
        // Reset image preview
        setImagePreview(null);
        setProfileImage(null);
      }
      
      toast.success("Profile picture removed successfully");
    } catch (err) {
      console.error("Remove profile picture error:", err);
      toast.error("Failed to remove profile picture");
    } finally {
      setRemovingPhoto(false);
    }
  };

  const handleRoleToggle = (role) => {
    let newRoles = [...formData.roles];
    
    // Check if the role is already in the array
    if (newRoles.includes(role)) {
      // Don't allow removing the last role
      if (newRoles.length > 1) {
        newRoles = newRoles.filter(r => r !== role);
      }
    } else {
      newRoles.push(role);
    }
    
    setFormData({
      ...formData,
      roles: newRoles
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate that at least one role is selected
      if (!formData.roles || formData.roles.length === 0) {
        toast.error("You must select at least one role");
        setLoading(false);
        return;
      }
      
      // If worker role is selected but no categories, show warning
      if (formData.roles.includes('worker') && (!formData.categories || formData.categories.length === 0)) {
        toast.warning("You should select at least one service category as a worker");
      }
      
      // Update profile information
      const response = await axiosInstance.put("/auth/user", formData);
      
      // Handle profile image upload if a new image is selected
      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append('profileImage', profileImage);
        
        // Note: This endpoint needs to be implemented on the backend
        await axiosInstance.post("/auth/upload-profile-image", imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Update the user state with the response
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(response.data); // Fallback for older API format
      }
      
      // Show success message from response or default
      const successMessage = response.data.message || "Profile updated successfully";
      toast.success(successMessage);
      
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
      const errorMessage = err.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
      
      // If there's a specific validation error about roles, highlight it
      if (errorMessage.includes('role')) {
        toast.error("Please check your role selection", { duration: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        setIsDeleting(true);
        await axiosInstance.delete('/auth/user');
        
        // Clear local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        
        toast.success('Your account has been deleted successfully');
        
        // Redirect to login page
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (err) {
        console.error("Delete account error:", err);
        toast.error(err.response?.data?.message || "Failed to delete account");
        setIsDeleting(false);
      }
    }
  };

  if (loading && !user) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-10 text-lg">Loading profile...</div>
      </>
    );
  }

  if (error && !user) {
    return (
      <>
        <Navbar />
        <div className="text-center mt-10 text-lg text-red-500">{error}</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      <section className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
            Your Profile
          </h1>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Edit size={18} />
                  Edit Profile
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name || "",
                      email: user.email || "",
                      phoneNumber: user.phoneNumber || "",
                      categories: user.categories || [],
                      roles: user.roles || ["customer"]
                    });
                    setImagePreview(null);
                    setProfileImage(null);
                  }}
                  className="flex items-center gap-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  <X size={18} />
                  Cancel
                </button>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-blue-100">
                  {user.profilePicture || imagePreview ? (
                    <img 
                      src={imagePreview || (user.profilePicture ? `http://localhost:5000${user.profilePicture}` : '')} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <User size={64} className="text-blue-500" />
                    </div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="mb-4 w-full space-y-2">
                    <label htmlFor="profileImage" className="cursor-pointer flex items-center justify-center gap-2 bg-blue-50 text-blue-700 p-2 rounded-lg hover:bg-blue-100 transition">
                      <Upload size={16} />
                      Upload Photo
                    </label>
                    <input 
                      type="file" 
                      id="profileImage" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                      className="hidden"
                    />
                    
                    {(user.profilePicture || imagePreview) && (
                      <button
                        type="button"
                        onClick={handleRemoveProfilePicture}
                        disabled={removingPhoto}
                        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-700 p-2 rounded-lg hover:bg-red-100 transition"
                      >
                        <X size={16} />
                        {removingPhoto ? "Removing..." : "Remove Photo"}
                      </button>
                    )}
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-blue-600">
                    {user.roles && user.roles.map(role => 
                      role.charAt(0).toUpperCase() + role.slice(1)
                    ).join(', ')}
                  </p>
                  {user.rating > 0 && (
                    <div className="flex items-center justify-center mt-2">
                      <div className="bg-yellow-50 px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="text-yellow-600">★</span>
                        <span className="font-medium text-yellow-700">{user.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Profile Details */}
              <div className="flex-1">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Roles
                      </label>
                      <div className="flex space-x-3">
                        <button
                          type="button"
                          onClick={() => handleRoleToggle('customer')}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            formData.roles.includes('customer')
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <User size={18} />
                          Customer
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRoleToggle('worker')}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            formData.roles.includes('worker')
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Briefcase size={18} />
                          Worker
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {formData.roles.includes('worker') ? 
                          "As a worker, you'll be able to accept service requests in your selected categories." : 
                          "Switch to worker role to offer services to the community."}
                      </p>
                    </div>
                    
                    {/* Only show categories selection if worker role is selected */}
                    {formData.roles.includes('worker') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Categories
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {availableCategories.map(category => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => handleCategoryChange(category)}
                              className={`px-3 py-1 rounded-full text-sm ${
                                formData.categories.includes(category)
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        {loading ? 'Updating...' : (
                          <>
                            <Save size={18} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500">Full Name</h4>
                        <p className="text-gray-800 font-medium">{user.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Mail size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500">Email Address</h4>
                        <p className="text-gray-800 font-medium">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Phone size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500">Phone Number</h4>
                        <p className="text-gray-800 font-medium">{user.phoneNumber || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Briefcase size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500">Roles</h4>
                        <div className="flex gap-2 mt-1">
                          {user.roles && user.roles.map(role => (
                            <span
                              key={role}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm capitalize"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {user.roles && user.roles.includes('worker') && user.categories && user.categories.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm text-gray-500 mb-2">Service Categories</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.categories.map(category => (
                            <span
                              key={category}
                              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Delete Account Section */}
          <div className="mt-10 bg-white rounded-2xl shadow-lg p-6 md:p-8 border-t-4 border-red-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Danger Zone</h2>
            <p className="text-gray-600 mb-6">
              Deleting your account is permanent. All your data will be permanently removed, including your profile, requests, and ratings. This action cannot be undone.
            </p>
            
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center gap-2"
            >
              {isDeleting ? (
                <>Loading...</>
              ) : (
                <>Delete Account</>
              )}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
