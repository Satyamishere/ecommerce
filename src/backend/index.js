import dotenv from "dotenv";
import connectDB from "./db/dbConnectFile.js";
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
    origin:[ "http://localhost:5173",
    "https://ecommerce-frontend-bdhf.onrender.com"], //  frontend origin
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log("user joined", roomId);
    console.log(`Joined room: ${roomId}`);
  });
  

  
 socket.on("send_message", (data) => {

    console.log("Received message:", data);

    socket.to(data.roomId).emit("receive_message", {
        message: data.message,
        sender: data.sender
    });
    console.log("notification emmited to", `user_${data.receiverId}`)

    io.to(`user_${data.receiverId}`)
      .emit("new_notification", {
          roomId: data.roomId,
          message: `New message from ${data.sender.username}`,
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
