import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./FetchUser";

const Productdisplay = () => {
  const [searchData, setSearchData] = useState({ title: "", category: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReviews, setShowReviews] = useState([]);
  const [giveReview, setGiveReview] = useState(null);
  const [reviewDesc, setReviewDesc] = useState("");
  const [reviewScore, setReviewScore] = useState(0);

  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewFormSubmit = async (productId) => {
    try {
      await axios.get("/api/v1/users/updateProductReview", {
        params: {
          productid: productId,
          description: reviewDesc,
          rating: reviewScore,
        },
      });

      alert("Review submitted");

      setGiveReview(null);
      setReviewDesc("");
      setReviewScore(0);
    } catch (err) {
      console.log(err);
      alert("Failed to submit review");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!searchData.title && !searchData.category) {
      setError("Please enter at least one search term");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "/api/v1/users/searchproduct",
        searchData
      );

      setResults(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (product) => {
    if (!currentUser?._id) {
      alert("Please login to start chat");
      return;
    }

    try {
      await axios.post("/api/v1/users/createchat", {
        productId: product._id,
        buyerId: currentUser._id,
        ownerId: product.ownerId,
      });

      const roomId = `${currentUser._id}_${product.ownerId}_${product._id}`;
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error("Chat creation failed", err);
      alert("Failed to start chat");
    }
  };

  const toggleReviews = (productId) => {
    let updated = showReviews.filter((id) => id !== productId);

    if (updated.length === showReviews.length) {
      updated.push(productId);
    }

    setShowReviews(updated);
  };

  const displayReviews = (product) => {
    if (!showReviews.includes(product._id)) return null;

    if (!Array.isArray(product.reviews) || product.reviews.length === 0) {
      return <p>No reviews yet</p>;
    }

    return (
      <ul>
        {product.reviews.map((review, idx) => {
          const user = product.reviewUsers?.find(
            (u) => u._id.toString() === review.user.toString()
          );

          return (
            <li key={idx} className="mb-2 border-b pb-2">
              <p>User: {user?.username || "Unknown User"}</p>
              <p>Rating: {review.rating}</p>
              <p>Review: {review.review}</p>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="mb-6 flex gap-4 items-center">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={searchData.title}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded w-64 focus:outline-none"
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={searchData.category}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded w-40 focus:outline-none"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-4">
          {results.length === 0 && <p className="text-gray-600">No results</p>}
          {results.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow duration-150 max-w-3xl mx-auto"
            >
              <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>

              <p className="text-indigo-600 font-semibold">Price: ₹{product.price}</p>

              <p className="text-gray-600">Category: {product.categoryDetails?.name || "N/A"}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  onClick={() => handleChat(product)}
                >
                  Chat with Owner
                </button>

                <button
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded hover:bg-gray-200"
                  onClick={() => toggleReviews(product._id)}
                >
                  Show Reviews
                </button>

                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => setGiveReview(product._id)}
                >
                  Give Review
                </button>
              </div>

              <div className="mt-4">{displayReviews(product)}</div>

              {giveReview === product._id && (
                <form
                  className="mt-4 flex flex-col gap-2 max-w-2xl"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleReviewFormSubmit(product._id);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Write review"
                    value={reviewDesc}
                    onChange={(e) => setReviewDesc(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                  />

                  <input
                    type="number"
                    min="1"
                    max="5"
                    placeholder="Rating"
                    value={reviewScore}
                    onChange={(e) => setReviewScore(e.target.value)}
                    className="border px-3 py-2 rounded w-32"
                  />

                  <button type="submit" className="bg-indigo-600 text-white px-3 py-2 rounded w-44">
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Productdisplay;