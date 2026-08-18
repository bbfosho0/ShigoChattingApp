import type { Meta, StoryObj } from "@storybook/react-webpack5";

import MenuDemo from "components/ui/fluid-menu-demo";

const meta = {
  title: "Components/Fluid Menu",
  component: MenuDemo,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof MenuDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="min-h-[26rem] min-w-[22rem] rounded-3xl border border-border bg-background p-6 text-foreground shadow-sm">
      <MenuDemo />
    </div>
  ),
};

export const Dark: Story = {
  render: () => (
    <div className="dark min-h-[26rem] min-w-[22rem] rounded-3xl border border-border bg-background p-6 text-foreground shadow-sm">
      <MenuDemo />
    </div>
  ),
};
