
import { MoreVertical, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {motion} from "framer-motion"
import logo from "../../icons/logo.png"
import { useAuth } from "../../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showMenu1, setShowMenu1] = useState(false);
  const { user, logout } = useAuth();


  return (
    <header className="flex justify-between items-center px-3 md:px-6 py-3 bg-white shadow-sm sticky top-0 z-50">

  {/* Logo */}
  <motion.img
    src={logo}
    alt="ReviewIt Logo"
    onClick={() => navigate("/")}
    whileTap={{ scale: 0.95 }}
    className="h-10 md:h-20 cursor-pointer"
  />

  <div className="flex items-center space-x-2 md:space-x-4 relative">

    {/* Open Chat - ALWAYS visible */}
    <button
      onClick={() => navigate("/vendor/signup")}
      className="bg-green-800 text-white text-xs md:text-sm px-2 md:px-3 py-1.5 rounded-lg hover:bg-green-900 transition"
    >
      Create Business
    </button>

    {/* User or Sign Up - ALWAYS visible */}
    {user ? (
      <div className="relative">
        <User
          className="cursor-pointer text-green-800"
          size={24}
          onClick={() => setShowMenu(!showMenu)}
        />

        {showMenu && (
          <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg p-2">
            <p className="px-3 py-2 text-sm font-semibold">
              {user.name}
            </p>

            <button
              onClick={() => navigate("/")}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
            >
              Home
            </button>

            <button
              onClick={() => {
                logout();
                setShowMenu(false);
                navigate("/", { replace: true });
              }}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    ) : (
      <button
        onClick={() => navigate("/reviewer/login")}
        className="bg-green-800 text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg hover:bg-green-900 transition"
      >
        Log in
      </button>
    )}

    {/* Secondary Menu */}
    <div className="relative">
      <MoreVertical
        className="cursor-pointer"
        size={22}
        onClick={() => setShowMenu1(!showMenu1)}
      />

      {showMenu1 && (
        <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg p-2">
          <button
            onClick={() => navigate("/about")}
            className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
          >
             About
          </button>
        </div>
      )}
    </div>
  </div>
</header>
  );
};

export default Header;
