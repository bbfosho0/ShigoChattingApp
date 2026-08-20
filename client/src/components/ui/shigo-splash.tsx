import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "components/ui/button";
import { MagneticCursor } from "components/ui/magnetic-cursor";
import { ShigoBrandArtwork } from "components/ui/shigo-brand-artwork";
import { ShigoShader } from "components/ui/shigo-shader";
import { shigoAmbient, shigoSpringSoft } from "lib/shigo-motion";

export interface ShigoSplashProps {
  onContinue?: () => void;
  showAction?: boolean;
  magnetic?: boolean;
  progress?: number;
  className?: string;
}

function SplashMark() {
  return (
    <motion.div
      data-testid="shigo-moon-mark"
      aria-hidden="true"
      className="relative flex size-11 items-center justify-center"
      initial={{ opacity: 0, scale: 0.94, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ ...shigoSpringSoft, delay: 0.08 }}
    >
      <motion.svg
        width="44"
        height="44"
        viewBox="0 0 64 64"
        fill="none"
        className="overflow-visible drop-shadow-[0_8px_24px_hsl(var(--primary)/0.2)]"
        animate={{ opacity: [0.82, 1, 0.82], scale: [1, 1.025, 1] }}
        transition={{ duration: 4.8, ease: "easeInOut", repeat: Infinity }}
      >
        <path
          d="M32 8 C18 8, 8 19, 8 32 C8 45, 18 56, 32 56 C24 50, 20 42, 20 32 C20 22, 24 14, 32 8Z"
          fill="currentColor"
          className="text-primary"
        />
        <circle cx="39" cy="18" r="3" fill="currentColor" className="text-foreground" opacity="0.55" />
        <circle cx="45" cy="28" r="2" fill="currentColor" className="text-primary" opacity="0.38" />
      </motion.svg>
    </motion.div>
  );
}

export function ShigoSplash({
  onContinue,
  showAction = true,
  magnetic = false,
  progress,
  className,
}: ShigoSplashProps) {
  const normalizedProgress = Math.min(100, Math.max(0, progress ?? 0));

  const content = (
    <motion.div
      data-shigo-splash
      initial={{ opacity: 0, scale: 1.008 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.012 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex min-h-screen min-h-[100dvh] w-full flex-col overflow-hidden bg-background text-foreground ${className ?? ""}`}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-1.5%]"
        animate={{ scale: [1, 1.018, 1], x: [0, 7, 0], y: [0, -3, 0] }}
        transition={shigoAmbient}
      >
        <ShigoBrandArtwork imageClassName="scale-[1.02]" />
      </motion.div>
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

      <motion.header
        className="relative z-10 flex h-20 items-center justify-between px-5 sm:px-8 lg:px-12"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...shigoSpringSoft, delay: 0.12 }}
      >
        <div className="flex items-center gap-3">
          <SplashMark />
          <div>
            <p className="text-[13px] font-semibold tracking-[-0.01em]">ShigoChat</p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Quiet Room</p>
          </div>
        </div>
        <span className="hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">Presence without pressure</span>
      </motion.header>

      <main className="relative z-10 flex flex-1 items-center px-5 pb-20 pt-8 sm:px-8 lg:px-12">
        <motion.div
          className="w-full max-w-5xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.14 } },
          }}
        >
          <motion.p
            className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground"
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
          >
            Shigo Midnight
          </motion.p>
          <motion.h1
            className="max-w-4xl font-brand text-[clamp(3.5rem,9vw,8.8rem)] leading-[0.84] tracking-[-0.055em] text-foreground"
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
          >
            A quieter place
            <span className="block text-foreground/72">to connect.</span>
          </motion.h1>
          <motion.div
            className="mt-9 flex max-w-xl flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          >
            <p className="max-w-sm text-sm leading-7 text-foreground/66 sm:text-[15px]">
              Conversation without the noise around it. A shared room designed to feel present, personal, and gently alive.
            </p>
            {showAction ? (
              <Button onClick={onContinue} trailingIcon={ArrowRight} size="lg" className="w-fit shadow-panel">
                Enter Quiet Room
              </Button>
            ) : null}
          </motion.div>

          {typeof progress === "number" ? (
            <motion.div
              className="mt-9 w-40"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              <div className="h-0.5 overflow-hidden rounded-full bg-foreground/10">
                <div
                  data-testid="shigo-splash-progress"
                  className="h-full rounded-full bg-primary/75 transition-[width] duration-75 ease-linear motion-reduce:transition-none"
                  style={{ width: `${normalizedProgress}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Opening Quiet Room</p>
            </motion.div>
          ) : null}
        </motion.div>
      </main>

      <motion.footer
        className="relative z-10 flex items-end justify-between px-5 pb-6 text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:px-8 lg:px-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.46, duration: 0.45 }}
      >
        <span>01 · Quiet Room</span>
        <span className="hidden sm:inline">Light / Dark · Reduced motion aware</span>
      </motion.footer>
    </motion.div>
  );

  return magnetic ? <MagneticCursor>{content}</MagneticCursor> : content;
}
