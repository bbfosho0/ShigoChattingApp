/**
 * @fileoverview
 * Main server entrypoint.
 * Sets up Express server, MongoDB connectivity, and Socket.IO.
 * Includes JWT authentication on socket connections.
 * CORS origins configured dynamically.
 * Improved socket sendMessage handler with enhanced sender ID extraction and warning log.
 * Added socket event handlers for editMessage and deleteMessage broadcasting.
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const Message = require("./models/Message");

dotenv.config();

const app = express();
const server = http.createServer(app);

const allowedOrigins = ["http://localhost:3000"];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

io.use((socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    (socket.handshake.headers.authorization
      ? socket.handshake.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return next(new Error("Authentication error: token missing"));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    return next(new Error("Authentication error: invalid token"));
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id, "UserId:", socket.user._id);

  function extractSenderId(sender) {
    if (typeof sender === "object" && sender !== null) {
      return sender._id ?? sender.id ?? null;
    }
    return sender;
  }

  socket.on("sendMessage", async (message) => {
    try {
      const senderId = extractSenderId(message.sender);

      if (!senderId || String(senderId) !== String(socket.user._id)) {
        console.warn(
          `Socket sendMessage sender mismatch or missing. Socket user id: ${socket.user._id}, Message sender: ${JSON.stringify(
            message.sender
          )}, Ignoring event.`
        );
        return;
      }

      const fullMessage = await Message.findById(message._id).populate(
        "sender",
        "username"
      );
      if (fullMessage) {
        io.emit("receiveMessage", fullMessage);
      }
    } catch (err) {
      console.error("Socket sendMessage emit failed:", err);
    }
  });

  socket.on("editMessage", async (message) => {
    try {
      const senderId = extractSenderId(message.sender);

      if (!senderId || String(senderId) !== String(socket.user._id)) {
        console.warn(
          `Socket editMessage sender mismatch or missing. Socket user id: ${socket.user._id}, Message sender: ${JSON.stringify(
            message.sender
          )}, Ignoring event.`
        );
        return;
      }

      const updatedMessage = await Message.findById(message._id).populate(
        "sender",
        "username"
      );
      if (updatedMessage) {
        socket.broadcast.emit("editMessage", updatedMessage);
      }
    } catch (err) {
      console.error("Socket editMessage emit failed:", err);
    }
  });

  socket.on("deleteMessage", async (payload) => {
    try {
      if (!payload._id) {
        console.warn(
          "deleteMessage payload missing _id from socket user:",
          socket.user._id
        );
        return;
      }

      socket.broadcast.emit("deleteMessage", payload._id);
    } catch (err) {
      console.error("Socket deleteMessage emit failed:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
