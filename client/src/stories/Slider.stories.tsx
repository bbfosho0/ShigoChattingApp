import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Slider } from "components/ui/slider";

function SliderDemo() {
  return (
    <div className="w-[min(30rem,80vw)] space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Ambient volume</span>
        <span className="text-muted-foreground">55%</span>
      </div>
      <Slider defaultValue={[55]} max={100} step={1} aria-label="Ambient volume" />
    </div>
  );
}

const meta = {
  title: "Components/Slider",
  component: SliderDemo,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SliderDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { render: () => <div className="dark rounded-xl bg-background p-8 text-foreground"><SliderDemo /></div> };
