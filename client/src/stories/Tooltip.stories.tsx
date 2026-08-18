import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Settings2 } from "lucide-react";

import { Button } from "components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";

function TooltipDemo() {
  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="Preferences">
            <Settings2 />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Preferences</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

const meta = {
  title: "Components/Tooltip",
  component: TooltipDemo,
  parameters: { layout: "centered" },
} satisfies Meta<typeof TooltipDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Dark: Story = {
  render: () => (
    <div className="dark rounded-xl bg-background p-10 text-foreground">
      <TooltipDemo />
    </div>
  ),
};
