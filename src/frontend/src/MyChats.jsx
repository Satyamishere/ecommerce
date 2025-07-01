import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyChats = () => {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")); // logged-in seller

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get(`http://localhost:7000/api/v1/chat/seller/${user._id}`, {
          withCredentials: true
        });
        setChats(data.data || []);
      } catch (err) {
        console.error("Error fetching chats", err);
      }
    };

    fetchChats();
  }, [user._id]);

  const joinChat = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chats with Buyers</h2>
      {chats.length === 0 ? (
        <p>No chats yet</p>
      ) : (
        <ul className="space-y-3">
          {chats.map((chat) => (
            <li key={chat._id} className="border p-3 rounded shadow">
              <p><strong>Buyer:</strong> {chat.buyer?.username}</p>
              <p><strong>Product:</strong> {chat.product?.title}</p>
              <button
                onClick={() => joinChat(chat.roomId)}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
              >
                Open Chat
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyChats;
