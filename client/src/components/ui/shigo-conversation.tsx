import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";

import { ShigoMessage, type ShigoMessageData } from "components/ui/shigo-message";
import { Skeleton } from "components/ui/skeleton";
import { cn } from "lib/utils";

export interface ShigoConversationProps {
  messages: ShigoMessageData[];
  currentUserId: string;
  loading?: boolean;
  autoScroll?: boolean;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onReply?: (message: ShigoMessageData) => void;
  onReact?: (message: ShigoMessageData) => void;
  className?: string;
}

export function ConversationEmpty() {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
      <div className="flex size-11 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground">
        <MessageCircle size={19} strokeWidth={1.5} />
      </div>
      <p className="mt-4 text-sm font-semibold text-foreground">It&apos;s quiet in here.</p>
      <p className="mt-1 max-w-xs text-sm leading-6 text-muted-foreground">Say something when you&apos;re ready.</p>
    </div>
  );
}

export function ConversationLoading() {
  return (
    <div className="space-y-6 p-5" aria-label="Loading conversation" role="status">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className={cn("flex gap-3", item % 2 === 1 && "flex-row-reverse")}>
          {item % 2 === 0 ? <Skeleton className="size-9 shrink-0 rounded-full" /> : null}
          <div className={cn("w-[58%] space-y-2", item % 2 === 1 && "flex flex-col items-end")}>
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-14 w-full rounded-lg" />
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
  onEdit,
  onDelete,
  onReply,
  onReact,
  className,
}: ShigoConversationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoScroll || loading) return;
    const element = scrollRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }, [autoScroll, loading, messages.length]);

  if (loading) return <ConversationLoading />;
  if (messages.length === 0) return <ConversationEmpty />;

  return (
    <div ref={scrollRef} className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain", className)}>
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-end gap-5 px-4 py-5 sm:px-6">
        {messages.map((message) => (
          <ShigoMessage
            key={message.id}
            message={message}
            currentUserId={currentUserId}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={onReply}
            onReact={onReact}
          />
        ))}
      </div>
    </div>
  );
}
