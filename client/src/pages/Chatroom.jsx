import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import MessageInput from "../components/MessageInput";
import MessageBubble from "../components/MessageBubble";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

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
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
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
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
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
      return;
    }

    if (user) {
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
    <div className="relative flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-gray-300 dark:from-black dark:to-gray-900 transition-colors duration-500">
      {/* Floating Blobs */}
      <div className="absolute w-[30rem] h-[30rem] bg-purple-400/30 blur-3xl rounded-full top-[-10rem] left-[-10rem] animate-pulse z-0"></div>
      <div className="absolute w-[30rem] h-[30rem] bg-blue-400/30 blur-3xl rounded-full bottom-[-10rem] right-[-10rem] animate-pulse z-0"></div>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0}}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 m-auto flex flex-col w-full max-w-2xl h-[90vh] backdrop-blur-2xl bg-white/30 dark:bg-white/10 rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
      >
        {/* Header */}
       <div className="sticky top-16 z-20 self-center flex justify-between items-center px-6 py-4 border-b border-white/20 rounded-t-xl backdrop-blur-md bg-white/30 dark:bg-white/10 shadow-md text-lg font-bold text-gray-800 dark:text-white max-w-4xl w-full">

          <span>Welcome, {user?.username}</span>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>


        {/* Messages */}
        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-2 text-sm scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
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

        {/* Input Box */}
        <div className="border-t border-white/20 px-4 py-3 bg-white/10 backdrop-blur-xl">
          <MessageInput onSend={handleSend} />
        </div>
      </motion.div>
    </div>
  );
};

export default Chatroom;
