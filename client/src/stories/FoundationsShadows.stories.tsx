import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ShadowsFoundation } from "components/ui/shigo-foundations";

const meta = {
  title: "Foundations/Shadows",
  component: ShadowsFoundation,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ShadowsFoundation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
