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
    return <div className={cn("mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-dialog sm:p-8", className)}>{children}</div>;
  }

  return (
    <div className={cn("grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-dialog lg:grid-cols-[1.05fr_0.95fr]", className)}>
      <div className="hidden lg:block">{visual ?? <AuthShaderPane />}</div>
      <div className="flex min-h-[34rem] items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
