import type { Meta, StoryObj } from "@storybook/react-webpack5";

import PricingTable from "components/ui/pricing-table";

const meta = {
  title: "Reference/PricingTable",
  component: PricingTable,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PricingTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  render: () => (
    <div className="dark bg-background p-6">
      <PricingTable />
    </div>
  ),
};
