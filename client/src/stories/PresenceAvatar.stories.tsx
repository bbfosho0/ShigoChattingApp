import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { PresenceAvatar } from "components/ui/presence-avatar";

function PresenceSet() {
  return (
    <div className="flex items-center gap-6">
      <div className="space-y-2 text-center"><PresenceAvatar fallback="YG" presence="online" /><p className="text-xs text-muted-foreground">Online</p></div>
      <div className="space-y-2 text-center"><PresenceAvatar fallback="AL" presence="away" /><p className="text-xs text-muted-foreground">Away</p></div>
      <div className="space-y-2 text-center"><PresenceAvatar fallback="MK" presence="offline" /><p className="text-xs text-muted-foreground">Offline</p></div>
    </div>
  );
}

const meta = {
  title: "Components/Presence Avatar",
  component: PresenceAvatar,
  parameters: { layout: "centered" },
} satisfies Meta<typeof PresenceAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = { args: { fallback: "YG" }, render: () => <PresenceSet /> };
export const Dark: Story = { args: { fallback: "YG" }, render: () => <div className="dark rounded-xl bg-background p-8 text-foreground"><PresenceSet /></div> };
