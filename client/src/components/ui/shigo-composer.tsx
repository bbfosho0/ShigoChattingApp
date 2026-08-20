import { useEffect, useRef, useState } from "react";
import { ArrowUp, Paperclip, Smile, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "components/ui/button";
import { EmojiPicker } from "components/ui/emoji-picker";
import { FileAttachment, type ShigoAttachment } from "components/ui/file-attachment";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Textarea } from "components/ui/textarea";
import { cn } from "lib/utils";
import { shigoSpringSoft } from "lib/shigo-motion";

export interface ShigoComposerProps {
  onSend?: (text: string, attachments: ShigoAttachment[]) => void;
  disabled?: boolean;
  placeholder?: string;
  initialAttachments?: ShigoAttachment[];
  replyingTo?: string;
  onCancelReply?: () => void;
  allowAttachments?: boolean;
  className?: string;
}

export function ShigoComposer({
  onSend,
  disabled = false,
  placeholder = "Message Quiet Room...",
  initialAttachments = [],
  replyingTo,
  onCancelReply,
  allowAttachments = true,
  className,
}: ShigoComposerProps) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<ShigoAttachment[]>(initialAttachments.slice(0, 4));
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef(new Set<string>());

  useEffect(() => () => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();
  }, []);

  const resizeTextarea = () => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 128)}px`;
  };

  const send = () => {
    const trimmed = text.trim();
    if (disabled || (!trimmed && attachments.length === 0)) return;
    onSend?.(trimmed, attachments);
    setText("");
    setAttachments([]);
    attachments.forEach((attachment) => {
      if (attachment.url && objectUrlsRef.current.has(attachment.url)) {
        URL.revokeObjectURL(attachment.url);
        objectUrlsRef.current.delete(attachment.url);
      }
    });
    requestAnimationFrame(resizeTextarea);
  };

  const addFiles = (files: FileList | null) => {
    if (!files || !allowAttachments) return;
    const slots = Math.max(0, 4 - attachments.length);
    if (slots === 0) return;

    const next = Array.from(files).slice(0, slots).map((file, index) => {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.add(url);
      return {
        id: `${file.name}-${file.lastModified}-${index}`,
        name: file.name,
        type: file.type,
        url,
      } satisfies ShigoAttachment;
    });

    setAttachments((current) => [...current, ...next].slice(0, 4));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((current) => {
      const target = current.find((attachment) => attachment.id === id);
      if (target?.url && objectUrlsRef.current.has(target.url)) {
        URL.revokeObjectURL(target.url);
        objectUrlsRef.current.delete(target.url);
      }
      return current.filter((attachment) => attachment.id !== id);
    });
  };

  const appendEmoji = (emoji: string) => {
    setText((current) => `${current}${emoji}`);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      resizeTextarea();
    });
  };

  const canSend = !disabled && (text.trim().length > 0 || attachments.length > 0);

  return (
    <motion.div
      data-shigo-composer
      data-shigo-composer-motion
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border/50 bg-shigo-raised shadow-none outline-none transition-[border-color,box-shadow,background-color] duration-base focus-within:border-primary/35 focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        className
      )}
      animate={{ y: focused ? -1 : 0, scale: focused ? 1.002 : 1 }}
      transition={shigoSpringSoft}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

      <AnimatePresence initial={false}>
        {replyingTo ? (
          <motion.div
            key="replying"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={shigoSpringSoft}
            className="flex items-center gap-3 overflow-hidden bg-secondary/25 px-3.5 py-2.5"
          >
            <div className="min-w-0 flex-1 border-l-2 border-primary/75 pl-3">
              <p className="text-[11px] font-semibold text-primary">Replying</p>
              <p className="truncate text-xs text-muted-foreground">{replyingTo}</p>
            </div>
            <Button size="icon" variant="ghost" onClick={onCancelReply} aria-label="Cancel reply"><X size={14} /></Button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {attachments.length > 0 ? (
          <motion.div
            key="attachments"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={shigoSpringSoft}
            className="grid gap-2 overflow-hidden border-b border-border/40 p-3 sm:grid-cols-2"
          >
            {attachments.map((attachment) => (
              <FileAttachment key={attachment.id} attachment={attachment} onRemove={removeAttachment} />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex items-end gap-1.5 p-2.5 sm:gap-2 sm:p-3">
        {allowAttachments ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept="image/*,.pdf,.txt,.doc,.docx"
              onChange={(event) => addFiles(event.target.files)}
              tabIndex={-1}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Attach files"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || attachments.length >= 4}
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <Paperclip size={17} strokeWidth={1.5} />
            </Button>
          </>
        ) : null}

        <Textarea
          ref={textareaRef}
          value={text}
          rows={1}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => {
            setText(event.target.value);
            requestAnimationFrame(resizeTextarea);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
          className="max-h-32 min-h-[2.25rem] flex-1 resize-none border-0 bg-transparent px-1.5 py-2 shadow-none focus:border-transparent focus:ring-0 focus:ring-offset-0 focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none"
          aria-label="Message Quiet Room"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" size="icon" variant="ghost" aria-label="Choose emoji" disabled={disabled} className="shrink-0 text-muted-foreground hover:text-foreground">
              <Smile size={17} strokeWidth={1.5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" side="top" className="w-auto border-0 bg-transparent p-0 shadow-none">
            <EmojiPicker onSelect={appendEmoji} />
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          size="icon"
          onClick={send}
          disabled={!canSend}
          aria-label="Send message"
          className={cn("shrink-0 transition-shadow duration-base", canSend && "shadow-[0_0_16px_hsl(var(--primary)/0.16)]")}
        >
          <ArrowUp size={16} strokeWidth={2} />
        </Button>
      </div>
      <div className="pointer-events-none hidden justify-end px-3.5 pb-2 text-[11px] text-muted-foreground opacity-0 transition-opacity duration-base group-focus-within:opacity-100 sm:flex">Enter to send · Shift+Enter for new line</div>
    </motion.div>
  );
}
