import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";

function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="tertiary">Open dialog</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename room</DialogTitle>
          <DialogDescription>Room names should stay short and recognizable.</DialogDescription>
        </DialogHeader>
        <div className="rounded-md border border-border bg-secondary px-3 py-2 text-sm">Quiet Room</div>
        <DialogFooter>
          <Button variant="tertiary">Cancel</Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: "Components/Dialog",
  component: DialogDemo,
  parameters: { layout: "centered" },
} satisfies Meta<typeof DialogDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { render: () => <div className="dark rounded-xl bg-background p-10 text-foreground"><DialogDemo /></div> };
