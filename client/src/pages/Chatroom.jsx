/**
 * Chatroom component displays the chat interface for authenticated users.
 * 
 * Features:
 * - Fetches and displays chat messages from the server.
 * - Allows users to send, edit, and delete messages.
 * - Uses AuthContext to access the current user.
 * - Utilizes MessageInput for sending messages and MessageBubble for displaying each message.
 * 
 * @component
 * @returns {JSX.Element} The rendered chatroom UI.
 */
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import MessageInput from "../components/MessageInput";
import MessageBubble from "../components/MessageBubble";

const Chatroom = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/messages", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(res.data);
  };

  const sendMessage = async (text) => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "http://localhost:5000/api/messages",
      { content: text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessages([...messages, res.data]);
  };

  const deleteMessage = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(messages.filter((m) => m._id !== id));
  };

  const editMessage = async (id, newText) => {
    const token = localStorage.getItem("token");
    const res = await axios.patch(
      `http://localhost:5000/api/messages/${id}`,
      { content: newText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessages(messages.map((m) => (m._id === id ? res.data : m)));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      <h2>Welcome, {user?.username}</h2>
      <div>
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            userId={user?.id}
            onDelete={deleteMessage}
            onEdit={editMessage}
          />
        ))}
      </div>
      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default Chatroom;
