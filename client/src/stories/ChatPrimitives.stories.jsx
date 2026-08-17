import React from "react";
import { expect, fn } from "storybook/test";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";

const baseMessage = {
  _id: "storybook-message-1",
  sender: { _id: "maya-id", username: "Maya" },
  content: "The room feels calm today.",
  createdAt: "2026-08-17T12:30:00.000Z",
  updatedAt: "2026-08-17T12:30:00.000Z",
};

const meta = {
  title: "ShigoChat/Chat primitives",
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/Srny3gef0k6rBZVkTFEzPC" },
    layout: "centered",
  },
};

export default meta;

export const IncomingMessage = {
  render: () => <MessageBubble message={baseMessage} userId="room-owner" onEdit={() => {}} onDelete={() => {}} />,
};

export const OwnedMessage = {
  render: () => (
    <MessageBubble
      message={{ ...baseMessage, _id: "storybook-owned-message", sender: { _id: "room-owner", username: "Room owner" }, content: "I noticed that too." }}
      userId="room-owner"
      onEdit={() => {}}
      onDelete={() => {}}
    />
  ),
};

export const ComposerIdle = {
  render: () => <div className="w-[min(640px,90vw)]"><MessageInput onSend={fn()} /></div>,
};

export const ComposerError = {
  render: () => <div className="w-[min(640px,90vw)]"><MessageInput onSend={fn(() => new Promise((resolve) => setTimeout(resolve, 120)))} error="The message could not be sent. Try again." /></div>,
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole("textbox", { name: "Message input" }), "A quiet update");
    await userEvent.click(canvas.getByRole("button", { name: "Send message" }));
    await expect(canvas.getByRole("status")).toBeVisible();
  },
};
