// @ts-nocheck
"use client";

import { Copy, Flag, MoreHorizontal, MoreVertical, Reply, Trash2, UserMinus2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Card, CardContent, CardHeader } from "./card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { ScrollArea } from "./scroll-area";
import { cn } from "../../lib/utils";

export type StatusType = "online" | "dnd" | "offline";
export type ConversationAction = "block" | "delete" | "report" | "reply" | "copy";
export type ConversationUser = { id: string; name: string; avatar: string; status?: StatusType };
export type ConversationMessage = { id: number; text: string; sender: ConversationUser; time: string };

const LOCAL_AVATAR_YOU = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3CradialGradient id='g'%3E%3Cstop stop-color='%23e8e7ff'/%3E%3Cstop offset='1' stop-color='%234c6fff'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='32' cy='32' r='32' fill='url(%23g)'/%3E%3C/svg%3E";
const LOCAL_AVATAR_ALICE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cdefs%3E%3CradialGradient id='g'%3E%3Cstop stop-color='%23f0eaff'/%3E%3Cstop offset='1' stop-color='%237566ff'/%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx='32' cy='32' r='32' fill='url(%23g)'/%3E%3C/svg%3E";

export const DEMO_USER: ConversationUser = { id: "user-123", name: "You", avatar: LOCAL_AVATAR_YOU };
export const DEMO_OTHER: ConversationUser = { id: "user-456", name: "Alice", avatar: LOCAL_AVATAR_ALICE, status: "online" };
export const DEMO_MESSAGES: ConversationMessage[] = [
  { id: 1, text: "Hey there! 👋", sender: DEMO_OTHER, time: "09:00" },
  { id: 2, text: "Hi Alice! How are you?", sender: DEMO_USER, time: "09:01" },
  { id: 3, text: "I'm good, thanks! Have you checked out hextaui.com?", sender: DEMO_OTHER, time: "09:02" },
  { id: 4, text: "Not yet! What is it?", sender: DEMO_USER, time: "09:03" },
  { id: 5, text: "It's a modern UI component library. Super easy to use!", sender: DEMO_OTHER, time: "09:04" },
  { id: 6, text: "That sounds cool. Does it have ready-made blocks?", sender: DEMO_USER, time: "09:05" },
  { id: 7, text: "Yes! Tons of blocks and beautiful primitives. You can just copy and paste.", sender: DEMO_OTHER, time: "09:06" },
  { id: 8, text: "Is it customizable?", sender: DEMO_USER, time: "09:07" },
  { id: 9, text: "Absolutely. You can theme everything with Tailwind and CSS variables.", sender: DEMO_OTHER, time: "09:08" },
  { id: 10, text: "Nice! Is there a CLI for installing components?", sender: DEMO_USER, time: "09:09" },
  { id: 11, text: "Yep, just run 'npx hextaui@latest add button' and you're set.", sender: DEMO_OTHER, time: "09:10" },
  { id: 12, text: "Thanks for the info! I'll try it out today.", sender: DEMO_USER, time: "09:11" },
  { id: 13, text: "Let me know if you need help. The docs are great too!", sender: DEMO_OTHER, time: "09:12" },
];

const STATUS_COLORS: Record<StatusType, string> = { online: "bg-green-500", dnd: "bg-red-500", offline: "bg-gray-400" };

function StatusBadge({ status }: { status: StatusType }) {
  return <span aria-label={status} className={cn("inline-block size-3 rounded-full border-2 border-background", STATUS_COLORS[status])} title={status.charAt(0).toUpperCase() + status.slice(1)} />;
}

