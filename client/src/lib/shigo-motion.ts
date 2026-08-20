import type { Transition, Variants } from "motion/react";

export const shigoSpringSoft: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 28,
  mass: 0.8,
};

export const shigoSpringSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 30,
  mass: 0.65,
};

export const shigoHoverLift = { y: -1, scale: 1.015 } as const;
export const shigoPress = { scale: 0.98 } as const;

export const shigoEnter = {
  hidden: { opacity: 0, y: 8, scale: 0.99 },
  visible: { opacity: 1, y: 0, scale: 1 },
} satisfies Variants;

export const shigoExit = {
  visible: { opacity: 1, y: 0, scale: 1 },
  hidden: { opacity: 0, y: -6, scale: 0.99 },
} satisfies Variants;

export const shigoPanel = {
  enter: { opacity: 0, x: 8 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -8 },
} satisfies Variants;

export const shigoMessageSelf = {
  hidden: { opacity: 0, x: 8, y: 4, scale: 0.985 },
  visible: { opacity: 1, x: 0, y: 0, scale: 1 },
} satisfies Variants;

export const shigoMessageOther = {
  hidden: { opacity: 0, x: -8, y: 4, scale: 0.985 },
  visible: { opacity: 1, x: 0, y: 0, scale: 1 },
} satisfies Variants;

export const shigoPopover = {
  hidden: { opacity: 0, y: 4, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
} satisfies Variants;

export const shigoAmbient: Transition = {
  duration: 14,
  ease: "easeInOut",
  repeat: Infinity,
  repeatType: "mirror",
};

export function resolveAmbientMotion(reducedMotion: boolean) {
  return reducedMotion
    ? { scale: 1, x: 0, y: 0 }
    : { scale: [1, 1.03, 1], x: [0, 6, 0], y: [0, -2, 0] };
}
