import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ShigoSplash } from "components/ui/shigo-splash";

const meta = {
  title: "Experience/Magnetic Cursor",
  component: ShigoSplash,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ShigoSplash>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SplashInteraction: Story = {
  args: {
    magnetic: true,
    showAction: true,
    onContinue: () => undefined,
  },
};
