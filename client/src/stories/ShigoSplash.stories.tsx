import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ShigoSplash } from "components/ui/shigo-splash";

const meta = {
  title: "Experience/Splash",
  component: ShigoSplash,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ShigoSplash>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { showAction: true, onContinue: () => undefined },
};

export const Progress: Story = {
  args: { showAction: false, progress: 64 },
};

export const ReducedChrome: Story = {
  args: { showAction: false },
};
