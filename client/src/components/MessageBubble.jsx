import React, { useState } from "react";

const MessageBubble = ({ message, userId, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(message.content);

  const isMine = message.sender && String(message.sender._id) === String(userId);

  const time = new Date(message.createdAt).toLocaleTimeString();
  console.log("message.sender", message.sender);
  console.log("userId", userId);


  const handleEdit = () => {
    onEdit(message._id, newContent);
    setIsEditing(false);
  };

  return (
    <div className={`p-2 rounded-xl max-w-xs ${isMine ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-black self-start mr-auto"}`}>
      <div className="text-xs font-bold mb-1">{message.sender.username}</div>

      {isEditing ? (
        <div className="flex items-center space-x-2">
          <input
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="text-black px-2 py-1 rounded w-full"
          />
          <button onClick={handleEdit} className="text-sm bg-green-600 text-white px-2 py-1 rounded">Save</button>
        </div>
      ) : (
        <p>{message.content}</p>
      )}

      <div className="flex justify-between items-center mt-1 text-xs opacity-60">
        <span>{time}</span>
        {isMine && !isEditing && (
          <div className="space-x-2">
            <button onClick={() => setIsEditing(true)} className="text-yellow-200 hover:text-yellow-400">Edit</button>
            <button onClick={() => onDelete(message._id)} className="text-red-200 hover:text-red-400">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
