import type { ReactNode } from "react";
import { Hash, Moon, Settings2, Sun } from "lucide-react";

import { Button } from "components/ui/button";

export interface QuietRoomHeaderProps {
  mobileNav?: ReactNode;
  onToggleTheme?: () => void;
  onPreferences?: () => void;
  darkMode?: boolean;
  showThemeToggle?: boolean;
}

export function QuietRoomHeader({
  mobileNav,
  onToggleTheme,
  onPreferences,
  darkMode = true,
  showThemeToggle = false,
}: QuietRoomHeaderProps) {
  return (
    <header className="relative flex h-14 shrink-0 items-center gap-3 bg-background px-3 sm:px-4">
      {mobileNav ? <div className="md:hidden">{mobileNav}</div> : null}

      <Hash size={17} strokeWidth={1.8} className="shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">Quiet Room</p>
        <p className="truncate text-[11px] leading-4 text-muted-foreground">A calm shared space for conversation.</p>
      </div>

      <div className="flex items-center gap-1">
        {showThemeToggle && onToggleTheme ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="text-muted-foreground hover:text-foreground"
          >
            {darkMode ? <Sun size={16} strokeWidth={1.6} /> : <Moon size={16} strokeWidth={1.6} />}
          </Button>
        ) : null}
        {onPreferences ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPreferences}
            aria-label="Open preferences"
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings2 size={16} strokeWidth={1.6} />
          </Button>
        ) : null}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
      />
    </header>
  );
}
