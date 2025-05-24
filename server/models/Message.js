const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
// This code defines a Mongoose schema for a message model in a chat application.
// The schema includes fields for the sender (referencing a User model) and the content of the message.