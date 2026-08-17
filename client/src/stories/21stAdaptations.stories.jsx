import React, { useState } from "react";
import { expect, fn, waitFor } from "storybook/test";
import { Copy, Hash, Menu, Moon, Music2, RefreshCcw, Settings, Sun } from "lucide-react";
import {
  AuthForm,
  Button,
  Drawer,
  Field,
  IconButton,
  InlineState,
  MessageActionRow,
  MobileNavigation,
  PresenceStack,
  RoomHeader,
} from "../components/Primitives";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import {
  ChatBubble as ChatBubblePrimitive,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "../components/ui/chat-bubble";

const meta = {
  title: "ShigoChat/21st adaptations",
  parameters: {
    layout: "padded",
    tags: ["autodocs"],
    docs: {
      description: {
        component: "Local ShigoChat primitives adapted from the 21st.dev pattern families recorded in .21st/INTEGRATION.md. These stories are deterministic and backend-independent.",
      },
    },
  },
};

export default meta;

export const ButtonsAndFields = {
  parameters: {
    docs: { description: { story: "Pattern references: 21st shadcn Button, Fluid Button, Tooltip Icon Button, and Coss Field. Adapted to semantic tokens, native controls, and 44px targets." } },
  },
  render: () => (
    <div className="grid max-w-3xl gap-8 md:grid-cols-2">
      <div className="space-y-3">
        <p className="sc-story-kicker">Control family</p>
        <div className="flex flex-wrap gap-2">
          <Button>Enter the room</Button>
          <Button variant="secondary">Keep it quiet</Button>
          <Button variant="quiet">Later</Button>
          <Button variant="destructive">Delete</Button>
          <Button loading>Saving</Button>
        </div>
        <div className="flex gap-2">
          <IconButton label="Open navigation"><Menu size={17} aria-hidden="true" /></IconButton>
          <IconButton label="Toggle theme" pressed><Moon size={17} aria-hidden="true" /></IconButton>
          <IconButton label="Open preferences"><Settings size={17} aria-hidden="true" /></IconButton>
        </div>
      </div>
      <Field id="storybook-email" label="Email address" description="Used only for signing in." placeholder="you@example.com" />
    </div>
  ),
};

export const RoomIdentityAndPresence = {
  parameters: {
    docs: { description: { story: "Pattern references: Avatar Status and Modern Sidebar. Adapted into a room-first identity with text fallbacks and no dashboard density." } },
  },
  render: () => (
    <div className="max-w-2xl space-y-5">
      <RoomHeader title="Quiet Room" subtitle="One shared conversation · listening quietly" people={[{ name: "Maya", active: true }, { name: "Noah", active: true }, { name: "You", active: false }]} onMenu={fn()} />
      <div className="sc-panel rounded-2xl p-5">
        <div className="mb-3 flex items-center gap-3"><Hash size={15} aria-hidden="true" className="sc-text-muted" /><span className="text-sm sc-text-primary">Presence is never color-only.</span></div>
        <PresenceStack people={[{ name: "Maya", active: true }, { name: "Noah", active: false }]} />
      </div>
    </div>
  ),
};

export const MessageActionsAndComposer = {
  parameters: {
    docs: { description: { story: "Pattern references: Chat Bubble, Chat Message List, Chat Input, and Input Bar demos 12400–12404. Adapted for private human chat, grouped metadata, inline actions, and recoverable send states." } },
  },
  render: () => {
    const message = { _id: "adapted-message", sender: { _id: "owner", username: "You" }, content: "A calmer message surface, with the action model kept close to the conversation.", createdAt: "2026-08-17T12:30:00.000Z" };
    return <div className="max-w-2xl space-y-5"><MessageBubble message={message} userId="owner" forceActionRow onEdit={fn()} onDelete={fn()} /><MessageActionRow id="standalone-actions" onEdit={fn()} onDelete={fn()} /><MessageInput onSend={async () => {}} /></div>;
  },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("button", { name: "Edit" })).toHaveLength(2);
    await expect(canvas.getByRole("textbox", { name: "Message input" })).toBeInTheDocument();
  },
};

