import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ColorsFoundation } from "components/ui/shigo-foundations";

const meta = {
  title: "Foundations/Colors",
  component: ColorsFoundation,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ColorsFoundation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
