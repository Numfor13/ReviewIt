import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import type { Vendor } from "../types/vendor";
import logo from "../assets/icons/logo.png"

const VendorProfile: React.FC = () => {
  const { phoneNumber } = useParams<{ phoneNumber: string }>();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const calculatedAverage = useMemo(() => {
  if (!vendor || vendor.reviews.length === 0) return 0;

  const total = vendor.reviews.reduce((sum, r) => sum + r.rating, 0);
  return Number((total / vendor.reviews.length).toFixed(1));
  }, [vendor]);

  useEffect(() => {

     const fetchVendor = async () => {
    setLoading(true);
    setError(""); // reset error before fetching

    try {
      // Simulate API delay
      await new Promise((res) => setTimeout(res, 1000));

      // Simulate success/failure
      const success = true; // change to false to test error
      if (!success) throw new Error("Vendor not found");

    const mockVendor: Vendor = {
      id: "1",
      name: "Numfor's Surprises",
      phoneNumber: phoneNumber || "",
      category: "Services",
      averageRating: 4.2,
      reviews: [
        {
          id: "r1",
          rating: 5,
          comment: "Very reliable!",
          createdAt: "2026-02-16",
        },
        {
          id: "r2",
          rating: 3,
          comment: "Delivery was late but packaging was good.",
          createdAt: "2026-02-14",
        },
      ],
    };

   setVendor(mockVendor);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setVendor(null); // ensure vendor is null on error
    } finally {
      setLoading(false);
    }
  };

  fetchVendor();
  }, [phoneNumber]);

  const sortedReviews = useMemo(() => {
    if (!vendor) return [];

    const reviewsCopy = [...vendor.reviews];

    if (sortOption === "highest") {
      return reviewsCopy.sort((a, b) => b.rating - a.rating);
    }
    if (sortOption === "lowest") {
      return reviewsCopy.sort((a, b) => a.rating - b.rating);
    }

    return reviewsCopy.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }, [vendor, sortOption]);

  const handleAddReview = () => {
    if (!selectedRating || !comment.trim() || !vendor) return;

    const newReview = {
      id: Date.now().toString(),
      rating: selectedRating,
      comment,
      createdAt: new Date().toISOString(),
    };

    setVendor({
      ...vendor,
      reviews: [newReview, ...vendor.reviews],
    });

    setSelectedRating(0);
    setComment("");
  };

  if (loading)
    return <div className="text-center mt-20">Loading...</div>;

  if (error)
    return <div className="text-center text-red-500 mt-20">{error}</div>;

  if (!vendor)
    return <div className="text-center mt-20">Business not found.</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-green-100 relative overflow-hidden">

      {/* Decorative background depth */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-green-200 opacity-30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-300 opacity-20 rounded-full blur-3xl" />

{/* HERO SECTION */}
<div className="relative h-64 bg-linear-to-br from-green-900 via-green-800 to-green-700 overflow-hidden">

  {/* Decorative glow accents */}
  <div className="absolute -top-16 -right-16 w-52 h-52 bg-green-400 opacity-20 rounded-full blur-3xl" />
  <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500 opacity-20 rounded-full blur-2xl" />

  {/* TOP BAR */}
  <div className="absolute top-0 left-0 w-full px-6 py-4 flex justify-between items-center z-20">

    {/* LEFT SIDE */}
    <div className="flex items-center gap-4">
      <button
        onClick={() => navigate(-1)}
        className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition"
      >
        <ArrowLeft size={18} />
      </button>

      <div className="text-white">
        <p className="text-sm opacity-80">Vendor Profile</p>
        <p className="font-semibold text-lg">{vendor.name}</p>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-4">

      {/* Platform trust label */}
      <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white border border-white/20">
        Trusted Reviews Platform
      </div>

      {/* Logo */}
      {/* <div className="bg-white/15 backdrop-blur-md p-2 rounded-xl border border-white/20"> */}
        <img
          src={logo} 
          alt="ReviewIt Logo"
          className="h-6 object-contain"
        />
      {/* </div> */}
    </div>
  </div>

  {/* CENTER BRAND MESSAGE */}
  <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
    <h2 className="text-white text-2xl font-bold tracking-wide">
      Honest Reviews. Real Experiences.
    </h2>
    <p className="text-green-200 text-sm mt-2">
      Powered by ReviewIt
    </p>
  </div>
</div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 -mt-1 pb-16 max-w-md mx-auto relative z-10 space-y-8"
      >

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 pt-16 text-center relative">

          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 rounded-full bg-green-800 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-white">
              {vendor.name.charAt(0)}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-green-900">
            {vendor.name}
          </h1>

          <p className="text-gray-500 mt-1">
            {vendor.category}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-900 px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
            <Star className="text-yellow-500 fill-yellow-500" size={16} />
           {calculatedAverage} / 5
          </div>
        </div>

        {/* ADD REVIEW */}
        <div className="bg-white/70 backdrop-blur-xl shadow-lg rounded-2xl p-5 border border-green-100">

          <h3 className="font-semibold text-green-900 mb-4">
            Leave a Review
          </h3>

          <div className="flex gap-1 mb-4 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={26}
                className={`cursor-pointer transition ${
                  (hoverRating || selectedRating) >= star
                    ? "text-yellow-500 fill-yellow-500 scale-110"
                    : "text-gray-300"
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setSelectedRating(star)}
              />
            ))}
          </div>

          <textarea
            placeholder="Share your experience..."
            className="w-full border border-green-100 focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none rounded-xl p-3 text-sm resize-none transition"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            onClick={handleAddReview}
            className="w-full mt-4 bg-linear-to-r from-green-800 to-green-700 text-white py-2.5 rounded-xl hover:scale-[1.02] hover:shadow-lg transition duration-200"
          >
            Submit Review
          </button>
        </div>

        {/* REVIEWS SECTION */}
        <div className="bg-white/60 backdrop-blur-lg p-5 rounded-2xl shadow-lg border border-green-100">

          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-green-900">
              Reviews ({vendor.reviews.length})
            </h3>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-green-200 rounded-xl text-sm px-3 py-1.5 focus:ring-2 focus:ring-green-200 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest</option>
              <option value="lowest">Lowest</option>
            </select>
          </div>

          <div className="space-y-4">
            {sortedReviews.map((review) => (
              <motion.div
                key={review.id}
                whileHover={{ y: -3 }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-green-50 transition"
              >
                <div className="flex gap-1 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-700">
                  {review.comment}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default VendorProfile;