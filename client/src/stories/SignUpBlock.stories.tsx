import type { Meta, StoryObj } from "@storybook/react-webpack5";

import SignUpBlockDemo from "components/ui/sign-up-block-demo";
import SignUpBlock from "components/ui/sign-up-block";

const meta = {
  title: "Components/Sign Up Block",
  component: SignUpBlock,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SignUpBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <SignUpBlockDemo />,
};

export const Dark: Story = {
  render: () => (
    <div className="dark rounded-2xl bg-background p-2 text-foreground">
      <SignUpBlock />
    </div>
  ),
};
