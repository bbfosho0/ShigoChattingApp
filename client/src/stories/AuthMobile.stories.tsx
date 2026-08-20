import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ShigoAuthPage } from "components/ui/shigo-auth-page";

const meta = {
  title: "Auth/Mobile",
  component: ShigoAuthPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ShigoAuthPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {
  args: { initialMode: "login", compact: true, onSubmit: () => undefined },
  decorators: [(Story) => <div className="dark min-h-screen w-full bg-background text-foreground"><Story /></div>],
};

export const Register: Story = {
  args: { initialMode: "register", compact: true, onSubmit: () => undefined },
  decorators: [(Story) => <div className="dark min-h-screen w-full bg-background text-foreground"><Story /></div>],
};
