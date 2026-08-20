import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { QuietRoomComposition } from "components/ui/quiet-room-composition";

const meta = {
  title: "Compositions/Quiet Room",
  component: QuietRoomComposition,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof QuietRoomComposition>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = { args: {} };
export const DesktopSidebarCollapsed: Story = { args: { collapsed: true } };
export const Tablet: Story = { args: { tablet: true } };
export const Mobile: Story = { args: { mobile: true } };
export const Empty: Story = { args: { state: "empty" } };
export const Loading: Story = { args: { state: "loading" } };
export const PreferencesOpen: Story = { args: { preferencesOpen: true } };
