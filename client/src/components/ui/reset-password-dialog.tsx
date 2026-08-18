import { FormEvent, useEffect, useState } from "react";

import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";

export interface ResetPasswordValues {
  email: string;
  password: string;
}

export interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmail?: string;
  loading?: boolean;
  onSubmit?: (values: ResetPasswordValues) => void;
}

export function ResetPasswordDialog({ open, onOpenChange, initialEmail = "", loading = false, onSubmit }: ResetPasswordDialogProps) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setEmail(initialEmail);
    setPassword("");
    setConfirmPassword("");
    setError("");
  }, [initialEmail, open]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    onSubmit?.({ email: trimmedEmail, password });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>Reset your password</DialogTitle>
            <DialogDescription>Choose a new password for this ShigoChat account.</DialogDescription>
          </DialogHeader>
          <div className="mt-5 space-y-4">
            {error ? <div role="alert" className="rounded-md border border-destructive/25 bg-destructive/[0.06] px-3 py-2 text-sm text-destructive">{error}</div> : null}
            <div className="space-y-2"><Label htmlFor="reset-email">Email</Label><Input id="reset-email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required disabled={loading} /></div>
            <div className="space-y-2"><Label htmlFor="reset-password">New password</Label><Input id="reset-password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={6} autoComplete="new-password" required disabled={loading} /></div>
            <div className="space-y-2"><Label htmlFor="reset-confirm">Confirm password</Label><Input id="reset-confirm" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" minLength={6} autoComplete="new-password" required disabled={loading} /></div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="tertiary" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" loading={loading}>Reset password</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
