import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, LogOut, Moon, Sun, X } from "lucide-react";
import toast from "react-hot-toast";
import { ThemeContext } from "../context/ThemeContext";
import MusicPlayer from "./MusicPlayer";

const Preferences = ({ open, onClose, returnFocusRef, user, onLogout }) => {
  const { darkMode, setTheme } = useContext(ThemeContext);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const initials = user?.username?.slice(0, 2).toUpperCase() || "U";
  const activeTheme = darkMode ? "dark" : "light";
  const handleClose = useCallback(() => {
    onClose();
    window.setTimeout(() => returnFocusRef?.current?.focus(), 0);
  }, [onClose, returnFocusRef]);

  useEffect(() => {
    if (!open) return undefined;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll("button, input, textarea, select, a[href], [tabindex]:not([tabindex='-1'])")].filter((element) => !element.disabled);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  const updatePasswordField = (field, value) => {
    setPasswordForm((current) => ({ ...current, [field]: value }));
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Current and new password are required");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/auth/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Password change failed";
      toast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 cursor-default border-0 p-0"
            style={{ background: "rgba(14,17,23,0.52)" }}
            onClick={handleClose}
            type="button"
            aria-label="Close preferences"
          />

          <motion.div
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="preferences-title"
            aria-describedby="preferences-description"
            id="preferences-dialog"
            ref={dialogRef}
          >
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--sc-border)" }}>
              <div>
                <h2 id="preferences-title" className="sc-serif text-[1.2rem] font-medium sc-text-primary">Preferences</h2>
                <p id="preferences-description" className="mt-1 text-[0.74rem] sc-text-secondary">Tune the room without leaving the conversation.</p>
              </div>
              <button
                onClick={handleClose}
                className="sc-icon-button sc-touch-target h-8 w-8 rounded-lg"
                type="button"
                aria-label="Close preferences"
                ref={closeButtonRef}
              >
                <X size={18} />
              </button>
            </div>

            <div className="sc-scrollbar flex-1 space-y-6 overflow-y-auto p-5">
              <section className="flex items-center gap-4 rounded-xl p-4 sc-panel">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full" style={{ background: "var(--sc-accent)" }}>
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
                  Account
                </p>
                <form
                  onSubmit={handleChangePassword}
                  className="space-y-3 rounded-xl p-4"
                  style={{ background: "var(--sc-accent-glow)", border: "1px solid var(--sc-border)" }}
                >
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    value={user?.email || ""}
                    readOnly
                    tabIndex={-1}
                    aria-hidden="true"
                    className="sc-visually-hidden"
                  />
                  <div className="flex items-center gap-2 text-[0.86rem] font-semibold sc-text-primary">
                    <KeyRound size={15} style={{ color: "var(--sc-accent)" }} />
                    Change password
                  </div>
                  <label className="sc-visually-hidden" htmlFor="current-password">Current password</label>
                  <input
                    id="current-password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(event) => updatePasswordField("currentPassword", event.target.value)}
                    placeholder="Current password"
                    className="sc-field px-3 py-2 text-[0.84rem]"
                    autoComplete="current-password"
                  />
                  <label className="sc-visually-hidden" htmlFor="new-password">New password</label>
                  <input
                    id="new-password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(event) => updatePasswordField("newPassword", event.target.value)}
                    placeholder="New password"
                    className="sc-field px-3 py-2 text-[0.84rem]"
                    autoComplete="new-password"
                  />
                  <label className="sc-visually-hidden" htmlFor="confirm-password">Confirm new password</label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(event) => updatePasswordField("confirmPassword", event.target.value)}
                    placeholder="Confirm new password"
                    className="sc-field px-3 py-2 text-[0.84rem]"
                    autoComplete="new-password"
                  />
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="sc-primary-button w-full px-3 py-2 text-[0.84rem] font-medium"
                  >
                    {passwordLoading ? "Saving..." : "Save password"}
                  </button>
                </form>
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
                className="sc-touch-target flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[0.88rem] font-medium transition"
                style={{
                background: "transparent",
                border: "1px solid var(--sc-danger)",
                color: "var(--sc-danger)",
                  cursor: "pointer",
                }}
                type="button"
              >
                <LogOut size={15} />
                Log out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Preferences;
