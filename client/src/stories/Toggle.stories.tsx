import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Moon } from "lucide-react";

import { Toggle } from "components/ui/toggle";

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Quiet mode",
    variant: "outline",
  },
};

export const Icon: Story = {
  render: () => <Toggle size="icon" variant="outline" aria-label="Toggle dark mode"><Moon size={16} /></Toggle>,
};

export const Dark: Story = {
  render: () => <div className="dark rounded-xl bg-background p-8 text-foreground"><Toggle variant="outline">Quiet mode</Toggle></div>,
};
