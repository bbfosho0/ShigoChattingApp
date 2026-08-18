import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

function TabsDemo() {
  return (
    <Tabs defaultValue="appearance" className="w-[min(34rem,82vw)]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="ambient">Ambient</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="rounded-lg border border-border bg-card p-5 text-sm">Account settings</TabsContent>
      <TabsContent value="appearance" className="rounded-lg border border-border bg-card p-5 text-sm">Appearance settings</TabsContent>
      <TabsContent value="ambient" className="rounded-lg border border-border bg-card p-5 text-sm">Ambient settings</TabsContent>
    </Tabs>
  );
}

const meta = {
  title: "Components/Tabs",
  component: TabsDemo,
  parameters: { layout: "centered" },
} satisfies Meta<typeof TabsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { render: () => <div className="dark rounded-xl bg-background p-8 text-foreground"><TabsDemo /></div> };
