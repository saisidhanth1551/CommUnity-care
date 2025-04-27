// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout"; // Import Layout component
import Navbar from "../components/Navbar"; // Import Navbar component
import { motion } from "framer-motion";
import { PageTransition, AnimatedCard, AnimatedButton } from "../components/AnimatedComponents";

const Home = () => {
  return (
    <Layout> {/* Layout handles the global background */}
      <Navbar /> {/* Include Navbar here */}
      <PageTransition>
        {/* Hero Section with Gradient */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center">
          <motion.img
            src="/assets/CommUnity-care.jpg"
            alt="CommUnity Care Logo"
            className="w-28 h-28 rounded-full mb-4 shadow-md"
            initial={{ scale: 0, rotateZ: -10 }}
            animate={{ scale: 1, rotateZ: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2
            }}
          />
          <motion.h1 
            className="text-5xl font-bold text-blue-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            CommUnity Care
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-700 max-w-xl mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <span className="font-medium text-blue-800">
              Connecting Needs. Empowering Communities.
            </span>
          </motion.p>
          <motion.div 
            className="space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <AnimatedButton
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
              onClick={() => {}}
            >
              <Link to="/register">Get Started</Link>
            </AnimatedButton>
            <AnimatedButton
              className="bg-white border border-blue-900 text-blue-900 px-6 py-2 rounded-lg hover:bg-blue-50 transition"
              onClick={() => {}}
            >
              <Link to="/login">Login</Link>
            </AnimatedButton>
          </motion.div>
        </section>

        {/* How it Works Section */}
        <section className="max-w-5xl mx-auto my-16 px-4 text-center bg-white">
          <motion.h2 
            className="text-3xl font-bold text-blue-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 text-gray-700">
            <AnimatedCard delay={0.1}>
              <div className="p-6 bg-white rounded-xl shadow h-full">
                <h3 className="font-semibold text-lg mb-2">1. Post Your Request</h3>
                <p>Need help? Submit a service request describing what you need.</p>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.3}>
              <div className="p-6 bg-white rounded-xl shadow h-full">
                <h3 className="font-semibold text-lg mb-2">2. Connect with Helpers</h3>
                <p>Nearby workers will see your request and can offer support.</p>
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.5}>
              <div className="p-6 bg-white rounded-xl shadow h-full">
                <h3 className="font-semibold text-lg mb-2">3. Get the Job Done</h3>
                <p>Receive the help you need, when you need it. Fast, safe, reliable.</p>
              </div>
            </AnimatedCard>
          </div>
        </section>

        {/* Call to Action Section */}
        <motion.section 
          className="text-center mb-16 py-8 overflow-hidden"
          initial={{ background: "linear-gradient(to bottom right, rgb(59, 130, 246), rgb(74, 222, 128))" }}
          whileInView={{ 
            background: "linear-gradient(to bottom right, rgb(37, 99, 235), rgb(16, 185, 129))"
          }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          viewport={{ once: false }}
        >
          <motion.h2 
            className="text-2xl font-semibold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to make a difference?
          </motion.h2>
          <motion.div
            whileInView={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            viewport={{ once: false }}
          >
            <Link
              to="/register"
              className="bg-green-600 text-white px-8 py-3 rounded-full font-medium hover:bg-green-700 transition inline-block"
            >
              Join CommUnity Care
            </Link>
          </motion.div>
        </motion.section>
      </PageTransition>
    </Layout>
  );
};

export default Home;
