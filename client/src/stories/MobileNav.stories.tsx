import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { AppShellPreview } from "components/ui/app-shell-preview";

const meta = {
  title: "Navigation/Mobile Nav",
  component: AppShellPreview,
  parameters: { layout: "centered" },
} satisfies Meta<typeof AppShellPreview>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { mobile: true } };
