import dotenv from "dotenv";
import connectDB from "./src/backend/db/index.js";
import { app } from "./app.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 7000;


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", //  frontend origin
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`Joined room: ${roomId}`);
  });

  
  socket.on("send_message", ({ roomId, message, sender }) => {
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


connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err);
  });
