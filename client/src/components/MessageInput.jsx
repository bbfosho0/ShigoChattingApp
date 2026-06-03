import { useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";

const MessageInput = ({ onSend, disabled = false }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 rounded-2xl px-4 py-3"
      style={{
        background: "var(--sc-bubble-other)",
        border: "1.5px solid var(--sc-border)",
        boxShadow: "0 4px 24px var(--sc-shadow), inset 0 1px 0 rgba(255,255,255,0.2)",
        backdropFilter: "blur(16px)",
      }}
      aria-label="Message input form"
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Share what's on your mind..."
        rows={1}
        disabled={disabled}
        className="sc-scrollbar min-h-[1.6rem] max-h-32 flex-1 resize-none bg-transparent px-0 py-0.5 text-[0.9rem] leading-relaxed outline-none sc-text-primary placeholder:opacity-60"
        aria-label="Message input"
      />
      <button
        type="submit"
        disabled={!hasText || disabled}
        className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-xl transition"
        style={{
          background: hasText
            ? "linear-gradient(135deg, var(--sc-accent-strong), var(--sc-accent))"
            : "var(--sc-accent-glow)",
          border: hasText ? "none" : "1px solid var(--sc-border)",
          color: hasText ? "#ffffff" : "var(--sc-text-muted)",
          cursor: hasText && !disabled ? "pointer" : "default",
          boxShadow: hasText ? "0 4px 16px rgba(107,79,168,0.32)" : "none",
          transform: hasText ? "scale(1)" : "scale(0.92)",
        }}
        aria-label="Send message"
      >
        <SendHorizontal size={16} />
      </button>
    </form>
  );
};

export default MessageInput;
