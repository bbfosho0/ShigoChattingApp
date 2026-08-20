import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { AuthShell } from "components/ui/auth-shell";
import { ShigoBrandArtwork } from "components/ui/shigo-brand-artwork";
import { ShigoResetPassword, type ResetPasswordStatus } from "components/ui/shigo-reset-password";

interface ResetPasswordStoryProps {
  status?: ResetPasswordStatus;
  compact?: boolean;
}

function ResetPasswordStory({ status = "form", compact = false }: ResetPasswordStoryProps) {
  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-background p-0 text-foreground sm:p-6">
      <ShigoBrandArtwork imageClassName="scale-[1.03]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-background/28 backdrop-blur-[2px] dark:bg-[#090A0F]/36" />
      <div className="relative z-10 w-full">
        <AuthShell compact={compact}>
          <ShigoResetPassword
            status={status}
            onSubmit={() => undefined}
            onBackToLogin={() => undefined}
          />
        </AuthShell>
      </div>
    </div>
  );
}

const meta = {
  title: "Auth/Reset Password",
  component: ResetPasswordStory,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="dark min-h-[100dvh] bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResetPasswordStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { status: "form" } };
export const Invalid: Story = { args: { status: "invalid" } };
export const Success: Story = { args: { status: "success" } };
export const Mobile: Story = { args: { status: "form", compact: true } };
