import React, { useRef, useState } from "react";
import { expect } from "storybook/test";
import { Hash, Menu, Moon, Settings, Sun } from "lucide-react";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import MusicPlayer from "../components/MusicPlayer";
import Preferences from "../components/Preferences";
import RoomState from "../components/RoomState";

const user = { _id: "owner-id", username: "room owner", email: "owner@example.com" };
const messages = [
  { _id: "room-maya", sender: { _id: "maya-id", username: "Maya" }, content: "Good to see you back.", createdAt: "2026-08-17T12:21:00.000Z", updatedAt: "2026-08-17T12:21:00.000Z" },
  { _id: "room-owner", sender: { _id: "owner-id", username: "room owner" }, content: "The room feels calm today.", createdAt: "2026-08-17T12:23:00.000Z", updatedAt: "2026-08-17T12:23:00.000Z" },
  { _id: "room-ava", sender: { _id: "ava-id", username: "Ava" }, content: "Same. I needed that.", createdAt: "2026-08-17T12:24:00.000Z", updatedAt: "2026-08-17T12:24:00.000Z" },
];

function RoomRail({ onPreferences, onCloseMobile, mobile = false }) {
  return (
    <div className="flex h-full w-64 flex-col sc-room-rail p-4">
      <div className="flex items-center gap-3 border-b pb-5" style={{ borderColor: "var(--sc-border)" }}>
        <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--sc-accent-soft)", color: "var(--sc-accent)" }}><Hash size={16} /></div>
        <div><p className="sc-serif text-lg sc-text-primary">ShigoChat</p><p className="text-[0.68rem] sc-text-secondary">A quieter place to connect.</p></div>
      </div>
      {mobile && <button type="button" onClick={onCloseMobile} className="sc-icon-button sc-touch-target mt-4 rounded-lg">Close navigation</button>}
      <p className="sc-room-kicker mt-6">Space</p>
      <div className="mt-2 flex items-center gap-3 rounded-xl p-3" style={{ background: "var(--sc-accent-soft)", border: "1px solid var(--sc-border)" }}>
        <Hash size={15} style={{ color: "var(--sc-accent)" }} /><div className="min-w-0"><p className="text-sm font-semibold sc-text-primary">Quiet Room</p><p className="truncate text-xs sc-text-secondary">One shared conversation</p></div>
      </div>
      <p className="sc-room-kicker mt-6">Ambient</p>
      <div className="mt-2"><MusicPlayer compact /></div>
      <div className="flex-1" />
      <div className="flex items-center gap-2 border-t pt-4" style={{ borderColor: "var(--sc-border)" }}><div className="grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-white" style={{ background: "var(--sc-accent)" }}>RO</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold sc-text-primary">room owner</p><p className="truncate text-xs sc-text-secondary">owner@example.com</p></div><button type="button" className="sc-icon-button sc-touch-target rounded-lg" onClick={onPreferences} aria-label="Open preferences"><Settings size={15} /></button></div>
    </div>
  );
}

function RoomShellFixture({ state = "populated", mobile = false, showPreferences = false, forceActionRow = false }) {
  const [mobileNav, setMobileNav] = useState(false);
  const [preferences, setPreferences] = useState(showPreferences);
  const [dark, setDark] = useState(false);
  const triggerRef = useRef(null);
  const content = state === "populated" ? messages : [];

  return (
    <div className={`sc-room-shell fixed inset-0 flex sc-app-bg ${dark ? "dark" : ""}`}>
      {!mobile && <aside className="hidden h-full flex-shrink-0 md:flex"><RoomRail onPreferences={() => setPreferences(true)} /></aside>}
      {mobile && mobileNav && <><button type="button" aria-label="Close mobile navigation" className="fixed inset-0 z-30 border-0" style={{ background: "rgba(14,17,23,.58)" }} onClick={() => setMobileNav(false)} /><aside id="mobile-navigation" className="fixed inset-y-0 left-0 z-40"><RoomRail mobile onCloseMobile={() => setMobileNav(false)} onPreferences={() => setPreferences(true)} /></aside></>}
      <main className="sc-room-main relative flex min-w-0 flex-1 flex-col">
        <header className="sc-room-header relative z-10 flex items-center gap-3 border-b px-4 py-4 md:px-6" style={{ borderColor: "var(--sc-border)" }}>
          {mobile && <button type="button" className="sc-icon-button sc-touch-target h-10 w-10 rounded-lg" aria-label="Open navigation" aria-expanded={mobileNav} aria-controls="mobile-navigation" onClick={() => setMobileNav(true)}><Menu size={18} /></button>}
          <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--sc-accent-soft)", color: "var(--sc-accent)" }}><Hash size={16} /></div>
          <div className="min-w-0 flex-1"><p className="sc-room-wordmark truncate">Quiet Room</p><p className="sc-status-line mt-1"><span className="sc-status-dot" />3 people here · listening quietly</p></div>
          <button type="button" className="sc-icon-button sc-touch-target h-10 w-10 rounded-lg" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} onClick={() => setDark((value) => !value)}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
          <button ref={triggerRef} type="button" className="sc-icon-button sc-touch-target h-10 w-10 rounded-lg" aria-label="Open preferences" onClick={() => setPreferences(true)}><Settings size={16} /></button>
        </header>
        <section className="sc-scrollbar relative flex-1 overflow-y-auto px-4 md:px-6" aria-label="Quiet Room conversation">
          {state === "loading" ? <RoomState kind="loading" /> : state === "empty" ? <RoomState kind="empty" /> : state === "error" ? <RoomState kind="error" onRetry={() => {}} /> : <div className="sc-room-message-list flex flex-col gap-5">{content.map((message) => <MessageBubble key={message._id} message={message} userId={user._id} onEdit={() => {}} onDelete={() => {}} forceActionRow={forceActionRow} />)}</div>}
        </section>
        <footer className="sc-room-composer border-t px-4 pb-5 pt-3 md:px-6" style={{ borderColor: "var(--sc-border)" }}><div className="mx-auto max-w-3xl"><MessageInput onSend={() => Promise.resolve()} disabled={state === "loading"} error={state === "error" ? "The room is offline. Your message will stay here until you reconnect." : ""} /></div></footer>
      </main>
      <Preferences open={preferences} onClose={() => setPreferences(false)} returnFocusRef={triggerRef} user={user} onLogout={() => {}} />
    </div>
  );
}

const meta = { title: "ShigoChat/Room shell", parameters: { layout: "fullscreen" }, tags: ["autodocs"] };
export default meta;

export const PopulatedDesktop = { render: () => <RoomShellFixture /> };
export const Loading = { render: () => <RoomShellFixture state="loading" /> };
export const Empty = { render: () => <RoomShellFixture state="empty" /> };
export const FetchError = { render: () => <RoomShellFixture state="error" /> };
export const PreferencesOpen = { render: () => <RoomShellFixture showPreferences /> };
export const MobileNavigation = {
  render: () => <RoomShellFixture mobile />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open navigation" }));
    await expect(canvas.getByRole("button", { name: "Close navigation" })).toBeVisible();
  },
};
export const MobileMessageActions = {
  render: () => <RoomShellFixture mobile forceActionRow />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  },
};
