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
import { Toggle } from "components/ui/toggle";

function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-panel">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
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

  const canSave = draftName.trim().length > 0 && draftEmail.trim().length > 0;

  return (
    <div className="space-y-4">
      <SettingsSection title="Profile" description="The identity people see when you talk in Quiet Room.">
        <div className="flex items-center gap-4">
          <PresenceAvatar fallback={(draftName || "?").slice(0, 2).toUpperCase()} presence="online" avatarClassName="size-12" />
          <div><p className="text-sm font-medium text-foreground">{draftName || "Unnamed"}</p><p className="text-xs text-muted-foreground">Online</p></div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="settings-name">Display name</Label><Input id="settings-name" value={draftName} onChange={(event) => setDraftName(event.target.value)} leftIcon={<UserRound />} autoComplete="nickname" /></div>
          <div className="space-y-2"><Label htmlFor="settings-email">Email</Label><Input id="settings-email" value={draftEmail} onChange={(event) => setDraftEmail(event.target.value)} type="email" autoComplete="email" /></div>
        </div>
        <div className="mt-5 flex justify-end"><Button disabled={!canSave} onClick={() => onSave?.(draftName.trim(), draftEmail.trim())}>Save changes</Button></div>
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
        <button type="button" aria-pressed={theme === "light"} onClick={() => onThemeChange?.("light")} className={`rounded-lg border p-4 text-left outline-none transition-colors focus-visible:shadow-focus ${theme === "light" ? "border-primary bg-primary/[0.06]" : "border-border bg-secondary"}`}>
          <Sun size={17} strokeWidth={1.5} /><p className="mt-4 text-sm font-medium">Light</p><p className="mt-1 text-xs text-muted-foreground">Alabaster surfaces with violet actions.</p>
        </button>
        <button type="button" aria-pressed={theme === "dark"} onClick={() => onThemeChange?.("dark")} className={`rounded-lg border p-4 text-left outline-none transition-colors focus-visible:shadow-focus ${theme === "dark" ? "border-primary bg-primary/[0.06]" : "border-border bg-secondary"}`}>
          <Moon size={17} strokeWidth={1.5} /><p className="mt-4 text-sm font-medium">Dark</p><p className="mt-1 text-xs text-muted-foreground">Near-black surfaces with restrained contrast.</p>
        </button>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-border bg-secondary p-4">
        <div><p className="text-sm font-medium">Reduce decorative motion</p><p className="mt-1 text-xs text-muted-foreground">System reduced-motion preferences always take priority.</p></div>
        <Toggle size="icon" variant="outline" aria-label="Reduce decorative motion"><Monitor size={16} /></Toggle>
      </div>
    </SettingsSection>
  );
}

export interface AmbientSettingsPanelProps {
  playing?: boolean;
  progress?: number;
  volume?: number;
  onTogglePlay?: () => void;
  onVolumeChange?: (value: number) => void;
}

export function AmbientSettingsPanel(props: AmbientSettingsPanelProps) {
  return (
    <div className="space-y-4">
      <AmbientPlayer {...props} />
      <SettingsSection title="Ambient behavior" description="Audio remains optional and never competes with conversation.">
        <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium">Remember volume</p><p className="mt-1 text-xs text-muted-foreground">Restore your last volume on this device.</p></div><Toggle variant="outline" aria-label="Remember volume">On</Toggle></div>
      </SettingsSection>
    </div>
  );
}

export interface SecuritySettingsPanelProps {
  onUpdatePassword?: (currentPassword: string, newPassword: string) => void;
  onDeleteAccount?: () => void;
}

export function SecuritySettingsPanel({ onUpdatePassword, onDeleteAccount }: SecuritySettingsPanelProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const canUpdate = currentPassword.length > 0 && newPassword.length >= 8;

  return (
    <div className="space-y-4">
      <SettingsSection title="Password" description="Use a strong password you do not reuse elsewhere.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="current-password">Current password</Label><Input id="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} type="password" leftIcon={<KeyRound />} autoComplete="current-password" /></div>
          <div className="space-y-2"><Label htmlFor="new-password">New password</Label><Input id="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" leftIcon={<ShieldCheck />} autoComplete="new-password" /></div>
        </div>
        <div className="mt-5 flex justify-end"><Button disabled={!canUpdate} onClick={() => onUpdatePassword?.(currentPassword, newPassword)}>Update password</Button></div>
      </SettingsSection>

      <SettingsSection title="Danger zone" description="Destructive account actions require explicit confirmation.">
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="destructive">Delete account</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Delete your ShigoChat account?</AlertDialogTitle><AlertDialogDescription>This permanently removes the account. This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={onDeleteAccount}>Delete account</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SettingsSection>
    </div>
  );
}
