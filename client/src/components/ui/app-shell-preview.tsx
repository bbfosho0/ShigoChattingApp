import { useState } from "react";
import { Search } from "lucide-react";

import { AppSidebar } from "components/ui/app-sidebar";
import { Button } from "components/ui/button";
import { MobileNav } from "components/ui/mobile-nav";

export interface AppShellPreviewProps {
  defaultCollapsed?: boolean;
  mobile?: boolean;
}

export function AppShellPreview({ defaultCollapsed = false, mobile = false }: AppShellPreviewProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  if (mobile) {
    return (
      <div className="dark flex h-[44rem] w-[min(24rem,88vw)] flex-col overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-dialog">
        <header className="flex h-14 items-center justify-between border-b border-border px-3">
          <MobileNav />
          <div className="text-center"><p className="text-[13px] font-semibold">Quiet Room</p><p className="text-[10px] text-muted-foreground">4 online</p></div>
          <Button size="icon" variant="ghost" aria-label="Search room"><Search size={16} /></Button>
        </header>
        <div className="flex flex-1 flex-col justify-end gap-4 p-4">
          <div className="max-w-[82%] rounded-lg border border-border bg-shigo-other-message px-4 py-3 text-sm">The mobile shell keeps navigation out of the conversation.</div>
          <div className="ml-auto max-w-[82%] rounded-lg border border-primary/15 bg-shigo-own-message px-4 py-3 text-sm">Exactly.</div>
          <div className="rounded-lg border border-input bg-card px-4 py-3 text-sm text-muted-foreground shadow-panel">Message Quiet Room...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark flex h-[42rem] w-[min(72rem,92vw)] overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-dialog">
      <AppSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-5">
          <div><p className="text-sm font-semibold">Quiet Room</p><p className="text-[11px] text-muted-foreground">4 people online</p></div>
          <Button size="icon" variant="ghost" aria-label="Search room"><Search size={16} /></Button>
        </header>
        <div className="flex flex-1 flex-col justify-end gap-4 p-6">
          <div className="max-w-[60%] rounded-lg border border-border bg-shigo-other-message px-4 py-3 shadow-panel"><p className="text-[11px] font-semibold text-muted-foreground">Alice · 8:42 PM</p><p className="mt-1 text-sm">The shell feels quiet without disappearing.</p></div>
          <div className="ml-auto max-w-[60%] rounded-lg border border-primary/15 bg-shigo-own-message px-4 py-3"><p className="text-sm">That balance is the goal.</p></div>
          <div className="rounded-lg border border-input bg-card px-4 py-3 text-sm text-muted-foreground shadow-panel">Message Quiet Room...</div>
        </div>
      </main>
    </div>
  );
}
