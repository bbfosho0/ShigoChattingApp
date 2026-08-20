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
    return <div className={cn("mx-auto w-full max-w-md rounded-xl border border-border/70 bg-card p-6 text-card-foreground shadow-floating sm:p-8", className)}>{children}</div>;
  }

  return (
    <div className={cn("grid w-full max-w-6xl overflow-hidden bg-card text-card-foreground sm:rounded-xl sm:border sm:border-border/70 sm:shadow-dialog lg:grid-cols-[1.08fr_0.92fr]", className)}>
      <div className="hidden lg:block">{visual ?? <AuthShaderPane />}</div>
      <div className="flex min-h-[34rem] items-center justify-center px-5 py-8 sm:p-10 lg:min-h-[38rem] lg:p-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
