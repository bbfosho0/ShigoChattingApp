/**
 * MessageInput component allows the user to type and send a message.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function(string): void} props.onSend - Callback function called when a message is sent. Receives the message text as an argument.
 * @returns {JSX.Element} The rendered message input form.
 */
import { useState } from "react";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
