import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import {socket} from "./utility/socket";
import "./Home.css";


function Home() {
  const navigate = useNavigate();
  const [messageCount, setMessageCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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
  const handleSellClick = () => navigate("/sell");
  const handleDisplayClick = () => navigate("/displayproduct");
  const handleSendingMessageToBuyer = () => navigate("/displaychats");
  const getAllProduct = ()=>{
    navigate("/displayallproduct")
  }
  const getUserProfile =()=>{
    navigate("/viewprofile")
  }
  const getRecommendation = ()=>{
    navigate("/recommendproduct")
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
    <>
      <div className="notifications-top-right">
        <button
          className="notification-toggle"
          onClick={() => setShowNotifications((s) => !s)}
          aria-expanded={showNotifications}
        >
          <span className="notification-label">Notifications</span>
          <span className="notification-badge">{notifications.length}</span>
        </button>

        {showNotifications && (
          <div className="notifications-box">
            <h2 className="notif-title">Notifications</h2>
            {notifications.length > 0 ? (
              <div className="notif-list">{handleCheckingChat()}</div>
            ) : (
              <div className="notif-empty">No notifications</div>
            )}
          </div>
        )}
      </div>

      <div className="home-container min-h-screen flex flex-col items-center justify-center bg-gray-100 gap-6 p-6">
        <h1 className="home-title text-3xl font-bold mb-6 text-gray-800">Marketplace Home</h1>

        <button
          onClick={handleDisplayClick}
          className="home-btn w-64 py-3 px-6 bg-blue-500 text-white rounded-2xl shadow hover:bg-blue-600 transition"
        >
          Browse Products
        </button>

        <button
          onClick={handleSellClick}
          className="home-btn w-64 py-3 px-6 bg-green-500 text-white rounded-2xl shadow hover:bg-green-600 transition"
        >
          Sell Product
        </button>

        <button
          onClick={handleSendingMessageToBuyer}
          className="home-btn w-64 py-3 px-6 bg-purple-500 text-white rounded-2xl shadow hover:bg-purple-600 transition"
        >
          See Chats
        </button>

        <button className="home-btn secondary color-cyan px-4 py-2" onClick={getAllProduct}>
          See All Products
        </button>

        <button className="home-btn secondary color-amber px-4 py-2" onClick={getUserProfile}>
          View Profile
        </button>

        <button className="home-btn secondary color-rose px-4 py-2" onClick={getRecommendation}>
          Get Recommendation
        </button>
      </div>
    </>
  );
}

export default Home;
