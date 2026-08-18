import { Hash, Settings2 } from "lucide-react";

import { AmbientPlayer } from "components/ui/ambient-player";
import { AppSidebar } from "components/ui/app-sidebar";
import { Button } from "components/ui/button";
import { MobileNav } from "components/ui/mobile-nav";
import { PreferencesContent } from "components/ui/preferences-shell";
import { ShigoComposer } from "components/ui/shigo-composer";
import { ShigoConversation } from "components/ui/shigo-conversation";
import type { ShigoMessageData } from "components/ui/shigo-message";

const sampleMessages: ShigoMessageData[] = [
  { id: "1", senderId: "alice", senderName: "Alice", content: "Hey. You still around?", createdAt: "2026-08-18T20:40:00" },
  { id: "2", senderId: "yoshi", senderName: "Yoshi", content: "Yeah. Give me like ten minutes.", createdAt: "2026-08-18T20:41:00" },
  { id: "3", senderId: "alice", senderName: "Alice", content: "No rush. I like how quiet this room feels.", createdAt: "2026-08-18T20:42:00", edited: true },
  { id: "4", senderId: "yoshi", senderName: "Yoshi", content: "That was the idea. Everything else can stay out of the way.", createdAt: "2026-08-18T20:44:00" },
];

export interface QuietRoomCompositionProps {
  mobile?: boolean;
  collapsed?: boolean;
  state?: "default" | "empty" | "loading";
  preferencesOpen?: boolean;
}

const ambient = <AmbientPlayer compact playing trackName="Rainfall" subtitle="Quiet Mix" progress={42} />;

export function QuietRoomComposition({ mobile = false, collapsed = false, state = "default", preferencesOpen = false }: QuietRoomCompositionProps) {
  const messages = state === "empty" ? [] : sampleMessages;

  if (mobile) {
    return (
      <div className="dark flex h-[46rem] w-[min(24rem,92vw)] flex-col overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-dialog">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-2">
          <MobileNav name="Yoshi" email="yoshi@example.com" theme="dark" ambientContent={ambient} />
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/[0.08] text-primary"><Hash size={15} /></div>
          <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold">Quiet Room</p><p className="truncate text-[10px] text-muted-foreground">Shared conversation</p></div>
          <Button size="icon" variant="ghost" aria-label="Preferences"><Settings2 size={16} /></Button>
        </header>
        <ShigoConversation messages={messages} currentUserId="yoshi" loading={state === "loading"} />
        <div className="shrink-0 border-t border-border p-3"><ShigoComposer allowAttachments={false} disabled={state === "loading"} /></div>
      </div>
    );
  }

  return (
    <div className="dark flex h-[46rem] w-[min(78rem,94vw)] overflow-hidden rounded-xl border border-border bg-background text-foreground shadow-dialog">
      <AppSidebar collapsed={collapsed} name="Yoshi" email="yoshi@example.com" theme="dark" roomStatus="Shared conversation" ambientContent={ambient} />
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-5"><div className="flex size-8 items-center justify-center rounded-md bg-primary/[0.08] text-primary"><Hash size={15} /></div><div className="min-w-0 flex-1"><p className="text-[13px] font-semibold">Quiet Room</p><p className="text-[11px] text-muted-foreground">A calm shared space for conversation.</p></div><Button size="icon" variant="ghost" aria-label="Preferences"><Settings2 size={16} /></Button></header>
        <ShigoConversation messages={messages} currentUserId="yoshi" loading={state === "loading"} />
        <div className="shrink-0 border-t border-border p-4"><div className="mx-auto max-w-3xl"><ShigoComposer allowAttachments={false} disabled={state === "loading"} /></div></div>
      </main>
      {preferencesOpen ? (
        <aside className="flex w-[28rem] max-w-[42%] flex-col border-l border-border bg-background">
          <div className="border-b border-border px-6 py-5"><h2 className="text-xl font-semibold">Preferences</h2><p className="mt-1 text-sm text-muted-foreground">Account, appearance, ambient audio, and security.</p></div>
          <PreferencesContent name="Yoshi" email="yoshi@example.com" theme="dark" playing progress={42} volume={55} />
        </aside>
      ) : null}
    </div>
  );
}
