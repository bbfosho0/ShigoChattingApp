import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { ArrowRight, Plus, Trash2 } from "lucide-react";

import ButtonDemo from "components/ui/button-demo";
import { Button } from "components/ui/button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const PreviewSurface = ({ children, dark = false }: { children: ReactNode; dark?: boolean }) => (
  <div
    className={`${dark ? "dark " : ""}rounded-2xl border border-border bg-background p-8 text-foreground shadow-sm`}
  >
    {children}
  </div>
);

export const Default: Story = {
  render: () => <ButtonDemo />,
};

export const Variants: Story = {
  render: () => (
    <PreviewSurface>
      <div className="flex max-w-3xl flex-wrap items-center justify-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Legacy Outline</Button>
        <Button variant="link">Legacy Link</Button>
      </div>
    </PreviewSurface>
  ),
};

export const SizesAndIcons: Story = {
  render: () => (
    <PreviewSurface>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="sm" leadingIcon={Plus}>Small</Button>
        <Button size="md" trailingIcon={ArrowRight}>Medium</Button>
        <Button size="lg" trailingIcon={ArrowRight}>Large</Button>
        <Button size="icon-sm" aria-label="Add item"><Plus /></Button>
        <Button size="icon" aria-label="Add item"><Plus /></Button>
        <Button size="icon-lg" variant="destructive" aria-label="Delete item"><Trash2 /></Button>
      </div>
    </PreviewSurface>
  ),
};

export const Loading: Story = {
  render: () => (
    <PreviewSurface>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button loading>Loading</Button>
        <Button loading variant="secondary" leadingIcon={Plus}>Creating</Button>
        <Button loading size="icon" aria-label="Loading action"><Plus /></Button>
      </div>
    </PreviewSurface>
  ),
};

export const Dark: Story = {
  render: () => (
    <PreviewSurface dark>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="tertiary">Tertiary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </PreviewSurface>
  ),
};
