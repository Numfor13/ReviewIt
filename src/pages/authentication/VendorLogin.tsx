import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { validateCameroonPhone, validatePassword } from "../../utils/validators";
import { InputAuth } from "../../assets/components/UI/Input";
import { ButtonAuth } from "../../assets/components/UI/Button";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";



const VendorLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
   

    if (!validateCameroonPhone(phoneNumber)) {
      setError("Invalid Cameroonian phone number.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

       const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("phone_number", phoneNumber)
      .eq("password", password)
      .single();

      if (error || !data) {
        setError("Invalid phone number or password.");
        return;
      }

      login(
        {
          id: data.id,
          name: data.business_name,
          phoneNumber: data.phone_number,
        },
        "vendor"
      );

      navigate(`/vendor/${phoneNumber}`);
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <button
          onClick={() => navigate("/")}
          className="bg-green-800 backdrop-blur-md text-white p-2 rounded-full hover:bg-green-950 transition ml-4 mt-3"
        >
          <ArrowLeft size={18} />
        </button>
    <div className="min-h-screen bg-linear-to-br from-green-100 via-white to-green-200 flex items-center justify-center px-4">

      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8"
      >

        <h2 className="text-2xl font-bold text-green-900 mb-2 text-center">
          Vendor Login
        </h2>

        <p className="text-gray-600 text-sm text-center mb-6">
          Welcome back! Log in to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>
          )}

          <InputAuth
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            
          />

          {/* Password Field with Toggle */}
          <div className="relative">
            <InputAuth
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
             
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500  hover:text-green-800"
              >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <span
              onClick={() => navigate("/vendor/forgot-password")}
              className="text-sm text-green-800 cursor-pointer hover:underline"
            >
              Forgot password?
            </span>
          </div>

          <ButtonAuth 
          type="submit"
          disabled={loading}
          >
          {loading ? "Logging in..." : "Login"}
          </ButtonAuth>
          
        </form>

        <p className="text-sm text-center mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/vendor/signup")}
            className="text-green-800 font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>

        <p className="text-sm text-center mt-1">
          Login as Reviewer?{" "}
          <span
            onClick={() => navigate("/reviewer/login")}
            className="text-green-800 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
    </>
  );
};

export default VendorLogin;