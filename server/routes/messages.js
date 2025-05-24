const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const verifyToken = require("../middleware/auth");

// GET /api/messages - Get all messages
router.get("/", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find()
      .populate("sender", "username")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// POST /api/messages - Create a new message
router.post("/", verifyToken, async (req, res) => {
  try {
    const message = new Message({
      sender: req.user._id,
      content: req.body.content,
    });

    await message.save();
    await message.populate("sender", "username");

    res.status(201).json(message);
  } catch (err) {
    console.error("Failed to send message:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// PATCH /api/messages/:id - Edit a message
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate("sender", "username");

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    if (String(message.sender._id) !== String(req.user._id)) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    message.content = req.body.content;
    await message.save();

    res.json(message);
  } catch (err) {
    console.error("Failed to edit message:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE /api/messages/:id - Delete a message
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    if (String(message.sender) !== String(req.user._id)) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await message.deleteOne();
    res.json({ msg: "Message deleted" });
  } catch (err) {
    console.error("Failed to delete message:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
