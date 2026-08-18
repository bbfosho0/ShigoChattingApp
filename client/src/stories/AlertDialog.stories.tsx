import type { Meta, StoryObj } from "@storybook/react-webpack5";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "components/ui/alert-dialog";
import { Button } from "components/ui/button";

function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild><Button variant="destructive">Clear history</Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear conversation history?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. Your local view of the conversation will be cleared.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Clear history</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const meta = {
  title: "Components/Alert Dialog",
  component: AlertDialogDemo,
  parameters: { layout: "centered" },
} satisfies Meta<typeof AlertDialogDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { render: () => <div className="dark rounded-xl bg-background p-10 text-foreground"><AlertDialogDemo /></div> };