function UserActionsMenu({ onAction }: { onAction: (action: ConversationAction) => void }) {
  return <DropdownMenu><DropdownMenuTrigger asChild><Button aria-label="User actions" className="border-muted-foreground/30" size="icon" type="button" variant="outline"><MoreVertical aria-hidden="true" className="size-4" /></Button></DropdownMenuTrigger><DropdownMenuContent className="min-w-36 rounded-lg bg-popover p-1 shadow-xl"><DropdownMenuItem onSelect={() => onAction("block")}><UserMinus2 className="mr-2 size-4" />Block User</DropdownMenuItem><DropdownMenuItem onSelect={() => onAction("delete")}><Trash2 className="mr-2 size-4" />Delete Conversation</DropdownMenuItem><DropdownMenuItem onSelect={() => onAction("report")}><Flag className="mr-2 size-4" />Report User</DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
}

function MessageActions({ isMe, onAction }: { isMe: boolean; onAction: (action: ConversationAction) => void }) {
  return <DropdownMenu><DropdownMenuTrigger asChild><Button aria-label="Message actions" className="size-7 rounded bg-background hover:bg-accent" size="icon" type="button" variant="ghost"><MoreHorizontal aria-hidden="true" className="size-3.5" /></Button></DropdownMenuTrigger><DropdownMenuContent align="center" className="w-40 rounded-lg bg-popover p-1 shadow-xl"><DropdownMenuItem onSelect={() => onAction("reply")}><Reply className="mr-2 size-3" />Reply</DropdownMenuItem><DropdownMenuItem onSelect={() => onAction("copy")}><Copy className="mr-2 size-3" />Copy</DropdownMenuItem>{isMe && <DropdownMenuItem onSelect={() => onAction("delete")}><Trash2 className="mr-2 size-3" />Delete</DropdownMenuItem>}<DropdownMenuItem onSelect={() => onAction("report")}><Flag className="mr-2 size-3" />Report</DropdownMenuItem></DropdownMenuContent></DropdownMenu>;
}

export default function MessageConversation({ className, messages = DEMO_MESSAGES, other = DEMO_OTHER, onAction = () => {} }: { className?: string; messages?: ConversationMessage[]; other?: ConversationUser; onAction?: (action: ConversationAction, message?: ConversationMessage) => void }) {
  return <Card className={cn("mx-auto flex h-[75vh] min-h-0 max-w-2xl w-full grow flex-col overflow-hidden shadow-none", className)}><CardHeader className="sticky top-0 z-10 flex flex-row items-center justify-between gap-2 border-b bg-background px-4 py-2"><div className="flex items-center gap-3 pt-1"><Avatar><AvatarImage alt={other.name} src={other.avatar} /><AvatarFallback>{other.name[0]}</AvatarFallback></Avatar><div className="flex flex-col"><div className="font-semibold text-base">{other.name}</div><div className="flex items-center gap-1 text-muted-foreground text-xs"><StatusBadge status={other.status || "offline"} /> {other.status || "offline"}</div></div></div><UserActionsMenu onAction={(action) => onAction(action)} /></CardHeader><CardContent className="min-h-0 flex-1 p-0"><ScrollArea aria-label="Conversation transcript" className="flex h-full max-h-full flex-col gap-6 bg-background p-4" role="log">{messages.map((msg) => { const isMe = msg.sender.id === DEMO_USER.id; return <div className={cn("group my-4 flex gap-2", isMe ? "justify-end" : "justify-start")} key={msg.id}><div className={cn("flex max-w-[80%] items-start gap-2", isMe && "flex-row-reverse")}><Avatar className="size-8"><AvatarImage alt={msg.sender.name} src={msg.sender.avatar} /><AvatarFallback>{msg.sender.name[0]}</AvatarFallback></Avatar><div><div className={cn("rounded-md px-3 py-2 text-sm", isMe ? "bg-primary text-primary-foreground" : "bg-accent text-foreground")}>{msg.text}</div><div className="mt-1 flex items-center gap-2"><time aria-label={`Sent at ${msg.time}`} className="text-muted-foreground text-xs" dateTime={msg.time}>{msg.time}</time><div className="opacity-0 transition-all group-hover:opacity-100"><MessageActions isMe={isMe} onAction={(action) => onAction(action, msg)} /></div></div></div></div></div>; })}</ScrollArea></CardContent></Card>;
}
