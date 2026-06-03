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
import { Hash, LogOut, Menu, Moon, Settings, Sun } from "lucide-react";
import Preferences from "../components/Preferences";

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
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Socket reference to keep single stable socket instance
  const socketRef = useRef(null);

  // Flag to indicate component mounted (to prevent setting state on unmounted component)
  const mounted = useRef(false);
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const initials = user?.username?.slice(0, 2).toUpperCase() || "U";
  const sidebarBg = darkMode
    ? "linear-gradient(180deg, #0f1629 0%, #0c1220 100%)"
    : "linear-gradient(180deg, #fdfbff 0%, #f8f4fe 100%)";

  const renderSidebar = () => (
    <div className="flex h-full w-64 flex-col">
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid var(--sc-border)" }}>
        <svg width="30" height="30" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path d="M32 8 C18 8, 8 19, 8 32 C8 45, 18 56, 32 56 C24 50, 20 42, 20 32 C20 22, 24 14, 32 8Z" fill={darkMode ? "#c4b8e8" : "#9b78d4"} />
          <circle cx="38" cy="18" r="2.5" fill={darkMode ? "#f0eaff" : "#d4beff"} opacity="0.7" />
        </svg>
        <div>
          <span className="sc-serif block text-[1.05rem] font-medium leading-tight sc-text-primary">
            ShigoChat
          </span>
          <span className="text-[0.65rem] tracking-[0.02em] sc-text-muted">
            A quieter place to connect.
          </span>
        </div>
      </div>

      <div className="px-3 pb-2 pt-5">
        <p className="mb-2 pl-2 text-[0.65rem] font-semibold uppercase tracking-[0.1em] sc-text-muted">
          Space
        </p>
        <div
          className="flex cursor-default items-center gap-3 rounded-xl px-3.5 py-3"
          style={{
            background: darkMode
              ? "linear-gradient(135deg, rgba(107,79,168,0.2), rgba(164,146,212,0.08))"
              : "linear-gradient(135deg, rgba(124,92,191,0.12), rgba(184,158,232,0.06))",
            border: "1px solid var(--sc-border)",
          }}
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--sc-accent-soft)" }}>
            <Hash size={14} style={{ color: "var(--sc-accent)" }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.85rem] font-semibold sc-text-primary">Quiet Room</p>
            <p className="truncate text-[0.68rem] sc-text-secondary">One shared conversation space</p>
          </div>
          <div className="h-1.5 w-1.5 rounded-full bg-[#5cc88a] shadow-[0_0_6px_rgba(92,200,138,0.6)]" />
        </div>
      </div>

      <div className="mt-4 px-3">
        <p className="mb-2 pl-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] sc-text-muted">
          Ambient
        </p>
        <MusicPlayer compact />
      </div>

      <div className="flex-1" />

      <div className="px-3 pb-4 pt-4" style={{ borderTop: "1px solid var(--sc-border)" }}>
        <div className="mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5 sc-panel">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6b4fa8] to-[#9b78d4]">
            <span className="text-[0.68rem] font-bold text-white">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[0.84rem] font-semibold sc-text-primary">{user?.username}</p>
            <p className="truncate text-[0.68rem] sc-text-muted">{user?.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleDarkMode}
            className="sc-icon-button flex-1 rounded-lg py-2 text-[0.75rem] font-medium"
            type="button"
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <Sun size={13} /> : <Moon size={13} />}
            <span className="ml-1.5">{darkMode ? "Light" : "Dark"}</span>
          </button>
          <button
            onClick={() => setPrefsOpen(true)}
            className="sc-icon-button rounded-lg px-3 py-2"
            type="button"
            title="Preferences"
          >
            <Settings size={14} />
          </button>
          <button
            onClick={logout}
            className="flex items-center justify-center rounded-lg px-3 py-2"
            style={{
              background: "rgba(224,91,122,0.06)",
              border: "1px solid rgba(224,91,122,0.15)",
              color: "#e05b7a",
              cursor: "pointer",
            }}
            type="button"
            title="Log out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center sc-app-bg">
        <div className="flex flex-col items-center gap-4">
          <svg width="44" height="44" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M32 8 C18 8, 8 19, 8 32 C8 45, 18 56, 32 56 C24 50, 20 42, 20 32 C20 22, 24 14, 32 8Z" fill={darkMode ? "#c4b8e8" : "#9b78d4"} />
          </svg>
          <p className="text-sm tracking-[0.04em] sc-text-secondary">Opening Quiet Room...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 flex sc-app-bg"
    >
      <aside
        className="hidden h-full flex-shrink-0 md:flex"
        style={{ background: sidebarBg, borderRight: "1px solid var(--sc-border)" }}
      >
        {renderSidebar()}
      </aside>

      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed bottom-0 left-0 top-0 z-40 md:hidden"
            style={{ background: sidebarBg, borderRight: "1px solid var(--sc-border)" }}
          >
            {renderSidebar()}
          </motion.aside>
        </>
      )}

      <main className="relative flex min-w-0 flex-1 flex-col">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: darkMode
              ? "radial-gradient(ellipse 60% 50% at 70% 30%, rgba(90,60,160,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(50,30,120,0.04) 0%, transparent 70%)"
              : "radial-gradient(ellipse 60% 50% at 70% 20%, rgba(200,170,240,0.12) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 10% 80%, rgba(220,190,255,0.08) 0%, transparent 70%)",
          }}
        />

        <header
          className="relative z-10 flex flex-shrink-0 items-center gap-3 px-5 py-3.5"
          style={{
            background: darkMode ? "rgba(9,13,26,0.85)" : "rgba(252,250,255,0.9)",
            borderBottom: "1px solid var(--sc-border)",
            backdropFilter: "blur(16px)",
          }}
        >
          <button
            className="sc-icon-button h-8 w-8 rounded-lg md:hidden"
            onClick={() => setSidebarOpen(true)}
            type="button"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>

          <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--sc-accent-soft)", border: "1px solid var(--sc-border)" }}>
            <Hash size={15} style={{ color: "var(--sc-accent)" }} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[0.9rem] font-semibold leading-tight sc-text-primary">Quiet Room</p>
            <p className="truncate text-[0.71rem] sc-text-secondary">A calm shared space for conversation.</p>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={toggleDarkMode} className="sc-icon-button h-8 w-8 rounded-lg" type="button" aria-label="Toggle theme">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => setPrefsOpen(true)} className="sc-icon-button h-8 w-8 rounded-lg" type="button" aria-label="Open preferences">
              <Settings size={16} />
            </button>
          </div>
        </header>

        <section className="sc-scrollbar relative flex-1 overflow-y-auto px-4 py-6 md:px-6" style={{ overflowAnchor: "none" }}>
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <svg width="48" height="48" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.25 }} aria-hidden="true">
                <path d="M32 8 C18 8, 8 19, 8 32 C8 45, 18 56, 32 56 C24 50, 20 42, 20 32 C20 22, 24 14, 32 8Z" fill={darkMode ? "#c4b8e8" : "#9b78d4"} />
              </svg>
              <p className="text-[0.88rem] leading-relaxed sc-text-muted">
                The room is quiet.
                <br />
                Be the first to share something.
              </p>
            </div>
          )}

          <div className="mx-auto flex max-w-3xl flex-col gap-5">
            {messages.map((message, index) => {
              const previous = messages[index - 1];
              const showDayLabel =
                !previous ||
                new Date(message.createdAt).toDateString() !== new Date(previous.createdAt).toDateString();

              return (
                <React.Fragment key={message._id}>
                  {showDayLabel && (
                    <div className="my-2 flex items-center gap-3">
                      <div className="h-px flex-1" style={{ background: "var(--sc-border)" }} />
                      <span className="text-[0.68rem] font-medium tracking-[0.04em] sc-text-muted">
                        {new Date(message.createdAt).toLocaleDateString([], {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <div className="h-px flex-1" style={{ background: "var(--sc-border)" }} />
                    </div>
                  )}
                  <MessageBubble
                    message={message}
                    userId={user?._id}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </section>

        <footer
          className="relative flex-shrink-0 px-4 pb-5 pt-3 md:px-6"
          style={{
            background: darkMode ? "rgba(9,13,26,0.92)" : "rgba(252,250,255,0.92)",
            borderTop: "1px solid var(--sc-border)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="mx-auto max-w-3xl">
            <MessageInput onSend={handleSend} />
          </div>
        </footer>
      </main>

      <Preferences open={prefsOpen} onClose={() => setPrefsOpen(false)} user={user} onLogout={logout} />
    </motion.div>
  );
};

export default Chatroom;
