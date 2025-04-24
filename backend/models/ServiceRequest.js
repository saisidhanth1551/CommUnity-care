// backend/models/ServiceRequest.js
import mongoose from 'mongoose';

const serviceRequestSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'Accepted', 'Completed', 'Rejected'],
      default: 'Pending',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Assuming 'User' is your user model
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isWorkerConfirmed: {
      type: Boolean,
      default: false,
    },
    rejectionMessage: {
      type: String,
      default: null,
    },
    // Worker rating fields
    workerRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    workerFeedback: {
      type: String,
      default: null,
    },
    isRated: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true, // Will create createdAt and updatedAt fields
  }
);

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;
