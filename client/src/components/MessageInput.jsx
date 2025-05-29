import { useState } from "react";
import { SendHorizontal } from "lucide-react";

/**
 * MessageInput component - controlled text input with send button.
 *
 * Text colors and placeholder colors are adjusted to match the exact
 * theme-based styling used in Register.jsx input fields to ensure UI consistency.
 */
const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  /**
   * Form submission handler:
   * - Prevent default form submit
   * - Trim and validate input text presence
   * - Invoke onSend callback with trimmed text, then clear input
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 px-3 py-2 bg-white/30 dark:bg-white/10 rounded-xl backdrop-blur-lg shadow-inner border border-white/20"
      aria-label="Message input form"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something magical..."
        className="flex-grow bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none px-2 py-2"
        aria-label="Message input"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className={`transition-all px-3 py-2 rounded-xl flex items-center justify-center ${
          text.trim()
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-400 text-white opacity-50 cursor-not-allowed"
        }`}
        aria-label="Send message"
      >
        <SendHorizontal size={18} />
      </button>
    </form>
  );
};

export default MessageInput;