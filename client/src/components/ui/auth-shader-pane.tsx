import { ShigoShader } from "components/ui/shigo-shader";

export function AuthShaderPane() {
  return (
    <div className="relative flex h-full min-h-[32rem] flex-col justify-between overflow-hidden bg-[#090A0F] p-8 text-white lg:p-10">
      <ShigoShader />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/30" />
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-md bg-white text-sm font-bold text-[#090A0F] shadow-panel">S</div>
        <div><p className="text-sm font-semibold">ShigoChat</p><p className="text-xs text-white/50">Quiet Room</p></div>
      </div>
      <div className="relative z-10 max-w-md">
        <p className="font-brand text-5xl leading-[0.96] tracking-[-0.035em] lg:text-6xl">A quieter place to connect.</p>
        <p className="mt-5 max-w-sm text-sm leading-6 text-white/55">Conversation without the noise around it.</p>
      </div>
      <p className="relative z-10 text-[11px] uppercase tracking-[0.16em] text-white/35">Shigo Midnight</p>
    </div>
  );
}
