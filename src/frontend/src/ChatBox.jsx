import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "./utility/socket";
import { useAuth } from "./FetchUser";
const ChatRoom = () => {
  const { roomId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!roomId) return;
      
    socket.emit("join_room", roomId);
    console.log(`📡 Joined room: ${roomId}`);     

    
    socket.on("receive_message", (data) => {
      // Ignore self message already shown locally
      if (currentUser && data?.sender?._id === currentUser._id) return;

      setMessages((prev) => [...prev, data]);
    });


    return () => {
      socket.off("receive_message");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;
  // const roomId = `${currentUser._id}_${product.ownerId}_${product._id}`;
    if (!currentUser?._id) {
      alert("Please login to send messages");
      return;
    }

    const msgObj = {
      receiverId: roomId.split("_")[1],
      roomId,
      message,
      sender: {
        _id: currentUser._id,
        username: currentUser.username,
      },
    };

    socket.emit("send_message", msgObj);
    setMessages((prev) => [...prev, msgObj]);
    setMessage("");
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-lg font-bold mb-4">Chat Room</h2>

      <div className="border rounded h-96 overflow-y-auto p-4 mb-4 bg-gray-50">
        {messages.map((msg, index) => {
          const isMe = msg?.sender?._id === currentUser._id;

          return (
            <div
              key={index}
              className={`mb-2 text-sm ${
                isMe ? "text-right text-blue-600" : "text-left text-gray-800"
              }`}
            >
              <span className="font-medium">{msg?.sender?.username || "Unknown"}:</span>{" "}
              {msg.message}
            </div>
          );
        })}
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
