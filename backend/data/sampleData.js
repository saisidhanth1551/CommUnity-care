import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import ServiceRequest from '../models/ServiceRequest.js';

// Sample users data
const sampleUsers = [
  // Customers
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@gmail.com",
    password: "password123",
    phoneNumber: "9876543210",
    roles: ["customer"],
    profilePicture: null
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    password: "password123",
    phoneNumber: "9876543211",
    roles: ["customer"],
    profilePicture: null
  },
  {
    name: "Arjun Reddy",
    email: "arjun.reddy@gmail.com",
    password: "password123",
    phoneNumber: "9876543215",
    roles: ["customer"],
    profilePicture: null
  },
  // Workers
  {
    name: "Amit Patel",
    email: "amit.patel@gmail.com",
    password: "password123",
    phoneNumber: "9876543212",
    roles: ["worker"],
    categories: ["Electrical", "Plumbing"],
    profilePicture: null,
    rating: 4.8,
    completedJobs: 45
  },
  {
    name: "Sneha Reddy",
    email: "sneha.reddy@gmail.com",
    password: "password123",
    phoneNumber: "9876543213",
    roles: ["worker"],
    categories: ["Cleaning", "Gardening"],
    profilePicture: null,
    rating: 4.9,
    completedJobs: 78
  },
  {
    name: "Vikram Singh",
    email: "vikram.singh@gmail.com",
    password: "password123",
    phoneNumber: "9876543214",
    roles: ["worker"],
    categories: ["Carpentry", "Appliance Repair"],
    profilePicture: null,
    rating: 4.7,
    completedJobs: 32
  },
  {
    name: "Meera Gupta",
    email: "meera.gupta@gmail.com",
    password: "password123",
    phoneNumber: "9876543216",
    roles: ["worker"],
    categories: ["Medical", "Hospitality"],
    profilePicture: null,
    rating: 4.6,
    completedJobs: 28
  },
  {
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    password: "password123",
    phoneNumber: "9876543217",
    roles: ["worker"],
    categories: ["IT Support", "Gas"],
    profilePicture: null,
    rating: 4.5,
    completedJobs: 15
  },
  {
    name: "Lakshmi Devi",
    email: "lakshmi.devi@gmail.com",
    password: "password123",
    phoneNumber: "9876543218",
    roles: ["worker"],
    categories: ["Tailoring", "Moving Help"],
    profilePicture: null,
    rating: 4.4,
    completedJobs: 22
  },
  {
    name: "Kiran Kumar",
    email: "kiran.kumar@gmail.com",
    password: "password123",
    phoneNumber: "9876543219",
    roles: ["worker"],
    categories: ["Groceries", "Other"],
    profilePicture: null,
    rating: 4.3,
    completedJobs: 18
  }
];

// Sample service requests data
const sampleServiceRequests = [
  {
    title: "Fix Electrical Wiring in Kitchen",
    description: "Need urgent repair of electrical wiring in kitchen. Power keeps tripping when using multiple appliances.",
    category: "Electrical",
    location: "Banjara Hills, Hyderabad",
    status: "Pending"
  },
  {
    title: "Deep Cleaning Required",
    description: "Looking for thorough cleaning of 3BHK apartment before moving in. Need cleaning of all rooms, bathrooms, and kitchen.",
    category: "Cleaning",
    location: "Gachibowli, Hyderabad",
    status: "Pending"
  },
  {
    title: "Plumbing Emergency",
    description: "Water leakage from bathroom ceiling. Need immediate attention to fix the plumbing issue.",
    category: "Plumbing",
    location: "Jubilee Hills, Hyderabad",
    status: "Pending"
  },
  {
    title: "Garden Maintenance",
    description: "Regular garden maintenance required for small garden. Need trimming, weeding, and plant care.",
    category: "Gardening",
    location: "Madhapur, Hyderabad",
    status: "Pending"
  },
  {
    title: "Furniture Assembly",
    description: "Need help assembling new furniture including bed, wardrobe, and dining table.",
    category: "Carpentry",
    location: "Hitech City, Hyderabad",
    status: "Pending"
  },
  {
    title: "Medical Equipment Setup",
    description: "Need help setting up medical equipment for home care. Includes oxygen concentrator and monitoring devices.",
    category: "Medical",
    location: "Secunderabad, Hyderabad",
    status: "Pending"
  },
  {
    title: "Hotel Room Service",
    description: "Looking for professional room service staff for a small hotel. Experience in hospitality required.",
    category: "Hospitality",
    location: "Begumpet, Hyderabad",
    status: "Pending"
  },
  {
    title: "Computer Repair",
    description: "Laptop not booting up. Need expert IT support to diagnose and fix the issue.",
    category: "IT Support",
    location: "Kondapur, Hyderabad",
    status: "Pending"
  },
  {
    title: "Gas Stove Installation",
    description: "Need professional installation of new gas stove. Safety check required.",
    category: "Gas",
    location: "Kukatpally, Hyderabad",
    status: "Pending"
  },
  {
    title: "Clothes Alteration",
    description: "Need alterations for wedding clothes. Skilled tailor required for precise measurements.",
    category: "Tailoring",
    location: "Abids, Hyderabad",
    status: "Pending"
  },
  {
    title: "Home Relocation",
    description: "Need help with packing and moving household items to new location. Careful handling required.",
    category: "Moving Help",
    location: "Dilsukhnagar, Hyderabad",
    status: "Pending"
  },
  {
    title: "Grocery Delivery",
    description: "Weekly grocery shopping and delivery required. List will be provided.",
    category: "Groceries",
    location: "Tarnaka, Hyderabad",
    status: "Pending"
  }
];

// Function to seed the database with sample data
export const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await ServiceRequest.deleteMany({});

    // Create users
    const createdUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return User.create({
          ...user,
          password: hashedPassword
        });
      })
    );

    // Create service requests
    const customerUsers = createdUsers.filter(user => user.roles.includes('customer'));
    const workerUsers = createdUsers.filter(user => user.roles.includes('worker'));

    await Promise.all(
      sampleServiceRequests.map(async (request, index) => {
        const customer = customerUsers[index % customerUsers.length];
        
        // For pending requests, don't assign a worker
        if (request.status === 'Pending') {
          return ServiceRequest.create({
            ...request,
            customer: customer._id,
            worker: null,
            isWorkerConfirmed: false
          });
        }
        
        // For other statuses, find a matching worker
        const matchingWorker = workerUsers.find(worker => 
          worker.categories.includes(request.category)
        ) || workerUsers[index % workerUsers.length];

        return ServiceRequest.create({
          ...request,
          customer: customer._id,
          worker: matchingWorker._id,
          isWorkerConfirmed: false
        });
      })
    );

    console.log('Sample data seeded successfully!');
  } catch (error) {
    console.error('Error seeding sample data:', error);
  }
}; 