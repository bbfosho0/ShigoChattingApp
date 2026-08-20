import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Hash, Moon, Settings2, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import MessageInput from "../components/MessageInput";
import MusicPlayer from "../components/MusicPlayer";
import Preferences from "../components/Preferences";
import { AppSidebar } from "../components/ui/app-sidebar";
import { Button } from "../components/ui/button";
import { CONVERSATION_MEASURE_CLASS } from "../components/ui/conversation-measure";
import { MobileNav } from "../components/ui/mobile-nav";
import { ShigoConversation } from "../components/ui/shigo-conversation";

const normalizeMessage = (message) => {
  const sender = typeof message.sender === "object" ? message.sender : null;
  const senderId = sender?._id || message.sender || message.senderId || "";
  const senderName = sender?.username || message.username || message.senderName || "Guest";
  const edited = Boolean(
    message.updatedAt &&
      message.createdAt &&
      new Date(message.updatedAt).getTime() !== new Date(message.createdAt).getTime()
  );

  return {
    id: String(message._id || message.id),
    senderId: String(senderId),
    senderName,
    content: message.content || "",
    createdAt: message.createdAt,
    edited,
  };
};

const Chatroom = () => {
  const { user, setUser } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const socketRef = useRef(null);

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

  const conversationMessages = useMemo(() => messages.map(normalizeMessage), [messages]);

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
      <div className="hidden h-full xl:block">
        <AppSidebar
          {...sidebarProps}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      </div>
      <div className="hidden h-full md:block xl:hidden">
        <AppSidebar {...sidebarProps} collapsed />
      </div>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border/50 bg-background px-3 sm:px-4">
          <div className="md:hidden">
            <MobileNav {...sidebarProps} />
          </div>

          <Hash size={17} strokeWidth={1.8} className="shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Quiet Room</p>
            <p className="truncate text-xs text-muted-foreground">
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

        <ShigoConversation
          messages={conversationMessages}
          currentUserId={String(user._id || "")}
          loading={loading}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

        <footer className="shrink-0 bg-background px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
          <div className={CONVERSATION_MEASURE_CLASS}>
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
