import desktopDark from "../../DesktopDarkBackgroundSplash.png";
import desktopLight from "../../DesktopLightBackgroundSplash.png";
import mobileDark from "../../MobileDarkBackgroundSplash.png";
import mobileLight from "../../MobileLightBackgroundSplash.png";

import { cn } from "lib/utils";

export interface ShigoBrandArtworkProps {
  className?: string;
  imageClassName?: string;
}

const sharedImageClass =
  "absolute inset-0 size-full object-cover object-center transition-opacity duration-panel ease-shigo";

export function ShigoBrandArtwork({
  className,
  imageClassName,
}: ShigoBrandArtworkProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      data-shigo-brand-artwork
    >
      <img
        src={desktopLight}
        alt=""
        data-testid="shigo-artwork-desktop-light"
        className={cn(sharedImageClass, "hidden opacity-100 dark:opacity-0 sm:block", imageClassName)}
      />
      <img
        src={desktopDark}
        alt=""
        data-testid="shigo-artwork-desktop-dark"
        className={cn(sharedImageClass, "hidden opacity-0 dark:opacity-100 sm:block", imageClassName)}
      />
      <img
        src={mobileLight}
        alt=""
        data-testid="shigo-artwork-mobile-light"
        className={cn(sharedImageClass, "opacity-100 dark:opacity-0 sm:hidden", imageClassName)}
      />
      <img
        src={mobileDark}
        alt=""
        data-testid="shigo-artwork-mobile-dark"
        className={cn(sharedImageClass, "opacity-0 dark:opacity-100 sm:hidden", imageClassName)}
      />
    </div>
  );
}
