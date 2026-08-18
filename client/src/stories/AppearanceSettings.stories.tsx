import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { AppearanceSettingsPanel } from "components/ui/settings-panels";

function Demo() { const [theme, setTheme] = useState<"light" | "dark">("dark"); return <AppearanceSettingsPanel theme={theme} onThemeChange={setTheme} />; }
const meta = { title: "Settings/Appearance", component: AppearanceSettingsPanel, parameters: { layout: "centered" } } satisfies Meta<typeof AppearanceSettingsPanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { render: () => <div className="w-[min(38rem,88vw)]"><Demo /></div> };
export const Dark: Story = { render: () => <div className="dark w-[min(42rem,90vw)] rounded-xl bg-background p-6 text-foreground"><Demo /></div> };
