import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Button } from "components/ui/button";
import { PreferencesContent, PreferencesShell, type PreferencesSection } from "components/ui/preferences-shell";

const meta = {
  title: "Settings/Preferences Shell",
  component: PreferencesShell,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PreferencesShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const commonProps = {
  name: "Yoshi",
  email: "yoshi@example.com",
  playing: true,
  volume: 55,
  progress: 42,
};

function PreferencesCanvas({ section = "account", mobile = false, theme = "dark" }: { section?: PreferencesSection; mobile?: boolean; theme?: "dark" | "light" }) {
  const themeClass = theme === "dark" ? "dark " : "";
  return (
    <div className={`${themeClass}flex min-h-screen w-full items-stretch justify-center overflow-hidden bg-background text-foreground`}>
      <div className={mobile ? "flex h-screen w-[390px] max-w-full min-w-0 flex-col overflow-hidden bg-card" : "flex h-screen w-full max-w-2xl min-w-0 flex-col bg-card"}>
        <div className="px-4 pb-3 pt-5 sm:px-6 sm:pb-4">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Preferences</h2>
          <p className="mt-1 text-sm text-muted-foreground">Account, appearance, ambient audio, and security.</p>
        </div>
        <PreferencesContent {...commonProps} theme={theme} defaultSection={section} />
      </div>
    </div>
  );
}

export const Drawer: Story = {
  render: () => (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <PreferencesShell {...commonProps} theme="dark">
        <Button variant="tertiary">Open preferences</Button>
      </PreferencesShell>
    </div>
  ),
};

export const Account: Story = { render: () => <PreferencesCanvas section="account" /> };
export const Appearance: Story = { render: () => <PreferencesCanvas section="appearance" /> };
export const Ambient: Story = { render: () => <PreferencesCanvas section="ambient" /> };
export const Security: Story = { render: () => <PreferencesCanvas section="security" /> };
export const MobileAccount: Story = { render: () => <PreferencesCanvas section="account" mobile /> };
export const MobileAppearance: Story = { render: () => <PreferencesCanvas section="appearance" mobile /> };
export const MobileAmbient: Story = { render: () => <PreferencesCanvas section="ambient" mobile /> };
export const MobileSecurity: Story = { render: () => <PreferencesCanvas section="security" mobile /> };
export const LightAppearance: Story = { render: () => <PreferencesCanvas section="appearance" theme="light" /> };
export const LightMobileAppearance: Story = { render: () => <PreferencesCanvas section="appearance" theme="light" mobile /> };
