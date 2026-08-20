import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ShigoAuthPage } from "components/ui/shigo-auth-page";

const meta = {
  title: "Auth/Register",
  component: ShigoAuthPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ShigoAuthPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { initialMode: "register", onSubmit: () => undefined },
  decorators: [(Story) => <div className="dark flex min-h-screen w-full items-center justify-center bg-background p-4 text-foreground sm:p-6"><Story /></div>],
};
