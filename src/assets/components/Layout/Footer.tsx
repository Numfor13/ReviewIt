// src/components/layout/Footer.tsx

import { Facebook, Apple } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        <div>
          <h4 className="text-xl font-bold text-green-500">
            ReviewIt
          </h4>
          <p className="mt-3 text-gray-400">
            Empowering communities with trusted reviews.
          </p>
        </div>

        <div>
          <h5 className="font-semibold mb-3">Account</h5>
          <button
            onClick={() => navigate("/reviewer/login")}
            className="block text-gray-400 hover:text-white"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/reviewer/signup")}
            className="block text-gray-400 hover:text-white"
          >
            Sign Up
          </button>
        </div>

        <div>
          <h5 className="font-semibold mb-3">Social</h5>
          <div className="flex space-x-4">
            <Facebook className="cursor-pointer hover:text-green-800" />
            <Apple className="cursor-pointer hover:text-green-800" />
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;