import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { AccountSettingsPanel } from "components/ui/settings-panels";

const meta = { title: "Settings/Account", component: AccountSettingsPanel, parameters: { layout: "centered" } } satisfies Meta<typeof AccountSettingsPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { name: "Yoshi", email: "yoshi@example.com", onSave: () => undefined }, decorators: [(Story) => <div className="w-[min(38rem,88vw)]"><Story /></div>] };
export const Dark: Story = { render: () => <div className="dark w-[min(42rem,90vw)] rounded-xl bg-background p-6 text-foreground"><AccountSettingsPanel /></div> };
