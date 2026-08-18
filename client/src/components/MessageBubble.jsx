import React from "react";

import { ShigoMessage } from "./ui/shigo-message";

const getSenderId = (sender) =>
  typeof sender === "object" ? sender?._id : sender;

const getSenderName = (message) =>
  message?.sender?.username || message?.username || "Guest";

const MessageBubble = ({ message, userId, onDelete, onEdit }) => {
  const senderId = getSenderId(message.sender);
  const senderName = getSenderName(message);
  const edited = Boolean(
    message.updatedAt &&
      message.createdAt &&
      new Date(message.updatedAt).getTime() !== new Date(message.createdAt).getTime()
  );

  return (
    <ShigoMessage
      message={{
        id: String(message._id),
        senderId: String(senderId || ""),
        senderName,
        content: message.content || "",
        createdAt: message.createdAt,
        edited,
      }}
      currentUserId={String(userId || "")}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};

export default MessageBubble;
