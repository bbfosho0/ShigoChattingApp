import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { AppShellPreview } from "components/ui/app-shell-preview";

const meta = {
  title: "Navigation/App Sidebar",
  component: AppShellPreview,
  parameters: { layout: "centered" },
} satisfies Meta<typeof AppShellPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = { args: { defaultCollapsed: false } };
export const Collapsed: Story = { args: { defaultCollapsed: true } };
