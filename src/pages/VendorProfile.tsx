import type React from "react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Camera } from "lucide-react";
import type { Vendor } from "../types/vendor";
import logo from "../assets/icons/logo.png";

import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { Categories } from "../utils/categories";

const VendorProfile: React.FC = () => {
  const { phoneNumber } = useParams<{ phoneNumber: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { user, role } = useAuth();
  const isLoggedIn = !!user;
  const isReviewer = role === "reviewer";
  const isOwnerVendor = role === "vendor" && user?.id === vendor?.id;

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [description, setDescription] = useState("");

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

        if (vendorError || !vendorData)
          throw vendorError || new Error("Vendor not found");

        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("*")
          .eq("vendor_id", vendorData.id);

        if (reviewsError) throw reviewsError;

        await supabase.from("vendor_views").insert([{ vendor_id: vendorData.id }]);

        const formattedVendor: Vendor = {
          id: vendorData.id,
          name: vendorData.business_name,
          phoneNumber: vendorData.phone_number,
          category: vendorData.category,
          description: vendorData.description || "",
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
        setDescription(vendorData.description || "");
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

    if (sortOption === "highest") return reviewsCopy.sort((a, b) => b.rating - a.rating);
    if (sortOption === "lowest") return reviewsCopy.sort((a, b) => a.rating - b.rating);

    return reviewsCopy.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  /* description */
  const saveDescription = async () => {
  if (!vendor) return;

  const { error } = await supabase
    .from("vendors")
    .update({ description })
    .eq("id", vendor.id);

  if (error) {
    console.error(error);
  }
};

  /* ADD REVIEW */
  const handleAddReview = async () => {
    if (!isReviewer || !selectedRating || !comment.trim() || !vendor) return;

    const newReview = {
      id: Date.now().toString(),
      rating: selectedRating,
      comment,
      createdAt: new Date().toISOString(),
    };

    setCurrentPage(1);

    const { error } = await supabase.from("reviews").insert([
      { vendor_id: vendor.id, rating: selectedRating, comment: comment },
    ]);

    if (error) {
      console.error(error);
      return;
    }

    setVendor({ ...vendor, reviews: [newReview, ...vendor.reviews] });
    setSelectedRating(0);
    setComment("");
    setReviewSubmitted(true);

    setTimeout(() => setReviewSubmitted(false), 2500);
  };
  
   /* UPDATE BUSINESS */

  const saveBusinessChanges = async () => {
    if (!vendor) return;

    const { error } = await supabase
      .from("vendors")
      .update({
        business_name: editName,
        category: editCategory,
      })
      .eq("id", vendor.id);

    if (!error) {
      setVendor({ ...vendor, name: editName, category: editCategory });
      setEditOpen(false);
    }
  };

  /* PROFILE IMAGE UPLOAD */
  const handleImageUpload = async (file: File) => {
  if (!vendor) return;

  try {
    const filePath = `vendors/${vendor.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("Vendor_Images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("Vendor_Images").getPublicUrl(filePath);

    if (!data?.publicUrl) throw new Error("Failed to get public URL");

    const { error: dbError } = await supabase
      .from("vendors")
      .update({ profile_picture: data.publicUrl })
      .eq("id", vendor.id);

    if (dbError) throw dbError;

    setVendor({ ...vendor, profileImage: data.publicUrl });
  } catch (err: any) {
    console.error("Error uploading profile picture:", err.message || err);
  }
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
              onClick={() => navigate("/dashboard")}
              className="bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="text-white">
              <p className="text-sm opacity-80">Vendor Profile</p>
              <p className="font-semibold text-lg">{vendor.name}</p>
            </div>
          </div>

          <img
            src={logo}
            alt="ReviewIt"
            className="h-6 object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-wide">
            Honest Reviews. Real Experiences.
          </h2>
          <p className="text-green-200 text-sm mt-2">Powered by ReviewIt</p>
        </div>
      </div>

      {/* MAIN GRID */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 -mt-8 pb-20 max-w-7xl mx-auto grid md:grid-cols-[420px_1fr] gap-10 relative z-10"
      >
        {/* LEFT COLUMN */}
        <div className="space-y-8 sticky top-24 h-fit">
          {/* PROFILE CARD */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border text-center relative">
            <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                {vendor.profileImage ? (
                  <img
                    src={vendor.profileImage}
                    alt={vendor.name}
                    className="w-full h-full rounded-full object-cover shadow-xl ring-4 ring-white"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-green-800 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-xl ring-4 ring-white">
                    {vendor.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                {isOwnerVendor && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-green-800 p-1 rounded-full text-white shadow-md hover:bg-green-700 transition"
                  >
                    <Camera size={16} />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    handleImageUpload(file);
                  }}
                />
              </div>
            </div>

            <div className="mt-16">
              {isOwnerVendor && (
                <h1 className="text-2xl font-bold text-green-900">{vendor.name}</h1>
              )}

              {isOwnerVendor && (
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

            {isReviewer && (
              <div className="space-y-4">

                <h3 className="font-semibold text-green-900 text-center">
                  Leave a Review
                </h3>

                {/* Stars */}
                <div className="flex justify-center gap-2">
                  {[1,2,3,4,5].map((star)=>(
                    <Star
                      key={star}
                      size={26}
                      className={`cursor-pointer transition ${
                        (hoverRating || selectedRating) >= star
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                      onMouseEnter={()=>setHoverRating(star)}
                      onMouseLeave={()=>setHoverRating(0)}
                      onClick={()=>setSelectedRating(star)}
                    />
                  ))}
                </div>

                {/* Comment */}
                <textarea
                  placeholder="Share your experience..."
                  className="w-full border rounded-xl p-3 text-sm resize-none focus:ring-2 focus:ring-green-400 outline-none"
                  value={comment}
                  onChange={(e)=>setComment(e.target.value)}
                  rows={4}
                />

                {/* Submit */}
                <button
                  onClick={handleAddReview}
                  className="w-full bg-green-800 text-white py-2.5 rounded-xl font-medium hover:bg-green-900 transition"
                >
                  Submit Review
                </button>

                {reviewSubmitted && (
                  <p className="text-green-700 text-sm text-center">
                    Review submitted successfully!
                  </p>
                )}

              </div>
            )}

            {!isLoggedIn && (
              <button
                onClick={() =>
                  navigate("/reviewer/login", { state: { from: location.pathname } })
                }
                className="w-full bg-green-800 text-white py-3 rounded-xl hover:bg-green-900 transition"
              >
                Write a Review
              </button>
            )}

            {isOwnerVendor && (
              <button
                onClick={()=>{
                  setEditName(vendor.name);
                  setEditCategory(vendor.category);
                  setEditOpen(true);
                }}
                className="w-full bg-green-800 text-white py-3 rounded-xl hover:bg-green-900 transition"
              >
                Edit Business Profile
              </button>
            )}

          </div>

          {/* VENDOR DESCRIPTION */}
        <div className="bg-white shadow-lg rounded-2xl p-6">

          <h3 className="font-semibold text-green-900 mb-4">
            About this Business
          </h3>

          {isOwnerVendor ? (
            <>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your business..."
                className="w-full border rounded-xl p-3 text-sm resize-none focus:ring-1 focus:ring-green-400 outline-none"
                rows={4}
              />

              <button
                onClick={saveDescription}
                className="mt-3 bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition"
              >
                Save Description
              </button>
            </>
          ) : (
            <p className="text-gray-600 text-sm leading-relaxed">
              {description || "No business description available."}
            </p>
          )}

        </div>
       </div>

         {/* EDIT MODAL */}

      {editOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-[400px]">

            <h3 className="font-semibold text-lg mb-4">Edit Business</h3>

            <input
              value={editName}
              onChange={(e)=>setEditName(e.target.value)}
              className="w-full border p-2 rounded mb-3"
              placeholder="Business name"
            />

            <select
              value={editCategory}
              onChange={(e)=>setEditCategory(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              {Categories.map((c)=>(
                <option key={c.name}>{c.name}</option>
              ))}
            </select>

            <div className="flex justify-end gap-3">

              <button
                onClick={()=>setEditOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveBusinessChanges}
                className="px-4 py-2 bg-green-800 text-white rounded"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

        {/* RIGHT COLUMN */}
        <div className="bg-white rounded-2xl shadow-xl p-6 h-[650px] flex flex-col">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-green-900">Reviews ({vendor.reviews.length})</h3>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded-lg text-sm px-3 py-1"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest</option>
              <option value="lowest">Lowest</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {paginatedReviews.map((review) => (
              <motion.div key={review.id} whileHover={{ y: -3 }} className="bg-gray-50 p-4 rounded-xl">
                <div className="flex gap-1 mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
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
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? "bg-green-800 text-white" : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorProfile;