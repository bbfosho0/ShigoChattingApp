import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ShigoAuthPage } from "components/ui/shigo-auth-page";

const RECOVERY_SENT_MESSAGE = "If an account exists for that email, a recovery link has been sent.";

const meta = {
  title: "Auth/Forgot Password",
  component: ShigoAuthPage,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="dark min-h-[100dvh] bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ShigoAuthPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialMode: "forgot",
    onSubmit: () => undefined,
  },
};

export const Sent: Story = {
  args: {
    initialMode: "forgot",
    success: RECOVERY_SENT_MESSAGE,
    onSubmit: () => undefined,
  },
};

export const Mobile: Story = {
  args: {
    initialMode: "forgot",
    compact: true,
    onSubmit: () => undefined,
  },
};
