import React, { useState } from "react";

const MessageBubble = ({ message, userId, onDelete, onEdit }) => {
  const isOwn = message.sender === userId || message.sender?._id === userId;
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.content);

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleSave = () => {
    if (editedText.trim()) {
      onEdit(message._id, editedText);
      setEditing(false);
    }
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 rounded-xl max-w-xs ${
          isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {editing ? (
          <>
            <input
              className="w-full text-black px-2 py-1 rounded"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <div className="mt-1 space-x-1 text-xs">
              <button className="underline" onClick={handleSave}>Save</button>
              <button className="underline text-gray-300" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div className="text-sm">{message.content}</div>
            <div className="text-xs opacity-60 mt-1">{time}</div>
            {isOwn && (
              <div className="mt-1 space-x-1 text-xs">
                <button className="underline" onClick={() => setEditing(true)}>Edit</button>
                <button className="underline text-red-300" onClick={() => onDelete(message._id)}>Delete</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
