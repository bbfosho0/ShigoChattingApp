import { useEffect, useRef, type ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { CONVERSATION_MEASURE_CLASS } from "components/ui/conversation-measure";
import { ShigoMessage, type MessageGroupPosition, type ShigoMessageData } from "components/ui/shigo-message";
import { Skeleton } from "components/ui/skeleton";
import { cn } from "lib/utils";

const MESSAGE_GROUP_WINDOW_MS = 5 * 60 * 1000;
const STICK_TO_BOTTOM_THRESHOLD_PX = 96;

function messageTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sameDay(a: ShigoMessageData, b: ShigoMessageData) {
  const left = messageTime(a.createdAt);
  const right = messageTime(b.createdAt);
  return Boolean(left && right && left.toDateString() === right.toDateString());
}

function sameConversationGroup(a: ShigoMessageData | undefined, b: ShigoMessageData | undefined) {
  if (!a || !b || a.senderId !== b.senderId || !sameDay(a, b)) return false;
  const left = messageTime(a.createdAt);
  const right = messageTime(b.createdAt);
  if (!left || !right) return false;
  return Math.abs(right.getTime() - left.getTime()) <= MESSAGE_GROUP_WINDOW_MS;
}

function groupPosition(messages: ShigoMessageData[], index: number): MessageGroupPosition {
  const current = messages[index];
  const joinsPrevious = sameConversationGroup(messages[index - 1], current);
  const joinsNext = sameConversationGroup(current, messages[index + 1]);

  if (joinsPrevious && joinsNext) return "middle";
  if (joinsPrevious) return "end";
  if (joinsNext) return "start";
  return "single";
}

export interface ShigoConversationProps {
  messages: ShigoMessageData[];
  currentUserId: string;
  loading?: boolean;
  autoScroll?: boolean;
  showDaySeparators?: boolean;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onReply?: (message: ShigoMessageData) => void;
  onReact?: (message: ShigoMessageData) => void;
  className?: string;
}

export function ConversationEmpty() {
  return (
    <div className="flex min-h-full flex-col items-center justify-end px-6 pb-14 text-center sm:pb-20">
      <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <MessageCircle size={18} strokeWidth={1.5} />
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">It&apos;s quiet in here.</p>
      <p className="mt-1 max-w-xs text-sm leading-6 text-muted-foreground">Say something when you&apos;re ready.</p>
    </div>
  );
}

export function ConversationLoading() {
  return (
    <div className={cn(CONVERSATION_MEASURE_CLASS, "flex min-h-full flex-col justify-end gap-4 px-4 py-5 sm:px-6")} aria-label="Loading conversation" role="status">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className={cn("flex gap-3", item % 2 === 1 && "flex-row-reverse")}>
          {item % 2 === 0 ? <Skeleton className="size-9 shrink-0 rounded-full" /> : null}
          <div className={cn("w-[58%] space-y-2", item % 2 === 1 && "flex flex-col items-end")}>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      ))}
      <span className="sr-only">Loading messages</span>
    </div>
  );
}

export function ShigoConversation({
  messages,
  currentUserId,
  loading = false,
  autoScroll = true,
  showDaySeparators = true,
  onEdit,
  onDelete,
  onReply,
  onReact,
  className,
}: ShigoConversationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);

  useEffect(() => {
    if (!autoScroll || loading || !stickToBottomRef.current) return;
    const element = scrollRef.current;
    if (!element) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    element.scrollTo({ top: element.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" });
  }, [autoScroll, loading, messages.length]);

  const messageNodes: ReactNode[] = [];
  messages.forEach((message, index) => {
    const previous = messages[index - 1];
    const showDayLabel = showDaySeparators && (!previous || !sameDay(previous, message));
    const position = groupPosition(messages, index);
    const groupStart = position === "single" || position === "start";
    const date = messageTime(message.createdAt);

    if (showDayLabel && date) {
      messageNodes.push(
        <motion.div
          key={`day-${message.id}`}
          className={cn("mb-4 flex items-center gap-3", index > 0 && "mt-6")}
          role="separator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-[11px] font-medium text-muted-foreground">
            {date.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
          </span>
          <div className="h-px flex-1 bg-border/60" />
        </motion.div>
      );
    }

    messageNodes.push(
      <ShigoMessage
        key={message.id}
        message={message}
        currentUserId={currentUserId}
        groupPosition={position}
        className={cn(!showDayLabel && groupStart && index > 0 && "mt-4", !groupStart && "mt-1.5")}
        onEdit={onEdit}
        onDelete={onDelete}
        onReply={onReply}
        onReact={onReact}
      />
    );
  });

  return (
    <div
      ref={scrollRef}
      className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", className)}
      aria-label="Quiet Room messages"
      onScroll={(event) => {
        const element = event.currentTarget;
        const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
        stickToBottomRef.current = distanceFromBottom <= STICK_TO_BOTTOM_THRESHOLD_PX;
      }}
    >
      {loading ? (
        <ConversationLoading />
      ) : messages.length === 0 ? (
        <ConversationEmpty />
      ) : (
        <div className={cn(CONVERSATION_MEASURE_CLASS, "flex min-h-full flex-col justify-end px-4 py-5 sm:px-6")}>
          <AnimatePresence initial={false} mode="popLayout">
            {messageNodes}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
