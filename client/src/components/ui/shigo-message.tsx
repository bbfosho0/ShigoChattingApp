import { useEffect, useMemo, useState } from "react";
import { Check, MoreHorizontal, Pencil, Reply, Smile, Trash2, X } from "lucide-react";

import { Button } from "components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { PresenceAvatar } from "components/ui/presence-avatar";
import { Textarea } from "components/ui/textarea";
import { cn } from "lib/utils";

export interface ShigoMessageData {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string | Date;
  edited?: boolean;
}

export type MessageGroupPosition = "single" | "start" | "middle" | "end";

export interface ShigoMessageProps {
  message: ShigoMessageData;
  currentUserId: string;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onReply?: (message: ShigoMessageData) => void;
  onReact?: (message: ShigoMessageData) => void;
  defaultEditing?: boolean;
  groupPosition?: MessageGroupPosition;
  className?: string;
}

function messageRadius(own: boolean, position: MessageGroupPosition) {
  if (own) {
    if (position === "start") return "rounded-lg rounded-br-sm";
    if (position === "middle") return "rounded-lg rounded-r-sm";
    if (position === "end") return "rounded-lg rounded-tr-sm";
    return "rounded-lg rounded-br-sm";
  }

  if (position === "start") return "rounded-lg rounded-bl-sm";
  if (position === "middle") return "rounded-lg rounded-l-sm";
  if (position === "end") return "rounded-lg rounded-tl-sm";
  return "rounded-lg rounded-bl-sm";
}

function MessageActions({
  own,
  onEdit,
  onDelete,
  onReply,
  onReact,
}: {
  own: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onReply?: () => void;
  onReact?: () => void;
}) {
  const hasActions = Boolean(onReply || onReact || (own && (onEdit || onDelete)));
  if (!hasActions) return null;

  return (
    <div className="flex items-center rounded-md border border-border/50 bg-popover p-0.5 text-muted-foreground shadow-floating">
      {onReply ? <Button size="icon" variant="ghost" aria-label="Reply" onClick={onReply}><Reply size={14} /></Button> : null}
      {onReact ? <Button size="icon" variant="ghost" aria-label="React" onClick={onReact}><Smile size={14} /></Button> : null}
      {own && onEdit ? <Button size="icon" variant="ghost" aria-label="Edit message" onClick={onEdit}><Pencil size={14} /></Button> : null}
      {own && onDelete ? <Button size="icon" variant="ghost" aria-label="Delete message" onClick={onDelete} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button> : null}
    </div>
  );
}

export function ShigoMessage({
  message,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  onReact,
  defaultEditing = false,
  groupPosition = "single",
  className,
}: ShigoMessageProps) {
  const own = message.senderId === currentUserId;
  const [editing, setEditing] = useState(defaultEditing);
  const [draft, setDraft] = useState(message.content);
  const hasActions = Boolean(onReply || onReact || (own && (onEdit || onDelete)));
  const groupStart = groupPosition === "single" || groupPosition === "start";
  const groupEnd = groupPosition === "single" || groupPosition === "end";

  useEffect(() => {
    if (!editing) setDraft(message.content);
  }, [editing, message.content]);

  const time = useMemo(() => {
    const date = message.createdAt instanceof Date ? message.createdAt : new Date(message.createdAt);
    return Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [message.createdAt]);

  const saveEdit = () => {
    const trimmed = draft.trim();
    if (!trimmed || !onEdit) return;
    onEdit(message.id, trimmed);
    setEditing(false);
  };

  const cancelEdit = () => {
    setDraft(message.content);
    setEditing(false);
  };

  const beginEdit = () => {
    setDraft(message.content);
    setEditing(true);
  };

  return (
    <article
      data-group-position={groupPosition}
      data-message-owner={own ? "self" : "other"}
      className={cn("group/message flex w-full gap-3", own && "flex-row-reverse", className)}
    >
      {!own ? (
        groupStart ? (
          <PresenceAvatar
            fallback={message.senderName.slice(0, 2).toUpperCase() || "?"}
            showPresence={false}
            avatarClassName="size-9"
            className="mt-5"
          />
        ) : (
          <div aria-hidden="true" className="size-9 shrink-0" />
        )
      ) : null}

      <div className={cn("min-w-0 max-w-[84%] sm:max-w-[72%]", own && "flex flex-col items-end")}>
        {!own && groupStart ? (
          <div className="mb-1.5 flex items-baseline gap-2 px-1">
            <span className="text-xs font-medium text-foreground">{message.senderName}</span>
            <span className="text-[11px] text-muted-foreground">{time}</span>
          </div>
        ) : null}

        <div className={cn("relative flex items-center gap-2", own && "flex-row-reverse")}>
          {editing ? (
            <div className="w-[min(30rem,70vw)] rounded-lg border border-primary/25 bg-card p-3 shadow-panel">
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    saveEdit();
                  }
                  if (event.key === "Escape") cancelEdit();
                }}
                autoFocus
                rows={2}
                className="min-h-20 border-0 bg-transparent p-0 shadow-none focus-visible:shadow-none"
                aria-label="Edit message"
              />
              <div className="mt-3 flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={cancelEdit} leadingIcon={X}>Cancel</Button>
                <Button size="sm" onClick={saveEdit} leadingIcon={Check} disabled={!draft.trim()}>Save</Button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "px-3.5 py-2 text-sm leading-6",
                messageRadius(own, groupPosition),
                own
                  ? "bg-shigo-own-message text-foreground"
                  : "bg-shigo-other-message text-foreground"
              )}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              {message.edited ? <span className="mt-1 block text-[11px] text-muted-foreground">edited</span> : null}
            </div>
          )}

          {hasActions && !editing ? (
            <div className="hidden opacity-0 transition-opacity duration-fast group-focus-within/message:opacity-100 group-hover/message:opacity-100 sm:block">
              <MessageActions
                own={own}
                onReply={onReply ? () => onReply(message) : undefined}
                onReact={onReact ? () => onReact(message) : undefined}
                onEdit={own && onEdit ? beginEdit : undefined}
                onDelete={own && onDelete ? () => onDelete(message.id) : undefined}
              />
            </div>
          ) : null}

          {hasActions && !editing && groupEnd ? (
            <div className="sm:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="Message actions"><MoreHorizontal size={15} /></Button>
                </PopoverTrigger>
                <PopoverContent align={own ? "end" : "start"} className="w-auto p-1">
                  <MessageActions
                    own={own}
                    onReply={onReply ? () => onReply(message) : undefined}
                    onReact={onReact ? () => onReact(message) : undefined}
                    onEdit={own && onEdit ? beginEdit : undefined}
                    onDelete={own && onDelete ? () => onDelete(message.id) : undefined}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : null}
        </div>

        {own && !editing && groupEnd ? (
          <span className="mt-1 px-1 text-[11px] text-muted-foreground">{time}</span>
        ) : null}
      </div>
    </article>
  );
}
