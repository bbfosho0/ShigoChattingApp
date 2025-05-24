/**
 * MessageBubble component displays a single chat message with options to edit or delete if the user is the owner.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.message - The message object containing content, sender, and metadata.
 * @param {string} props.userId - The current user's ID to determine ownership.
 * @param {function} props.onDelete - Callback function to handle message deletion. Receives message ID as argument.
 * @param {function} props.onEdit - Callback function to handle message editing. Receives message ID and new text as arguments.
 *
 * @example
 * <MessageBubble
 *   message={message}
 *   userId={currentUserId}
 *   onDelete={handleDelete}
 *   onEdit={handleEdit}
 * />
 */
import { useState } from "react";

const MessageBubble = ({ message, userId, onDelete, onEdit }) => {
  const isOwner = message.sender._id === userId;
  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState(message.content);

  const handleEdit = () => {
    onEdit(message._id, newText);
    setEditing(false);
  };

  return (
    <div>
      <p><strong>{message.sender.username}</strong></p>
      {editing ? (
        <>
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <p>{message.content}</p>
      )}
      <small>{new Date(message.createdAt).toLocaleString()}</small>
      {isOwner && !editing && (
        <>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={() => onDelete(message._id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default MessageBubble;
