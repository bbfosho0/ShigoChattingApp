import { Hash, Settings2 } from "lucide-react";

import { AmbientPlayer } from "components/ui/ambient-player";
import { AppSidebar } from "components/ui/app-sidebar";
import { Button } from "components/ui/button";
import { CONVERSATION_MEASURE_CLASS } from "components/ui/conversation-measure";
import { MobileNav } from "components/ui/mobile-nav";
import { PreferencesContent } from "components/ui/preferences-shell";
import { ShigoComposer } from "components/ui/shigo-composer";
import { ShigoConversation } from "components/ui/shigo-conversation";
import type { ShigoMessageData } from "components/ui/shigo-message";

const sampleMessages: ShigoMessageData[] = [
  { id: "1", senderId: "alice", senderName: "Alice", content: "Hey. You still around?", createdAt: "2026-08-18T20:40:00" },
  { id: "2", senderId: "alice", senderName: "Alice", content: "No rush if you're busy.", createdAt: "2026-08-18T20:41:00" },
  { id: "3", senderId: "yoshi", senderName: "Yoshi", content: "Yeah. Give me like ten minutes.", createdAt: "2026-08-18T20:42:00" },
  { id: "4", senderId: "yoshi", senderName: "Yoshi", content: "Everything else can stay out of the way.", createdAt: "2026-08-18T20:44:00", edited: true },
];

export interface QuietRoomCompositionProps {
  mobile?: boolean;
  tablet?: boolean;
  collapsed?: boolean;
  state?: "default" | "empty" | "loading";
  preferencesOpen?: boolean;
}

const ambient = <AmbientPlayer compact playing trackName="Rainfall" subtitle="Quiet Mix" progress={42} />;

function ConversationHeader({ mobile = false }: { mobile?: boolean }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/50 px-3 sm:px-4">
      {mobile ? <MobileNav name="Yoshi" email="yoshi@example.com" theme="dark" ambientContent={ambient} /> : null}
      <Hash size={17} strokeWidth={1.8} className="shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">Quiet Room</p>
        <p className="truncate text-xs text-muted-foreground">A calm shared space for conversation.</p>
      </div>
      <Button size="icon" variant="ghost" aria-label="Preferences"><Settings2 size={16} /></Button>
    </header>
  );
}

export function QuietRoomComposition({ mobile = false, tablet = false, collapsed = false, state = "default", preferencesOpen = false }: QuietRoomCompositionProps) {
  const messages = state === "empty" ? [] : sampleMessages;

  if (mobile) {
    return (
      <div className="dark flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
        <ConversationHeader mobile />
        <ShigoConversation messages={messages} currentUserId="yoshi" loading={state === "loading"} />
        <div className="shrink-0 px-3 pb-3 pt-2"><ShigoComposer allowAttachments={false} disabled={state === "loading"} /></div>
      </div>
    );
  }

  return (
    <div className="dark flex h-screen w-full overflow-hidden bg-background text-foreground">
      <AppSidebar collapsed={tablet || collapsed} name="Yoshi" email="yoshi@example.com" theme="dark" roomStatus="Shared conversation" ambientContent={ambient} />
      <main className="flex min-w-0 flex-1 flex-col">
        <ConversationHeader />
        <ShigoConversation messages={messages} currentUserId="yoshi" loading={state === "loading"} />
        <div className="shrink-0 px-4 pb-4 pt-2"><div className={CONVERSATION_MEASURE_CLASS}><ShigoComposer allowAttachments={false} disabled={state === "loading"} /></div></div>
      </main>
      {preferencesOpen ? (
        <aside className="flex w-[28rem] max-w-[42%] flex-col border-l border-border/70 bg-background">
          <div className="px-6 pb-4 pt-5"><h2 className="text-xl font-semibold">Preferences</h2><p className="mt-1 text-sm text-muted-foreground">Account, appearance, ambient audio, and security.</p></div>
          <PreferencesContent name="Yoshi" email="yoshi@example.com" theme="dark" playing progress={42} volume={55} />
        </aside>
      ) : null}
    </div>
  );
}
