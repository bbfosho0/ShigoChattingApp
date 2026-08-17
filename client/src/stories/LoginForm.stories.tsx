import type { Meta, StoryObj } from "@storybook/react-webpack5";

import LoginFormDemo from "components/ui/login-form-demo";
import { LoginForm } from "components/ui/login-form";

const meta = {
  title: "Components/Login Form",
  component: LoginForm,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SmokeyBackground: Story = {
  render: () => <LoginFormDemo />,
};

export const FormOnly: Story = {
  render: () => (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <LoginForm />
    </main>
  ),
};
