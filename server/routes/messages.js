/**
 * @fileoverview
 * Routes for message CRUD operations.
 * Uses validation middleware to ensure content integrity.
 */

const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const verifyToken = require("../middleware/auth");
const { validateMessageContent } = require("../middleware/validators");

/**
 * @route GET /api/messages
 * @desc Retrieve all messages, populated with sender username,
 * sorted oldest-first.
 * @access Authenticated users only
 */
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

/**
 * @route POST /api/messages
 * @desc Create a new message for authenticated user.
 * @body { content: string }
 */
router.post("/", verifyToken, validateMessageContent, async (req, res) => {
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

/**
 * @route PATCH /api/messages/:id
 * @desc Edit existing message if sender matches user.
 * @body { content: string }
 */
router.patch("/:id", verifyToken, validateMessageContent, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate("sender", "username");
    if (!message) return res.status(404).json({ msg: "Message not found" });

    if (String(message.sender._id) !== String(req.user._id))
      return res.status(403).json({ msg: "Not authorized" });

    message.content = req.body.content;
    await message.save();
    res.json(message);
  } catch (err) {
    console.error("Failed to edit message:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route DELETE /api/messages/:id
 * @desc Delete message if sender matches user.
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ msg: "Message not found" });

    if (String(message.sender) !== String(req.user._id))
      return res.status(403).json({ msg: "Not authorized" });

    await message.deleteOne();
    res.json({ msg: "Message deleted" });
  } catch (err) {
    console.error("Failed to delete message:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;