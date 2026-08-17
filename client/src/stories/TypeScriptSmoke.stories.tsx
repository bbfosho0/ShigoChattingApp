import type { Meta, StoryObj } from "@storybook/react-webpack5";

type TypeScriptSmokeProps = {
  label: string;
};

function TypeScriptSmoke({ label }: TypeScriptSmokeProps) {
  return (
    <button
      type="button"
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
    >
      {label}
    </button>
  );
}

const meta = {
  title: "Baseline/TypeScript",
  component: TypeScriptSmoke,
  args: {
    label: "TSX is compiling"
  }
} satisfies Meta<typeof TypeScriptSmoke>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
