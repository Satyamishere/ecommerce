import dotenv from "dotenv";
import connectDB from "./src/backend/db/index.js";
import { app } from "./app.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 7000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend origin
    credentials: true,
  },
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`Joined room: ${roomId}`);
  });

  // This was the original issue:
  // Problem 1: You were using `io.to(roomId).emit(...)`, which sends the message to the whole room including the sender.
  // Problem 2: You were not sending the `sender` object in the emitted message, which led to "Unknown" in the frontend.
  socket.on("send_message", ({ roomId, message, sender }) => {
    // Corrected: send to everyone in the room except the sender using `socket.to(...)`
    // Also include the sender object in the payload
    socket.to(roomId).emit("receive_message", {
      message,
      sender: {
        _id: sender._id,
        username: sender.username,
      },
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });
