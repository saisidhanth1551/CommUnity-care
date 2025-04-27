// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout"; // Import Layout component
import Navbar from "../components/Navbar"; // Import Navbar component

const Home = () => {
  return (
    <Layout> {/* Layout handles the global background */}
      <Navbar /> {/* Include Navbar here */}

      {/* Hero Section with Gradient */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <img
          src="/assets/CommUnity-care.jpg"
          alt="CommUnity Care Logo"
          className="w-28 h-28 rounded-full mb-4 shadow-md"
        />
        <h1 className="text-5xl font-bold text-blue-900 mb-4">CommUnity Care</h1>
        <p className="text-xl text-gray-700 max-w-xl mb-6">
          <span className="font-medium text-blue-800">
            Connecting Needs. Empowering Communities.
          </span>
        </p>
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white border border-blue-900 text-blue-900 px-6 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            Login
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-5xl mx-auto my-16 px-4 text-center bg-white">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 text-gray-700">
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="font-semibold text-lg mb-2">1. Post Your Request</h3>
            <p>Need help? Submit a service request describing what you need.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="font-semibold text-lg mb-2">2. Connect with Helpers</h3>
            <p>Nearby workers will see your request and can offer support.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="font-semibold text-lg mb-2">3. Get the Job Done</h3>
            <p>Receive the help you need, when you need it. Fast, safe, reliable.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center mb-16 bg-gradient-to-br from-blue-500 to-green-400 py-8">
        <h2 className="text-2xl font-semibold text-white mb-4">Ready to make a difference?</h2>
        <Link
          to="/register"
          className="bg-green-600 text-white px-8 py-3 rounded-full font-medium hover:bg-green-700 transition"
        >
          Join CommUnity Care
        </Link>
      </section>
    </Layout>
  );
};

export default Home;
