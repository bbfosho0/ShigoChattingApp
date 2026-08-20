import { FormEvent, useEffect, useState } from "react";
import { CheckCircle2, KeyRound, Link2Off, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { shigoEnter, shigoSpringSoft } from "lib/shigo-motion";

export type ResetPasswordStatus = "form" | "invalid" | "success";

export interface ShigoResetPasswordProps {
  status?: ResetPasswordStatus;
  loading?: boolean;
  error?: string;
  onSubmit?: (newPassword: string) => void;
  onBackToLogin?: () => void;
}

const actionClass =
  "rounded-sm font-medium text-primary outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function ShigoResetPassword({
  status = "form",
  loading = false,
  error,
  onSubmit,
  onBackToLogin,
}: ShigoResetPasswordProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (status !== "form") {
      setPassword("");
      setConfirmPassword("");
      setLocalError("");
    }
  }, [status]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }
    setLocalError("");
    onSubmit?.(password);
  };

  if (status === "invalid") {
    return (
      <motion.div className="space-y-7" initial="hidden" animate="visible" variants={shigoEnter} transition={shigoSpringSoft}>
        <div className="flex size-11 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/[0.05] text-destructive">
          <Link2Off className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Recovery link</p>
          <h1 className="mt-3 text-[2rem] font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-[2.15rem]">Link unavailable.</h1>
          <p className="mt-2.5 text-sm leading-6 text-muted-foreground">This recovery link is invalid or has expired.</p>
        </div>
        <Button type="button" className="w-full" onClick={onBackToLogin}>Return to sign in</Button>
      </motion.div>
    );
  }

  if (status === "success") {
    return (
      <motion.div className="space-y-7" initial="hidden" animate="visible" variants={shigoEnter} transition={shigoSpringSoft}>
        <div className="flex size-11 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-500">
          <CheckCircle2 className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Recovery complete</p>
          <h1 className="mt-3 text-[2rem] font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-[2.15rem]">You are secure again.</h1>
          <p className="mt-2.5 text-sm leading-6 text-muted-foreground">Password reset. Sign in with your new password.</p>
        </div>
        <div className="border-l-2 border-primary/45 bg-primary/[0.035] px-3 py-2.5 text-xs leading-5 text-muted-foreground">
          Existing sessions have been revoked. Sign in again on devices you still trust.
        </div>
        <Button type="button" className="w-full" onClick={onBackToLogin}>Sign in</Button>
      </motion.div>
    );
  }

  const displayedError = localError || error;
  const canSubmit = password.length >= 8 && confirmPassword.length >= 8 && !loading;

  return (
    <motion.form onSubmit={submit} className="space-y-7" initial="hidden" animate="visible" variants={shigoEnter} transition={shigoSpringSoft}>
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-md bg-foreground text-xs font-bold text-background ring-1 ring-inset ring-primary/20">
          S
          <span aria-hidden="true" className="absolute inset-x-1 bottom-0 h-px bg-primary/70" />
        </div>
        <div><p className="text-sm font-semibold tracking-[-0.01em]">ShigoChat</p><p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Shigo Midnight</p></div>
      </div>

      <div>
        <div className="mb-5 flex size-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/[0.045] text-primary">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </div>
        <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-[2.15rem]">Set a new password.</h1>
        <p className="mt-2.5 text-sm leading-6 text-muted-foreground">Choose at least 8 characters. Using this link will revoke older signed-in sessions.</p>
      </div>

      {displayedError ? (
        <div role="alert" className="border-l-2 border-destructive/70 bg-destructive/[0.045] px-3 py-2.5 text-sm text-destructive">{displayedError}</div>
      ) : null}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-new-password">New password</Label>
          <Input id="reset-new-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} autoComplete="new-password" leftIcon={<KeyRound />} disabled={loading} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reset-confirm-password">Confirm password</Label>
          <Input id="reset-confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} autoComplete="new-password" leftIcon={<KeyRound />} disabled={loading} required />
        </div>
        <p className="text-[11px] leading-5 text-muted-foreground">The recovery link is single-use and expires after 30 minutes.</p>
      </div>

      <Button type="submit" className="w-full shadow-[0_0_18px_hsl(var(--primary)/0.08)]" loading={loading} disabled={!canSubmit}>Reset password</Button>

      <div className="text-center text-sm text-muted-foreground">
        <button type="button" className={actionClass} onClick={onBackToLogin}>Back to sign in</button>
      </div>
    </motion.form>
  );
}
