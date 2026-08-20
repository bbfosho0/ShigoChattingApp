import type { Meta, StoryObj } from "@storybook/react-webpack5";

import FeatureGrid from "components/ui/feature-grid";

const meta = {
  title: "Reference/FeatureGrid",
  component: FeatureGrid,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof FeatureGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  render: () => (
    <div className="dark bg-background p-6">
      <FeatureGrid />
    </div>
  ),
};
