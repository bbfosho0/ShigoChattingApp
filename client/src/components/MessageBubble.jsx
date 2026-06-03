import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pencil, Trash2, X } from "lucide-react";

const AVATAR_COLORS = [
  ["#6b4fa8", "#9b78d4"],
  ["#3d6fa8", "#6ea4d8"],
  ["#3d9e76", "#6ecfa4"],
  ["#9e6e3d", "#d4a06e"],
  ["#9e3d6b", "#d46ea4"],
];

const getSenderId = (sender) => (typeof sender === "object" ? sender?._id : sender);
const getSenderName = (message) => message?.sender?.username || message?.username || "Guest";
const getInitials = (name) => name.slice(0, 2).toUpperCase();
const getAvatarGradient = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const MessageBubble = ({ message, userId, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(message.content);
  const [hovered, setHovered] = useState(false);

  const senderId = getSenderId(message.sender);
  const senderName = getSenderName(message);
  const isMine = senderId && String(senderId) === String(userId);
  const [c1, c2] = getAvatarGradient(senderName || "U");
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleEdit = () => {
    const trimmed = newContent.trim();
    if (trimmed) {
      onEdit(message._id, trimmed);
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    setNewContent(message.content);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`flex gap-3 ${isMine ? "flex-row-reverse" : "flex-row"}`}
      style={{ alignItems: "flex-end" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!isMine && (
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
          style={{
            background: `linear-gradient(135deg, ${c1}, ${c2})`,
            boxShadow: `0 2px 8px ${c1}44`,
          }}
        >
          <span className="text-[0.68rem] font-bold text-white">{getInitials(senderName)}</span>
        </div>
      )}

      <div
        className={`flex min-w-0 max-w-[78%] flex-col gap-1 md:max-w-[68%] ${isMine ? "items-end" : "items-start"}`}
      >
        {!isMine && (
          <div className="flex items-baseline gap-2 pl-0.5">
            <span className="text-[0.74rem] font-semibold sc-text-secondary">{senderName}</span>
            <span className="text-[0.67rem] sc-text-muted">{time}</span>
          </div>
        )}

        <div className={`relative flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
          <AnimatePresence>
            {isMine && !isEditing && hovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.12 }}
                className="hidden flex-shrink-0 gap-1 md:flex"
              >
                <button
                  onClick={() => setIsEditing(true)}
                  className="sc-icon-button h-7 w-7 rounded-lg"
                  type="button"
                  aria-label="Edit message"
                >
                  <Pencil size={11} />
                </button>
                <button
                  onClick={() => onDelete(message._id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    background: "var(--sc-bubble-other)",
                    border: "1px solid rgba(224,91,122,0.2)",
                    color: "#e05b7a",
                    cursor: "pointer",
                  }}
                  type="button"
                  aria-label="Delete message"
                >
                  <Trash2 size={11} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {isEditing ? (
            <div
              className="min-w-[220px] rounded-2xl p-3"
              style={{
                background: isMine ? "var(--sc-bubble-own)" : "var(--sc-bubble-other)",
                border: "1px solid var(--sc-border)",
                boxShadow: "0 2px 12px var(--sc-shadow)",
              }}
            >
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleEdit();
                  }
                  if (e.key === "Escape") cancelEdit();
                }}
                autoFocus
                rows={2}
                className="sc-scrollbar w-full resize-none bg-transparent text-[0.875rem] leading-relaxed outline-none sc-text-primary"
                aria-label="Edit message input"
              />
              <div className="mt-2 flex justify-end gap-1.5">
                <button onClick={cancelEdit} className="sc-icon-button rounded-md px-2 py-1" type="button" aria-label="Cancel edit">
                  <X size={12} />
                </button>
                <button
                  onClick={handleEdit}
                  className="rounded-md px-2 py-1"
                  style={{
                    background: "var(--sc-accent-soft)",
                    border: "1px solid var(--sc-border)",
                    color: "var(--sc-accent)",
                    cursor: "pointer",
                  }}
                  type="button"
                  aria-label="Confirm edit"
                >
                  <Check size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div
              className="rounded-2xl px-4 py-2.5"
              style={{
                background: isMine ? "var(--sc-bubble-own)" : "var(--sc-bubble-other)",
                border: "1px solid var(--sc-border)",
                borderBottomRightRadius: isMine ? "0.4rem" : undefined,
                borderBottomLeftRadius: !isMine ? "0.4rem" : undefined,
                boxShadow: "0 2px 12px var(--sc-shadow)",
              }}
            >
              <p className="m-0 whitespace-pre-wrap break-words text-[0.875rem] leading-relaxed sc-text-primary">
                {message.content}
              </p>
              {message.updatedAt && message.updatedAt !== message.createdAt && (
                <span className="mt-0.5 block text-[0.63rem] sc-text-muted">edited</span>
              )}
            </div>
          )}
        </div>

        {isMine && (
          <div className="flex items-center gap-2 pr-0.5">
            <span className="text-[0.67rem] sc-text-muted">{time}</span>
            {!isEditing && (
              <div className="flex gap-2 md:hidden">
                <button onClick={() => setIsEditing(true)} className="sc-text-secondary" style={{ background: "none", border: 0 }} type="button" aria-label="Edit message">
                  <Pencil size={14} />
                </button>
                <button onClick={() => onDelete(message._id)} style={{ background: "none", border: 0, color: "#e05b7a" }} type="button" aria-label="Delete message">
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
