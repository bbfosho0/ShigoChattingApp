import React, { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Check } from "lucide-react";

const MessageBubble = ({ message, userId, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(message.content);

  const isMine = message.sender && String(message.sender._id) === String(userId);
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
      className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md text-sm backdrop-blur-md ${
        isMine
          ? "bg-gradient-to-tr from-blue-500/70 to-blue-600/60 text-white self-end ml-auto"
          : "bg-white/20 dark:bg-white/10 text-white self-start mr-auto"
      }`}
    >
      <div className="text-xs font-semibold mb-1 text-white/80">{message.sender.username}</div>

      {isEditing ? (
        <div className="flex items-center space-x-2">
          <input
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="text-black px-2 py-1 rounded w-full border border-gray-300 focus:outline-none"
          />
          <button onClick={handleEdit} className="p-1 bg-green-600 hover:bg-green-700 text-white rounded">
            <Check size={14} />
          </button>
        </div>
      ) : (
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      )}

      <div className="flex justify-between items-center mt-1 text-xs text-white/50">
        <span>{time}</span>
        {isMine && !isEditing && (
          <div className="flex items-center gap-2">
            <button onClick={() => setIsEditing(true)} className="hover:text-white">
              <Pencil size={14} />
            </button>
            <button onClick={() => onDelete(message._id)} className="hover:text-red-400">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
