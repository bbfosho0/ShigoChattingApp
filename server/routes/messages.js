/**
 * @module routes/messages
 * @description Express router for handling message-related endpoints.
 */

const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const verifyToken = require("../middleware/auth");



/**
 * GET /
 * @summary Get all messages.
 * @description Retrieves all messages from the database, populating the sender's username, sorted by creation time.
 * @access Protected (requires JWT token)
 * @returns {Array<Object>} 200 - List of messages
 */

//router.get("/", verifyToken, async (req, res) => { ... });

/**
 * POST /
 * @summary Create a new message.
 * @description Creates a new message with the authenticated user as the sender.
 * @access Protected (requires JWT token)
 * @param {string} req.body.content - The content of the message.
 * @returns {Object} 201 - The created message
 */

//router.post("/", verifyToken, async (req, res) => { ... });

/**
 * PATCH /:id
 * @summary Update a message.
 * @description Updates the content of a message if the authenticated user is the sender.
 * @access Protected (requires JWT token)
 * @param {string} req.params.id - The ID of the message to update.
 * @param {string} req.body.content - The new content of the message.
 * @returns {Object} 200 - The updated message
 * @returns {Object} 403 - Not allowed if user is not the sender
 */

//router.patch("/:id", verifyToken, async (req, res) => { ... });

/**
 * DELETE /:id
 * @summary Delete a message.
 * @description Deletes a message if the authenticated user is the sender.
 * @access Protected (requires JWT token)
 * @param {string} req.params.id - The ID of the message to delete.
 * @returns {Object} 200 - Deletion confirmation
 * @returns {Object} 403 - Not allowed if user is not the sender
 */

//router.delete("/:id", verifyToken, async (req, res) => { ... });

/**
 * @exports router
 */

router.get("/", verifyToken, async (req, res) => {
  const messages = await Message.find().populate("sender", "username").sort({ createdAt: 1 });
  res.json(messages);
});

router.post("/", verifyToken, async (req, res) => {
  const message = new Message({ sender: req.user.id, content: req.body.content });
  await message.save();
  res.status(201).json(message);
});

router.patch("/:id", verifyToken, async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message || message.sender.toString() !== req.user.id) return res.status(403).json({ msg: "Not allowed" });
  message.content = req.body.content;
  await message.save();
  res.json(message);
});

router.delete("/:id", verifyToken, async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message || message.sender.toString() !== req.user.id) return res.status(403).json({ msg: "Not allowed" });
  await message.deleteOne();
  res.json({ msg: "Deleted" });
});

module.exports = router;
