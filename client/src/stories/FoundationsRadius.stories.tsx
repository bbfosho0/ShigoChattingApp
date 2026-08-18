import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { RadiusFoundation } from "components/ui/shigo-foundations";

const meta = {
  title: "Foundations/Radius",
  component: RadiusFoundation,
  parameters: { layout: "padded" },
} satisfies Meta<typeof RadiusFoundation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  render: () => (
    <div className="dark rounded-2xl bg-background text-foreground">
      <RadiusFoundation />
    </div>
  ),
};
