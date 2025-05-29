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

// Allowed origins list for CORS
const allowedOrigins = [
  "http://localhost:3000"
];

// Add production client URL if set
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

// Socket.IO server with CORS config
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Accept requests with no origin (postman, localhost curl) or valid origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});

// Socket connection authentication middleware
io.use((socket, next) => {
  // Clients should send token either in handshake.auth.token or as Bearer in auth header
  const token =
    socket.handshake.auth?.token ||
    (socket.handshake.headers.authorization
      ? socket.handshake.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return next(new Error("Authentication error: token missing"));
  }

  try {
    // Verify JWT token
    const user = jwt.verify(token, process.env.JWT_SECRET);
    // Attach verified user info to socket object
    socket.user = user;
    next();
  } catch (err) {
    return next(new Error("Authentication error: invalid token"));
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// CORS middleware for Express with same origins allowed as socket.io
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id, "UserId:", socket.user._id);

  // Helper to safely extract senderId string
  function extractSenderId(sender) {
    if (typeof sender === "object" && sender !== null) {
      return sender._id ?? sender.id ?? null;
    }
    return sender;
  }

  // Handle sendMessage event: broadcast full message fetched from DB if sender matches
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

      const fullMessage = await Message.findById(message._id).populate("sender", "username");
      if (fullMessage) {
        // Broadcast full message including sender username to all clients including sender
        io.emit("receiveMessage", fullMessage);
      }
    } catch (err) {
      console.error("Socket sendMessage emit failed:", err);
    }
  });

  // Handle editMessage event: broadcast updated message with full info
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

      // Fetch updated message from DB to ensure latest data and populated sender username
      const updatedMessage = await Message.findById(message._id).populate("sender", "username");
      if (updatedMessage) {
        // Broadcast updated message to all other clients except sender (so sender does not receive their own emission)
        socket.broadcast.emit("editMessage", updatedMessage);
      }
    } catch (err) {
      console.error("Socket editMessage emit failed:", err);
    }
  });

  // Handle deleteMessage event: broadcast deletion event to other clients
socket.on("deleteMessage", async (payload) => {
  try {
    if (!payload._id) {
      console.warn("deleteMessage payload missing _id from socket user:", socket.user._id);
      return;
    }

    // No need to verify sender here because REST DELETE already ensures ownership
    // Broadcast to all other clients except sender
    socket.broadcast.emit("deleteMessage", payload._id);
  } catch (err) {
    console.error("Socket deleteMessage emit failed:", err);
  }
});

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));