import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket } from "./utility/socket";
import { useAuth } from "./FetchUser";

const ChatRoom = () => {
  const { roomId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user: currentUser } = useAuth();
  const endRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join_room", roomId);

    socket.on("receive_message", (data) => {
      // Ignore duplicate local messages
      if (currentUser && data?.sender?._id === currentUser._id) return;
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [roomId, currentUser]);

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;
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
      createdAt: new Date().toISOString(),
    };

    socket.emit("send_message", msgObj);
    setMessages((prev) => [...prev, msgObj]);
    setMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chat Room</h2>
          <div className="text-sm text-gray-500">Room: {roomId}</div>
        </div>

        <div className="p-4 h-96 overflow-y-auto bg-gray-50 space-y-3">
          {messages.map((msg, index) => {
            const isMe = msg?.sender?._id === currentUser?._id;
            const username = msg?.sender?.username || "Unknown";

            return (
              <div
                key={index}
                className={`flex items-end ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && (
                  <div className="mr-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">{username.charAt(0).toUpperCase()}</div>
                  </div>
                )}

                <div className={`max-w-[75%] px-4 py-2 rounded-xl shadow-sm ${isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-900 rounded-bl-none border"}`}>
                  {!isMe && <div className="text-xs font-medium text-gray-600 mb-1">{username}</div>}
                  <div className="text-sm break-words">{msg.message}</div>
                  <div className={`text-xs mt-1 ${isMe ? "text-blue-100" : "text-gray-400"}`}>{new Date(msg.createdAt || Date.now()).toLocaleTimeString()}</div>
                </div>

                {isMe && (
                  <div className="ml-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">{currentUser?.username?.charAt(0).toUpperCase() || "U"}</div>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t flex gap-3 items-center bg-white">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
