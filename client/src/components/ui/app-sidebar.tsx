import { Hash, Music2, PanelLeftClose, PanelLeftOpen, Play, Settings2 } from "lucide-react";

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
  className?: string;
}

function SidebarIconButton({ label, children, onClick, active = false }: { label: string; children: React.ReactNode; onClick?: () => void; active?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          className={cn(
            "flex size-10 items-center justify-center rounded-md outline-none transition-colors duration-base hover:bg-accent focus-visible:shadow-focus",
            active ? "bg-accent text-foreground" : "text-muted-foreground"
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar({ collapsed = false, onCollapsedChange, onPreferences, onLogout, className }: AppSidebarProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <aside
        className={cn(
          "flex h-full shrink-0 flex-col border-r border-border bg-shigo-shell text-foreground transition-[width] duration-panel ease-shigo",
          collapsed ? "w-[4.5rem]" : "w-64",
          className
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-border", collapsed ? "justify-center px-2" : "justify-between px-4") }>
          <div className={cn("flex min-w-0 items-center gap-3", collapsed && "justify-center") }>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground shadow-panel">S</div>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">ShigoChat</p>
                <p className="truncate text-[11px] text-muted-foreground">A quieter place to connect</p>
              </div>
            ) : null}
          </div>
          {!collapsed ? (
            <button
              type="button"
              onClick={() => onCollapsedChange?.(true)}
              className="rounded-sm p-2 text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:shadow-focus"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={16} strokeWidth={1.5} />
            </button>
          ) : null}
        </div>

        <div className={cn("flex min-h-0 flex-1 flex-col", collapsed ? "items-center px-2 py-4" : "px-3 py-4") }>
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
                <button type="button" className="mt-2 flex w-full items-center gap-3 rounded-md bg-accent px-3 py-2.5 text-left outline-none focus-visible:shadow-focus">
                  <Hash size={16} strokeWidth={1.8} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">Quiet Room</p>
                    <p className="text-[11px] text-muted-foreground">4 online</p>
                  </div>
                  <span className="size-2 rounded-full bg-shigo-presence-online" aria-label="Room active" />
                </button>
              </section>

              <section className="mt-7">
                <div className="flex items-center justify-between px-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ambient</p>
                  <span className="text-[10px] text-shigo-signal">playing</span>
                </div>
                <div className="mt-2 rounded-lg border border-border bg-card p-3 shadow-panel">
                  <div className="flex items-center gap-3">
                    <button type="button" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground outline-none focus-visible:shadow-focus" aria-label="Pause ambient audio">
                      <Play size={14} fill="currentColor" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">Rainfall</p>
                      <p className="truncate text-[11px] text-muted-foreground">Quiet Mix</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[58%] rounded-full bg-shigo-ambient" />
                  </div>
                </div>
              </section>

              <button type="button" onClick={onPreferences} className="mt-4 flex items-center gap-3 rounded-md px-3 py-2 text-[13px] text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:shadow-focus">
                <Settings2 size={15} strokeWidth={1.5} /> Preferences
              </button>
            </>
          )}
        </div>

        <div className={cn("border-t border-border", collapsed ? "p-2" : "p-3") }>
          <ProfileMenu compact={collapsed} onPreferences={onPreferences} onLogout={onLogout} />
        </div>
      </aside>
    </TooltipProvider>
  );
}
