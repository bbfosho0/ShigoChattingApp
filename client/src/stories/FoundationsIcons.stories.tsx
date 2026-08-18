import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { IconsFoundation } from "components/ui/shigo-foundations";

const meta = {
  title: "Foundations/Icons",
  component: IconsFoundation,
  parameters: { layout: "padded" },
} satisfies Meta<typeof IconsFoundation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
