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

function GroupPreview({ own = false }: { own?: boolean }) {
  const senderId = own ? "yoshi" : "alice";
  const senderName = own ? "Yoshi" : "Alice";
  const contents = own
    ? ["Yeah. Give me like ten minutes.", "I want to finish this one thing first.", "Then I am all yours."]
    : ["No rush.", "I like how quiet this room feels.", "It makes the conversation easier to read."];
  return (
    <div className="w-[min(44rem,86vw)] space-y-1.5">
      {contents.map((content, index) => (
        <ShigoMessage
          key={content}
          message={{ id: `group-${index}`, senderId, senderName, content, createdAt: `2026-08-18T20:4${index}:00` }}
          currentUserId="yoshi"
          groupPosition={index === 0 ? "start" : index === contents.length - 1 ? "end" : "middle"}
        />
      ))}
    </div>
  );
}

const meta = {
  title: "Messaging/Message",
  component: ShigoMessage,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ShigoMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

const requiredArgs = { message: ownMessage, currentUserId: "yoshi" };

export const Other: Story = { args: requiredArgs, render: () => <div className="w-[min(44rem,86vw)]"><ShigoMessage message={otherMessage} currentUserId="yoshi" onReply={() => undefined} onReact={() => undefined} /></div> };
export const Own: Story = { args: requiredArgs, render: () => <div className="w-[min(44rem,86vw)]"><InteractiveMessage /></div> };
export const Edited: Story = { args: requiredArgs, render: () => <div className="w-[min(44rem,86vw)]"><InteractiveMessage initial={{ ...ownMessage, edited: true }} /></div> };
export const Actions: Story = { args: requiredArgs, render: () => <div className="w-[min(44rem,86vw)]"><InteractiveMessage /></div> };
export const EditMode: Story = { args: requiredArgs, render: () => <div className="w-[min(44rem,86vw)]"><InteractiveMessage defaultEditing /></div> };
export const GroupedOther: Story = { args: requiredArgs, render: () => <GroupPreview /> };
export const GroupedOwn: Story = { args: requiredArgs, render: () => <GroupPreview own /> };
export const Dark: Story = { args: requiredArgs, render: () => <div className="dark w-[min(48rem,90vw)] rounded-xl bg-background p-6 text-foreground"><InteractiveMessage /></div> };
