import { LogOut, Moon, Settings2, Sun, UserRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { PresenceAvatar } from "components/ui/presence-avatar";
import { cn } from "lib/utils";

export interface ProfileMenuProps {
  name?: string;
  email?: string;
  theme?: "light" | "dark";
  onProfile?: () => void;
  onPreferences?: () => void;
  onToggleTheme?: () => void;
  onLogout?: () => void;
  compact?: boolean;
  className?: string;
}

export function ProfileMenu({
  name = "Yoshi",
  email = "yoshi@example.com",
  theme = "dark",
  onProfile,
  onPreferences,
  onToggleTheme,
  onLogout,
  compact = false,
  className,
}: ProfileMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-lg p-2 text-left outline-none transition-colors duration-base hover:bg-accent focus-visible:shadow-focus",
            compact && "justify-center px-1",
            className
          )}
          aria-label="Open profile menu"
        >
          <PresenceAvatar fallback={name.slice(0, 2).toUpperCase()} presence="online" avatarClassName="size-9" />
          {!compact ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">{name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{email}</p>
            </div>
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={compact ? "center" : "end"} side="top" sideOffset={8} className="w-60 rounded-lg border-border p-1.5 shadow-floating">
        <DropdownMenuLabel className="px-2 py-2">
          <div className="flex items-center gap-3">
            <PresenceAvatar fallback={name.slice(0, 2).toUpperCase()} presence="online" avatarClassName="size-9" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium">{name}</p>
              <p className="truncate text-[11px] font-normal text-muted-foreground">{email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onProfile} className="gap-2.5 py-2 text-[13px]">
          <UserRound size={15} strokeWidth={1.5} /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onPreferences} className="gap-2.5 py-2 text-[13px]">
          <Settings2 size={15} strokeWidth={1.5} /> Preferences
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onToggleTheme} className="gap-2.5 py-2 text-[13px]">
          {theme === "dark" ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onLogout} className="gap-2.5 py-2 text-[13px] text-destructive focus:text-destructive">
          <LogOut size={15} strokeWidth={1.5} /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
