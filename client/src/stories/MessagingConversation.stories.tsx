import type { Meta, StoryObj } from "@storybook/react-webpack5";

import MessageConversation from "components/ui/messaging-conversation";

const meta = {
  title: "Components/Messaging Conversation",
  component: MessageConversation,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MessageConversation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <MessageConversation />
    </div>
  ),
};

export const Dark: Story = {
  render: () => (
    <div className="dark min-h-screen bg-background p-6 text-foreground">
      <MessageConversation />
    </div>
  ),
};
