import type { ReactNode } from "react";
import { Hash, Music2, PanelLeftClose, PanelLeftOpen, Settings2 } from "lucide-react";
import { motion } from "motion/react";

import { ProfileMenu } from "components/ui/profile-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";
import { cn } from "lib/utils";
import { shigoAmbient, shigoSpringSoft } from "lib/shigo-motion";

export interface AppSidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  onPreferences?: () => void;
  onLogout?: () => void;
  onToggleTheme?: () => void;
  name?: string;
  email?: string;
  theme?: "light" | "dark";
  roomStatus?: string;
  ambientContent?: ReactNode;
  className?: string;
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-foreground/[0.94] font-bold text-background ring-1 ring-inset ring-primary/20", compact ? "size-8 text-[11px]" : "size-8 text-xs")}>
      S
      <span aria-hidden="true" className="absolute inset-x-1 bottom-0 h-px bg-primary/75" />
    </div>
  );
}

function ActiveIndicator() {
  return (
    <motion.span
      layoutId="shigo-sidebar-active"
      aria-hidden="true"
      className="absolute left-0 top-2 bottom-2 w-px rounded-full bg-primary/75 shadow-[0_0_12px_hsl(var(--primary)/0.35)]"
      transition={shigoSpringSoft}
    />
  );
}

function SidebarIconButton({ label, children, onClick, active = false }: { label: string; children: ReactNode; onClick?: () => void; active?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          className={cn(
            "relative flex size-10 items-center justify-center rounded-md outline-none transition-colors duration-base hover:bg-accent focus-visible:shadow-focus",
            active ? "bg-primary/[0.035] text-primary" : "text-muted-foreground"
          )}
        >
          {active ? <ActiveIndicator /> : null}
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar({
  collapsed = false,
  onCollapsedChange,
  onPreferences,
  onLogout,
  onToggleTheme,
  name = "User",
  email = "",
  theme = "dark",
  roomStatus = "Shared conversation",
  ambientContent,
  className,
}: AppSidebarProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <aside className={cn("relative flex h-full shrink-0 flex-col overflow-hidden border-r border-border/50 bg-shigo-shell text-foreground transition-[width] duration-panel ease-shigo", collapsed ? "w-[4.5rem]" : "w-56", className)}>
        <motion.span
          data-shigo-sidebar-seam
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-[8%] right-0 z-20 w-px origin-center bg-gradient-to-b from-transparent via-primary/35 to-transparent"
          animate={{ opacity: [0.18, 0.5, 0.18], scaleY: [0.82, 1, 0.82] }}
          transition={{ ...shigoAmbient, duration: 9 }}
        />
        <div className={cn("flex h-14 items-center", collapsed ? "justify-center px-2" : "justify-between px-3.5")}>
          <div className={cn("flex min-w-0 items-center gap-2.5", collapsed && "justify-center")}>
            <BrandMark compact={collapsed} />
            {!collapsed ? <div className="min-w-0"><p className="truncate text-[13px] font-semibold tracking-[-0.01em]">ShigoChat</p><p className="truncate text-[11px] text-muted-foreground">A quieter place to connect</p></div> : null}
          </div>
          {!collapsed && onCollapsedChange ? <button type="button" onClick={() => onCollapsedChange(true)} className="rounded-md p-2 text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:shadow-focus" aria-label="Collapse sidebar"><PanelLeftClose size={16} strokeWidth={1.5} /></button> : null}
        </div>

        <div className={cn("flex min-h-0 flex-1 flex-col", collapsed ? "items-center px-2 py-3" : "px-3 py-3")}>
          {collapsed ? (
            <div className="space-y-1.5">
              {onCollapsedChange ? <SidebarIconButton label="Expand sidebar" onClick={() => onCollapsedChange(false)}><PanelLeftOpen size={17} strokeWidth={1.5} /></SidebarIconButton> : null}
              <SidebarIconButton label="Quiet Room" active><Hash size={17} strokeWidth={1.8} /></SidebarIconButton>
              <SidebarIconButton label="Ambient audio" onClick={onCollapsedChange ? () => onCollapsedChange(false) : undefined}><Music2 size={17} strokeWidth={1.5} /></SidebarIconButton>
              <SidebarIconButton label="Preferences" onClick={onPreferences}><Settings2 size={17} strokeWidth={1.5} /></SidebarIconButton>
            </div>
          ) : (
            <>
              <div className="relative flex w-full items-center gap-3 overflow-hidden rounded-md bg-primary/[0.035] px-3 py-2.5 pl-3.5 text-left">
                <ActiveIndicator />
                <Hash size={16} strokeWidth={1.8} className="text-primary" />
                <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold">Quiet Room</p><p className="truncate text-[11px] text-muted-foreground">{roomStatus}</p></div>
              </div>

              {ambientContent ? <div className="mt-5">{ambientContent}</div> : null}

              {onPreferences ? <button type="button" onClick={onPreferences} className="mt-3 flex items-center gap-3 rounded-md px-3 py-2 text-[13px] text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:shadow-focus"><Settings2 size={15} strokeWidth={1.5} /> Preferences</button> : null}
            </>
          )}
        </div>

        <div className={cn(collapsed ? "p-2 pt-1" : "p-3 pt-2")}>
          <ProfileMenu compact={collapsed} name={name} email={email} theme={theme} onToggleTheme={onToggleTheme} onPreferences={onPreferences} onLogout={onLogout} />
        </div>
      </aside>
    </TooltipProvider>
  );
}
