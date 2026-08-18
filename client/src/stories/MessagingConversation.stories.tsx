import type { Meta, StoryObj } from "@storybook/react-webpack5";

import MessageConversation from "components/ui/messaging-conversation";

const meta = {
  title: "Components/Messaging Conversation",
  component: MessageConversation,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof MessageConversation>;

export default meta;
type Story = StoryObj<typeof meta>;

const conversationClassName = "h-[28rem] w-[min(92vw,36rem)] max-w-xl grow-0";

export const Default: Story = {
  render: () => (
    <div className="rounded-2xl bg-background p-3 text-foreground">
      <MessageConversation className={conversationClassName} />
    </div>
  ),
};

export const Dark: Story = {
  render: () => (
    <div className="dark rounded-2xl bg-background p-3 text-foreground">
      <MessageConversation className={conversationClassName} />
    </div>
  ),
};
