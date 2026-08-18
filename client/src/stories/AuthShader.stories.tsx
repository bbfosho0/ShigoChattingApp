import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { AuthShaderPane } from "components/ui/auth-shader-pane";

const meta = {
  title: "Experience/Auth Shader",
  component: AuthShaderPane,
  parameters: { layout: "centered" },
} satisfies Meta<typeof AuthShaderPane>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <div className="h-[38rem] w-[min(34rem,88vw)] overflow-hidden rounded-2xl shadow-dialog"><AuthShaderPane /></div>,
};
