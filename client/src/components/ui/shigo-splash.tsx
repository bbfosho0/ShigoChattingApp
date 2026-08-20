import { ArrowRight } from "lucide-react";

import { Button } from "components/ui/button";
import { MagneticCursor } from "components/ui/magnetic-cursor";
import { ShigoShader } from "components/ui/shigo-shader";

export interface ShigoSplashProps {
  magnetic?: boolean;
  showAction?: boolean;
  onContinue?: () => void;
}

function SplashContent({ showAction = true, onContinue }: Pick<ShigoSplashProps, "showAction" | "onContinue">) {
  return (
    <div
      data-shigo-splash
      className="relative flex min-h-screen min-h-[100dvh] w-full flex-col overflow-hidden bg-[#090A0F] text-white"
    >
      <ShigoShader />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/50" />

      <header className="relative z-10 flex items-center justify-between p-6 sm:p-8 lg:px-12 lg:py-10">
        <div data-magnetic className="flex items-center gap-3 rounded-lg px-2 py-1">
          <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-md bg-white text-sm font-bold text-[#090A0F]">
            S
            <span aria-hidden="true" className="absolute inset-x-1 bottom-0 h-px bg-primary/70" />
          </div>
          <div><p className="text-sm font-semibold tracking-[-0.01em]">ShigoChat</p><p className="text-[11px] text-white/45">Quiet Room</p></div>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">Shigo Midnight</span>
      </header>

      <main className="relative z-10 flex flex-1 items-center px-6 py-16 sm:px-10 lg:px-20 lg:py-20">
        <div className="max-w-[46rem]">
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.22em] text-white/30">Presence without pressure</p>
          <h1 className="font-brand text-6xl leading-[0.9] tracking-[-0.045em] text-white/95 sm:text-7xl lg:text-[6rem]">A quieter place to connect.</h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-white/55 sm:text-[15px]">A calm room for conversation, where the interface lowers its voice and leaves more space for the people inside it.</p>
          {showAction ? (
            <div className="mt-10" data-magnetic>
              <Button onClick={onContinue} trailingIcon={ArrowRight} className="bg-white text-[#090A0F] shadow-[0_10px_36px_rgba(0,0,0,0.18)] hover:bg-white/90">Enter Quiet Room</Button>
            </div>
          ) : null}
        </div>
      </main>

      <footer className="relative z-10 mx-6 flex justify-between border-t border-white/[0.06] py-6 text-[10px] uppercase tracking-[0.16em] text-white/30 sm:mx-8 sm:py-8 lg:mx-12 lg:py-9">
        <span>Conversation without the noise</span>
        <span>01 · ShigoChat</span>
      </footer>
    </div>
  );
}

export function ShigoSplash({ magnetic = false, showAction = true, onContinue }: ShigoSplashProps) {
  const content = <SplashContent showAction={showAction} onContinue={onContinue} />;
  return magnetic ? (
    <MagneticCursor magneticFactor={0.32} cursorSize={26} hoverPadding={8} blendMode="exclusion" contrastBoost={1.15}>
      {content}
    </MagneticCursor>
  ) : content;
}
