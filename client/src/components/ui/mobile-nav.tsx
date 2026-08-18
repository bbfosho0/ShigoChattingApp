import type { ReactNode } from "react";
import { Hash, Menu, Settings2 } from "lucide-react";

import { Button } from "components/ui/button";
import { ProfileMenu } from "components/ui/profile-menu";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "components/ui/sheet";

export interface MobileNavProps {
  onPreferences?: () => void;
  onLogout?: () => void;
  onToggleTheme?: () => void;
  name?: string;
  email?: string;
  theme?: "light" | "dark";
  roomStatus?: string;
  ambientContent?: ReactNode;
}

export function MobileNav({
  onPreferences,
  onLogout,
  onToggleTheme,
  name = "User",
  email = "",
  theme = "dark",
  roomStatus = "Shared conversation",
  ambientContent,
}: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild><Button variant="ghost" size="icon" aria-label="Open navigation"><Menu size={18} strokeWidth={1.5} /></Button></SheetTrigger>
      <SheetContent side="left" className="max-w-[20rem] gap-0">
        <SheetHeader className="border-b border-border pb-5">
          <div className="flex items-center gap-3 pr-10"><div className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">S</div><div><SheetTitle className="text-base">ShigoChat</SheetTitle><SheetDescription className="text-xs">A quieter place to connect</SheetDescription></div></div>
        </SheetHeader>
        <SheetBody className="flex flex-col pt-6">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Space</p>
          <div className="mt-2 flex items-center gap-3 rounded-md bg-accent px-3 py-3 text-left"><Hash size={17} strokeWidth={1.8} /><div className="min-w-0 flex-1"><p className="text-[13px] font-medium">Quiet Room</p><p className="truncate text-[11px] text-muted-foreground">{roomStatus}</p></div></div>

          <p className="mt-7 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ambient</p>
          <div className="mt-2">{ambientContent ?? <div className="rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground shadow-panel">Ambient audio</div>}</div>

          <button type="button" onClick={onPreferences} className="mt-4 flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:shadow-focus"><Settings2 size={16} strokeWidth={1.5} /> Preferences</button>

          <div className="mt-auto border-t border-border pt-4"><ProfileMenu name={name} email={email} theme={theme} onToggleTheme={onToggleTheme} onPreferences={onPreferences} onLogout={onLogout} /></div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
