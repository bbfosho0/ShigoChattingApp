import type { ReactNode } from "react";

import { AuthShaderPane } from "components/ui/auth-shader-pane";
import { cn } from "lib/utils";

export interface AuthShellProps {
  children: ReactNode;
  visual?: ReactNode;
  compact?: boolean;
  className?: string;
}

export function AuthShell({ children, visual, compact = false, className }: AuthShellProps) {
  if (compact) {
    return (
      <div className={cn("mx-auto flex min-h-[100dvh] w-full max-w-md items-center bg-background px-5 py-10 text-foreground sm:px-8", className)}>
        <div className="w-full">{children}</div>
      </div>
    );
  }

  return (
    <div className={cn("grid w-full max-w-6xl overflow-hidden bg-shigo-raised text-card-foreground sm:rounded-xl sm:border sm:border-border/45 sm:shadow-dialog lg:grid-cols-[1.08fr_0.92fr]", className)}>
      <div className="hidden lg:block">{visual ?? <AuthShaderPane />}</div>
      <div className="relative flex min-h-[34rem] items-center justify-center bg-gradient-to-br from-shigo-raised via-shigo-raised to-secondary/35 px-5 py-8 sm:p-10 lg:min-h-[38rem] lg:p-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
        <div className="relative w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
