import { ArrowUpRight, Menu } from "lucide-react";

import { MagneticCursor } from "components/ui/magnetic-cursor";

export default function MagneticCursorDemo() {
  return (
    <MagneticCursor magneticFactor={0.55} blendMode="exclusion" cursorSize={40}>
      <div className="fixed inset-0 isolate flex h-full w-full flex-col overflow-hidden bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <header className="relative z-10 flex shrink-0 items-center justify-between p-6 sm:p-8 lg:p-10">
          <div
            data-magnetic
            className="text-lg font-bold tracking-tighter mix-blend-difference sm:text-xl"
          >
            ShigoChat
          </div>

          <button
            type="button"
            data-magnetic
            aria-label="Open navigation"
            className="group relative flex size-12 items-center justify-center rounded-full border-2 border-border bg-secondary/90 backdrop-blur-sm transition-colors hover:bg-secondary sm:size-14"
          >
            <Menu className="pointer-events-none size-5 stroke-1 text-foreground sm:size-6" />
          </button>
        </header>

        <main className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-7 px-6 py-6 sm:gap-9 sm:py-8">
          <div className="space-y-3 text-center">
            <h1 className="text-5xl font-medium leading-[0.92] tracking-tighter sm:text-6xl lg:text-7xl">
              Fluid <br />
              <span className="text-muted-foreground">Interaction</span>
            </h1>
          </div>

          <div
            data-magnetic
            data-magnetic-color="white"
            className="relative flex h-28 w-[min(88vw,24rem)] shrink-0 items-center justify-between overflow-hidden rounded-2xl bg-primary px-6 text-primary-foreground shadow-2xl sm:h-32 sm:px-8"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-widest opacity-60">
                Try Hovering
              </span>
              <span className="text-xl font-bold tracking-tight sm:text-2xl">
                Smart Contrast
              </span>
            </div>
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground text-primary sm:size-12">
              <ArrowUpRight className="pointer-events-none size-5" />
            </div>
          </div>

          <p className="max-w-md text-center text-sm leading-relaxed text-muted-foreground">
            A physics-based cursor wrapper with velocity stretch, magnetic
            snapping, and contrast-aware blending.
          </p>
        </main>

        <footer className="relative z-10 flex w-full shrink-0 justify-between px-6 py-6 text-[11px] uppercase tracking-widest text-muted-foreground sm:px-8 lg:px-10">
          <span>GSAP Motion</span>
          <span>Vecteur Math</span>
        </footer>
      </div>
    </MagneticCursor>
  );
}
