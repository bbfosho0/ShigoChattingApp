import type { ReactNode } from "react";
import { Hash, Music2, PanelLeftClose, PanelLeftOpen, Settings2 } from "lucide-react";

import { ProfileMenu } from "components/ui/profile-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "components/ui/tooltip";
import { cn } from "lib/utils";

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

function SidebarIconButton({ label, children, onClick, active = false }: { label: string; children: ReactNode; onClick?: () => void; active?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" onClick={onClick} aria-label={label} className={cn("flex size-10 items-center justify-center rounded-md outline-none transition-colors duration-base hover:bg-accent focus-visible:shadow-focus", active ? "bg-accent text-foreground" : "text-muted-foreground")}>{children}</button>
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
      <aside className={cn("flex h-full shrink-0 flex-col border-r border-border bg-shigo-shell text-foreground transition-[width] duration-panel ease-shigo", collapsed ? "w-[4.5rem]" : "w-64", className)}>
        <div className={cn("flex h-16 items-center border-b border-border", collapsed ? "justify-center px-2" : "justify-between px-4")}>
          <div className={cn("flex min-w-0 items-center gap-3", collapsed && "justify-center")}>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground shadow-panel">S</div>
            {!collapsed ? <div className="min-w-0"><p className="truncate text-[13px] font-semibold">ShigoChat</p><p className="truncate text-[11px] text-muted-foreground">A quieter place to connect</p></div> : null}
          </div>
          {!collapsed ? <button type="button" onClick={() => onCollapsedChange?.(true)} className="rounded-sm p-2 text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:shadow-focus" aria-label="Collapse sidebar"><PanelLeftClose size={16} strokeWidth={1.5} /></button> : null}
        </div>

        <div className={cn("flex min-h-0 flex-1 flex-col", collapsed ? "items-center px-2 py-4" : "px-3 py-4")}>
          {collapsed ? (
            <div className="space-y-2">
              <SidebarIconButton label="Expand sidebar" onClick={() => onCollapsedChange?.(false)}><PanelLeftOpen size={17} strokeWidth={1.5} /></SidebarIconButton>
              <SidebarIconButton label="Quiet Room" active><Hash size={17} strokeWidth={1.8} /></SidebarIconButton>
              <SidebarIconButton label="Ambient audio"><Music2 size={17} strokeWidth={1.5} /></SidebarIconButton>
              <SidebarIconButton label="Preferences" onClick={onPreferences}><Settings2 size={17} strokeWidth={1.5} /></SidebarIconButton>
            </div>
          ) : (
            <>
              <section>
                <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Space</p>
                <div className="mt-2 flex w-full items-center gap-3 rounded-md bg-accent px-3 py-2.5 text-left">
                  <Hash size={16} strokeWidth={1.8} />
                  <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium">Quiet Room</p><p className="truncate text-[11px] text-muted-foreground">{roomStatus}</p></div>
                </div>
              </section>

              <section className="mt-7">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ambient</p>
                <div className="mt-2">{ambientContent ?? <div className="rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground shadow-panel">Ambient audio</div>}</div>
              </section>

              <button type="button" onClick={onPreferences} className="mt-4 flex items-center gap-3 rounded-md px-3 py-2 text-[13px] text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:shadow-focus"><Settings2 size={15} strokeWidth={1.5} /> Preferences</button>
            </>
          )}
        </div>

        <div className={cn("border-t border-border", collapsed ? "p-2" : "p-3")}>
          <ProfileMenu compact={collapsed} name={name} email={email} theme={theme} onToggleTheme={onToggleTheme} onPreferences={onPreferences} onLogout={onLogout} />
        </div>
      </aside>
    </TooltipProvider>
  );
}
