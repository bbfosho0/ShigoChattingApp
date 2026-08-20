import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ShigoConversation } from "components/ui/shigo-conversation";
import type { ShigoMessageData } from "components/ui/shigo-message";

const oneMessage: ShigoMessageData[] = [
  { id: "1", senderId: "alice", senderName: "Alice", content: "Hey. You still around?", createdAt: "2026-08-18T20:40:00" },
];

const twoMessages: ShigoMessageData[] = [
  ...oneMessage,
  { id: "2", senderId: "alice", senderName: "Alice", content: "No rush if you are busy.", createdAt: "2026-08-18T20:42:00" },
];

const fourMessages: ShigoMessageData[] = [
  ...twoMessages,
  { id: "3", senderId: "yoshi", senderName: "Yoshi", content: "Yeah. Give me like ten minutes.", createdAt: "2026-08-18T20:43:00" },
  { id: "4", senderId: "yoshi", senderName: "Yoshi", content: "Everything else can stay out of the way.", createdAt: "2026-08-18T20:45:00", edited: true },
];

const alternatingMessages: ShigoMessageData[] = [
  { id: "a1", senderId: "alice", senderName: "Alice", content: "This feels calmer.", createdAt: "2026-08-18T20:40:00" },
  { id: "a2", senderId: "yoshi", senderName: "Yoshi", content: "That is the point.", createdAt: "2026-08-18T20:41:00" },
  { id: "a3", senderId: "alice", senderName: "Alice", content: "Keep the room, lose the noise.", createdAt: "2026-08-18T20:42:00" },
  { id: "a4", senderId: "yoshi", senderName: "Yoshi", content: "Exactly.", createdAt: "2026-08-18T20:43:00" },
];

const longConversation: ShigoMessageData[] = Array.from({ length: 28 }, (_, index) => ({
  id: `long-${index}`,
  senderId: index % 4 < 2 ? "alice" : "yoshi",
  senderName: index % 4 < 2 ? "Alice" : "Yoshi",
  content: index % 3 === 0
    ? "A longer message to verify wrapping, transcript density, and comfortable reading measure without turning each line into a card."
    : `Conversation message ${index + 1}.`,
  createdAt: new Date(2026, 7, 18, 20, 10 + index * 2).toISOString(),
}));

function ConversationCanvas({ messages, loading = false }: { messages: ShigoMessageData[]; loading?: boolean }) {
  return (
    <div className="flex h-screen min-h-[30rem] w-full flex-col overflow-hidden bg-background text-foreground">
      <ShigoConversation messages={messages} currentUserId="yoshi" loading={loading} />
    </div>
  );
}

function InteractiveConversation() {
  const [messages, setMessages] = useState(fourMessages);
  return (
    <div className="flex h-screen min-h-[30rem] w-full flex-col overflow-hidden bg-background text-foreground">
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
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ShigoConversation>;

export default meta;
type Story = StoryObj<typeof meta>;

const requiredArgs = { messages: [] as ShigoMessageData[], currentUserId: "yoshi" };

export const Interactive: Story = { args: requiredArgs, render: () => <InteractiveConversation /> };
export const Empty: Story = { args: requiredArgs, render: () => <ConversationCanvas messages={[]} /> };
export const OneMessage: Story = { args: requiredArgs, render: () => <ConversationCanvas messages={oneMessage} /> };
export const TwoMessagesGrouped: Story = { args: requiredArgs, render: () => <ConversationCanvas messages={twoMessages} /> };
export const FourMessages: Story = { args: requiredArgs, render: () => <ConversationCanvas messages={fourMessages} /> };
export const AlternatingSenders: Story = { args: requiredArgs, render: () => <ConversationCanvas messages={alternatingMessages} /> };
export const LongTranscript: Story = { args: requiredArgs, render: () => <ConversationCanvas messages={longConversation} /> };
export const Loading: Story = { args: requiredArgs, render: () => <ConversationCanvas messages={[]} loading /> };
export const Dark: Story = { args: requiredArgs, render: () => <div className="dark"><ConversationCanvas messages={fourMessages} /></div> };
