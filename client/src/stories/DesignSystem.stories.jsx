import React, { useState } from "react";
import { expect, fn } from "storybook/test";
import { Check, ChevronDown, Hash, LoaderCircle, Menu, Moon, MoreHorizontal, Pencil, SendHorizontal, Settings, Sun, Trash2, Volume2 } from "lucide-react";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import RoomState from "../components/RoomState";

const user = { _id: "room-owner", username: "room owner", email: "owner@example.com" };
const baseMessage = {
  _id: "message-1",
  sender: { _id: "room-owner", username: "room owner" },
  content: "The room feels calm today.",
  createdAt: "2026-08-17T12:24:00.000Z",
};

const meta = {
  title: "ShigoChat/Design system",
  parameters: {
    layout: "padded",
    designs: { type: "figma", url: "https://www.figma.com/design/Srny3gef0k6rBZVkTFEzPC" },
  },
  tags: ["autodocs"],
};

export default meta;

const TokenSwatch = ({ name, value, tone = "light" }) => (
  <div className="min-w-[10rem] overflow-hidden rounded-xl" style={{ border: "1px solid var(--sc-border)" }}>
    <div className="h-16" style={{ background: value }} />
    <div className="space-y-1 p-3" style={{ background: tone === "dark" ? "#171d29" : "var(--sc-surface-raised)" }}>
      <p className="m-0 text-xs font-semibold sc-text-primary">{name}</p>
      <code className="text-[0.68rem] sc-text-muted">{value}</code>
    </div>
  </div>
);

export const SemanticSurfaces = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] sc-text-muted">Surface hierarchy</p>
        <div className="flex flex-wrap gap-3">
          <TokenSwatch name="Canvas" value="var(--sc-canvas)" />
          <TokenSwatch name="Surface" value="var(--sc-surface)" />
          <TokenSwatch name="Raised" value="var(--sc-surface-raised)" />
          <TokenSwatch name="Panel" value="var(--sc-panel)" />
          <TokenSwatch name="Accent soft" value="var(--sc-accent-soft)" />
        </div>
      </div>
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] sc-text-muted">Semantic statuses</p>
        <div className="flex flex-wrap gap-3">
          <TokenSwatch name="Focus / accent" value="var(--sc-accent)" />
          <TokenSwatch name="Success" value="var(--sc-success)" />
          <TokenSwatch name="Destructive" value="var(--sc-danger)" />
          <TokenSwatch name="Border" value="var(--sc-border)" />
        </div>
      </div>
    </div>
  ),
};

export const TypographyAndRhythm = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] sc-text-muted">Editorial display</p>
        <h1 className="sc-serif mt-2 text-5xl font-medium leading-none sc-text-primary">A quieter room to return to.</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Display", "Playfair Display", "3rem / 1"],
          ["Conversation", "DM Sans", "0.875rem / 1.6"],
          ["Metadata", "DM Sans", "0.68rem / 1.2"],
        ].map(([label, font, spec]) => (
          <div key={label} className="rounded-xl p-4 sc-panel">
            <p className="m-0 text-xs font-bold uppercase tracking-[0.12em] sc-text-muted">{label}</p>
            <p className={`mt-3 mb-1 text-lg sc-text-primary ${label === "Display" ? "sc-serif" : ""}`}>{font}</p>
            <code className="text-xs sc-text-secondary">{spec}</code>
          </div>
        ))}
      </div>
    </div>
  ),
};

const Button = ({ children, variant = "primary", disabled = false, loading = false, ...props }) => (
  <button
    {...props}
    type="button"
    disabled={disabled || loading}
    className={variant === "primary" ? "sc-primary-button sc-touch-target rounded-xl px-4 py-2.5 text-sm font-medium" : "sc-touch-target rounded-xl px-4 py-2.5 text-sm font-medium"}
    style={variant === "primary" ? undefined : {
      border: variant === "destructive" ? "1px solid var(--sc-danger)" : "1px solid var(--sc-border)",
      background: variant === "quiet" ? "transparent" : "var(--sc-surface)",
      color: variant === "destructive" ? "var(--sc-danger)" : "var(--sc-text-primary)",
    }}
  >
    {loading && <LoaderCircle className="mr-2 inline animate-spin" size={14} aria-hidden="true" />}
    {children}
  </button>
);

export const ButtonStates = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Enter the room</Button>
      <Button variant="secondary">Keep it quiet</Button>
      <Button variant="quiet">Later</Button>
      <Button variant="destructive">Delete room</Button>
      <Button loading>Saving</Button>
      <Button disabled>Unavailable</Button>
    </div>
  ),
};

export const IconButtonStates = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {[
        [Menu, "Open navigation"],
        [Settings, "Open preferences"],
        [MoreHorizontal, "More actions"],
        [Volume2, "Ambient sound"],
      ].map(([Icon, label]) => (
        <button key={label} className="sc-icon-button sc-touch-target rounded-xl" type="button" aria-label={label}>
          <Icon size={17} aria-hidden="true" />
        </button>
      ))}
      <button className="sc-icon-button sc-touch-target rounded-xl" type="button" aria-label="Current theme" aria-pressed="true">
        <Moon size={17} aria-hidden="true" />
      </button>
    </div>
  ),
};

