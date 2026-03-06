// src/components/layout/Footer.tsx

import { Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h4 className="text-2xl font-bold text-green-500">ReviewIt</h4>

          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            ReviewIt helps customers find trusted businesses through
            real reviews and verified experiences.  
            Our goal is to strengthen trust between vendors and buyers.
          </p>

          <div className="flex space-x-4 mt-5">
            <Facebook
              size={20}
              className="cursor-pointer hover:text-green-500 transition"
            />
            <Instagram
              size={20}
              className="cursor-pointer hover:text-green-500 transition"
            />
            <Twitter
              size={20}
              className="cursor-pointer hover:text-green-500 transition"
            />
          </div>
        </div>

        {/* Explore */}
        <div>
          <h5 className="font-semibold text-white mb-4">Explore</h5>

          <button
            onClick={() => navigate("/")}
            className="block mb-2 hover:text-green-500"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="block mb-2 hover:text-green-500"
          >
            Browse Businesses
          </button>

          <button
            onClick={() => navigate("/reviewer/signup")}
            className="block mb-2 hover:text-green-500"
          >
            Sign up
          </button>

          <button
            onClick={() => navigate("/reviewer/login")}
            className="block hover:text-green-500"
          >
           Log in
          </button>
        </div>

        {/* For Businesses */}
        <div>
          <h5 className="font-semibold text-white mb-4">For Businesses</h5>

          <button
            onClick={() => navigate("/vendor/signup")}
            className="block mb-2 hover:text-green-500"
          >
            Register Your Business
          </button>

          <button
            onClick={() => navigate("/vendor/login")}
            className="block mb-2 hover:text-green-500"
          >
            Vendor Login
          </button>

          <button
            onClick={() => navigate("/vendor/guide")}
            className="block hover:text-green-500"
          >
            Vendor Guide
          </button>
        </div>

        {/* Contact */}
        <div>
          <h5 className="font-semibold text-white mb-4">Contact</h5>

          <div className="flex items-center mb-2">
            <Mail size={16} className="mr-2" />
            <span>support@reviewit.com</span>
          </div>

          <div className="flex items-center mb-2">
            <Phone size={16} className="mr-2" />
            <span>+237 XXX XXX XXX</span>
          </div>

          <p className="text-sm text-gray-400 mt-3">
            Buea, Cameroon
          </p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ReviewIt. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;