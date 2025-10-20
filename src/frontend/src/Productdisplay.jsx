import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Productdisplay = () => {
  const [searchData, setSearchData] = useState({ title: "", category: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
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
        "http://localhost:7000/api/v1/users/searchproduct",
        searchData,
        { withCredentials: true }
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
      const res = await axios.post(
        "http://localhost:7000/api/v1/users/createchat", 
        {
          productId: product._id,
          buyerId: currentUser._id,
          ownerId: product.ownerId,
        },
        { withCredentials: true }
      );

      const roomId = `${currentUser._id}_${product.ownerId}_${product._id}`;
      navigate(`/chat/${roomId}`);
    } catch (err) {
      console.error("Chat creation failed", err);
      alert("Failed to start chat");
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="mb-4 flex gap-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={searchData.title}
          onChange={handleInputChange}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={searchData.category}
          onChange={handleInputChange}
          className="border px-2 py-1 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4">
        {results.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{product.title}</h3>
            <p>Price: ₹{product.price}</p>
            <p>Category: {product.categoryDetails?.name || "N/A"}</p>
            <button
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
              onClick={() => handleChat(product)}
            >
              Chat with Owner
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productdisplay;
