import type { ReactNode } from "react";
import {
  ArrowUp,
  Hash,
  LogOut,
  Moon,
  Paperclip,
  Pause,
  Pencil,
  Play,
  Search,
  Settings2,
  Smile,
  Sun,
  Trash2,
  UserRound,
  Volume2,
  X,
} from "lucide-react";

function FoundationPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 p-6 text-foreground sm:p-8">
      <header className="max-w-2xl space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          Shigo Midnight
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </header>
      {children}
    </main>
  );
}

function ThemePreview({ dark = false }: { dark?: boolean }) {
  return (
    <section className={dark ? "dark" : ""}>
      <div className="overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-panel">
        <div className="grid min-h-[22rem] grid-cols-[10rem_1fr] sm:grid-cols-[12rem_1fr]">
          <aside className="flex flex-col border-r border-border bg-shigo-shell p-4">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                S
              </div>
              <div>
                <p className="text-[13px] font-semibold">ShigoChat</p>
                <p className="text-[11px] text-muted-foreground">Quiet Room</p>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-left text-[13px] font-medium text-accent-foreground"
            >
              <Hash size={15} strokeWidth={1.8} />
              Quiet Room
            </button>

            <div className="mt-auto space-y-3">
              <div className="rounded-lg border border-border bg-card p-3 shadow-panel">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Ambient
                  </span>
                  <span className="size-2 rounded-full bg-shigo-signal" />
                </div>
                <p className="text-[13px] font-medium">Rainfall</p>
                <p className="text-[11px] text-muted-foreground">Quiet Mix</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex size-8 items-center justify-center rounded-full bg-muted text-[11px] font-semibold">
                  YG
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-shigo-shell bg-shigo-presence-online" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium">Yoshi</p>
                  <p className="text-[11px] text-muted-foreground">online</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold">Quiet Room</p>
                <p className="text-[11px] text-muted-foreground">4 people online</p>
              </div>
              <button
                type="button"
                className="rounded-md border border-border bg-card p-2 text-muted-foreground transition-colors duration-base ease-shigo hover:bg-accent hover:text-foreground"
                aria-label="Search room"
              >
                <Search size={16} strokeWidth={1.5} />
              </button>
            </header>

            <div className="flex flex-1 flex-col justify-end gap-4 p-5">
              <div className="max-w-[78%] rounded-lg border border-border bg-shigo-other-message px-4 py-3 shadow-panel">
                <p className="text-[11px] font-semibold text-muted-foreground">Alice</p>
                <p className="mt-1 text-sm leading-5">It feels much calmer in here now.</p>
              </div>
              <div className="ml-auto max-w-[78%] rounded-lg border border-primary/15 bg-shigo-own-message px-4 py-3">
                <p className="text-sm leading-5">That is exactly the point.</p>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-input bg-card px-4 py-3 shadow-panel">
                <span className="flex-1 text-sm text-muted-foreground">Message Quiet Room...</span>
                <button
                  type="button"
                  className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  aria-label="Send message"
                >
                  <ArrowUp size={15} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ThemeFoundation() {
  return (
    <FoundationPage
      title="Theme"
      description="Light and dark modes share one hierarchy. Violet carries brand/action identity, teal is reserved for signal and ambient states, and neutral surfaces do most of the visual work."
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Light</p>
          <ThemePreview />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Dark</p>
          <ThemePreview dark />
        </div>
      </div>
    </FoundationPage>
  );
}

const swatches = [
  ["Background", "--background"],
  ["Shell", "--shigo-shell"],
  ["Card", "--card"],
  ["Hover", "--muted"],
  ["Raised", "--shigo-raised"],
  ["Primary", "--primary"],
  ["Signal", "--shigo-signal"],
  ["Warning", "--shigo-warning"],
  ["Destructive", "--destructive"],
  ["Border", "--border"],
] as const;

function ColorGrid({ dark = false }: { dark?: boolean }) {
  return (
    <section className={dark ? "dark" : ""}>
      <div className="rounded-2xl border border-border bg-background p-5 text-foreground shadow-panel">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {swatches.map(([label, variable]) => (
            <div key={variable} className="overflow-hidden rounded-lg border border-border bg-card">
              <div
                className="h-20 border-b border-border"
                style={{ backgroundColor: `hsl(var(${variable}))` }}
              />
              <div className="p-3">
                <p className="text-xs font-semibold">{label}</p>
                <code className="mt-1 block text-[10px] text-muted-foreground">{variable}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ColorsFoundation() {
  return (
    <FoundationPage
      title="Colors"
      description="Semantic tokens are authoritative. Imported 21st.dev components must be normalized into these roles instead of retaining author-specific palettes."
    >
      <div className="space-y-6">
        <ColorGrid />
        <ColorGrid dark />
      </div>
    </FoundationPage>
  );
}

export function TypographyFoundation() {
  return (
    <FoundationPage
      title="Typography"
      description="Inter owns product UI. Playfair Display is a restrained editorial signature reserved for splash, auth art direction, and rare brand moments."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-panel">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Inter / product UI</p>
          <div className="space-y-5">
            <TypeRow label="Metadata · 11px" className="text-[11px]">09:42 PM · edited</TypeRow>
            <TypeRow label="Label · 13px" className="text-[13px] font-medium">Quiet Room</TypeRow>
            <TypeRow label="Message · 15px" className="text-[15px] leading-6">A quiet place should feel intentional, not empty.</TypeRow>
            <TypeRow label="Section · 18px" className="text-lg font-semibold">Appearance</TypeRow>
            <TypeRow label="Panel · 24px" className="text-2xl font-semibold tracking-tight">Preferences</TypeRow>
            <TypeRow label="Auth · 36px" className="text-4xl font-semibold tracking-[-0.03em]">Welcome back.</TypeRow>
          </div>
        </section>

        <section className="flex min-h-[24rem] flex-col justify-between rounded-2xl border border-border bg-shigo-shell p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Playfair / brand only</p>
          <div className="space-y-4">
            <p className="font-brand text-5xl leading-[0.96] tracking-[-0.035em] sm:text-6xl">A quieter place to connect.</p>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">Use this voice sparingly. It should feel like a signature, never like ordinary interface chrome.</p>
          </div>
        </section>
      </div>
    </FoundationPage>
  );
}

function TypeRow({ label, className, children }: { label: string; className: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-border pb-4 last:border-0 last:pb-0 sm:grid-cols-[8rem_1fr] sm:items-baseline">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className={className}>{children}</span>
    </div>
  );
}

const spacingScale = [4, 8, 12, 16, 20, 24, 32, 48] as const;

export function SpacingFoundation() {
  return (
    <FoundationPage
      title="Spacing"
      description="Shigo uses a 4px base rhythm. Chat stays dense, while immersive auth and splash surfaces may open up to 32-48px relationships."
    >
      <section className="rounded-2xl border border-border bg-card p-6 shadow-panel">
        <div className="space-y-5">
          {spacingScale.map((value) => (
            <div key={value} className="grid grid-cols-[4rem_1fr] items-center gap-4">
              <code className="text-xs text-muted-foreground">{value}px</code>
              <div className="h-6 rounded-sm bg-primary/15">
                <div className="h-full rounded-sm bg-primary" style={{ width: `${value * 4}px`, maxWidth: "100%" }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </FoundationPage>
  );
}

const radii = [
  ["Micro", "--radius-xs", "6px"],
  ["Menu", "--radius-sm", "8px"],
  ["Control", "--radius-md", "12px"],
  ["Card", "--radius-lg", "16px"],
  ["Panel", "--radius-xl", "20px"],
  ["Expressive", "--radius-2xl", "24px"],
] as const;

export function RadiusFoundation() {
  return (
    <FoundationPage
      title="Radius"
      description="Radius communicates scale. Small controls stay precise; large expressive containers can soften without turning every surface into a pill."
    >
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {radii.map(([label, variable, value]) => (
          <div key={variable} className="border border-border bg-card p-5 shadow-panel" style={{ borderRadius: `var(${variable})` }}>
            <div className="mb-10 h-16 rounded-md bg-muted" />
            <p className="text-sm font-semibold">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{value} · {variable}</p>
          </div>
        ))}
      </section>
    </FoundationPage>
  );
}

export function ShadowsFoundation() {
  return (
    <FoundationPage
      title="Shadows"
      description="Dark mode relies on surface and border contrast first. Shadows become stronger only as an element leaves the document plane."
    >
      <section className="grid gap-6 bg-shigo-shell p-8 sm:grid-cols-3" style={{ borderRadius: "var(--radius-2xl)" }}>
        <ShadowSample label="Panel" detail="Ordinary cards and grouped surfaces" className="shadow-panel" />
        <ShadowSample label="Floating" detail="Popover, floating menus, elevated controls" className="shadow-floating" />
        <ShadowSample label="Dialog" detail="Sheets and modal elevation only" className="shadow-dialog" />
      </section>
    </FoundationPage>
  );
}

function ShadowSample({ label, detail, className }: { label: string; detail: string; className: string }) {
  return (
    <div className={`min-h-44 rounded-xl border border-border bg-card p-5 ${className}`}>
      <div className="mb-10 size-8 rounded-md bg-primary/15" />
      <p className="text-sm font-semibold">{label}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}

const iconItems = [
  [Hash, "Quiet Room"],
  [Search, "Search"],
  [Settings2, "Preferences"],
  [Sun, "Light theme"],
  [Moon, "Dark theme"],
  [UserRound, "Profile"],
  [LogOut, "Logout"],
  [ArrowUp, "Send"],
  [Paperclip, "Attachment"],
  [Smile, "Emoji"],
  [Pencil, "Edit"],
  [Trash2, "Delete"],
  [Volume2, "Audio"],
  [Play, "Play"],
  [Pause, "Pause"],
  [X, "Close"],
] as const;

export function IconsFoundation() {
  return (
    <FoundationPage
      title="Icons"
      description="Lucide is the single production icon family. Normal controls use a 1.5 stroke; selected or emphasized states may move to 2 without changing icon metaphors."
    >
      <section className="rounded-2xl border border-border bg-card p-5 shadow-panel">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4 lg:grid-cols-8">
          {iconItems.map(([Icon, label]) => (
            <div key={label} className="flex min-h-28 flex-col items-center justify-center gap-3 bg-card p-3 text-center">
              <Icon size={20} strokeWidth={1.5} />
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </FoundationPage>
  );
}
