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
  { id: "1", name: "Clau's Wigs", category: "Fashion", rating: 4.6, phoneNumber: "677123456" },
  { id: "2", name: "Blink's Electronics", category: "Electronics", rating: 4.3, phoneNumber: "671234567" },
  { id: "3", name: "Hope's Cosmetics", category: "Cosmetics", rating: 4.8, phoneNumber: "699123456" },
  { id: "4", name: "Elite Tutors", category: "Education", rating: 4.5, phoneNumber: "680123456" },
  { id: "5", name: "Random Business", category: "Unknown", rating: 3.9, phoneNumber: "655123456" },
  { id: "6", name: "Dynasty clothing", category: "Fashion", rating: 4.8, phoneNumber: "677123406" },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [activeCategory, setActiveCategory] = React.useState("Electronics");

  React.useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
        }
      });
    },
    { threshold: 0.6 }
  );

  Object.values(sectionRefs.current).forEach((section) => {
    if (section) observer.observe(section);
  });

  return () => observer.disconnect();
}, []);

  const scrollToCategory = (category: string) => {
  const element = sectionRefs.current[category];
  if (!element) return;

  const yOffset = -140;
  const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
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
      <div className="sticky top-20 bg-white shadow-md z-40 py-3 px-4 md:px-6 flex overflow-x-auto space-x-3 scrollbar-hide snap-x snap-mandatory">

        <input
          placeholder="Search businesses..."
          className="w-full p-3 mb-6 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95}}
            onClick={() => scrollToCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 text-sm md:text-base rounded-full font-medium transition snap-start
            ${
              activeCategory === cat
                ? "bg-green-600 text-white shadow"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}>
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Category Sections */}
      <div className="px-4 md:px-6 py-10 space-y-16 max-w-7xl mx-auto">
        {categories.map((cat) => (
          <div
            id={cat}
            key={cat}
            ref={(el) => {sectionRefs.current[cat] = el}}
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
                        <h3 className="font-semibold text-lg text-green-900">
                          {biz.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {biz.category}
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
    </div>
  );
};

export default Dashboard;