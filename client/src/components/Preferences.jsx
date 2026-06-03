import React, { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Moon, Sun, X } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";
import MusicPlayer from "./MusicPlayer";

const Preferences = ({ open, onClose, user, onLogout }) => {
  const { darkMode, setTheme } = useContext(ThemeContext);
  const initials = user?.username?.slice(0, 2).toUpperCase() || "U";
  const activeTheme = darkMode ? "dark" : "light";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex w-[min(360px,100vw)] flex-col"
            style={{
              background: "var(--sc-panel)",
              borderLeft: "1px solid var(--sc-border)",
              boxShadow: darkMode
                ? "-24px 0 64px rgba(0,0,0,0.6)"
                : "-24px 0 64px rgba(100,70,180,0.1)",
            }}
          >
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--sc-border)" }}>
              <h2 className="sc-serif text-[1.2rem] font-medium sc-text-primary">Preferences</h2>
              <button
                onClick={onClose}
                className="sc-icon-button h-8 w-8 rounded-lg"
                type="button"
                aria-label="Close preferences"
              >
                <X size={18} />
              </button>
            </div>

            <div className="sc-scrollbar flex-1 space-y-6 overflow-y-auto p-5">
              <section className="flex items-center gap-4 rounded-xl p-4 sc-panel">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6b4fa8] to-[#9b78d4]">
                  <span className="text-base font-semibold text-white">{initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[0.95rem] font-semibold sc-text-primary">{user?.username}</p>
                  <p className="truncate text-[0.78rem] sc-text-secondary">{user?.email}</p>
                </div>
              </section>

              <section>
                <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.06em] sc-text-secondary">
                  Appearance
                </p>
                <div className="flex overflow-hidden rounded-xl" style={{ border: "1px solid var(--sc-border)" }}>
                  {["light", "dark"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setTheme(theme)}
                      className="flex flex-1 items-center justify-center gap-2 py-2.5 text-[0.85rem] transition"
                      style={{
                        background: activeTheme === theme ? "var(--sc-accent-soft)" : "transparent",
                        color: activeTheme === theme ? "var(--sc-accent)" : "var(--sc-text-secondary)",
                        border: 0,
                        cursor: "pointer",
                        fontWeight: activeTheme === theme ? 600 : 400,
                      }}
                      type="button"
                    >
                      {theme === "light" ? <Sun size={14} /> : <Moon size={14} />}
                      {theme === "light" ? "Light" : "Dark"}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.06em] sc-text-secondary">
                  Ambient Music
                </p>
                <MusicPlayer />
              </section>
            </div>

            <div className="p-5" style={{ borderTop: "1px solid var(--sc-border)" }}>
              <button
                onClick={onLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[0.88rem] font-medium transition"
                style={{
                  background: darkMode ? "rgba(224,91,122,0.08)" : "rgba(224,91,122,0.06)",
                  border: "1px solid rgba(224,91,122,0.2)",
                  color: "#e05b7a",
                  cursor: "pointer",
                }}
                type="button"
              >
                <LogOut size={15} />
                Log out
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Preferences;
