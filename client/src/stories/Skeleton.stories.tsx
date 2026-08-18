import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Skeleton } from "components/ui/skeleton";

function SkeletonDemo() {
  return (
    <div className="w-[min(34rem,82vw)] space-y-5 rounded-xl border border-border bg-card p-5">
      {[0, 1, 2].map((item) => (
        <div key={item} className="flex items-start gap-3">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: "Components/Skeleton",
  component: SkeletonDemo,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SkeletonDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { render: () => <div className="dark rounded-xl bg-background p-8"><SkeletonDemo /></div> };
