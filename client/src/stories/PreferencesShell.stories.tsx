import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Button } from "components/ui/button";
import { PreferencesContent, PreferencesShell } from "components/ui/preferences-shell";

const meta = {
  title: "Settings/Preferences Shell",
  component: PreferencesShell,
  parameters: { layout: "centered" },
} satisfies Meta<typeof PreferencesShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Drawer: Story = {
  render: () => (
    <PreferencesShell name="Yoshi" email="yoshi@example.com" theme="dark" playing volume={55} progress={42}>
      <Button variant="tertiary">Open preferences</Button>
    </PreferencesShell>
  ),
};

export const OpenCanvas: Story = {
  render: () => (
    <div className="dark h-[42rem] w-[min(44rem,90vw)] overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-dialog">
      <div className="flex h-full flex-col"><div className="border-b border-border px-6 py-5"><h2 className="text-xl font-semibold">Preferences</h2><p className="mt-1 text-sm text-muted-foreground">Account, appearance, ambient audio, and security in one place.</p></div><PreferencesContent name="Yoshi" email="yoshi@example.com" theme="dark" playing volume={55} progress={42} /></div>
    </div>
  ),
};
