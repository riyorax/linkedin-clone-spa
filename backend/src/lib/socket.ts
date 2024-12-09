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
  [userId: string]: Set<string>;
}

export function getReceiverSocketIds(userId: string): Set<string> {
  return connectedUsers[userId] || new Set();
}

const connectedUsers: ConnectedUsers = {};

const typingUsers: { [fromUserId: string]: string } = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    if (!connectedUsers[userId]) {
      connectedUsers[userId] = new Set();
    }
    connectedUsers[userId].add(socket.id);
    console.log(`User connected: ${userId}, Socket ID: ${socket.id}`);
  }

  // Listen for "newMessage" events
  socket.on("newMessage", (message) => {
    const { to, from, content } = message;
    const receiverSocketIds = connectedUsers[to];
    if (receiverSocketIds) {
      receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("newMessage", { from, content });
      });
    }
  });

  // Listen for "typing" events
  socket.on("typing", ({ to }) => {
    if (!userId || !to) return;
    typingUsers[userId] = to;
    const receiverSocketIds = getReceiverSocketIds(to);
    receiverSocketIds.forEach((socketId) => {
      io.to(socketId).emit("userTyping", userId);
    });
  });

  // Listen for "stopTyping" events
  socket.on("stopTyping", ({ to }) => {
    if (!userId || !to) return;
    delete typingUsers[userId]; 
    const receiverSocketIds = getReceiverSocketIds(to);
    receiverSocketIds.forEach((socketId) => {
      io.to(socketId).emit("userStopTyping", userId);
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);

    if (userId && connectedUsers[userId]) {
      connectedUsers[userId].delete(socket.id);

      if (typingUsers[userId]) {
        const to = typingUsers[userId];
        delete typingUsers[userId];
        const receiverSocketIds = getReceiverSocketIds(to);
        receiverSocketIds.forEach((socketId) => {
          io.to(socketId).emit("userStopTyping", userId);
        });
      }

      if (connectedUsers[userId].size === 0) {
        delete connectedUsers[userId];
      }
    }
  });
});

export { io, app, server };