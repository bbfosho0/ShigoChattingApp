import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ShigoAuthPage } from "components/ui/shigo-auth-page";

const meta = {
  title: "Auth/Login",
  component: ShigoAuthPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ShigoAuthPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const fullCanvas = (Story: typeof ShigoAuthPage) => (
  <div className="dark flex min-h-screen w-full items-center justify-center bg-background p-4 text-foreground sm:p-6">
    <Story />
  </div>
);

export const Default: Story = {
  args: { initialMode: "login", onSubmit: () => undefined },
  decorators: [fullCanvas],
};

export const Error: Story = {
  args: { initialMode: "login", error: "That email and password combination was not recognized.", onSubmit: () => undefined },
  decorators: [fullCanvas],
};
