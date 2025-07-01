
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PostProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !price || !category) {
      return alert("Please fill in all fields.");
    }

    try {
      const response = await axios.post(
        "http://localhost:7000/api/v1/users/sell", 
        { title, description, price, category },
        { withCredentials: true } 
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage(error.response?.data?.message || "Error uploading product.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Post a New Product</h2>
      {message && (
        <div className="mb-4 text-sm text-blue-600">{message}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full px-4 py-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full px-4 py-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          className="w-full px-4 py-2 border rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          className="w-full px-4 py-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Upload Product
        </button>
      </form>
    </div>
  );
}

export default PostProduct;
