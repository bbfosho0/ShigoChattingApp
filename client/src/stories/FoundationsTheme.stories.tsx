import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ThemeFoundation } from "components/ui/shigo-foundations";

const meta = {
  title: "Foundations/Theme",
  component: ThemeFoundation,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ThemeFoundation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
