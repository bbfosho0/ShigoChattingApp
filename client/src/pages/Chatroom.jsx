import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Hash, Moon, Settings2, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import MusicPlayer from "../components/MusicPlayer";
import Preferences from "../components/Preferences";
import { AppSidebar } from "../components/ui/app-sidebar";
import { Button } from "../components/ui/button";
import { ConversationEmpty, ConversationLoading } from "../components/ui/shigo-conversation";
import { MobileNav } from "../components/ui/mobile-nav";

const Chatroom = () => {
  const { user, setUser } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const messagesViewportRef = useRef(null);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      navigate("/login");
      return undefined;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
      navigate("/login", { replace: true });
      return undefined;
    }

    let active = true;
    const controller = new AbortController();
    setLoading(true);

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        if (active) setMessages(res.data);
      } catch (err) {
        if (err?.code === "ERR_CANCELED" || err?.name === "CanceledError") return;
        console.error("Fetch messages error:", err);
        if (active) toast.error("Could not load messages");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchMessages();

    const socket = io(process.env.REACT_APP_API_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err.message);
    });

    const onReceiveMessage = (msg) => {
      if (!active) return;
      setMessages((prev) => {
        if (prev.find((message) => message._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const onEditMessage = (updatedMsg) => {
      if (!active) return;
      setMessages((prev) =>
        prev.map((message) =>
          message._id === updatedMsg._id ? updatedMsg : message
        )
      );
    };

    const onDeleteMessage = (deletedMsgId) => {
      if (!active) return;
      setMessages((prev) =>
        prev.filter((message) => message._id !== deletedMsgId)
      );
    };

    socket.on("receiveMessage", onReceiveMessage);
    socket.on("editMessage", onEditMessage);
    socket.on("deleteMessage", onDeleteMessage);

    return () => {
      active = false;
      controller.abort();
      socket.off("receiveMessage", onReceiveMessage);
      socket.off("editMessage", onEditMessage);
      socket.off("deleteMessage", onDeleteMessage);
      socket.disconnect();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [navigate, setUser, user]);

  useEffect(() => {
    const viewport = messagesViewportRef.current;
    if (!viewport || loading) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [loading, messages]);

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

  const handleSend = async (content) => {
    if (!content.trim()) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/messages`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newMessage = res.data;
      setMessages((prev) => [...prev, newMessage]);

      if (socketRef.current?.connected) {
        socketRef.current.emit("sendMessage", {
          _id: newMessage._id,
          sender:
            typeof newMessage.sender === "object"
              ? newMessage.sender._id
              : newMessage.sender,
        });
      }
    } catch (err) {
      console.error("Handle send message error:", err);
      toast.error("Message could not be sent");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) => prev.filter((message) => message._id !== id));
      if (socketRef.current?.connected) {
        socketRef.current.emit("deleteMessage", { _id: id });
      }
    } catch (err) {
      console.error("Handle delete message error:", err);
      toast.error("Message could not be deleted");
    }
  };

  const handleEdit = async (id, content) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/messages/${id}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) =>
        prev.map((message) => (message._id === id ? res.data : message))
      );
      if (socketRef.current?.connected) {
        socketRef.current.emit("editMessage", res.data);
      }
    } catch (err) {
      console.error("Handle edit message error:", err);
      toast.error("Message could not be edited");
    }
  };

  if (!user) return null;

  const sidebarProps = {
    name: user.username || "User",
    email: user.email || "",
    theme: darkMode ? "dark" : "light",
    roomStatus: "Shared conversation",
    onToggleTheme: toggleDarkMode,
    onPreferences: () => setPrefsOpen(true),
    onLogout: logout,
    ambientContent: <MusicPlayer compact />,
  };

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-background text-foreground">
      <div className="hidden h-full md:block">
        <AppSidebar
          {...sidebarProps}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      </div>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-3 backdrop-blur-md sm:px-5">
          <div className="md:hidden">
            <MobileNav {...sidebarProps} />
          </div>

          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/[0.08] text-primary">
            <Hash size={15} strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold">Quiet Room</p>
            <p className="truncate text-[11px] text-muted-foreground">
              A calm shared space for conversation.
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPrefsOpen(true)}
              aria-label="Open preferences"
            >
              <Settings2 size={16} />
            </Button>
          </div>
        </header>

        <section
          ref={messagesViewportRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          aria-label="Quiet Room messages"
        >
          {loading ? (
            <ConversationLoading />
          ) : messages.length === 0 ? (
            <ConversationEmpty />
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
              {messages.map((message, index) => {
                const previous = messages[index - 1];
                const showDayLabel =
                  !previous ||
                  new Date(message.createdAt).toDateString() !==
                    new Date(previous.createdAt).toDateString();

                return (
                  <React.Fragment key={message._id}>
                    {showDayLabel ? (
                      <div className="my-1 flex items-center gap-3" role="separator">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-[11px] font-medium text-muted-foreground">
                          {new Date(message.createdAt).toLocaleDateString([], {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                    ) : null}
                    <MessageBubble
                      message={message}
                      userId={user._id}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </section>

        <footer className="shrink-0 border-t border-border bg-background/95 px-3 pb-4 pt-3 backdrop-blur-md sm:px-5 sm:pb-5">
          <div className="mx-auto max-w-3xl">
            <MessageInput onSend={handleSend} disabled={loading} />
          </div>
        </footer>
      </main>

      <Preferences
        open={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        user={user}
      />
    </div>
  );
};

export default Chatroom;
