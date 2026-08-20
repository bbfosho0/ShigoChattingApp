import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

import { shigoSpringSoft } from "lib/shigo-motion";

export interface ShigoMotionProviderProps {
  children: ReactNode;
}

export function ShigoMotionProvider({ children }: ShigoMotionProviderProps) {
  return (
    <MotionConfig reducedMotion="user" transition={shigoSpringSoft}>
      {children}
    </MotionConfig>
  );
}
