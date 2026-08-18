import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ProfileMenu } from "components/ui/profile-menu";

const meta = {
  title: "Navigation/Profile Menu",
  component: ProfileMenu,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ProfileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: "Yoshi", email: "yoshi@example.com", theme: "dark", className: "w-64 border border-border bg-shigo-shell" },
};

export const Compact: Story = {
  args: { name: "Yoshi", email: "yoshi@example.com", compact: true, className: "w-14 border border-border bg-shigo-shell" },
};

export const Dark: Story = {
  render: () => <div className="dark rounded-xl bg-background p-8 text-foreground"><ProfileMenu className="w-64 border border-border bg-shigo-shell" /></div>,
};
