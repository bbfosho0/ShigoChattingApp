import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ShigoComposer } from "components/ui/shigo-composer";

const meta = {
  title: "Messaging/Composer",
  component: ShigoComposer,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ShigoComposer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <div className="w-[min(46rem,88vw)]"><ShigoComposer onSend={() => undefined} /></div>,
};

export const WithAttachment: Story = {
  render: () => (
    <div className="w-[min(46rem,88vw)]">
      <ShigoComposer
        onSend={() => undefined}
        initialAttachments={[{ id: "notes", name: "quiet-room-notes.txt", type: "text/plain" }]}
      />
    </div>
  ),
};

export const Replying: Story = {
  render: () => <div className="w-[min(46rem,88vw)]"><ShigoComposer replyingTo="No rush. I like how quiet this room feels." onCancelReply={() => undefined} onSend={() => undefined} /></div>,
};

export const Disabled: Story = {
  render: () => <div className="w-[min(46rem,88vw)]"><ShigoComposer disabled /></div>,
};

export const Dark: Story = {
  render: () => <div className="dark rounded-xl bg-background p-6 text-foreground"><div className="w-[min(46rem,80vw)]"><ShigoComposer onSend={() => undefined} /></div></div>,
};
