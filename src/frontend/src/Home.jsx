import React from 'react'
import { useNavigate } from "react-router-dom";
import {useState,useEffect} from "react";
import {socket} from "./utility/socket";
import "./Home.css";


function Home() {
  const navigate = useNavigate();
  const [messageCount, setMessageCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const handleCheckingChat = () => {
    let temp = [];
    for (const notification of notifications) {
      temp.push(
        <div key={notification.roomId} className="notification-item mb-2 text-sm text-left text-gray-800">
          <div>{notification.message}</div>
          <button
            className="notification-link"
            onClick={() => {
              const updatedNotification = notifications.filter(n => n.roomId !== notification.roomId);
              setNotifications(updatedNotification);
              navigate(`/chat/${notification.roomId}`);
            }}
          >
            Click to join the chat
          </button>
        </div>
      );
    }

    return temp;
  };
  const handleSearchClick = () => navigate("/searchforproduct");
  const handleSellClick = () => navigate("/sell");
  const handleDisplayClick = () => navigate("/displayproduct");
  const handleSendingMessageToBuyer = () => navigate("/displaychats");
  const getAllProduct = ()=>{
    navigate("/displayallproduct")
  }
  const getUserProfile =()=>{
    navigate("/viewprofile")
  }

  useEffect(() => {

    socket.on("new_notification", (data) => {
        console.log("New notification received:", data);
        setNotifications(prev => [...prev, data]);
        setMessageCount(prev => prev + 1);
    });

    return () => {
        socket.off("new_notification");
    };

}, []);

  return (
    <div className="home-container min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-6 p-6">
      <h1 className="home-title text-3xl font-bold mb-6 text-gray-800">Marketplace Home</h1>

      <button
        onClick={handleSearchClick}
        className="home-btn w-64 py-3 px-6 bg-blue-500 text-white rounded-2xl shadow hover:bg-blue-600 transition"
      >
        Search Product
      </button>

      <button
        onClick={handleSellClick}
        className="home-btn w-64 py-3 px-6 bg-green-500 text-white rounded-2xl shadow hover:bg-green-600 transition"
      >
        Sell Product
      </button>

      <button
        onClick={handleDisplayClick}
        className="home-btn w-64 py-3 px-6 bg-indigo-500 text-white rounded-2xl shadow hover:bg-indigo-600 transition"
      >
        Display Products
      </button>

      <button
        onClick={handleSendingMessageToBuyer}
        className="home-btn w-64 py-3 px-6 bg-purple-500 text-white rounded-2xl shadow hover:bg-purple-600 transition"
      >
        See Chats
      </button>
      <div className="notifications-root">
        <div className="notification-count">notifications: {notifications.length}</div>
        {notifications.length > 0 && (
          <div className="mt-4 p-4 border rounded bg-white shadow notifications-box">
            <h2 className="text-lg font-bold mb-2">Notifications</h2>
            {handleCheckingChat()}
          </div>
        )}
      </div>
      <button className="home-btn secondary px-4 py-2" onClick={getAllProduct}>
        See All Products
      </button>
      <button className="home-btn secondary px-4 py-2" onClick={getUserProfile}>
        View Profile
      </button>
    </div>
  );
}

export default Home;
