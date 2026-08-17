import type { Meta, StoryObj } from "@storybook/react-webpack5";

import MenuDemo from "components/ui/fluid-menu-demo";

const meta = {
  title: "Components/Fluid Menu",
  component: MenuDemo,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MenuDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <main className="flex min-h-screen items-start justify-center bg-background p-12 text-foreground">
      <MenuDemo />
    </main>
  ),
};

export const Dark: Story = {
  render: () => (
    <main className="dark flex min-h-screen items-start justify-center bg-background p-12 text-foreground">
      <MenuDemo />
    </main>
  ),
};
