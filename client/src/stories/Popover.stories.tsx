import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { Smile } from "lucide-react";

import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";

function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="tertiary" leadingIcon={Smile}>Add reaction</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <p className="text-sm font-semibold">Quick reactions</p>
        <div className="mt-3 flex gap-2 text-xl" aria-label="Reaction choices">
          {['👍', '❤️', '😂', '🎉', '👀'].map((emoji) => (
            <button key={emoji} type="button" className="rounded-md p-2 hover:bg-accent focus-visible:shadow-focus">
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const meta = {
  title: "Components/Popover",
  component: PopoverDemo,
  parameters: { layout: "centered" },
} satisfies Meta<typeof PopoverDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Dark: Story = {
  render: () => <div className="dark rounded-xl bg-background p-10 text-foreground"><PopoverDemo /></div>,
};
