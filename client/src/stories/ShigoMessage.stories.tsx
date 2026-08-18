import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ShigoMessage, type ShigoMessageData } from "components/ui/shigo-message";

const otherMessage: ShigoMessageData = {
  id: "m1",
  senderId: "alice",
  senderName: "Alice",
  content: "It feels much calmer in here now.",
  createdAt: "2026-08-18T20:42:00",
};

const ownMessage: ShigoMessageData = {
  id: "m2",
  senderId: "yoshi",
  senderName: "Yoshi",
  content: "That is exactly the point.",
  createdAt: "2026-08-18T20:43:00",
};

function InteractiveMessage({ initial = ownMessage, defaultEditing = false }: { initial?: ShigoMessageData; defaultEditing?: boolean }) {
  const [message, setMessage] = useState(initial);
  const [deleted, setDeleted] = useState(false);
  if (deleted) return <p className="text-sm text-muted-foreground">Message deleted.</p>;
  return (
    <ShigoMessage
      message={message}
      currentUserId="yoshi"
      defaultEditing={defaultEditing}
      onEdit={(_, content) => setMessage((current) => ({ ...current, content, edited: true }))}
      onDelete={() => setDeleted(true)}
      onReply={() => undefined}
      onReact={() => undefined}
    />
  );
}

const meta = {
  title: "Messaging/Message",
  component: ShigoMessage,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ShigoMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Other: Story = { render: () => <div className="w-[min(44rem,86vw)]"><ShigoMessage message={otherMessage} currentUserId="yoshi" onReply={() => undefined} onReact={() => undefined} /></div> };
export const Own: Story = { render: () => <div className="w-[min(44rem,86vw)]"><InteractiveMessage /></div> };
export const Edited: Story = { render: () => <div className="w-[min(44rem,86vw)]"><InteractiveMessage initial={{ ...ownMessage, edited: true }} /></div> };
export const Actions: Story = { render: () => <div className="w-[min(44rem,86vw)]"><InteractiveMessage /></div> };
export const EditMode: Story = { render: () => <div className="w-[min(44rem,86vw)]"><InteractiveMessage defaultEditing /></div> };
export const Dark: Story = { render: () => <div className="dark w-[min(48rem,90vw)] rounded-xl bg-background p-6 text-foreground"><InteractiveMessage /></div> };
