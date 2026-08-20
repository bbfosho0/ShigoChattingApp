import { motion } from "motion/react";

import { ShigoBrandArtwork } from "components/ui/shigo-brand-artwork";
import { ShigoShader } from "components/ui/shigo-shader";
import { shigoAmbient, shigoSpringSoft } from "lib/shigo-motion";

export function AuthShaderPane() {
  return (
    <div className="relative flex h-full min-h-[32rem] flex-col justify-between overflow-hidden bg-[#090A0F] p-8 text-white lg:p-10">
      <motion.div
        data-shigo-auth-art-motion
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-1.5%]"
        animate={{ scale: [1, 1.018, 1], x: [0, 6, 0], y: [0, -3, 0] }}
        transition={shigoAmbient}
      >
        <ShigoBrandArtwork imageClassName="scale-[1.04]" />
      </motion.div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-35 mix-blend-screen">
        <ShigoShader />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/8 via-black/12 to-black/60" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-12 right-0 w-px bg-gradient-to-b from-transparent via-primary/25 to-transparent" />

      <motion.div className="relative z-10 flex items-center gap-3" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...shigoSpringSoft, delay: 0.08 }}>
        <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-md bg-white text-sm font-bold text-[#090A0F]">
          S
          <span aria-hidden="true" className="absolute inset-x-1 bottom-0 h-px bg-primary/70" />
        </div>
        <div><p className="text-sm font-semibold tracking-[-0.01em]">ShigoChat</p><p className="text-[11px] text-white/55">Quiet Room</p></div>
      </motion.div>

      <motion.div className="relative z-10 max-w-md pb-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...shigoSpringSoft, delay: 0.14 }}>
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">Shigo Midnight</p>
        <p className="font-brand text-5xl leading-[0.94] tracking-[-0.04em] text-white/95 lg:text-6xl">A quieter place to connect.</p>
        <p className="mt-6 max-w-sm text-sm leading-7 text-white/65">Conversation without the noise around it. Just enough interface to stay present.</p>
      </motion.div>

      <motion.div className="relative z-10 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.34, duration: 0.45 }}>
        <span>Presence without pressure</span>
        <span>01 · Quiet Room</span>
      </motion.div>
    </div>
  );
}
