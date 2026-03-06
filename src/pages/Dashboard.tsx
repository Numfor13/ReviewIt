import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../assets/components/Layout/Header";
import { Search, Star } from "lucide-react";
import { validateCameroonPhone } from "../utils/validators";
import { InputHome } from "../assets/components/UI/Input";
import { ButtonHome } from "../assets/components/UI/Button";

const categories = [
  "Electronics",
  "Fashion",
  "Shoes",
  "Skin Care",
  "Health and Wellness",
  "Cosmetics",
  "Accessories",
  "Education",
  "Finance",
  "Food and Beverages",
  "Hair Suppies",
  "Services",
  "Travel",
  "Arts and Entertainment",
  "Others",
];

const businesses = [
  { id: "1", name: "Clau's Wigs", category: "Fashion", rating: 4.6, phoneNumber: "677123456" },
  { id: "2", name: "Blink's Electronics", category: "Electronics", rating: 4.3, phoneNumber: "671234567" },
  { id: "3", name: "Hope's Cosmetics", category: "Cosmetics", rating: 4.8, phoneNumber: "699123456" },
  { id: "4", name: "Elite Tutors", category: "Education", rating: 4.5, phoneNumber: "680123456" },
  { id: "5", name: "Random Business", category: "Unknown", rating: 3.9, phoneNumber: "655123456" },
  { id: "6", name: "Dynasty Clothing", category: "Fashion", rating: 4.8, phoneNumber: "677123406" },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll to category
  const scrollToCategory = (category: string) => {
    const element = sectionRefs.current[category];
    if (!element) return;

    const yOffset = -140; // Offset for header height
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Group businesses by category
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = businesses.filter((b) => b.category === cat);
    return acc;
  }, {} as Record<string, typeof businesses>);

  grouped["Others"] = businesses.filter((b) => !categories.includes(b.category));

  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();

  const query = searchValue.trim();

  // Detect if user typed only numbers
  const isNumber = /^\d+$/.test(query);

  if (isNumber) {
    // Validate Cameroon phone number
    if (!validateCameroonPhone(query)) {
      setError("Please enter a valid 9-digit Cameroon phone number.");
      return;
    }

    // Check if number exists
    const foundBusiness = businesses.find(
      (biz) => biz.phoneNumber === query
    );

    if (!foundBusiness) {
      setError("Number does not exist.");
      return;
    }

    setError("");
    navigate(`/vendor/${query}`);
    return;
  }

  // Otherwise treat as name search
  const foundBusiness = businesses.find((biz) =>
    biz.name.toLowerCase().includes(query.toLowerCase())
  );

  if (!foundBusiness) {
    setError("Business name does not exist.");
    return;
  }

  setError("");
  navigate(`/vendor/${foundBusiness.phoneNumber}`);
};

  return (
    <div className="min-h-screen bg-green-50">
      <Header /> {/* Sticky header */}

      <main >
        {/* Category Navigation - Sticky below header */}
        <div className="sticky top-16 md:top-[80px] bg-white shadow-md z-20 py-3 px-4 md:px-6 flex overflow-x-auto space-x-3 scrollbar-hide snap-x snap-mandatory">
          

          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToCategory(cat)}
              className="whitespace-nowrap px-4 py-2 text-sm md:text-base rounded-full font-medium transition snap-start bg-green-100 text-green-800 hover:bg-green-200"
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-6 md:mt-8 w-full max-w-xl mx-auto flex shadow-md rounded-xl overflow-hidden bg-white"
        >
          <InputHome
            type="text"
            placeholder="Search business name / phone number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <ButtonHome
            type="submit"
            className="bg-green-800 text-white px-4 md:px-6 py-3 md:py-4 hover:bg-green-900 transition"
          >
            <Search size={20} />
          </ButtonHome>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-2 font-medium">{error}</p>
        )}


        {/* Category Sections */}
        <div className="px-4 md:px-6 py-10 space-y-16 max-w-7xl mx-auto">
          
          {categories.map((cat) => (
            <div
              id={cat}
              key={cat}
              ref={(el) => { sectionRefs.current[cat] = el }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold mb-6 text-green-900"
              >
                {cat}
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {grouped[cat]?.length > 0 ? (
                  grouped[cat].map((biz) => (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      key={biz.id}
                      onClick={() => navigate(`/vendor/${biz.phoneNumber}`)}
                      className="cursor-pointer bg-white rounded-xl p-5 border border-gray-100 hover:border-green-300 shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-green-900">{biz.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{biz.category}</p >

                          <p className="text-sm text-gray-400 mt-0.5">{biz.phoneNumber}

                          </p>
                        </div>

                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                          <Star size={14} className="text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{biz.rating}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400">No businesses available.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;