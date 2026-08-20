import { useEffect, useState } from "react";
import { KeyRound, Monitor, Moon, ShieldCheck, Sun, UserRound } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "components/ui/alert-dialog";
import { AmbientPlayer } from "components/ui/ambient-player";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { PresenceAvatar } from "components/ui/presence-avatar";

function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border/60 pt-6 first:border-t-0 first:pt-0">
      <div className="mb-4"><h3 className="text-[17px] font-semibold text-foreground">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div>
      {children}
    </section>
  );
}

export interface AccountSettingsPanelProps {
  name?: string;
  email?: string;
  onSave?: (name: string, email: string) => void;
}

export function AccountSettingsPanel({ name = "Yoshi", email = "yoshi@example.com", onSave }: AccountSettingsPanelProps) {
  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);
  useEffect(() => setDraftName(name), [name]);
  useEffect(() => setDraftEmail(email), [email]);
  const editable = Boolean(onSave);
  const canSave = editable && draftName.trim().length > 0 && draftEmail.trim().length > 0;

  return (
    <div className="space-y-8">
      <SettingsSection title="Profile" description={editable ? "The identity people see when you talk in Quiet Room." : "Your ShigoChat account identity."}>
        <div className="flex items-center gap-3"><PresenceAvatar fallback={(draftName || "?").slice(0, 2).toUpperCase()} presence="online" avatarClassName="size-11" /><div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">{draftName || "Unnamed"}</p><p className="truncate text-xs text-muted-foreground">{draftEmail}</p></div></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="min-w-0 space-y-2"><Label htmlFor="settings-name">Display name</Label><Input id="settings-name" value={draftName} onChange={(event) => setDraftName(event.target.value)} leftIcon={<UserRound />} autoComplete="nickname" readOnly={!editable} /></div>
          <div className="min-w-0 space-y-2"><Label htmlFor="settings-email">Email</Label><Input id="settings-email" value={draftEmail} onChange={(event) => setDraftEmail(event.target.value)} type="email" autoComplete="email" readOnly={!editable} /></div>
        </div>
        {editable ? <div className="mt-5 flex justify-end"><Button disabled={!canSave} onClick={() => onSave?.(draftName.trim(), draftEmail.trim())}>Save changes</Button></div> : null}
      </SettingsSection>
    </div>
  );
}

export interface AppearanceSettingsPanelProps {
  theme?: "light" | "dark";
  onThemeChange?: (theme: "light" | "dark") => void;
}

export function AppearanceSettingsPanel({ theme = "dark", onThemeChange }: AppearanceSettingsPanelProps) {
  return (
    <SettingsSection title="Appearance" description="Choose the same quiet hierarchy in light or dark mode.">
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" aria-pressed={theme === "light"} onClick={() => onThemeChange?.("light")} className={`rounded-lg border p-4 text-left outline-none transition-colors focus-visible:shadow-focus ${theme === "light" ? "border-primary/50 bg-primary/[0.06]" : "border-border/70 bg-transparent hover:bg-accent/40"}`}><Sun size={17} strokeWidth={1.5} /><p className="mt-4 text-sm font-medium">Light</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Alabaster surfaces with violet actions.</p></button>
        <button type="button" aria-pressed={theme === "dark"} onClick={() => onThemeChange?.("dark")} className={`rounded-lg border p-4 text-left outline-none transition-colors focus-visible:shadow-focus ${theme === "dark" ? "border-primary/50 bg-primary/[0.06]" : "border-border/70 bg-transparent hover:bg-accent/40"}`}><Moon size={17} strokeWidth={1.5} /><p className="mt-4 text-sm font-medium">Dark</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Near-black surfaces with restrained contrast.</p></button>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4 rounded-md bg-secondary/40 p-4"><div><p className="text-sm font-medium">Reduced motion</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Shigo automatically honors your operating-system reduced-motion preference.</p></div><Monitor size={18} strokeWidth={1.5} className="shrink-0 text-muted-foreground" /></div>
    </SettingsSection>
  );
}

export interface AmbientSettingsPanelProps {
  playing?: boolean;
  progress?: number;
  volume?: number;
  onTogglePlay?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSeek?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
}

export function AmbientSettingsPanel(props: AmbientSettingsPanelProps) {
  return (
    <SettingsSection title="Ambient" description="Shared sound is a secondary layer, never a requirement for conversation.">
      <AmbientPlayer {...props} />
    </SettingsSection>
  );
}

export interface SecuritySettingsPanelProps {
  minPasswordLength?: number;
  loading?: boolean;
  onUpdatePassword?: (currentPassword: string, newPassword: string) => void;
  onDeleteAccount?: () => void;
}

export function SecuritySettingsPanel({ minPasswordLength = 6, loading = false, onUpdatePassword, onDeleteAccount }: SecuritySettingsPanelProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const matches = newPassword === confirmPassword;
  const canUpdate = !loading && currentPassword.length > 0 && newPassword.length >= minPasswordLength && matches;

  const submitPassword = () => {
    if (!canUpdate) return;
    onUpdatePassword?.(currentPassword, newPassword);
  };

  return (
    <div className="space-y-8">
      <SettingsSection title="Password" description={`Use at least ${minPasswordLength} characters and do not reuse passwords from other services.`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="min-w-0 space-y-2"><Label htmlFor="current-password">Current password</Label><Input id="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" leftIcon={<KeyRound />} autoComplete="current-password" /></div>
          <div className="min-w-0 space-y-2"><Label htmlFor="new-password">New password</Label><Input id="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" minLength={minPasswordLength} leftIcon={<ShieldCheck />} autoComplete="new-password" /></div>
          <div className="min-w-0 space-y-2 sm:col-start-2"><Label htmlFor="confirm-password">Confirm password</Label><Input id="confirm-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" minLength={minPasswordLength} autoComplete="new-password" aria-invalid={Boolean(confirmPassword) && !matches} /></div>
        </div>
        {confirmPassword && !matches ? <p className="mt-2 text-xs text-destructive">Passwords do not match.</p> : null}
        <div className="mt-5 flex justify-end"><Button loading={loading} disabled={!canUpdate} onClick={submitPassword}>Update password</Button></div>
      </SettingsSection>

      {onDeleteAccount ? (
        <SettingsSection title="Danger zone" description="Destructive account actions require explicit confirmation.">
          <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive">Delete account</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete your ShigoChat account?</AlertDialogTitle><AlertDialogDescription>This permanently removes the account. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={onDeleteAccount}>Delete account</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </SettingsSection>
      ) : null}
    </div>
  );
}
