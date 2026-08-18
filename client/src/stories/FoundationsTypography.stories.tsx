import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { TypographyFoundation } from "components/ui/shigo-foundations";

const meta = {
  title: "Foundations/Typography",
  component: TypographyFoundation,
  parameters: { layout: "padded" },
} satisfies Meta<typeof TypographyFoundation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dark: Story = {
  render: () => (
    <div className="dark rounded-2xl bg-background text-foreground">
      <TypographyFoundation />
    </div>
  ),
};
