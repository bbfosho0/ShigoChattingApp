import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ShigoConversation } from "components/ui/shigo-conversation";
import type { ShigoMessageData } from "components/ui/shigo-message";

const seed: ShigoMessageData[] = [
  { id: "1", senderId: "alice", senderName: "Alice", content: "Hey. You still around?", createdAt: "2026-08-18T20:40:00" },
  { id: "2", senderId: "yoshi", senderName: "Yoshi", content: "Yeah. Give me like ten minutes.", createdAt: "2026-08-18T20:41:00" },
  { id: "3", senderId: "alice", senderName: "Alice", content: "No rush. I like how quiet this room feels.", createdAt: "2026-08-18T20:42:00", edited: true },
];

function ConversationDemo() {
  const [messages, setMessages] = useState(seed);
  return (
    <div className="flex h-[30rem] w-[min(48rem,88vw)] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-panel">
      <ShigoConversation
        messages={messages}
        currentUserId="yoshi"
        onEdit={(id, content) => setMessages((current) => current.map((message) => message.id === id ? { ...message, content, edited: true } : message))}
        onDelete={(id) => setMessages((current) => current.filter((message) => message.id !== id))}
        onReply={() => undefined}
        onReact={() => undefined}
      />
    </div>
  );
}

const meta = {
  title: "Messaging/Conversation",
  component: ShigoConversation,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ShigoConversation>;

export default meta;
type Story = StoryObj<typeof meta>;

const requiredArgs = { messages: [] as ShigoMessageData[], currentUserId: "yoshi" };

export const Default: Story = { args: requiredArgs, render: () => <ConversationDemo /> };
export const Empty: Story = { args: requiredArgs, render: () => <div className="flex h-[30rem] w-[min(48rem,88vw)] flex-col overflow-hidden rounded-xl border border-border bg-background"><ShigoConversation messages={[]} currentUserId="yoshi" /></div> };
export const Loading: Story = { args: requiredArgs, render: () => <div className="flex h-[30rem] w-[min(48rem,88vw)] flex-col overflow-hidden rounded-xl border border-border bg-background"><ShigoConversation messages={[]} currentUserId="yoshi" loading /></div> };
export const Dark: Story = { args: requiredArgs, render: () => <div className="dark rounded-xl bg-background p-4 text-foreground"><ConversationDemo /></div> };
