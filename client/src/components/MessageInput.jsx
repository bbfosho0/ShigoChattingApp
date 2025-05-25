import { useState } from "react";
import { SendHorizonal } from "lucide-react";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

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
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something magical..."
        className="flex-grow bg-transparent text-sm text-gray-800 dark:text-white placeholder-white/60 focus:outline-none px-2 py-2"
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className={`transition-all px-3 py-2 rounded-xl flex items-center justify-center ${
          text.trim()
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-blue-400 text-white opacity-50 cursor-not-allowed"
        }`}
      >
        <SendHorizonal size={18} />
      </button>
    </form>
  );
};

export default MessageInput;
