import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:7000", { withCredentials: true });

const ChatRoom = () => {
  const { roomId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    socket.emit("join_room", roomId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, { sender: "other", text: data.message }]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", { roomId, message });
    setMessages((prev) => [...prev, { sender: "me", text: message }]);
    setMessage("");
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-lg font-bold mb-4">Chat Room</h2>
      <div className="border rounded h-96 overflow-y-auto p-4 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 text-sm ${
              msg.sender === "me" ? "text-right text-blue-600" : "text-left text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="border rounded w-full px-3 py-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
