import React, { useState } from "react";

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
    <div className={`p-3 rounded-xl max-w-sm break-words ${isMine ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-black self-start mr-auto"}`}>
      <div className="text-xs font-semibold mb-1">{message.sender.username}</div>

      {isEditing ? (
        <div className="flex items-center space-x-2">
          <input
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="text-black px-2 py-1 rounded w-full border border-gray-300"
          />
          <button onClick={handleEdit} className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Save</button>
        </div>
      ) : (
        <p className="text-sm">{message.content}</p>
      )}

      <div className="flex justify-between items-center mt-1 text-xs opacity-60">
        <span>{time}</span>
        {isMine && !isEditing && (
          <div className="space-x-2">
            <button onClick={() => setIsEditing(true)} className="hover:underline">Edit</button>
            <button onClick={() => onDelete(message._id)} className="text-red-300 hover:text-red-500 hover:underline">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
