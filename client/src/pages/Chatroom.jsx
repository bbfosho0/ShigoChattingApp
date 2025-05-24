import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import MessageInput from "../components/MessageInput";
import MessageBubble from "../components/MessageBubble";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Chatroom = () => {
  const { user, setUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/messages", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (content) => {
    if (!content.trim()) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages",
        { content },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      socket.emit("sendMessage", res.data);
    } catch (err) {
      console.error("Send failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const handleEdit = async (id, content) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/messages/${id}`,
        { content },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? res.data : m))
      );
    } catch (err) {
      console.error("Edit failed");
    }
  };

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login");
    } else if (user) {
      fetchMessages();

      socket.on("receiveMessage", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-bold">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow">
      <div className="flex justify-between items-center p-4 border-b text-xl font-bold">
        <span>Welcome, {user?.username}</span>
        <button
          onClick={logout}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            userId={user?._id}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="border-t p-2">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
};

export default Chatroom;
