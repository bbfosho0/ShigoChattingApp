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
  parameters: {
    layout: "centered",
  },
  render: () => (
    <div className="rounded-3xl bg-gray-900 p-8 shadow-xl">
      <LoginForm />
    </div>
  ),
};
