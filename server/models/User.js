const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
// This code defines a Mongoose schema for a User model in a MongoDB database.
// The schema includes fields for username, email, and password, all of which are required.