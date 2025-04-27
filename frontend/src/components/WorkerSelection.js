import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { UserPlus, Star, Phone, Mail, AlertCircle, Loader2, Search, Award, FileCheck } from 'lucide-react';

const WorkerSelection = ({ category, onWorkerSelect, selectedWorkerId }) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!category) return;
    
    const fetchWorkers = async () => {
      setLoading(true);
      setError('');
      setMessage('');
      
      try {
        const token = localStorage.getItem('authToken');
        const response = await axiosInstance.get(`/users/workers/category/${category}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Workers data received:", response.data);
        setWorkers(response.data);
      } catch (err) {
        console.error('Error fetching workers:', err);
        if (err.response && err.response.status === 404) {
          if (err.response.data.message.includes('busy')) {
            setMessage(err.response.data.message);
          } else {
            setMessage('No workers are currently available for this category.');
          }
        } else {
          setError('Failed to load available workers.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkers();
  }, [category]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <Loader2 size={32} className="animate-spin mb-3 text-blue-500" />
        <p>Finding available workers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-red-50 border border-red-100 rounded-lg">
        <AlertCircle className="mx-auto text-red-500 mb-2" size={28} />
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  if (message) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <AlertCircle className="text-yellow-600" size={24} />
          <p className="text-yellow-700 font-medium">{message}</p>
        </div>
        <p className="text-sm text-yellow-600 text-center">
          Your request will be posted for the next available worker to accept.
        </p>
      </div>
    );
  }

  if (workers.length === 0) {
    return (
      <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <Search className="mx-auto text-blue-600 mb-2" size={28} />
        <p className="text-blue-700 font-medium">No workers available for this category.</p>
        <p className="text-sm text-blue-600 mt-2">
          Your request will be posted for any qualified worker to accept.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-900 flex items-center">
          <UserPlus className="mr-2" size={20} />
          Available Workers
        </h3>
        {selectedWorkerId && (
          <button 
            onClick={() => onWorkerSelect(null)}
            className="text-sm text-red-600 hover:text-red-800 flex items-center"
          >
            <AlertCircle size={14} className="mr-1" />
            Clear Selection
          </button>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        Select a worker below or leave unselected to let any qualified worker accept your request.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workers.map((worker) => {
          const isSelected = selectedWorkerId === worker._id;
          const rating = worker.rating || 0;
          
          return (
            <div 
              key={worker._id}
              onClick={() => onWorkerSelect(worker._id)}
              className={`border p-5 rounded-xl cursor-pointer transition-all ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {worker.profilePicture ? (
                    <img 
                      src={`http://localhost:5000${worker.profilePicture}`} 
                      alt={worker.name}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-800 font-bold text-xl">
                      {worker.name.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 text-lg">{worker.name}</h4>
                  
                  <div className="flex items-center mt-1">
                    {rating > 0 ? (
                      <>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              size={14} 
                              className={`${
                                star <= rating 
                                  ? 'text-yellow-500 fill-yellow-500' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm ml-2 font-medium text-gray-700">
                          {rating.toFixed(1)}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-blue-600 flex items-center">
                        <Award size={14} className="mr-1" />
                        New Worker
                      </span>
                    )}
                  </div>
                  
                  {worker.completedJobs > 0 && (
                    <div className="mt-1 text-xs text-green-700 flex items-center">
                      <FileCheck size={12} className="mr-1" />
                      {worker.completedJobs} jobs completed
                    </div>
                  )}
                  
                  <div className="mt-3 space-y-1 text-xs text-gray-600">
                    {worker.phoneNumber && (
                      <div className="flex items-center gap-1">
                        <Phone size={12} className="text-gray-500" />
                        <span>{worker.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Mail size={12} className="text-gray-500" />
                      <span>{worker.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-blue-200 text-center">
                  <span className="text-sm font-medium text-blue-700">Worker Selected</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkerSelection; 