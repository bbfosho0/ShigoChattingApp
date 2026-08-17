import type { Meta, StoryObj } from "@storybook/react-webpack5";

import ScreenSizeDemo from "components/ui/use-screen-size-demo";

const meta = {
  title: "Hooks/useScreenSize",
  component: ScreenSizeDemo,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ScreenSizeDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <main className="min-h-screen bg-background text-foreground">
      <ScreenSizeDemo />
    </main>
  ),
};

export const Dark: Story = {
  render: () => (
    <main className="dark min-h-screen bg-background text-foreground">
      <ScreenSizeDemo />
    </main>
  ),
};
