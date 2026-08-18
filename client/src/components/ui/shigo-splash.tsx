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
    <div className="relative flex min-h-[36rem] w-full flex-col overflow-hidden bg-[#090A0F] text-white">
      <ShigoShader />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/35" />
      <header className="relative z-10 flex items-center justify-between p-6 sm:p-8 lg:p-10">
        <div data-magnetic className="flex items-center gap-3 rounded-lg px-2 py-1">
          <div className="flex size-10 items-center justify-center rounded-md bg-white text-sm font-bold text-[#090A0F]">S</div>
          <div><p className="text-sm font-semibold">ShigoChat</p><p className="text-[11px] text-white/45">Quiet Room</p></div>
        </div>
        <span className="text-[10px] uppercase tracking-[0.16em] text-white/30">Shigo Midnight</span>
      </header>

      <main className="relative z-10 flex flex-1 items-center px-6 py-14 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <h1 className="font-brand text-6xl leading-[0.92] tracking-[-0.04em] sm:text-7xl lg:text-8xl">A quieter place to connect.</h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-white/55 sm:text-[15px]">A calm room for conversation, without the interface fighting for your attention.</p>
          {showAction ? (
            <div className="mt-9" data-magnetic>
              <Button onClick={onContinue} trailingIcon={ArrowRight} className="bg-white text-[#090A0F] hover:bg-white/90">Enter Quiet Room</Button>
            </div>
          ) : null}
        </div>
      </main>

      <footer className="relative z-10 flex justify-between p-6 text-[10px] uppercase tracking-[0.16em] text-white/30 sm:p-8 lg:p-10">
        <span>Presence without pressure</span>
        <span>ShigoChat</span>
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
