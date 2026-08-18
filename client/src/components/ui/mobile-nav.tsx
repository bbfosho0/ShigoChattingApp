import { Hash, Menu, Music2, Settings2 } from "lucide-react";

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
}

export function MobileNav({ onPreferences, onLogout }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open navigation">
          <Menu size={18} strokeWidth={1.5} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="max-w-[20rem]">
        <SheetHeader>
          <div className="flex items-center gap-3 pr-10">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">S</div>
            <div>
              <SheetTitle className="text-base">ShigoChat</SheetTitle>
              <SheetDescription className="text-xs">A quieter place to connect</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <SheetBody className="flex flex-col pt-6">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Space</p>
          <button type="button" className="mt-2 flex items-center gap-3 rounded-md bg-accent px-3 py-3 text-left">
            <Hash size={17} strokeWidth={1.8} />
            <div className="flex-1"><p className="text-[13px] font-medium">Quiet Room</p><p className="text-[11px] text-muted-foreground">4 online</p></div>
            <span className="size-2 rounded-full bg-shigo-presence-online" />
          </button>

          <p className="mt-7 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Ambient</p>
          <div className="mt-2 rounded-lg border border-border bg-card p-3 shadow-panel">
            <div className="flex items-center gap-3"><Music2 size={17} strokeWidth={1.5} className="text-shigo-signal" /><div><p className="text-[13px] font-medium">Rainfall</p><p className="text-[11px] text-muted-foreground">Quiet Mix</p></div></div>
            <div className="mt-3 h-1 rounded-full bg-muted"><div className="h-full w-[58%] rounded-full bg-shigo-ambient" /></div>
          </div>

          <button type="button" onClick={onPreferences} className="mt-4 flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground">
            <Settings2 size={16} strokeWidth={1.5} /> Preferences
          </button>

          <div className="mt-auto border-t border-border pt-4">
            <ProfileMenu onPreferences={onPreferences} onLogout={onLogout} />
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
