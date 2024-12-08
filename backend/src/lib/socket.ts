import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001"],
    credentials: true,
  },
});

interface ConnectedUsers {
  [userId: string]: Set<string>; // Map userId to a set of socket IDs
}

export function getReceiverSocketIds(userId: string): Set<string> {
  return connectedUsers[userId] || new Set();
}

// Store connected users and their socket IDs (in case of multiple tabs or devices)
const connectedUsers: ConnectedUsers = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    if (!connectedUsers[userId]) {
      connectedUsers[userId] = new Set();
    }
    connectedUsers[userId].add(socket.id);
    console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);
  }

  // Listen for new message events
  socket.on("newMessage", (message) => {
    const { to, from, content } = message; 
    const receiverSocketIds = connectedUsers[to];
    if (receiverSocketIds) {
      receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("newMessage", { from, content });
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    if (userId && connectedUsers[userId]) {
      connectedUsers[userId].delete(socket.id);
      if (connectedUsers[userId].size === 0) {
        delete connectedUsers[userId];
      }
    }
  });
});

export { io, app, server };