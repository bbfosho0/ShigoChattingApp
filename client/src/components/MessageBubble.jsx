import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Check } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * MessageBubble component - displays a single chat message.
 *
 * - Shows sender username, timestamp, and message content.
 * - If the message belongs to the current user, shows edit and delete controls.
 * - When editing, shows a controlled input with proper theme-aware styling.
 * - Uses Framer Motion for smooth fade/slide animations.
 *
 * @param {Object} props
 * @param {Object} props.message - message data including sender, content, timestamps.
 * @param {string} props.userId - current logged-in user ID for ownership check.
 * @param {Function} props.onDelete - callback to delete this message by ID.
 * @param {Function} props.onEdit - callback to edit this message by ID and new content.
 */
const MessageBubble = ({ message, userId, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(message.content);

  const { darkMode } = useContext(ThemeContext); // Read theme context for styling

  const isMine = message.sender && String(message.sender._id) === String(userId);
  // Format time as HH:mm (24h)
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  /**
   * Confirm edit handler:
   * - Validate trimmed content is non-empty.
   * - Calls onEdit callback with new content.
   * - Exits editing mode on success.
   */
  const handleEdit = () => {
    if (newContent.trim()) {
      onEdit(message._id, newContent.trim());
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`max-w-max flex-shrink-0 px-4 py-2 rounded-3xl shadow-md text-sm font-inter backdrop-blur-md overflow-x-hidden overflow-y-visible ${
        isMine
          ? "bg-gradient-to-tr from-indigo-600/80 to-purple-600/90 text-white self-end ml-auto"
          : "bg-white/20 dark:bg-white/15 text-gray-900 dark:text-gray-200 self-start mr-auto"
      }`}
    >
      {/* Sender Username */}
      <div className="text-xs font-semibold mb-0.5 opacity-75 select-none">
        {message.sender.username}
      </div>

      {/* Editable text input or plain message content */}
      {isEditing ? (
        <div className="flex items-center space-x-1">
          <input
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className={`px-3 py-1 rounded-xl w-full border focus:outline-none focus:ring-2 ${
              darkMode
                ? "bg-gray-900 text-gray-100 border-gray-700 focus:ring-indigo-500"
                : "bg-white text-gray-900 border-gray-300 focus:ring-indigo-500"
            }`}
            autoFocus
            aria-label="Edit message input"
          />
          <button
            onClick={handleEdit}
            className="p-2 bg-indigo-600 rounded-xl text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Confirm edit"
          >
            <Check size={16} />
          </button>
        </div>
      ) : (
        <p className="whitespace-pre-wrap break-all overflow-y-visible">{message.content}</p>
      )}

      {/* Timestamp */}
      <div className="text-xs opacity-60 mt-0 select-none">{time}</div>

      {/* Edit/Delete action buttons only for own messages and when not editing */}
      {isMine && !isEditing && (
        <div className="flex items-center gap-4 mt-1">
          <button
            onClick={() => setIsEditing(true)}
            className="hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
            aria-label="Edit message"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(message._id)}
            className="hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            aria-label="Delete message"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default MessageBubble;