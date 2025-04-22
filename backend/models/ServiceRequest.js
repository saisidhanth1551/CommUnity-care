// backend/models/ServiceRequest.js
import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the request'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    category: {
      type: String,
      enum: [
        'Electrical',
        'Gas',
        'Medical',
        'Hospitality',
        'Plumbing',
        'Cleaning',
        'IT Support',
        'Carpentry',
        'Appliance Repair',
        'Gardening',
        'Moving Help',
        'Groceries',
        'Other'
      ],
      required: [true, 'Please select a category'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Completed'],
      default: 'Pending',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

export default ServiceRequest; // Export using ES Module syntax
