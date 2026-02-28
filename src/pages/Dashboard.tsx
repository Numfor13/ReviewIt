import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../assets/components/Layout/Header";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

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
  { id: "1", name: "Clau's Wigs", category: "Fashion", rating: 4.6, phone: "677123456" },
  { id: "2", name: "Blink's Electronics", category: "Electronics", rating: 4.3, phone: "671234567" },
  { id: "3", name: "Hope's Cosmetics", category: "Cosmetics", rating: 4.8, phone: "699123456" },
  { id: "4", name: "Elite Tutors", category: "Education", rating: 4.5, phone: "680123456" },
  { id: "5", name: "Random Business", category: "Unknown", rating: 3.9, phone: "655123456" },
  { id: "6", name: "Dynasty clothing", category: "Fashion", rating: 4.8, phone: "677123406" },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToCategory = (category: string) => {
    sectionRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = businesses.filter((b) => b.category === cat);
    return acc;
  }, {} as Record<string, typeof businesses>);

  grouped["Others"] = businesses.filter(
    (b) => !categories.includes(b.category)
  );

  return (
    <div className="min-h-screen bg-green-50 overflow-x-hidden">
      <Header />

      {/* Category Navigation */}
      <div className="sticky top-0 bg-white shadow z-10 py-3 px-4 md:px-6 flex overflow-x-auto space-x-3">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.1 }}
            onClick={() => scrollToCategory(cat)}
            className="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-green-100 text-green-800 rounded-full"
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Category Sections */}
      <div className="px-4 md:px-6 py-8 space-y-12 md:space-y-16">
        {categories.map((cat) => (
          <div
            key={cat}
            ref={(el) => {sectionRefs.current[cat] = el}}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-green-900">
              {cat}
            </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">              
                {grouped[cat]?.length > 0 ? (
                grouped[cat].map((biz) => (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    key={biz.id}
                    onClick={() => navigate(`/vendor/${biz.phone}`)}
                    className="cursor-pointer bg-white shadow-md hover:shadow-xl p-4 rounded-xl transition-all"
                  >
                    <p className="font-semibold">{biz.name}</p>
                    <p className="flex items-center text-xs md:text-sm text-gray-600">
                      <Star size={12} className="text-yellow-500 mr-1" />
                      {biz.rating}
                    </p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400">No businesses available.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;