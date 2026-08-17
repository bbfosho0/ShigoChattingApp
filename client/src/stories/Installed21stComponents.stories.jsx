import React, { useState } from "react";
import { expect, fn } from "storybook/test";
import { Copy, MoreHorizontal, RefreshCcw, Settings, Sparkles } from "lucide-react";
import {
  ChatBubble as InstalledChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "../components/ui/chat-bubble";
import { ChatMessageList as InstalledChatMessageList } from "../components/ui/chat-message-list";
import { ChatInput as InstalledChatInput } from "../components/ui/chat-input";
import { ComposerInput as InstalledComposerInput } from "../components/ui/composer-input";
import { Sheet as InstalledSheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Drawer as InstalledDrawer, DrawerClose, DrawerContent, DrawerTrigger } from "../components/ui/drawer";
import { Button as InstalledButton } from "../components/ui/button";
import { TooltipIconButton as InstalledTooltipIconButton } from "../components/ui/tooltip-icon-button";
import { PopoverBody, PopoverButton, PopoverContent, PopoverHeader, PopoverRoot, PopoverTrigger } from "../components/ui/popover";
import {
  Menu as InstalledMenu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "../components/ui/menu";
import {
  DropdownMenu as InstalledDropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar as InstalledAvatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Skeleton as InstalledSkeleton } from "../components/ui/skeleton";
import { LoginForm } from "../components/ui/login-form";

const meta = {
  title: "ShigoChat/Installed 21st components",
  parameters: {
    layout: "padded",
    tags: ["autodocs"],
    docs: {
      description: {
        component: "The installed 21st.dev components rendered from local source. The examples use deterministic fixtures and ShigoChat-compatible wrappers; no network, backend, credentials, or sockets are required.",
      },
    },
  },
};

export default meta;

const panel = "sc-panel rounded-2xl p-5";

export const Gallery = {
  render: () => (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className={panel}><h2 className="sc-serif m-0 text-xl sc-text-primary">Conversation</h2><div className="mt-4"><MessageBubbles /></div></section>
      <section className={panel}><h2 className="sc-serif m-0 text-xl sc-text-primary">Composer family</h2><div className="mt-4 space-y-4"><InstalledChatInput placeholder="Installed chat input" aria-label="Installed chat input" /><InstalledComposerInput onSend={fn()} placeholder="Installed composer input" /></div></section>
      <section className={panel}><h2 className="sc-serif m-0 text-xl sc-text-primary">Overlays and actions</h2><div className="mt-4 flex flex-wrap gap-2"><OverlayControls /><ActionControls /></div></section>
      <section className={panel}><h2 className="sc-serif m-0 text-xl sc-text-primary">Identity and loading</h2><div className="mt-4 flex items-center gap-4"><InstalledAvatar><AvatarImage src="" alt="" /><AvatarFallback>QR</AvatarFallback></InstalledAvatar><div className="space-y-2"><InstalledSkeleton className="h-3 w-32" /><InstalledSkeleton className="h-3 w-48" /></div></div></section>
      <section className={`${panel} lg:col-span-2`}><h2 className="sc-serif m-0 text-xl sc-text-primary">Auth reference</h2><div className="mt-4 max-w-md rounded-2xl bg-slate-950 p-5"><LoginForm /></div></section>
    </div>
  ),
};

function MessageBubbles() {
  return (
    <div className="space-y-3">
      <InstalledChatBubble variant="sent"><ChatBubbleAvatar fallback="YO" /><ChatBubbleMessage variant="sent">The installed component is visible in Storybook.</ChatBubbleMessage></InstalledChatBubble>
      <InstalledChatBubble><ChatBubbleAvatar fallback="QR" /><div><ChatBubbleMessage>It remains local and token-adapted for Quiet Room.</ChatBubbleMessage><ChatBubbleActionWrapper><ChatBubbleAction icon={<Copy size={14} />} onClick={fn()} /><ChatBubbleAction icon={<RefreshCcw size={14} />} onClick={fn()} /></ChatBubbleActionWrapper></div></InstalledChatBubble>
    </div>
  );
}

export const ChatBubble = { render: () => <MessageBubbles /> };

export const ChatMessageList = {
  render: () => <div className="h-64 rounded-xl border border-[var(--sc-border)]"><InstalledChatMessageList><p className="m-0 text-sm sc-text-primary">A deterministic message list fixture.</p><p className="m-0 text-sm sc-text-secondary">Scroll behavior is owned by the installed component.</p></InstalledChatMessageList></div>,
};

export const ChatInput = {
  render: () => <div className="max-w-xl space-y-3"><InstalledChatInput placeholder="Write a message" aria-label="Installed chat input" /><p className="m-0 text-xs sc-text-muted">Enter and Shift+Enter are covered by the existing composer contract.</p></div>,
};

export const ComposerInput = {
  render: () => <div className="max-w-xl"><InstalledComposerInput onSend={fn()} placeholder="Compose with toolbar actions" /></div>,
};

function OverlayControls() {
  const [sheetOpen, setSheetOpen] = useState(false);
  return <>
    <InstalledSheet open={sheetOpen} onOpenChange={setSheetOpen}><SheetTrigger asChild><InstalledButton>Open sheet</InstalledButton></SheetTrigger><SheetContent><SheetHeader><SheetTitle>Preferences</SheetTitle><SheetDescription>Installed Sheet with deterministic content.</SheetDescription></SheetHeader><SheetClose asChild><InstalledButton className="mt-5">Close</InstalledButton></SheetClose></SheetContent></InstalledSheet>
    <InstalledDrawer><DrawerTrigger asChild><InstalledButton variant="secondary">Open drawer</InstalledButton></DrawerTrigger><DrawerContent side="right"><div className="p-6"><p className="m-0 sc-text-primary">Installed drawer content.</p><DrawerClose asChild><InstalledButton className="mt-5">Close</InstalledButton></DrawerClose></div></DrawerContent></InstalledDrawer>
  </>;
}

function ActionControls() {
  return <>
    <InstalledTooltipIconButton tooltip="Open settings"><Settings size={16} /></InstalledTooltipIconButton>
    <PopoverRoot><PopoverTrigger>Open popover</PopoverTrigger><PopoverContent><PopoverHeader>Room action</PopoverHeader><PopoverBody><p className="m-0 text-sm">Installed popover content.</p><PopoverButton onClick={fn()}><Sparkles size={14} /> Keep it quiet</PopoverButton></PopoverBody></PopoverContent></PopoverRoot>
    <InstalledMenu><MenuTrigger asChild><InstalledButton variant="ghost"><MoreHorizontal size={16} /> Menu</InstalledButton></MenuTrigger><MenuPopup><MenuItem onSelect={fn()}>Edit</MenuItem><MenuItem onSelect={fn()}>Archive</MenuItem></MenuPopup></InstalledMenu>
    <InstalledDropdownMenu><DropdownMenuTrigger asChild><InstalledButton variant="ghost">Dropdown</InstalledButton></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onSelect={fn()}>Light mode</DropdownMenuItem><DropdownMenuItem onSelect={fn()}>Moonlit dark</DropdownMenuItem></DropdownMenuContent></InstalledDropdownMenu>
  </>;
}

export const OverlaysAndActions = { render: () => <div className="flex flex-wrap gap-2"><OverlayControls /><ActionControls /></div>, play: async ({ canvas }) => { await expect(canvas.getByRole("button", { name: "Open sheet" })).toBeInTheDocument(); } };
export const Sheet = { render: () => <div className="min-h-[24rem] w-full bg-background p-8 text-foreground"><OverlayControls /></div> };
export const Drawer = { render: () => <div className="min-h-[24rem] w-full bg-background p-8 text-foreground"><DrawerOnly /></div> };
export const TooltipIconButton = { render: () => <div className="flex min-h-24 items-center bg-background p-8 text-foreground"><InstalledTooltipIconButton tooltip="Open settings"><Settings size={16} /></InstalledTooltipIconButton></div>, play: async ({ canvas, userEvent }) => { const button = canvas.getByRole("button"); await userEvent.tab(); await expect(button).toHaveFocus(); } };
export const Popover = { render: () => <div className="min-h-[24rem] w-full bg-background p-8 text-foreground"><PopoverOnly /></div> };
export const Menu = { render: () => <div className="min-h-24 bg-background p-8 text-foreground"><MenuOnly /></div> };
export const DropdownMenu = { render: () => <div className="min-h-24 bg-background p-8 text-foreground"><DropdownOnly /></div> };
export const Button = { render: () => <div className="flex flex-wrap gap-2"><InstalledButton>Primary</InstalledButton><InstalledButton variant="secondary">Secondary</InstalledButton><InstalledButton variant="ghost">Quiet</InstalledButton><InstalledButton disabled>Disabled</InstalledButton></div> };
export const Avatar = { render: () => <div className="flex items-center gap-3"><InstalledAvatar><AvatarFallback>QR</AvatarFallback></InstalledAvatar><InstalledAvatar><AvatarImage src="" alt="" /><AvatarFallback>YU</AvatarFallback></InstalledAvatar></div> };
export const Skeleton = { render: () => <div className="space-y-3"><InstalledSkeleton className="h-4 w-48" /><InstalledSkeleton className="h-4 w-72" /><InstalledSkeleton className="h-10 w-full" /></div> };
export const Login = { render: () => <div className="max-w-md rounded-2xl bg-slate-950 p-5"><LoginForm /></div> };

function DrawerOnly() {
  return <InstalledDrawer><DrawerTrigger asChild><InstalledButton>Open drawer</InstalledButton></DrawerTrigger><DrawerContent side="right"><div className="min-h-full w-full max-w-sm p-8"><h2 className="text-xl font-semibold text-foreground">Quiet Room drawer</h2><p className="mt-2 text-sm text-muted-foreground">Dismiss with Escape, the overlay, or the close button.</p><DrawerClose asChild><InstalledButton className="mt-6">Close drawer</InstalledButton></DrawerClose></div></DrawerContent></InstalledDrawer>;
}

function PopoverOnly() {
  return <PopoverRoot><PopoverTrigger>Open popover</PopoverTrigger><PopoverContent><PopoverHeader>Room action</PopoverHeader><PopoverBody><p className="m-0 text-sm">A source-faithful popover with local copy.</p><PopoverButton onClick={fn()}><Sparkles size={14} /> Keep it quiet</PopoverButton></PopoverBody></PopoverContent></PopoverRoot>;
}

function MenuOnly() {
  return <InstalledMenu><MenuTrigger asChild><InstalledButton>Open menu</InstalledButton></MenuTrigger><MenuPopup><MenuItem onSelect={fn()}>Edit message</MenuItem><MenuItem onSelect={fn()}>Delete message</MenuItem></MenuPopup></InstalledMenu>;
}

function DropdownOnly() {
  return <InstalledDropdownMenu><DropdownMenuTrigger asChild><InstalledButton>Open dropdown</InstalledButton></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onSelect={fn()}>Light mode</DropdownMenuItem><DropdownMenuItem onSelect={fn()}>Moonlit dark</DropdownMenuItem></DropdownMenuContent></InstalledDropdownMenu>;
}
