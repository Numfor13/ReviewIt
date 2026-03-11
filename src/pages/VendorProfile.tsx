import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import type { Vendor } from "../types/vendor";
import logo from "../assets/icons/logo.png";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";


const VendorProfile: React.FC = () => {
  const { phoneNumber } = useParams<{ phoneNumber: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
   
  const { user, role } = useAuth();

  const isLoggedIn = !!user;

  const REVIEWS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  /* FETCH VENDOR */

  useEffect(() => {
    const fetchVendor = async () => {
      setLoading(true);
      setError("");

      try {
        const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("*")
        .eq("phone_number", phoneNumber)
        .single();

      if (vendorError || !vendorData) throw vendorError || new Error("Vendor not found");

      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("*")
        .eq("vendor_id", vendorData.id);

      if (reviewsError) throw reviewsError;

      await supabase.from("vendor_views").insert([
        {
          vendor_id: vendorData.id,
        },
      ]);

      const formattedVendor: Vendor = {
        id: vendorData.id,
        name: vendorData.business_name,
        phoneNumber: vendorData.phone_number,
        category: vendorData.category,
        averageRating: 0,
        profileImage: vendorData.profile_picture || undefined,
        reviews: (reviewsData || []).map((r: any) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.created_at,
        })),
      };

      setVendor(formattedVendor);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
        setVendor(null);
      } finally {
        setLoading(false);
      }

      
    };

    fetchVendor();
  }, [phoneNumber]);

  /* SORT REVIEWS */

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

  /* PAGINATION */

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    return sortedReviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [sortedReviews, currentPage]);

  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);

  /* AVERAGE RATING */

  const calculatedAverage = useMemo(() => {
    if (!vendor || vendor.reviews.length === 0) return 0;

    const total = vendor.reviews.reduce((sum, r) => sum + r.rating, 0);
    return Number((total / vendor.reviews.length).toFixed(1));
  }, [vendor]);

  /* RATING BREAKDOWN */

  const ratingBreakdown = useMemo(() => {
    if (!vendor) return [0, 0, 0, 0, 0];

    const counts = [0, 0, 0, 0, 0];

    vendor.reviews.forEach((r) => {
      counts[r.rating - 1]++;
    });

    return counts;
  }, [vendor]);

  /* ADD REVIEW */

  const handleAddReview = async () => {
    if (!selectedRating || !comment.trim() || !vendor) return;

    const newReview = {
      id: Date.now().toString(),
      rating: selectedRating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setCurrentPage(1);

    const { error } = await supabase.from("reviews").insert([
    {
      vendor_id: vendor.id,
      rating: selectedRating,
      comment: comment,
    },
  ]);

  if (error) {
    console.error(error);
    return;
  }

  setVendor({
    ...vendor,
    reviews: [newReview, ...vendor.reviews],
  });

    setSelectedRating(0);
    setComment("");
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-20">{error}</div>;
  if (!vendor) return <div className="text-center mt-20">Business not found.</div>;

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-green-100 relative overflow-hidden">

      {/* HERO */}

      <div className="relative h-64 bg-linear-to-br from-green-900 via-green-800 to-green-700 overflow-hidden">

        <div className="absolute top-0 left-0 w-full px-6 py-4 flex justify-between items-center z-20">

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

          <img src={logo} alt="ReviewIt Logo" className="h-6 object-contain" />

        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <h2 className="text-white text-2xl font-bold tracking-wide">
            Honest Reviews. Real Experiences.
          </h2>
          <p className="text-green-200 text-sm mt-2">
            Powered by ReviewIt
          </p>
        </div>
      </div>

      {/* MAIN GRID */}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 -mt-8 pb-20 max-w-7xl mx-auto grid md:grid-cols-[420px_1fr] gap-10 relative z-10"
      >

        {/* LEFT COLUMN (STICKY) */}

        <div className="space-y-8 sticky top-24 h-fit">

          {/* PROFILE CARD */}

          <div className="bg-white shadow-lg rounded-2xl p-6 border text-center relative">

            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">

              {vendor.profileImage ? (
                <img
                  src={vendor.profileImage}
                  alt={vendor.name}
                  className="w-24 h-24 rounded-full object-cover shadow-xl ring-4 ring-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-green-800 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-white">
                  {vendor.name.charAt(0)}
                </div>
              )}

              {role === "vendor" && (
                <input
                  type="file"
                  className="mt-2 text-xs"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file || !vendor) return;

                    const filePath = `vendors/${vendor.id}-${Date.now()}`;

                    const { error: uploadError } = await supabase.storage
                      .from("vendor-images")
                      .upload(filePath, file);

                    if (uploadError) {
                      console.error(uploadError);
                      return;
                    }

                    const { data } = supabase.storage
                      .from("vendor-images")
                      .getPublicUrl(filePath);

                    const imageUrl = data.publicUrl;

                    await supabase
                      .from("vendors")
                      .update({ profile_picture: imageUrl })
                      .eq("id", vendor.id);

                    setVendor({ ...vendor, profileImage: imageUrl });
                  }}
                />
              )}

            </div>

            <div className="mt-16">

              {role === "vendor" ? (
                <input
                  value={vendor.name}
                  onChange={(e) =>
                    setVendor({ ...vendor, name: e.target.value })
                  }
                  className="text-2xl font-bold text-green-900 text-center border-b outline-none"
                />
              ) : (
                <h1 className="text-2xl font-bold text-green-900">
                  {vendor.name}
                </h1>
              )}

              {role === "vendor" ? (
                <input
                  value={vendor.category}
                  onChange={(e) =>
                    setVendor({ ...vendor, category: e.target.value })
                  }
                  className="text-gray-500 text-center border-b outline-none"
                />
              ) : (
                <p className="text-gray-500 mt-1">{vendor.category}</p>
              )}

              <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-900 px-4 py-1 rounded-full text-sm font-semibold shadow-sm">
                <Star className="text-yellow-500 fill-yellow-500" size={16} />
                {calculatedAverage} / 5
              </div>

            </div>

          </div>

            {/* WRITE REVIEW */}

          <div className="bg-white shadow-lg rounded-2xl p-6 border">

            {/* REVIEWER VIEW */}

            {role === "reviewer" && (
              <>
                <h3 className="font-semibold text-green-900 mb-4">
                  Leave a Review
                </h3>

                <div className="flex gap-1 mb-4 justify-center">
                  {[1,2,3,4,5].map((star)=>(
                    <Star
                      key={star}
                      size={26}
                      className={`cursor-pointer ${
                        (hoverRating || selectedRating) >= star
                          ? "text-yellow-500 fill-yellow-500"
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
                  className="w-full border rounded-xl p-3 text-sm"
                  value={comment}
                  onChange={(e)=>setComment(e.target.value)}
                />

                <button
                  onClick={handleAddReview}
                  className="w-full mt-4 bg-green-800 text-white py-2.5 rounded-xl"
                >
                  Submit Review
                </button>
              </>
            )}

            {/* NOT LOGGED IN */}

            {!isLoggedIn && (
              <button
                onClick={() =>
                  navigate("/reviewer/login", {
                    state: { from: location.pathname }
                  })
                }
                className="w-full bg-green-800 text-white py-3 rounded-xl hover:bg-green-900 transition"
              >
                Login to Write Review
              </button>
            )}

            {/* VENDOR VIEW */}

            {role === "vendor" && (
              <>
                <h3 className="font-semibold text-green-900 mb-4">
                  Manage Business
                </h3>

                <button
                  onClick={() => navigate(`/vendor/edit/${vendor.phoneNumber}`)}
                  className="w-full bg-green-800 text-white py-3 rounded-xl hover:bg-green-900 transition"
                >
                  Edit Business Profile
                </button>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  Vendors cannot review their own business.
                </p>
              </>
            )}

          </div>

          {/* RATING BREAKDOWN */}

          <div className="bg-white shadow-lg rounded-2xl p-6">

            <h3 className="font-semibold text-green-900 mb-4">
              Rating Breakdown
            </h3>

            {[5,4,3,2,1].map((star) => {

              const count = ratingBreakdown[5 - star];

              const percentage =
                vendor.reviews.length > 0
                  ? (count / vendor.reviews.length) * 100
                  : 0;

              return (
                <div key={star} className="flex items-center gap-3 text-sm mb-2">

                  <span className="w-6 text-gray-600">{star}</span>

                  <Star size={14} className="text-yellow-500 fill-yellow-500" />

                  <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-green-700 h-2"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="text-gray-500 text-xs">{count}</span>

                </div>
              );
            })}

          </div>



        </div>

        {/* RIGHT COLUMN (REVIEWS SCROLL) */}

        <div className="bg-white rounded-2xl shadow-xl p-6 h-[650px] flex flex-col">

          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-green-900">
              Reviews ({vendor.reviews.length})
            </h3>

            <select
              value={sortOption}
              onChange={(e)=>setSortOption(e.target.value)}
              className="border rounded-lg text-sm px-3 py-1"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest</option>
              <option value="lowest">Lowest</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">

            {paginatedReviews.map((review)=>(
              <motion.div
                key={review.id}
                whileHover={{y:-3}}
                className="bg-gray-50 p-4 rounded-xl"
              >

                <div className="flex gap-1 mb-2">
                  {[...Array(review.rating)].map((_,i)=>(
                    <Star
                      key={i}
                      size={16}
                      className="text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-700">{review.comment}</p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>

              </motion.div>
            ))}

          </div>

          <div className="flex justify-center gap-2 mt-4">
            {Array.from({length: totalPages}, (_,i)=>(
              <button
                key={i}
                onClick={()=>setCurrentPage(i+1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i+1
                  ? "bg-green-800 text-white"
                  : "bg-gray-200"
                }`}
              >
                {i+1}
              </button>
            ))}
          </div>

        </div>

      </motion.div>

    </div>
  );
};

export default VendorProfile;