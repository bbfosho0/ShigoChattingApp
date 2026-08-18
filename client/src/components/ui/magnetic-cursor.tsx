"use client";

import React, {
  type FC,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { vec2, type Vector2 } from "vecteur";

interface MagneticCursorProps {
  children: ReactNode;
  magneticFactor?: number;
  lerpAmount?: number;
  hoverPadding?: number;
  hoverAttribute?: string;
  cursorSize?: number;
  cursorColor?: string;
  blendMode?: "difference" | "exclusion" | "normal" | "screen" | "overlay";
  cursorClassName?: string;
  shape?: "circle" | "square" | "rounded-square";
  disableOnTouch?: boolean;
  speedMultiplier?: number;
  maxScaleX?: number;
  maxScaleY?: number;
  contrastBoost?: number;
}

interface CursorState {
  el: HTMLDivElement | null;
  pos: {
    current: Vector2;
    target: Vector2;
    previous: Vector2;
  };
  hover: { isHovered: boolean };
  isDetaching: boolean;
}

const getShapeRadius = (shape: MagneticCursorProps["shape"]) => {
  if (shape === "square") return "0";
  if (shape === "rounded-square") return "8px";
  return "50%";
};

export const MagneticCursor: FC<MagneticCursorProps> = ({
  children,
  lerpAmount = 0.1,
  magneticFactor = 0.2,
  hoverPadding = 12,
  hoverAttribute = "data-magnetic",
  cursorSize = 24,
  cursorColor = "white",
  blendMode = "exclusion",
  cursorClassName = "",
  shape = "circle",
  disableOnTouch = true,
  speedMultiplier = 0.02,
  maxScaleX = 1,
  maxScaleY = 0.3,
  contrastBoost = 1.5,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorStateRef = useRef<CursorState | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const configRef = useRef({
    magneticFactor,
    speedMultiplier,
    maxScaleX,
    maxScaleY,
    cursorSize,
    lerpAmount,
    hoverPadding,
  });

  useEffect(() => {
    configRef.current = {
      magneticFactor,
      speedMultiplier,
      maxScaleX,
      maxScaleY,
      cursorSize,
      lerpAmount,
      hoverPadding,
    };
  }, [
    cursorSize,
    hoverPadding,
    lerpAmount,
    magneticFactor,
    maxScaleX,
    maxScaleY,
    speedMultiplier,
  ]);

  useEffect(() => {
    setIsTouchDevice(
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    );
  }, []);

  useEffect(() => {
    if (disableOnTouch && isTouchDevice) return;

    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    gsap.set(cursorEl, {
      xPercent: -50,
      yPercent: -50,
      opacity: 0,
    });

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const detachDuration = prefersReducedMotion ? 0.1 : 0.35;

    cursorStateRef.current = {
      el: cursorEl,
      pos: {
        current: vec2(-100, -100),
        target: vec2(-100, -100),
        previous: vec2(-100, -100),
      },
      hover: { isHovered: false },
      isDetaching: false,
    };

    const update = () => {
      const state = cursorStateRef.current;
      if (!state || state.hover.isHovered) return;

      const {
        speedMultiplier: currentSpeedMultiplier,
        maxScaleX: currentMaxScaleX,
        maxScaleY: currentMaxScaleY,
        lerpAmount: currentLerpAmount,
      } = configRef.current;
      const effectiveLerp = prefersReducedMotion ? 1 : currentLerpAmount;

      state.pos.current.lerp(state.pos.target, effectiveLerp);
      const delta = state.pos.current.clone().sub(state.pos.previous);
      state.pos.previous.copy(state.pos.current);

      if (state.isDetaching || prefersReducedMotion) {
        gsap.set(state.el, {
          x: state.pos.current.x,
          y: state.pos.current.y,
          scaleX: 1,
          scaleY: 1,
          rotate: 0,
          overwrite: "auto",
        });
        return;
      }

      const speed =
        Math.hypot(delta.x, delta.y) * currentSpeedMultiplier;

      gsap.set(state.el, {
        x: state.pos.current.x,
        y: state.pos.current.y,
        rotate: Math.atan2(delta.y, delta.x) * (180 / Math.PI),
        scaleX: 1 + Math.min(speed, currentMaxScaleX),
        scaleY: 1 - Math.min(speed, currentMaxScaleY),
        overwrite: "auto",
      });
    };

    const initializePosition = (event: PointerEvent) => {
      const state = cursorStateRef.current;
      if (!state) return;

      const { clientX: x, clientY: y } = event;
      state.pos.current.x = x;
      state.pos.current.y = y;
      state.pos.target.x = x;
      state.pos.target.y = y;
      state.pos.previous.x = x;
      state.pos.previous.y = y;
      gsap.set(cursorEl, { x, y, opacity: 1 });
    };

    const onPointerMove = (event: PointerEvent) => {
      const state = cursorStateRef.current;
      if (!state) return;

      state.pos.target.x = event.clientX;
      state.pos.target.y = event.clientY;

      const isInViewport =
        event.clientX >= 0 &&
        event.clientX <= window.innerWidth &&
        event.clientY >= 0 &&
        event.clientY <= window.innerHeight;

      gsap.to(cursorEl, {
        opacity: isInViewport ? 1 : 0,
        duration: prefersReducedMotion ? 0 : 0.2,
        overwrite: "auto",
      });

      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const isTextContent =
        ["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6"].includes(
          target.tagName
        ) || window.getComputedStyle(target).cursor === "text";

      if (
        isTextContent &&
        !state.hover.isHovered &&
        !state.isDetaching &&
        !prefersReducedMotion
      ) {
        gsap.to(cursorEl, {
          scaleX: 0.5,
          scaleY: 1.5,
          duration: 0.3,
          overwrite: "auto",
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(cursorEl, {
        opacity: 0,
        duration: prefersReducedMotion ? 0 : 0.3,
      });
    };

    const handleMouseEnter = () => {
      gsap.to(cursorEl, {
        opacity: 1,
        duration: prefersReducedMotion ? 0 : 0.3,
      });
    };

    gsap.ticker.add(update);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointermove", initializePosition, { once: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    const cleanupFunctions: Array<() => void> = [];
    const magneticElements = gsap.utils.toArray<HTMLElement>(
      `[${hoverAttribute}]`
    );

    magneticElements.forEach((element) => {
      const xTo = gsap.quickTo(element, "x", {
        duration: prefersReducedMotion ? 0 : 1,
        ease: "elastic.out(1, 0.3)",
      });
      const yTo = gsap.quickTo(element, "y", {
        duration: prefersReducedMotion ? 0 : 1,
        ease: "elastic.out(1, 0.3)",
      });
      let rafId: number | null = null;

      const handlePointerEnter = () => {
        const state = cursorStateRef.current;
        if (!state) return;

        const {
          magneticFactor: currentMagneticFactor,
          hoverPadding: currentHoverPadding,
        } = configRef.current;

        state.hover.isHovered = true;
        state.isDetaching = false;

        const bounds = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        const magneticColor =
          element.getAttribute("data-magnetic-color") || cursorColor;
        const dynamicPadding =
          currentHoverPadding * (1 + currentMagneticFactor);
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;

        gsap.killTweensOf(cursorEl);
        gsap.to(cursorEl, {
          x: centerX,
          y: centerY,
          width: bounds.width + dynamicPadding * 2,
          height: bounds.height + dynamicPadding * 2,
          borderRadius: computedStyle.borderRadius,
          backgroundColor: magneticColor,
          scaleX: 1,
          scaleY: 1,
          rotate: 0,
          duration: prefersReducedMotion ? 0 : 0.3,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      const handlePointerLeave = () => {
        const state = cursorStateRef.current;
        if (!state) return;

        const currentX = Number(gsap.getProperty(cursorEl, "x"));
        const currentY = Number(gsap.getProperty(cursorEl, "y"));

        state.pos.current.x = currentX;
        state.pos.current.y = currentY;
        state.pos.previous.x = currentX;
        state.pos.previous.y = currentY;
        state.hover.isHovered = false;
        state.isDetaching = true;

        gsap.killTweensOf(cursorEl);
        gsap.to(cursorEl, {
          width: configRef.current.cursorSize,
          height: configRef.current.cursorSize,
          borderRadius: getShapeRadius(shape),
          backgroundColor: cursorColor,
          scaleX: 1,
          scaleY: 1,
          rotate: 0,
          duration: detachDuration,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => {
            state.isDetaching = false;
          },
        });
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (rafId !== null) return;

        const { clientX, clientY } = event;
        rafId = requestAnimationFrame(() => {
          const { height, width, left, top } = element.getBoundingClientRect();
          const currentMagneticFactor = configRef.current.magneticFactor;
          xTo((clientX - (left + width / 2)) * currentMagneticFactor);
          yTo((clientY - (top + height / 2)) * currentMagneticFactor);
          rafId = null;
        });
      };

      const handlePointerOut = () => {
        xTo(0);
        yTo(0);
      };

      element.addEventListener("pointerenter", handlePointerEnter);
      element.addEventListener("pointerleave", handlePointerLeave);
      element.addEventListener("pointermove", handlePointerMove);
      element.addEventListener("pointerout", handlePointerOut);

      cleanupFunctions.push(() => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        gsap.killTweensOf(element);
        element.removeEventListener("pointerenter", handlePointerEnter);
        element.removeEventListener("pointerleave", handlePointerLeave);
        element.removeEventListener("pointermove", handlePointerMove);
        element.removeEventListener("pointerout", handlePointerOut);
      });
    });

    return () => {
      gsap.ticker.remove(update);
      gsap.killTweensOf(cursorEl);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointermove", initializePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cleanupFunctions.forEach((cleanup) => cleanup());
      cursorStateRef.current = null;
    };
  }, [
    cursorColor,
    disableOnTouch,
    hoverAttribute,
    isTouchDevice,
    shape,
  ]);

  if (disableOnTouch && isTouchDevice) return <>{children}</>;

  const styles: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 9999,
    pointerEvents: "none",
    opacity: 0,
    willChange: "transform, width, height, border-radius",
    backgroundColor: cursorColor,
    mixBlendMode: blendMode,
    width: cursorSize,
    height: cursorSize,
    borderRadius: getShapeRadius(shape),
    backdropFilter:
      contrastBoost !== 1 ? `contrast(${contrastBoost})` : "none",
    WebkitBackdropFilter:
      contrastBoost !== 1 ? `contrast(${contrastBoost})` : "none",
  };

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={`magnetic-cursor ${cursorClassName}`}
        style={styles}
      />
      {children}
    </>
  );
};
