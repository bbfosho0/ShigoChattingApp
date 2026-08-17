import { ArrowUpRight, Menu } from "lucide-react";

import { MagneticCursor } from "components/ui/magnetic-cursor";

export default function MagneticCursorDemo() {
  return (
    <MagneticCursor magneticFactor={0.55} blendMode="exclusion" cursorSize={40}>
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <header className="relative z-10 flex items-center justify-between p-8 md:p-12">
          <div
            data-magnetic
            className="text-xl font-bold tracking-tighter mix-blend-difference"
          >
            ShigoChat
          </div>

          <button
            type="button"
            data-magnetic
            aria-label="Open navigation"
            className="group relative flex size-14 items-center justify-center rounded-full border-2 border-border bg-secondary/90 backdrop-blur-sm transition-colors hover:bg-secondary"
          >
            <Menu className="pointer-events-none size-6 stroke-1 text-foreground" />
          </button>
        </header>

        <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-12 p-6">
          <div className="space-y-4 text-center">
            <h1 className="text-6xl font-medium leading-[0.9] tracking-tighter md:text-8xl">
              Fluid <br />
              <span className="text-muted-foreground">Interaction</span>
            </h1>
          </div>

          <div
            data-magnetic
            data-magnetic-color="white"
            className="relative flex h-32 w-full max-w-sm items-center justify-between overflow-hidden rounded-2xl bg-primary px-8 text-primary-foreground shadow-2xl"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium uppercase tracking-widest opacity-60">
                Try Hovering
              </span>
              <span className="text-2xl font-bold tracking-tight">
                Smart Contrast
              </span>
            </div>
            <div className="flex size-12 items-center justify-center rounded-full bg-primary-foreground text-primary">
              <ArrowUpRight className="pointer-events-none size-5" />
            </div>
          </div>

          <p className="max-w-md text-center text-sm leading-relaxed text-muted-foreground">
            A physics-based cursor wrapper with velocity stretch, magnetic
            snapping, and contrast-aware blending.
          </p>
        </main>

        <footer className="relative z-10 flex w-full justify-between p-8 text-xs uppercase tracking-widest text-muted-foreground md:p-12">
          <span>GSAP Motion</span>
          <span>Vecteur Math</span>
        </footer>
      </div>
    </MagneticCursor>
  );
}
