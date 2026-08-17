import type { Meta, StoryObj } from "@storybook/react-webpack5";

import SignUpBlockDemo from "components/ui/sign-up-block-demo";
import SignUpBlock from "components/ui/sign-up-block";

const meta = {
  title: "Components/Sign Up Block",
  component: SignUpBlock,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof SignUpBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SignUpBlockDemo />,
};

export const Dark: Story = {
  render: () => (
    <main className="dark flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <SignUpBlock />
    </main>
  ),
};
