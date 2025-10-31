// backend/socket.js
import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// In-memory map of userId -> socketId
const userSocketMap = {};

export const getSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId !== undefined) {
    userSocketMap[userId] = socket.id;
  }

  // Broadcast current online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ Typing event handler
  socket.on("typing", ({ to }) => {
    const receiverSocketId = getSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { from: userId });
    }
  });

  // ✅ Send message handler (clients may emit after REST POST)
  socket.on("sendMessage", ({ message, to, from }) => {
    // Normalize
    const receiverSocketId = getSocketId(String(to));
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }
    // Also emit back to sender's socket so sender UI can confirm delivery in multi-tab cases
    if (socket && socket.id) {
      socket.emit("newMessage", message);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
