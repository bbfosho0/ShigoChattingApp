import { useEffect, useMemo, useState } from "react";

const SCREEN_SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

export type ScreenSize = (typeof SCREEN_SIZES)[number];

const sizeOrder: Record<ScreenSize, number> = {
  xs: 0,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  "2xl": 5,
};

export class ComparableScreenSize {
  constructor(private readonly value: ScreenSize) {}

  toString(): ScreenSize {
    return this.value;
  }

  valueOf(): number {
    return sizeOrder[this.value];
  }

  equals(other: ScreenSize): boolean {
    return this.value === other;
  }

  lessThan(other: ScreenSize): boolean {
    return this.valueOf() < sizeOrder[other];
  }

  greaterThan(other: ScreenSize): boolean {
    return this.valueOf() > sizeOrder[other];
  }

  lessThanOrEqual(other: ScreenSize): boolean {
    return this.valueOf() <= sizeOrder[other];
  }

  greaterThanOrEqual(other: ScreenSize): boolean {
    return this.valueOf() >= sizeOrder[other];
  }
}

const getScreenSize = (width: number): ScreenSize => {
  if (width >= 1536) return "2xl";
  if (width >= 1280) return "xl";
  if (width >= 1024) return "lg";
  if (width >= 768) return "md";
  if (width >= 640) return "sm";
  return "xs";
};

const useScreenSize = (): ComparableScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>("xs");

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(getScreenSize(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return useMemo(() => new ComparableScreenSize(screenSize), [screenSize]);
};

export { SCREEN_SIZES, useScreenSize };
