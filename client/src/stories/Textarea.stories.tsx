import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Textarea } from "components/ui/textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Message Quiet Room...",
    className: "w-[min(34rem,80vw)]",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Messaging unavailable",
    disabled: true,
    className: "w-[min(34rem,80vw)]",
  },
};

export const Dark: Story = {
  render: () => (
    <div className="dark rounded-xl bg-background p-6 text-foreground">
      <Textarea className="w-[min(34rem,80vw)]" placeholder="Message Quiet Room..." />
    </div>
  ),
};
