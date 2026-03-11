import React from "react";
import { motion } from "framer-motion";
import Header from "../assets/components/Layout/Header";
import Footer from "../assets/components/Layout/Footer";
import { Star, Users, Store, MessageCircle } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">
      
      <Header />

      {/* HERO SECTION */}
      <section className="text-center py-24 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-6"
        >
          What is <span className="text-green-500">ReviewIt?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto text-gray-400 text-lg"
        >
          ReviewIt is a platform that helps people discover trustworthy
          businesses through real customer reviews. It connects customers and
          vendors in one place so people can make smarter decisions before
          buying products or services.
        </motion.p>
      </section>

      {/* FEATURES */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-900 p-8 rounded-2xl shadow-lg text-center"
          >
            <Store className="mx-auto text-green-500 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Discover Businesses</h3>
            <p className="text-gray-400">
              Find local vendors across different categories like electronics,
              fashion, beauty, and more.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-900 p-8 rounded-2xl shadow-lg text-center"
          >
            <Star className="mx-auto text-green-500 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Honest Reviews</h3>
            <p className="text-gray-400">
              Customers can rate businesses and leave feedback so others know
              which vendors are reliable.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-900 p-8 rounded-2xl shadow-lg text-center"
          >
            <Users className="mx-auto text-green-500 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Support Vendors</h3>
            <p className="text-gray-400">
              Vendors can showcase their businesses, gain trust, and grow their
              customer base through positive reviews.
            </p>
          </motion.div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-900 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-12">
            How <span className="text-green-500">ReviewIt</span> Works
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div>
              <MessageCircle className="mx-auto text-green-500 mb-4" size={36} />
              <h4 className="font-semibold mb-2">1. Find a Vendor</h4>
              <p className="text-gray-400">
                Search businesses by category and discover vendors near you.
              </p>
            </div>

            <div>
              <Star className="mx-auto text-green-500 mb-4" size={36} />
              <h4 className="font-semibold mb-2">2. Read Reviews</h4>
              <p className="text-gray-400">
                Check ratings and experiences shared by real customers.
              </p>
            </div>

            <div>
              <Users className="mx-auto text-green-500 mb-4" size={36} />
              <h4 className="font-semibold mb-2">3. Share Your Experience</h4>
              <p className="text-gray-400">
                Leave your own review and help others make better choices.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-6">
          Start Exploring Businesses Today
        </h2>

        <p className="text-gray-400 mb-8">
          Join ReviewIt and help build a community driven by trust and honest
          feedback.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-500 transition"
        >
          Explore Vendors
        </motion.button>
      </section>

      <Footer />
    </div>
  );
};

export default About;