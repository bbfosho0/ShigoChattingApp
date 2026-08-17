import type { Meta, StoryObj } from "@storybook/react-webpack5";

import MagneticCursorDemo from "components/ui/magnetic-cursor-demo";

const meta = {
  title: "Components/Magnetic Cursor",
  component: MagneticCursorDemo,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof MagneticCursorDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <MagneticCursorDemo />,
};

export const Dark: Story = {
  render: () => (
    <div className="dark">
      <MagneticCursorDemo />
    </div>
  ),
};
