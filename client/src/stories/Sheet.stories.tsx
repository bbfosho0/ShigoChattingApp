import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Button } from "components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "components/ui/sheet";

function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild><Button variant="tertiary">Open preferences</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Preferences</SheetTitle>
          <SheetDescription>Manage your ShigoChat experience.</SheetDescription>
        </SheetHeader>
        <SheetBody className="pt-6">
          <div className="space-y-3">
            {['Account', 'Appearance', 'Ambient', 'Security'].map((item) => (
              <div key={item} className="rounded-lg border border-border bg-secondary p-4 text-sm font-medium">{item}</div>
            ))}
          </div>
        </SheetBody>
        <SheetFooter><Button>Done</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const meta = {
  title: "Components/Sheet",
  component: SheetDemo,
  parameters: { layout: "centered" },
} satisfies Meta<typeof SheetDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { render: () => <div className="dark rounded-xl bg-background p-10 text-foreground"><SheetDemo /></div> };
