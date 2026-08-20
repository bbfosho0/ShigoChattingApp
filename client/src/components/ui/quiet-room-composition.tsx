import { motion, useReducedMotion } from "motion/react";

import { AmbientPlayer } from "components/ui/ambient-player";
import { AppSidebar } from "components/ui/app-sidebar";
import { CONVERSATION_MEASURE_CLASS } from "components/ui/conversation-measure";
import { MobileNav } from "components/ui/mobile-nav";
import { PreferencesContent } from "components/ui/preferences-shell";
import { QuietRoomHeader } from "components/ui/quiet-room-header";
import { ShigoComposer } from "components/ui/shigo-composer";
import { ShigoConversation } from "components/ui/shigo-conversation";
import type { ShigoMessageData } from "components/ui/shigo-message";
import { shigoAmbient } from "lib/shigo-motion";

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
  theme?: "dark" | "light";
}

const ambient = <AmbientPlayer compact playing trackName="Rainfall" subtitle="Quiet Mix" progress={42} />;

function QuietRoomAtmosphereMotion() {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      data-shigo-atmosphere-motion
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      animate={reducedMotion ? { opacity: 0.65 } : { opacity: [0.48, 0.72, 0.48] }}
      transition={reducedMotion ? undefined : { ...shigoAmbient, duration: 12 }}
    >
      <motion.div
        className="absolute -right-[18%] top-[6%] h-[42%] w-[48%] rounded-full bg-primary/[0.035] blur-3xl"
        animate={reducedMotion ? undefined : { x: [0, -12, 0], y: [0, 7, 0], scale: [1, 1.04, 1] }}
        transition={reducedMotion ? undefined : shigoAmbient}
      />
      <motion.div
        className="absolute -left-[12%] bottom-[8%] h-[30%] w-[38%] rounded-full bg-shigo-signal/[0.018] blur-3xl"
        animate={reducedMotion ? undefined : { x: [0, 10, 0], y: [0, -5, 0], scale: [1, 1.03, 1] }}
        transition={reducedMotion ? undefined : { ...shigoAmbient, duration: 16 }}
      />
    </motion.div>
  );
}

export function QuietRoomComposition({
  mobile = false,
  tablet = false,
  collapsed = false,
  state = "default",
  preferencesOpen = false,
  theme = "dark",
}: QuietRoomCompositionProps) {
  const messages = state === "empty" ? [] : sampleMessages;
  const darkMode = theme === "dark";
  const themeClass = darkMode ? "dark " : "";
  const commonSidebarProps = {
    name: "Yoshi",
    email: "yoshi@example.com",
    theme,
    roomStatus: "Shared conversation",
    ambientContent: ambient,
  } as const;

  if (mobile) {
    return (
      <div className={`${themeClass}flex h-screen w-full flex-col overflow-hidden bg-background text-foreground`}>
        <main className="shigo-quiet-room-atmosphere relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <QuietRoomAtmosphereMotion />
          <QuietRoomHeader
            mobileNav={<MobileNav {...commonSidebarProps} />}
            onToggleTheme={() => undefined}
            onPreferences={() => undefined}
            darkMode={darkMode}
            showThemeToggle
          />
          <ShigoConversation messages={messages} currentUserId="yoshi" loading={state === "loading"} />
          <div className="shrink-0 px-3 pb-3 pt-2"><ShigoComposer allowAttachments={false} disabled={state === "loading"} /></div>
        </main>
      </div>
    );
  }

  return (
    <div className={`${themeClass}flex h-screen w-full overflow-hidden bg-background text-foreground`}>
      <AppSidebar collapsed={tablet || collapsed} {...commonSidebarProps} />
      <main className="shigo-quiet-room-atmosphere relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <QuietRoomAtmosphereMotion />
        <QuietRoomHeader
          onToggleTheme={() => undefined}
          onPreferences={() => undefined}
          darkMode={darkMode}
          showThemeToggle
        />
        <ShigoConversation messages={messages} currentUserId="yoshi" loading={state === "loading"} />
        <div className="shrink-0 px-4 pb-4 pt-2"><div className={CONVERSATION_MEASURE_CLASS}><ShigoComposer allowAttachments={false} disabled={state === "loading"} /></div></div>
      </main>
      {preferencesOpen ? (
        <aside className="flex w-[28rem] max-w-[42%] flex-col border-l border-border/70 bg-background">
          <div className="px-6 pb-4 pt-5"><h2 className="text-xl font-semibold">Preferences</h2><p className="mt-1 text-sm text-muted-foreground">Account, appearance, ambient audio, and security.</p></div>
          <PreferencesContent name="Yoshi" email="yoshi@example.com" theme={theme} playing progress={42} volume={55} />
        </aside>
      ) : null}
    </div>
  );
}
