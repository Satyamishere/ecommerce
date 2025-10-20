import React from 'react'
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const clickevent = () => navigate("/searchforproduct");
  const clickevent1 = () => navigate("/sell");
  const clickevent2 = () => navigate("/displayproduct");
  const handleSendingMessageToBuyer = () => navigate("/displaychats");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-6 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Marketplace Home</h1>

      <button
        onClick={clickevent}
        className="w-64 py-3 px-6 bg-blue-500 text-white rounded-2xl shadow hover:bg-blue-600 transition"
      >
        Search Product
      </button>

      <button
        onClick={clickevent1}
        className="w-64 py-3 px-6 bg-green-500 text-white rounded-2xl shadow hover:bg-green-600 transition"
      >
        Sell Product
      </button>

      <button
        onClick={clickevent2}
        className="w-64 py-3 px-6 bg-indigo-500 text-white rounded-2xl shadow hover:bg-indigo-600 transition"
      >
        Display Products
      </button>

      <button
        onClick={handleSendingMessageToBuyer}
        className="w-64 py-3 px-6 bg-purple-500 text-white rounded-2xl shadow hover:bg-purple-600 transition"
      >
        See Chats
      </button>
    </div>
  );
}

export default Home;
