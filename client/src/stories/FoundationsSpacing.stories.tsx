import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { SpacingFoundation } from "components/ui/shigo-foundations";

const meta = {
  title: "Foundations/Spacing",
  component: SpacingFoundation,
  parameters: { layout: "padded" },
} satisfies Meta<typeof SpacingFoundation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
