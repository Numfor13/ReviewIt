import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { InputAuth } from "../../assets/components/UI/Input";
import { ButtonAuth } from "../../assets/components/UI/Button";
import { validateCameroonPhone, validatePassword } from "../../utils/validators";
import { supabase } from "../../lib/supabaseClient";


const ReviewerSignUp: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:"",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name||!form.phoneNumber || !form.password || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
  
    
   if (!validateCameroonPhone(form.phoneNumber)) {
      setError("Invalid Cameroonian phone number.");
      return;
    }

    if (!validatePassword(form.password)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {

       const { error } = await supabase
      .from("users")
      .insert([
        {
          name: form.name,
          phone_number: form.phoneNumber,
          password: form.password,
        },
      ]);

      if (error) {
        setError(error.message);
        return;
      }

      //  Insert reviewer into users table
      const { error: userError } = await supabase
        .from("users")
        .insert([
          {
            name: form.name,
            phone_number: form.phoneNumber,
          },
        ]);

      if (userError) {
        setError(userError.message);
        return;
      }

      navigate("/reviewer/login");

    } catch (err) {
      setError("Signup failed. Please try again.");
    }   
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-100 via-white to-green-200 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8"
      >
        <h2 className="text-2xl font-bold text-green-900 mb-2 text-center">
          Reviewer Sign Up
        </h2>

        <p className="text-gray-600 text-sm text-center mb-6">
          Join the community and start reviewing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <InputAuth
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <InputAuth
            type="text"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={(e) =>
              setForm({ ...form, phoneNumber: e.target.value })
            }
          />

          <InputAuth
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <InputAuth
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>
          )}

          <ButtonAuth type="submit">
            Sign Up
          </ButtonAuth>
        </form>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/reviewer/login")}
            className="text-green-800 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default ReviewerSignUp;