export const FieldStates = {
  render: () => (
    <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
      <label className="space-y-2 text-sm sc-text-primary">
        <span className="block text-xs font-bold uppercase tracking-[0.12em] sc-text-secondary">Email address</span>
        <input className="sc-field w-full px-4 py-3" placeholder="you@example.com" aria-label="Email address" />
      </label>
      <label className="space-y-2 text-sm sc-text-primary">
        <span className="block text-xs font-bold uppercase tracking-[0.12em] sc-text-secondary">Invalid field</span>
        <input className="sc-field w-full px-4 py-3" aria-invalid="true" aria-describedby="story-field-error" value="not-an-email" readOnly />
        <span id="story-field-error" className="block text-xs" style={{ color: "var(--sc-danger)" }}>Use a valid email address.</span>
      </label>
    </div>
  ),
};

export const RoomHeaderAndPresence = {
  render: () => (
    <div className="max-w-2xl rounded-2xl p-5 sc-room-header" style={{ border: "1px solid var(--sc-border)" }}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--sc-accent-soft)", color: "var(--sc-accent)" }}>
          <Hash size={18} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="sc-serif m-0 text-xl font-medium sc-text-primary">Quiet Room</h2>
            <span className="inline-flex items-center gap-1.5 text-xs sc-text-secondary"><span className="h-2 w-2 rounded-full" style={{ background: "var(--sc-success)" }} aria-hidden="true" />3 here</span>
          </div>
          <p className="mt-1 mb-0 text-xs sc-text-muted">One shared conversation · listening quietly</p>
        </div>
        <button className="sc-icon-button sc-touch-target rounded-xl" type="button" aria-label="Open room actions"><MoreHorizontal size={17} /></button>
      </div>
    </div>
  ),
};

export const MessageStates = {
  render: () => (
    <div className="max-w-2xl space-y-5">
      <MessageBubble message={{ ...baseMessage, _id: "incoming", sender: { _id: "maya", username: "Maya" }, content: "Good to see you back." }} userId={user._id} />
      <MessageBubble message={baseMessage} userId={user._id} onEdit={fn()} onDelete={fn()} />
      <MessageBubble message={{ ...baseMessage, _id: "grouped", content: "Same. I needed that." }} userId={user._id} grouped />
      <MessageBubble message={{ ...baseMessage, _id: "edited", content: "I noticed that too.", updatedAt: "2026-08-17T12:28:00.000Z" }} userId={user._id} />
      <MessageBubble message={{ ...baseMessage, _id: "pending", content: "A message finding its way out." }} userId={user._id} status="pending" />
      <MessageBubble message={{ ...baseMessage, _id: "failed", content: "This one needs another try." }} userId={user._id} status="failed" />
    </div>
  ),
};

export const MessageActions = {
  render: () => (
    <div className="max-w-2xl">
      <MessageBubble message={{ ...baseMessage, content: "Tap or focus the action row to edit this message." }} userId={user._id} onEdit={fn()} onDelete={fn()} forceActionRow />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  },
};

export const ComposerStates = {
  render: () => {
    const [error, setError] = useState("");
    return (
      <div className="max-w-2xl space-y-4">
        <MessageInput label="Idle message input" onSend={async () => { setError(""); }} />
        <MessageInput label="Disabled message input" disabled onSend={fn()} />
        <MessageInput label="Error message input" error={error || "The room is having trouble sending that."} onSend={async () => { setError("Could not send. Try again when you are ready."); }} />
      </div>
    );
  },
};

export const InlineRoomStates = {
  render: () => (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="rounded-2xl p-5 sc-panel"><RoomState kind="loading" /></div>
      <div className="rounded-2xl p-5 sc-panel"><RoomState kind="empty" /></div>
      <div className="rounded-2xl p-5 sc-panel"><RoomState kind="error" onRetry={fn()} /></div>
    </div>
  ),
};

export const ThemeAndAtmosphere = {
  render: () => (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="sc-room-shell relative min-h-64 overflow-hidden rounded-2xl p-6" style={{ background: "var(--sc-canvas)", border: "1px solid var(--sc-border)" }}>
        <p className="text-xs font-bold uppercase tracking-[0.14em] sc-text-muted">Warm paper / light</p>
        <h2 className="sc-serif mt-12 text-3xl font-medium sc-text-primary">A room with daylight.</h2>
      </div>
      <div className="dark sc-room-shell relative min-h-64 overflow-hidden rounded-2xl p-6" style={{ background: "#0d1017", border: "1px solid #303947" }}>
        <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "#a9b0bd" }}>Deep ink / moonlit</p>
        <h2 className="sc-serif mt-12 text-3xl font-medium" style={{ color: "#f3efe8" }}>A room after midnight.</h2>
      </div>
    </div>
  ),
};

export const AccessibilityContract = {
  render: () => (
    <div className="max-w-2xl rounded-2xl p-6 sc-panel">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "var(--sc-success)", color: "white" }}><Check size={17} aria-hidden="true" /></div>
        <div>
          <h2 className="sc-serif m-0 text-xl font-medium sc-text-primary">Every quiet detail should still be usable.</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed sc-text-secondary">
            <li>Keyboard-first controls with visible focus.</li>
            <li>44px touch targets and readable contrast.</li>
            <li>Semantic labels, live statuses, and recoverable errors.</li>
            <li>Reduced motion keeps the room calm without hiding feedback.</li>
          </ul>
        </div>
      </div>
    </div>
  ),
};
