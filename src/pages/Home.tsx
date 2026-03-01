import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../assets/components/Layout/Header";
import Footer from "../assets/components/Layout/Footer";
import { InputHome } from "../assets/components/UI/Input";
import { ButtonHome } from "../assets/components/UI/Button";
import { validateCameroonPhone } from "../utils/validators";
import { Search, Star } from "lucide-react";
import { motion } from "framer-motion";

import cosmetics from "../assets/images/cosmetics.jpg";
import accessories from "../assets/images/accessories.jpg";
import education from "../assets/images/education.webp";
import finance from "../assets/images/finance.jpg";
import food from "../assets/images/food.jpg";
import hair from "../assets/images/hair.jpg";
import services from "../assets/images/services.jpg";
import travel from "../assets/images/travel.jpg";
import Arts from "../assets/images/Arts.jpg";
import others from "../assets/images/others.png";
import electronics from "../assets/images/electronics.jpg"
import Clothes from "../assets/images/Clothes.jpg"
import shoes from "../assets/images/shoes.jpeg"
import skin_care from "../assets/images/skin_care.jpg"
import health from "../assets/images/health.png"

// Placeholder data
const categories = [
    {name: "Electronics", img: electronics},
    { name: "Fashion" , img: Clothes },
    {name: "Shoes", img: shoes},
    {name: "Skin Care", img: skin_care},
    {name: "Health and Wellness", img: health},
    {name: "Cosmetics", img: cosmetics},
    {name: "Accessories", img: accessories},
    {name: "Education", img: education},
    {name: "Finance", img: finance},
    {name: "Food and Beverages", img: food},
    {name: "Hair Suppies", img: hair},
    {name: "Services", img: services},
    {name: "Travel", img: travel},
    {name: "Arts and Entertainment", img: Arts},
    {name: "Others", img: others},
  ];

  const popular = [
    {name: "Clau's wigs", rating: 4.6},
    {name: "Blink's electronics", rating: 4.3},
    {name: "Hope's Cosmetics", rating: 4.8},
  ];


const Home: React.FC = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCameroonPhone(phoneNumber)) {
      setError("Please enter a valid 9-digit Cameroon phone number.");
      return;
    }

    setError("");
    navigate(`/vendor/${phoneNumber}`);
  };

  return (
   <div className="min-h-screen bg-linear-to-br from-green-100 via-white to-green-200 overflow-x-hidden">
      <Header />

      {/* HERO */}
      <section className="text-center py-12 md:py-16 px-4 md:px-6">
        <h2 className="text-2xl md:text-4xl font-bold text-green-900">
          Shop Smarter. Trust Better.
        </h2>

        <p className="text-sm md:text-base text-gray-600 mt-3">
          Real reviews. Real experiences. Real vendors.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-6 md:mt-8 w-full max-w-xl mx-auto flex shadow-md rounded-xl overflow-hidden bg-white"
        >
          <InputHome
            type="text"
            placeholder="Search business/phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <ButtonHome
            type="submit"
            className="bg-green-800 text-white px-4 md:px-6 py-3 md:py-4 hover:bg-green-900 transition"
          >
            <Search size={20} />
          </ButtonHome>
        </form>

        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}
      </section>

      {/* CATEGORIES */}
      <section className="px-4 md:px-6 py-8 md:py-10">
        <h3 className="text-xl font-semibold mb-6 text-green-900">
          Browse Categories
        </h3>

        <div className="flex overflow-x-auto space-x-4 md:space-x-6 pb-4 snap-x snap-mandatory">
          {categories.map((cat) => (
            <motion.div
              whileHover={{ scale: 1.08 }}
              key={cat.name}
              className="min-width:100px md:min-width:140px text-center cursor-pointer snap-start"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="h-20 w-20 md:h-24 md:w-24 object-cover rounded-full mx-auto shadow-md"
              />
              <p className="mt-2">{cat.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* POPULAR */}
      <section className="px-4 md:px-6 py-8 md:py-10 bg-white">
        <h3 className="text-xl font-semibold mb-6 text-green-900">
          Popular Searches
        </h3>

        <div className="space-y-4">
          {popular.map((biz) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={biz.name}
              className="p-3 md:p-4 shadow-md rounded-xl flex justify-between items-center"
            >
              <p>{biz.name}</p>
              <p className="flex items-center">
                <Star size={14} className="text-yellow-500 mr-1" />
                {biz.rating}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-green-800 font-semibold hover:underline"
          >
            See More →
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-b py-12 md:py-16 px-4 text-center bg-green-50">
        <h3 className="text-xl md:text-2xl font-bold text-green-900">
          Do you own a business?
        </h3>
        <p className="mt-2 text-gray-600">
          Strengthen vendor-customer trust with reviews.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/vendor/signup")}
          className="mt-6 bg-green-800 text-white px-6 py-3 rounded-lg hover:bg-green-900 transition"
        >
          Get Started
        </motion.button>
      </section>

      <Footer />
    </div>
  );
};

export default Home;