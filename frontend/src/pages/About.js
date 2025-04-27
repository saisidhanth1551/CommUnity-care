import React from 'react';
import Navbar from '../components/Navbar';
import { Users, HandHeart, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { motion } from "framer-motion";
import { PageTransition } from "../components/AnimatedComponents";

const AboutContact = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <PageTransition>
      <Navbar />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h1 
            className="text-4xl font-bold text-center text-blue-900 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to CommUnity Care!
          </motion.h1>
          
          <motion.p 
            className="text-center text-gray-700 mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            At CommUnity Care, we believe in building stronger communities by connecting people who need help with those who can provide it. 
            Whether it's fixing a leaky pipe, offering medical assistance, or helping with hospitality services, 
            our platform bridges the gap between service providers and customers quickly and reliably.
          </motion.p>

          {/* Mission Section */}
          <motion.section 
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center mb-4">
              <motion.div 
                className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4"
                variants={itemVariants}
              >
                <HandHeart size={24} className="text-blue-600" />
              </motion.div>
              <motion.h2 
                className="text-2xl font-semibold text-blue-800"
                variants={itemVariants}
              >
                Our Mission
              </motion.h2>
            </div>
            <motion.p 
              className="text-gray-700 leading-relaxed mb-4"
              variants={itemVariants}
            >
              Our mission is simple:
            </motion.p>
            <motion.ul 
              className="space-y-2 text-gray-700 mb-4"
              variants={itemVariants}
            >
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">👉</span>
                <span>Empower local workers by providing them with job opportunities.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">👉</span>
                <span>Support customers by making it easy to find trusted help in their neighborhood.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">👉</span>
                <span>Foster a sense of community through collaboration and care.</span>
              </li>
            </motion.ul>
          </motion.section>

          {/* What We Offer Section */}
          <motion.section 
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center mb-4">
              <motion.div 
                className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4"
                variants={itemVariants}
              >
                <CheckCircle size={24} className="text-blue-600" />
              </motion.div>
              <motion.h2 
                className="text-2xl font-semibold text-blue-800"
                variants={itemVariants}
              >
                What We Offer
              </motion.h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <motion.div 
                className="p-4 border border-blue-100 rounded-lg"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h3 className="font-semibold text-blue-700 mb-2">Easy Service Requests</h3>
                <p className="text-gray-600">Post your needs and get quick responses.</p>
              </motion.div>
              
              <motion.div 
                className="p-4 border border-blue-100 rounded-lg"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h3 className="font-semibold text-blue-700 mb-2">Verified Workers</h3>
                <p className="text-gray-600">Connect with skilled and dependable local professionals.</p>
              </motion.div>
              
              <motion.div 
                className="p-4 border border-blue-100 rounded-lg"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h3 className="font-semibold text-blue-700 mb-2">Real-Time Updates</h3>
                <p className="text-gray-600">Track your service requests and stay informed.</p>
              </motion.div>
              
              <motion.div 
                className="p-4 border border-blue-100 rounded-lg"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h3 className="font-semibold text-blue-700 mb-2">Secure Platform</h3>
                <p className="text-gray-600">Your safety and privacy are our top priorities.</p>
              </motion.div>
            </div>
          </motion.section>

          {/* Why Choose Us Section */}
          <motion.section 
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center mb-4">
              <motion.div 
                className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4"
                variants={itemVariants}
              >
                <Users size={24} className="text-blue-600" />
              </motion.div>
              <motion.h2 
                className="text-2xl font-semibold text-blue-800"
                variants={itemVariants}
              >
                Why Choose Us?
              </motion.h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-4">
                <span className="text-2xl mb-2 block">✨</span>
                <p className="font-medium text-gray-700">Fast connections</p>
              </div>
              <div className="text-center p-4">
                <span className="text-2xl mb-2 block">✨</span>
                <p className="font-medium text-gray-700">Reliable workers</p>
              </div>
              <div className="text-center p-4">
                <span className="text-2xl mb-2 block">✨</span>
                <p className="font-medium text-gray-700">Simple and user-friendly experience</p>
              </div>
              <div className="text-center p-4">
                <span className="text-2xl mb-2 block">✨</span>
                <p className="font-medium text-gray-700">Community-focused approach</p>
              </div>
            </div>
            
            <motion.p 
              className="text-center text-gray-700 mt-6"
              variants={itemVariants}
            >
              Thank you for being part of our growing community. Together, we care. Together, we grow. 🌱
            </motion.p>
          </motion.section>

          {/* Contact Us Section */}
          <motion.section 
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-center text-blue-900 mb-6"
              variants={itemVariants}
            >
              Contact Us
            </motion.h2>
            <motion.p 
              className="text-center text-gray-600 mb-8"
              variants={itemVariants}
            >
              Have questions or need assistance? We're here to help. Feel free to reach out using the information below.
            </motion.p>

            <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-10">
              {/* Phone */}
              <motion.div 
                className="flex items-start"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <Phone size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Phone</h3>
                  <p className="text-gray-600 mt-1">
                    <a href="tel:+9100000000000" className="hover:text-blue-600 transition">
                      +91 0000 0000 00
                    </a>
                  </p>
                </div>
              </motion.div>
              
              {/* Email */}
              <motion.div 
                className="flex items-start"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Email</h3>
                  <p className="text-gray-600 mt-1">
                    <a href="mailto:community@care.org" className="hover:text-blue-600 transition">
                      community@care.org
                    </a>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section 
            className="bg-white rounded-2xl shadow-lg p-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center mb-6">
              <motion.div 
                className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4"
                variants={itemVariants}
              >
                <MessageSquare size={20} className="text-blue-600" />
              </motion.div>
              <motion.h2 
                className="text-2xl font-semibold text-blue-800"
                variants={itemVariants}
              >
                Frequently Asked Questions
              </motion.h2>
            </div>
            
            <motion.div 
              className="space-y-6"
              variants={itemVariants}
            >
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">How do I sign up as a volunteer?</h3>
                <p className="text-gray-600">
                  To sign up as a volunteer, create an account and select the "Worker" role during registration. 
                  You can then select the categories of services you'd like to provide in your profile.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">How are service providers vetted?</h3>
                <p className="text-gray-600">
                  All service providers undergo a verification process that includes identity verification, 
                  background checks, and skill verification where applicable. We also have a rating system 
                  that helps maintain quality.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">What happens if I'm not satisfied with a service?</h3>
                <p className="text-gray-600">
                  If you're not satisfied with a service, please contact us immediately. We take all feedback seriously 
                  and work to resolve any issues. You can also leave a rating and review after service completion.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Is CommUnity Care available in my area?</h3>
                <p className="text-gray-600">
                  CommUnity Care is currently available in select cities across India. We're continuously expanding 
                  our service areas. Contact us to check availability in your specific location.
                </p>
              </div>
            </motion.div>
          </motion.section>
        </div>
      </main>
    </PageTransition>
  );
};

export default AboutContact; 