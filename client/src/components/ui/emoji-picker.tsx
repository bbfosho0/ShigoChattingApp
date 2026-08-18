const EMOJIS = [
  "😀", "😄", "😂", "🥹", "😊", "😍", "🥰", "😎",
  "🤔", "😴", "😭", "😤", "👍", "👎", "👏", "🙌",
  "❤️", "💜", "✨", "🔥", "🎉", "👀", "🙏", "💀",
] as const;

export interface EmojiPickerProps {
  onSelect?: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  return (
    <div className="grid w-64 grid-cols-8 gap-1 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-floating" role="group" aria-label="Emoji picker">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect?.(emoji)}
          className="flex size-7 items-center justify-center rounded-sm text-lg outline-none transition-colors hover:bg-accent focus-visible:shadow-focus"
          aria-label={`Insert ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
