import { ShigoShader } from "components/ui/shigo-shader";

export function AuthShaderPane() {
  return (
    <div className="relative flex h-full min-h-[32rem] flex-col justify-between overflow-hidden bg-[#090A0F] p-8 text-white lg:p-10">
      <ShigoShader />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-[#0d0d18]/10 to-black/45" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-12 right-0 w-px bg-gradient-to-b from-transparent via-[#9689ff]/25 to-transparent" />

      <div className="relative z-10 flex items-center gap-3">
        <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-md bg-white text-sm font-bold text-[#090A0F]">
          S
          <span aria-hidden="true" className="absolute inset-x-1 bottom-0 h-px bg-[#8173f5]/70" />
        </div>
        <div><p className="text-sm font-semibold tracking-[-0.01em]">ShigoChat</p><p className="text-[11px] text-white/45">Quiet Room</p></div>
      </div>

      <div className="relative z-10 max-w-md pb-4">
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">Shigo Midnight</p>
        <p className="font-brand text-5xl leading-[0.94] tracking-[-0.04em] text-white/95 lg:text-6xl">A quieter place to connect.</p>
        <p className="mt-6 max-w-sm text-sm leading-7 text-white/52">Conversation without the noise around it. Just enough interface to stay present.</p>
      </div>

      <div className="relative z-10 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/30">
        <span>Presence without pressure</span>
        <span>01 · Quiet Room</span>
      </div>
    </div>
  );
}
