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
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send_message", ({ roomId, message }) => {
    socket.to(roomId).emit("receive_message", { message });
  });
});


connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    })
  })
  .catch((err) => {
    console.log(" MongoDB connection failed:", err);
  });
