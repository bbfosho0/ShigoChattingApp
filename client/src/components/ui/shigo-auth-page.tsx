import { useState } from "react";

import { AuthShell, type AuthShellProps } from "components/ui/auth-shell";
import { ShigoAuthForm, type AuthMode, type AuthValues } from "components/ui/shigo-auth-form";

export interface ShigoAuthPageProps {
  initialMode?: AuthMode;
  compact?: boolean;
  loading?: boolean;
  error?: string;
  onSubmit?: (mode: AuthMode, values: AuthValues) => void;
  visual?: AuthShellProps["visual"];
}

export function ShigoAuthPage({ initialMode = "login", compact = false, loading, error, onSubmit, visual }: ShigoAuthPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  return (
    <AuthShell compact={compact} visual={visual}>
      <ShigoAuthForm mode={mode} loading={loading} error={error} onModeChange={setMode} onSubmit={(values) => onSubmit?.(mode, values)} />
    </AuthShell>
  );
}
