import type { Meta, StoryObj } from "@storybook/react-webpack5";

import ScreenSizeDemo from "components/ui/use-screen-size-demo";

const meta = {
  title: "Hooks/useScreenSize",
  component: ScreenSizeDemo,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ScreenSizeDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="rounded-2xl bg-background text-foreground">
      <ScreenSizeDemo />
    </div>
  ),
};

export const Dark: Story = {
  render: () => (
    <div className="dark rounded-2xl bg-background text-foreground">
      <ScreenSizeDemo />
    </div>
  ),
};
