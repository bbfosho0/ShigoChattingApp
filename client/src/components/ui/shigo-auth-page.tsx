import { useState } from "react";

import { AuthShell, type AuthShellProps } from "components/ui/auth-shell";
import { ShigoAuthForm, type AuthMode, type AuthValues } from "components/ui/shigo-auth-form";
import { ShigoBrandArtwork } from "components/ui/shigo-brand-artwork";

export interface ShigoAuthPageProps {
  initialMode?: AuthMode;
  compact?: boolean;
  loading?: boolean;
  error?: string;
  success?: string;
  onSubmit?: (mode: AuthMode, values: AuthValues) => void;
  visual?: AuthShellProps["visual"];
}

export function ShigoAuthPage({ initialMode = "login", compact = false, loading, error, success, onSubmit, visual }: ShigoAuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-background p-0 sm:p-6">
      <ShigoBrandArtwork imageClassName="scale-[1.03]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-background/28 backdrop-blur-[2px] dark:bg-[#090A0F]/36" />
      <div className="relative z-10 w-full">
        <AuthShell compact={compact} visual={visual}>
          <ShigoAuthForm mode={mode} loading={loading} error={error} success={success} onModeChange={setMode} onSubmit={(values) => onSubmit?.(mode, values)} />
        </AuthShell>
      </div>
    </div>
  );
}
