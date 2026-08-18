import { useEffect, useRef, useState } from "react";
import { ArrowUp, Paperclip, Smile, X } from "lucide-react";

import { Button } from "components/ui/button";
import { EmojiPicker } from "components/ui/emoji-picker";
import { FileAttachment, type ShigoAttachment } from "components/ui/file-attachment";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Textarea } from "components/ui/textarea";
import { cn } from "lib/utils";

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

    const next = Array.from(files)
      .slice(0, slots)
      .map((file, index) => {
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
    <div className={cn("rounded-xl border border-border bg-card shadow-panel", className)}>
      {replyingTo ? (
        <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
          <div className="min-w-0 flex-1 border-l-2 border-primary pl-3">
            <p className="text-[11px] font-semibold text-primary">Replying</p>
            <p className="truncate text-xs text-muted-foreground">{replyingTo}</p>
          </div>
          <Button size="icon-sm" variant="ghost" onClick={onCancelReply} aria-label="Cancel reply"><X size={14} /></Button>
        </div>
      ) : null}

      {attachments.length > 0 ? (
        <div className="grid gap-2 border-b border-border p-3 sm:grid-cols-2">
          {attachments.map((attachment) => (
            <FileAttachment key={attachment.id} attachment={attachment} onRemove={removeAttachment} />
          ))}
        </div>
      ) : null}

      <div className="flex items-end gap-2 p-3">
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
              className="shrink-0"
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
          className="max-h-32 min-h-[2.25rem] flex-1 resize-none border-0 bg-transparent px-1 py-2 shadow-none focus-visible:border-transparent focus-visible:shadow-none"
          aria-label="Message Quiet Room"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" size="icon" variant="ghost" aria-label="Choose emoji" disabled={disabled} className="shrink-0">
              <Smile size={17} strokeWidth={1.5} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" side="top" className="w-auto border-0 bg-transparent p-0 shadow-none">
            <EmojiPicker onSelect={appendEmoji} />
          </PopoverContent>
        </Popover>

        <Button type="button" size="icon" onClick={send} disabled={!canSend} aria-label="Send message" className="shrink-0">
          <ArrowUp size={16} strokeWidth={2} />
        </Button>
      </div>
      <div className="flex justify-end px-4 pb-2 text-[10px] text-muted-foreground">Enter to send · Shift+Enter for new line</div>
    </div>
  );
}
