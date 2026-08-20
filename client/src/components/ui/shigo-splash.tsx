import { ArrowRight } from "lucide-react";

import { Button } from "components/ui/button";
import { MagneticCursor } from "components/ui/magnetic-cursor";
import { ShigoBrandArtwork } from "components/ui/shigo-brand-artwork";
import { ShigoShader } from "components/ui/shigo-shader";

export interface ShigoSplashProps {
  onContinue?: () => void;
  showAction?: boolean;
  magnetic?: boolean;
  className?: string;
}

function SplashMark() {
  return (
    <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-md bg-foreground text-sm font-bold text-background ring-1 ring-inset ring-primary/25">
      S
      <span aria-hidden="true" className="absolute inset-x-1 bottom-0 h-px bg-primary/80" />
    </div>
  );
}

export function ShigoSplash({
  onContinue,
  showAction = true,
  magnetic = false,
  className,
}: ShigoSplashProps) {
  const content = (
    <div
      data-shigo-splash
      className={`relative flex min-h-screen min-h-[100dvh] w-full flex-col overflow-hidden bg-background text-foreground ${className ?? ""}`}
    >
      <ShigoBrandArtwork imageClassName="scale-[1.02]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.28] dark:opacity-[0.38]">
        <ShigoShader />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,hsl(var(--background)/0.06)_42%,hsl(var(--background)/0.72)_100%)] dark:bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(9,10,15,0.12)_40%,rgba(9,10,15,0.78)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/5 via-background/10 to-background/55 dark:from-black/5 dark:via-black/10 dark:to-black/55"
      />

      <header className="relative z-10 flex h-20 items-center justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <SplashMark />
          <div>
            <p className="text-[13px] font-semibold tracking-[-0.01em]">ShigoChat</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Quiet Room</p>
          </div>
        </div>
        <span className="hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">Presence without pressure</span>
      </header>

      <main className="relative z-10 flex flex-1 items-center px-5 pb-20 pt-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-5xl">
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">Shigo Midnight</p>
          <h1 className="max-w-4xl font-brand text-[clamp(3.5rem,9vw,8.8rem)] leading-[0.84] tracking-[-0.055em] text-foreground">
            A quieter place
            <span className="block text-foreground/72">to connect.</span>
          </h1>
          <div className="mt-9 flex max-w-xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-sm text-sm leading-7 text-foreground/66 sm:text-[15px]">
              Conversation without the noise around it. A shared room designed to feel present, personal, and gently alive.
            </p>
            {showAction ? (
              <Button onClick={onContinue} trailingIcon={ArrowRight} size="lg" className="w-fit shadow-panel">
                Enter Quiet Room
              </Button>
            ) : null}
          </div>
        </div>
      </main>

      <footer className="relative z-10 flex items-end justify-between px-5 pb-6 text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:px-8 lg:px-12">
        <span>01 · Quiet Room</span>
        <span className="hidden sm:inline">Light / Dark · Reduced motion aware</span>
      </footer>
    </div>
  );

  return magnetic ? <MagneticCursor>{content}</MagneticCursor> : content;
}
