import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { EmojiPicker } from "components/ui/emoji-picker";

const meta = {
  title: "Messaging/Emoji Picker",
  component: EmojiPicker,
  parameters: { layout: "centered" },
} satisfies Meta<typeof EmojiPicker>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { onSelect: () => undefined } };
export const Dark: Story = { render: () => <div className="dark rounded-xl bg-background p-8 text-foreground"><EmojiPicker onSelect={() => undefined} /></div> };
