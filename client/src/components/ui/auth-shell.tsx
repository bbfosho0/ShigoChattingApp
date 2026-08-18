import type { ReactNode } from "react";

import { cn } from "lib/utils";

export interface AuthShellProps {
  children: ReactNode;
  visual?: ReactNode;
  compact?: boolean;
  className?: string;
}

export function AuthVisualPlaceholder() {
  return (
    <div className="relative flex h-full min-h-[32rem] flex-col justify-between overflow-hidden bg-[#090A0F] p-8 text-white lg:p-10">
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -left-24 top-12 size-80 rounded-full bg-[#8173F5]/25 blur-[90px]" />
        <div className="absolute bottom-0 right-[-5rem] size-72 rounded-full bg-[#58CFC0]/10 blur-[100px]" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>
      <div className="relative z-10 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-md bg-white text-sm font-bold text-[#090A0F]">S</div><div><p className="text-sm font-semibold">ShigoChat</p><p className="text-xs text-white/50">Quiet Room</p></div></div>
      <div className="relative z-10 max-w-md"><p className="font-brand text-5xl leading-[0.96] tracking-[-0.035em] lg:text-6xl">A quieter place to connect.</p><p className="mt-5 max-w-sm text-sm leading-6 text-white/55">Conversation without the noise around it.</p></div>
      <p className="relative z-10 text-[11px] uppercase tracking-[0.16em] text-white/35">Shigo Midnight</p>
    </div>
  );
}

export function AuthShell({ children, visual, compact = false, className }: AuthShellProps) {
  if (compact) {
    return <div className={cn("mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-dialog sm:p-8", className)}>{children}</div>;
  }

  return (
    <div className={cn("grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-dialog lg:grid-cols-[1.05fr_0.95fr]", className)}>
      <div className="hidden lg:block">{visual ?? <AuthVisualPlaceholder />}</div>
      <div className="flex min-h-[34rem] items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
