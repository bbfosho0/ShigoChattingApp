import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, LoaderCircle, X } from "lucide-react";

const BUTTON_STYLES = {
  primary: "sc-primary-button",
  secondary: "sc-secondary-button",
  quiet: "sc-quiet-button",
  destructive: "sc-destructive-button",
};

export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  const isDisabled = disabled || loading;
  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      className={`${BUTTON_STYLES[variant] || BUTTON_STYLES.primary} sc-touch-target inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${className}`}
      data-state={loading ? "loading" : isDisabled ? "disabled" : "ready"}
    >
      {loading && <LoaderCircle size={15} aria-hidden="true" className="animate-spin" />}
      {children}
    </button>
  );
}

export const IconButton = React.forwardRef(function IconButton({ children, label, pressed, className = "", ...props }, ref) {
  return (
    <button
      {...props}
      ref={ref}
      type={props.type || "button"}
      className={`sc-icon-button sc-touch-target inline-flex h-11 w-11 items-center justify-center rounded-xl ${className}`}
      aria-label={label}
      aria-pressed={pressed === undefined ? undefined : pressed}
    >
      {children}
    </button>
  );
});

export function Field({
  id,
  label,
  description,
  error,
  required = false,
  className = "",
  ...props
}) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-[0.12em] sc-text-secondary">
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      {description && <p id={descriptionId} className="m-0 text-xs sc-text-muted">{description}</p>}
      <input
        {...props}
        id={id}
        required={required}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        className={`sc-field w-full px-4 py-3 ${error ? "sc-field-error" : ""}`}
      />
      {error && <p id={errorId} className="m-0 text-xs" role="alert" style={{ color: "var(--sc-danger)" }}>{error}</p>}
    </div>
  );
}

export function PresenceStack({ people = [], label = "People in the room" }) {
  return (
    <div className="sc-presence-stack" aria-label={label} role="list">
      {people.slice(0, 4).map((person, index) => {
        const name = typeof person === "string" ? person : person.name;
        const active = typeof person === "object" ? person.active !== false : true;
        return (
          <span
            key={`${name}-${index}`}
            className="sc-presence-avatar"
            role="listitem"
            title={`${name}${active ? " is here" : " is away"}`}
            aria-label={`${name}, ${active ? "active" : "away"}`}
            data-active={active}
          >
            {name.slice(0, 2).toUpperCase()}
          </span>
        );
      })}
      <span className="sr-only">{people.length} {people.length === 1 ? "person" : "people"} here.</span>
    </div>
  );
}

export function RoomHeader({ title = "Quiet Room", subtitle = "One shared conversation", people = [], onMenu }) {
  return (
    <header className="sc-room-header flex items-center gap-3 px-5 py-4" aria-label={`${title} room header`}>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="sc-serif m-0 text-xl font-medium sc-text-primary">{title}</h1>
          <span className="text-xs sc-text-secondary">{people.length} {people.length === 1 ? "person" : "people"} here</span>
        </div>
        <p className="mt-1 mb-0 text-xs sc-text-muted">{subtitle}</p>
      </div>
      <PresenceStack people={people} />
      {onMenu && <IconButton label={`Open ${title} actions`} onClick={onMenu}><ChevronRight size={17} aria-hidden="true" /></IconButton>}
    </header>
  );
}

export function MessageActionRow({ id, onEdit, onDelete, mobile = false }) {
  return (
    <div id={id} className={`flex items-center gap-2 ${mobile ? "md:hidden" : ""}`} aria-label="Message actions">
      <Button variant="quiet" className="px-3 py-1 text-xs" onClick={onEdit}>
        Edit
      </Button>
      <Button variant="destructive" className="px-3 py-1 text-xs" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
}

export function InlineState({ kind = "empty", eyebrow, title, body, actionLabel, onAction }) {
  const isLoading = kind === "loading";
  return (
    <div className={`sc-room-state sc-room-state-${kind}`} role={kind === "error" ? "alert" : "status"} aria-live="polite">
      <div className="sc-room-state-mark" aria-hidden="true">{isLoading ? <span className="sc-room-state-pulse" /> : <span />}</div>
      <p className="sc-room-state-eyebrow">{eyebrow || (isLoading ? "QUIET ROOM" : kind === "error" ? "A SMALL INTERRUPTION" : "A ROOM WITH SPACE")}</p>
      <h2 className="sc-serif sc-room-state-title">{title || (isLoading ? "Opening the room" : kind === "error" ? "The room could not load." : "The room is quiet.")}</h2>
      <p className="sc-room-state-body">{body || (isLoading ? "Gathering the latest conversation..." : kind === "error" ? "Your conversation is safe. Try reconnecting when you are ready." : "Be the first to leave something here.")}</p>
      {onAction && <Button variant="secondary" onClick={onAction}>{actionLabel || "Try again"}</Button>}
    </div>
  );
}

export function Drawer({ open, onClose, title = "Preferences", children, labelledBy = "drawer-title" }) {
  const closeButtonRef = useRef(null);
  const previouslyFocused = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    previouslyFocused.current = document.activeElement;
    closeButtonRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
      if (event.key !== "Tab") return;
      const dialog = event.currentTarget;
      const focusable = [...dialog.querySelectorAll("button, input, select, textarea, [href], [tabindex]:not([tabindex='-1'])")].filter((node) => !node.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const dialog = document.getElementById("storybook-drawer");
    dialog?.addEventListener("keydown", onKeyDown);
    return () => {
      dialog?.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && <>
        <motion.button className="fixed inset-0 z-40 cursor-default bg-black/25" aria-label="Close drawer" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        <motion.aside id="storybook-drawer" role="dialog" aria-modal="true" aria-labelledby={labelledBy} className="sc-panel fixed inset-y-0 right-0 z-50 w-[min(26rem,92vw)] overflow-y-auto border-l p-6" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}>
          <div className="flex items-center justify-between gap-4">
            <h2 id={labelledBy} className="sc-serif m-0 text-2xl font-medium sc-text-primary">{title}</h2>
            <IconButton ref={closeButtonRef} label={`Close ${title}`} onClick={onClose}><X size={17} aria-hidden="true" /></IconButton>
          </div>
          <div className="mt-6">{children}</div>
        </motion.aside>
      </>}
    </AnimatePresence>
  );
}

export function MobileNavigation({ open, onClose, children }) {
  return <Drawer open={open} onClose={onClose} title="ShigoChat" labelledBy="mobile-navigation-title"><nav aria-labelledby="mobile-navigation-title" className="space-y-2">{children}</nav></Drawer>;
}

export function AuthForm({ title, description, children, onSubmit }) {
  return <form onSubmit={onSubmit} className="space-y-5" aria-label={title}><div><h1 className="sc-serif m-0 text-3xl font-medium sc-text-primary">{title}</h1>{description && <p className="mt-2 mb-0 text-sm leading-relaxed sc-text-secondary">{description}</p>}</div>{children}</form>;
}
