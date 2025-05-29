import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import MessageInput from "../components/MessageInput";
import MessageBubble from "../components/MessageBubble";
import MusicPlayer from "../components/MusicPlayer";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { Moon, Sun, LogOut } from "lucide-react";

/**
 * Chatroom component - main chat interface with robust socket lifecycle handling.
 *
 * Features:
 * - Stable socket connection per user session.
 * - Verbose logging for connection state and message events.
 * - Authentication token presence check.
 * - Proper cleanup on unmount and user logout.
 * - Real-time updates on message edits and deletes via socket.io.
 * Includes floating blob background from SplashScreen.jsx style for exact visual consistency.
 */
const Chatroom = () => {
  const { user, setUser } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Socket reference to keep single stable socket instance
  const socketRef = useRef(null);

  // Flag to indicate component mounted (to prevent setting state on unmounted component)
  const mounted = useRef(false);

  // Exact same floating blobs as SplashScreen.jsx for consistent emotional design
  const blobs = darkMode
    ? [
        {
          className:
            "absolute z-10 w-72 h-72 bg-purple-300/40 dark:bg-purple-800/20 rounded-full blur-3xl opacity-55 mix-blend-lighten left-[-4%] top-16",
          animationDuration: 15,
          animationDelay: 0,
        },
        {
          className:
            "absolute z-10 w-52 h-52 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-2xl opacity-50 mix-blend-lighten right-[7%] top-38",
          animationDuration: 18,
          animationDelay: 1.5,
        },
        {
          className:
            "absolute z-10 w-40 h-44 bg-pink-200/40 dark:bg-pink-700/15 rounded-full blur-2xl opacity-35 mix-blend-lighten left-24 bottom-20",
          animationDuration: 20,
          animationDelay: 3,
        },
        {
          className:
            "absolute z-10 w-64 h-36 bg-indigo-200/20 dark:bg-indigo-600/10 rounded-full blur-2xl opacity-35 mix-blend-lighten right-40 bottom-[14%]",
          animationDuration: 16,
          animationDelay: 4.5,
        },
      ]
    : [
        {
          className:
            "absolute z-10 w-72 h-72 bg-purple-500/80 rounded-full blur-3xl opacity-90 left-[-4%] top-16 shadow-lg",
          animationDuration: 15,
          animationDelay: 0,
        },
        {
          className:
            "absolute z-10 w-52 h-52 bg-blue-500/85 rounded-full blur-2xl opacity-85 right-[7%] top-38 shadow-lg",
          animationDuration: 18,
          animationDelay: 1.5,
        },
        {
          className:
            "absolute z-10 w-40 h-44 bg-pink-400/80 rounded-full blur-2xl opacity-80 left-24 bottom-20 shadow-md",
          animationDuration: 20,
          animationDelay: 3,
        },
        {
          className:
            "absolute z-10 w-64 h-36 bg-indigo-500/70 rounded-full blur-2xl opacity-75 right-40 bottom-[14%] shadow-md",
          animationDuration: 16,
          animationDelay: 4.5,
        },
      ];

  /**
   * Fetch messages from server REST API.
   * Wrapped in function so it can be called after socket initialization or on user change.
   */
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No auth token found during fetchMessages");
        setMessages([]);
        return;
      }
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (mounted.current) setMessages(res.data);
    } catch (err) {
      console.error("Fetch messages error:", err);
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  /**
   * Stable effect to handle user login state and socket connection lifecycle.
   * Runs on user change only.
   */
  useEffect(() => {
    mounted.current = true;

    if (!user) {
      // If no user, redirect to login immediately and cleanup socket if any
      if (socketRef.current) {
        console.log("Disconnecting socket due to no user");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      navigate("/login");
      return () => {
        mounted.current = false;
      };
    }

    // User logged in: fetch messages and establish socket connection
    setLoading(true);
    fetchMessages();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No JWT token found for socket connection");
      setLoading(false);
      return;
    }

    console.log("Establishing socket connection for user:", user?.username);

    // Create socket with websocket transport for reliability
    const socket = io(process.env.REACT_APP_API_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Connection lifecycle logging
    socket.on("connect", () => {
      console.log(`Socket connected: id=${socket.id}`);
    });
    socket.on("disconnect", (reason) => {
      console.log(`Socket disconnected. Reason: ${reason}`);
    });
    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err.message);
    });
    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(`Socket reconnect attempt #${attempt}`);
    });
    socket.io.on("reconnect_failed", () => {
      console.error("Socket reconnect failed");
    });

    /**
     * Handler for incoming new messages from socket
     * Adds message if not already present.
     */
    const onReceiveMessage = (msg) => {
      console.log("Socket receiveMessage event:", msg);
      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    /**
     * Handler for message edits from socket
     * Updates the message content in state.
     */
    const onEditMessage = (updatedMsg) => {
      console.log("Socket editMessage event:", updatedMsg);
      setMessages((prev) =>
        prev.map((m) => (m._id === updatedMsg._id ? updatedMsg : m))
      );
    };

    /**
     * Handler for message deletions from socket
     * Removes the message from state.
     */
    const onDeleteMessage = (deletedMsgId) => {
      console.log("Socket deleteMessage event:", deletedMsgId);
      setMessages((prev) => prev.filter((m) => m._id !== deletedMsgId));
    };

    socket.on("receiveMessage", onReceiveMessage);
    socket.on("editMessage", onEditMessage);
    socket.on("deleteMessage", onDeleteMessage);

    // Cleanup function on component unmount or user change
    return () => {
      console.log("Cleaning up socket connection");
      socket.off("receiveMessage", onReceiveMessage);
      socket.off("editMessage", onEditMessage);
      socket.off("deleteMessage", onDeleteMessage);
      socket.disconnect();
      socketRef.current = null;
      mounted.current = false;
    };
  }, [user, navigate]);

  /**
   * Logout user:
   * Clears user context, localStorage tokens,
   * disconnects socket and redirects to login.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    navigate("/login");
  };

  /**
   * Send new message to server and emit real-time socket event.
   *
   * @param {string} content Text content of message to send.
   */
  const handleSend = async (content) => {
    if (!content.trim()) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found during handleSend");
        return;
      }
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/messages`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newMessage = res.data;

      // Optimistic UI update
      setMessages((prev) => [...prev, newMessage]);

      // Emit socket event if connected
      if (socketRef.current?.connected) {
        // Emit only minimal message info: _id and sender id string/object
        const messageToEmit = {
          _id: newMessage._id,
          sender:
            typeof newMessage.sender === "object"
              ? newMessage.sender._id
              : newMessage.sender,
        };
        socketRef.current.emit("sendMessage", messageToEmit);
        console.log("Emitted sendMessage event for:", newMessage._id);
      } else {
        console.warn("Socket not connected. Could not emit sendMessage.");
      }
    } catch (err) {
      console.error("Handle send message error:", err);
    }
  };

  /**
   * Delete message by ID:
   * Sends DELETE to backend and removes from state on success.
   * Emits socket event for other clients.
   *
   * @param {string} id Message ID to delete.
   */
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found during handleDelete");
        return;
      }
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((m) => m._id !== id));
      console.log("Deleted message:", id);

      // Emit socket event if connected
      if (socketRef.current?.connected) {
        socketRef.current.emit("deleteMessage", { _id: id });
        console.log("Emitted deleteMessage event for:", id);
      } else {
        console.warn("Socket not connected. Could not emit deleteMessage.");
      }
    } catch (err) {
      console.error("Handle delete message error:", err);
    }
  };

  /**
   * Edit message content:
   * Sends PATCH to backend and updates local state on success.
   * Emits socket event for other clients.
   *
   * @param {string} id Message ID to edit.
   * @param {string} content New text content.
   */
  const handleEdit = async (id, content) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found during handleEdit");
        return;
      }
      const res = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/messages/${id}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? res.data : m))
      );
      console.log("Edited message:", id);

      // Emit socket event if connected
      if (socketRef.current?.connected) {
        // Emit full updated message
        socketRef.current.emit("editMessage", res.data);
        console.log("Emitted editMessage event for:", id);
      } else {
        console.warn("Socket not connected. Could not emit editMessage.");
      }
    } catch (err) {
      console.error("Handle edit message error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-extrabold text-gray-900 dark:text-gray-100">
        Loading chat...
      </div>
    );
  }

  // SplashScreen background gradient classes (light theme)
  const splashBackgroundClass =
    "bg-gradient-to-br from-purple-300 via-blue-400 to-indigo-500";

  return (
    /* Wrapping container with relative positioning to anchor blobs absolutely */
    <motion.div
      className={`relative flex flex-col items-center justify-center h-screen w-screen pt-12 pb-8 px-4 md:px-8
        ${darkMode ? "bg-gradient-to-br from-black to-gray-900" : splashBackgroundClass}`}
      layout
    >
      {/* Floating blobs exact from SplashScreen to preserve visual harmony */}
      {blobs.map(({ className, animationDuration, animationDelay }, i) => (
        <motion.div
          key={i}
          className={className}
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: animationDuration,
            ease: "easeInOut",
            delay: animationDelay,
            repeat: Infinity,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Main chat container */}
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`flex flex-col justify-between w-full max-w-5xl h-[70vh] rounded-3xl border border-white/25 shadow-xl p-6
          ${
            darkMode
              ? "bg-white/30 dark:bg-white/10 backdrop-blur-3xl"
              : "bg-white/30 backdrop-blur-3xl bg-opacity-70"
          }`}
        style={{ zIndex: 20 }}
      >
        {/* Messages scrolling container */}
        <div className="flex-1 flex flex-col overflow-y-auto scroll-smooth space-y-1 px-4 py-2">
          {messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              userId={user?._id}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>

        {/* Message input */}
        <div className="flex-shrink-0 mt-4 max-w-full">
          <MessageInput onSend={handleSend} />
        </div>
      </motion.div>

      {/* Header with greeting, theme toggle and logout */}
      <header
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30 flex items-center justify-between space-x-10
        bg-white/75 dark:bg-black/75 backdrop-blur-xl p-3 rounded-xl shadow-lg
        w-[min(98vw,600px)] select-none"
        style={{ zIndex: 30 }}
      >
        <div className="font-inter text-lg font-semibold text-gray-900 dark:text-gray-100 tracking-wide">
          Hello, {user?.username || "Guest"}
        </div>
        <div className="flex items-center space-x-5">
          <button
            aria-label="Toggle dark/light mode"
            onClick={toggleDarkMode}
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition
            focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button
            onClick={logout}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600
            rounded-2xl px-5 py-2 text-white font-inter font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-purple-400/80 transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Music Player fixed at bottom center */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 w-[min(96vw,460px)]">
        <MusicPlayer autoPlay volumeInitial={0.2} />
      </div>
    </motion.div>
  );
};

export default Chatroom;