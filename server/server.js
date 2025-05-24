/**
 * Server setup for ShigoChattingApp.
 * 
 * - Loads environment variables using dotenv.
 * - Initializes an Express application.
 * - Applies middleware for JSON parsing and CORS.
 * - Connects to MongoDB using Mongoose.
 * - Sets up authentication and messaging API routes.
 * - Starts the server on the specified port.
 * 
 * Environment Variables:
 * @env {string} MONGO_URI - MongoDB connection string.
 * @env {string} [PORT=5000] - Port number for the server.
 * 
 * @module server
 */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/messages", require("./routes/messages"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
