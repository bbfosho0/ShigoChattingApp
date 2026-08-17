import { useRef, useState } from "react";
import { LoaderCircle, SendHorizontal } from "lucide-react";
import { ChatInput } from "./ui/chat-input";

export const Composer = ({ onSend, disabled = false, error = "", label = "Message input form" }) => {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);

  const submit = async () => {
    const trimmed = text.trim();
    if (!trimmed || disabled || isSending) return;
    setIsSending(true);
    try {
      await Promise.resolve(onSend(trimmed));
      setText("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isSending) {
      e.preventDefault();
      submit();
    }
  };

  const handleInput = (e) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
  };

  const hasText = text.trim().length > 0;
  const state = disabled ? "disabled" : isSending ? "sending" : hasText ? "ready" : "idle";

  return (
    <div className="space-y-2">
      <form
        onSubmit={handleSubmit}
        className="sc-composer flex items-end gap-3 rounded-xl px-4 py-3"
        style={{
          background: "var(--sc-surface)",
          border: "1px solid var(--sc-border)",
          boxShadow: "0 4px 18px var(--sc-shadow)",
        }}
        aria-label={label}
        data-state={state}
      >
        <ChatInput
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Share what's on your mind..."
          rows={1}
          disabled={disabled}
          className="sc-scrollbar min-h-[1.6rem] max-h-32 flex-1 resize-none bg-transparent px-0 py-0.5 text-[0.9rem] leading-relaxed sc-text-primary placeholder:opacity-60"
          aria-label="Message input"
          aria-describedby={error ? "message-input-error" : undefined}
        />
        <button
          type="submit"
          disabled={!hasText || disabled || isSending}
          className="sc-composer-submit sc-touch-target flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition"
          style={{
            background: hasText ? "var(--sc-accent-strong)" : "var(--sc-accent-glow)",
            border: hasText ? "none" : "1px solid var(--sc-border)",
            color: hasText ? "var(--sc-on-accent)" : "var(--sc-text-muted)",
            cursor: hasText && !disabled && !isSending ? "pointer" : "default",
            boxShadow: hasText ? "0 4px 12px var(--sc-shadow)" : "none",
          }}
          aria-label={isSending ? "Sending message" : "Send message"}
        >
          {isSending ? <LoaderCircle className="animate-spin" size={16} aria-hidden="true" /> : <SendHorizontal size={16} aria-hidden="true" />}
        </button>
      </form>
      {isSending && <p className="sc-composer-status" role="status" aria-live="polite">Sending quietly…</p>}
      {error && <p id="message-input-error" className="sc-composer-error" role="alert">{error}</p>}
    </div>
  );
};

const MessageInput = Composer;

export { MessageInput };
export default MessageInput;