export const ChatBubble = {
  parameters: {
    docs: { description: { story: "Local ShigoChat adaptation of the 21st Chat Bubble pattern. It preserves room tokens, text-based identity, labeled actions, loading state, and reduced dependency weight." } },
  },
  render: () => (
    <div className="max-w-xl space-y-5">
      <ChatBubblePrimitive variant="sent">
        <ChatBubbleAvatar fallback="YO" />
        <ChatBubbleMessage variant="sent">I have a question about the library.</ChatBubbleMessage>
      </ChatBubblePrimitive>
      <ChatBubblePrimitive>
        <ChatBubbleAvatar />
        <div>
          <ChatBubbleMessage>Sure, I&apos;d be happy to help.</ChatBubbleMessage>
          <ChatBubbleActionWrapper>
            <ChatBubbleAction icon={<Copy size={15} aria-hidden="true" />} onClick={fn()} />
            <ChatBubbleAction icon={<RefreshCcw size={15} aria-hidden="true" />} onClick={fn()} />
          </ChatBubbleActionWrapper>
        </div>
      </ChatBubblePrimitive>
      <ChatBubblePrimitive>
        <ChatBubbleAvatar />
        <ChatBubbleMessage isLoading />
      </ChatBubblePrimitive>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("status", { name: "Message loading" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("button")).toHaveLength(2);
  },
};

export const InlineRecoveryStates = {
  parameters: {
    docs: { description: { story: "Pattern references: Agent Chat Empty centered (12403), Agent Chat Error (12404), and Empty State collection. The room shell and composer stay present in the application." } },
  },
  render: () => <div className="grid gap-4 md:grid-cols-3">{["loading", "empty", "error"].map((kind) => <div className="sc-panel rounded-2xl p-5" key={kind}><InlineState kind={kind} onAction={kind === "error" ? fn() : undefined} /></div>)}</div>,
};

export const PreferencesDrawer = {
  render: () => {
    const [open, setOpen] = useState(false);
    return <div className="min-h-80"><Button onClick={() => setOpen(true)}>Open preferences</Button><Drawer open={open} onClose={() => setOpen(false)}><div className="space-y-5"><section className="sc-panel rounded-xl p-4"><p className="sc-story-kicker">Appearance</p><div className="mt-3 flex gap-2"><Button variant="secondary"><Sun size={15} /> Light</Button><Button variant="quiet"><Moon size={15} /> Moonlit dark</Button></div></section><section className="sc-panel rounded-xl p-4"><p className="sc-story-kicker">Ambient room</p><div className="mt-3 flex items-center gap-3 text-sm sc-text-primary"><Music2 size={16} /> Soft focus</div></section></div></Drawer></div>;
  },
  play: async ({ canvas, userEvent }) => {
    const open = canvas.getByRole("button", { name: "Open preferences" });
    await userEvent.click(open);
    await expect(canvas.getByRole("dialog")).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument(), { timeout: 1000 });
  },
};

export const MobileNavigationDrawer = {
  render: () => {
    const [open, setOpen] = useState(false);
    return <div className="min-h-80"><IconButton label="Open navigation" onClick={() => setOpen(true)}><Menu size={17} /></IconButton><MobileNavigation open={open} onClose={() => setOpen(false)}><button type="button" className="sc-nav-item sc-touch-target w-full rounded-xl px-3 py-3 text-left" aria-current="page">Quiet Room</button></MobileNavigation></div>;
  },
};

export const AuthFormState = {
  render: () => <div className="max-w-md"><AuthForm title="Welcome back" description="A quiet place to catch up with your people." onSubmit={(event) => event.preventDefault()}><Field id="auth-email" label="Email address" required type="email" placeholder="you@example.com" /><Field id="auth-password" label="Password" required type="password" placeholder="Your password" /><Button type="submit" className="w-full">Enter the room</Button></AuthForm></div>,
};
