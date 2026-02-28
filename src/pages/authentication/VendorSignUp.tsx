// src/pages/VendorSignUp.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { InputAuth } from "../../assets/components/UI/Input";
import { ButtonAuth } from "../../assets/components/UI/Button";
import ErrorState from "../../assets/components/UI/ErrorState";
import { validateCameroonPhone, validatePassword } from "../../utils/validators";
import { vendorSignup } from "../../services/vendorService";

const VendorSignUp: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    businessName: "",
    category: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.businessName ||
      !form.category ||
      !form.phoneNumber ||
      !form.password ||
      !form.confirmPassword
    ) {
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

    await vendorSignup({
      businessName: form.businessName,
      category: form.category,
      phoneNumber: form.phoneNumber,
      password: form.password,
    });

    navigate("/vendor/login");
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
          Vendor Sign Up
        </h2>

        <p className="text-gray-600 text-sm text-center mb-6">
          Grow smarter with real feedback
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputAuth
            placeholder="Business Name"
            value={form.businessName}
            onChange={(e) =>
              setForm({ ...form, businessName: e.target.value })
            }
          />

          <InputAuth
            placeholder="Business Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <InputAuth
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

          {error && <ErrorState message={error} />}

          <ButtonAuth type="submit">
            Sign Up
          </ButtonAuth>
        </form>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/vendor/login")}
            className="text-green-800 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default VendorSignUp;