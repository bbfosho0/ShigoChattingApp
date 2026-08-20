import { FormEvent, useEffect, useState } from "react";
import { Mail, UserRound } from "lucide-react";

import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";

export type AuthMode = "login" | "register" | "forgot";

export interface AuthValues {
  username?: string;
  email: string;
  password?: string;
}

export interface ShigoAuthFormProps {
  mode?: AuthMode;
  loading?: boolean;
  error?: string;
  initialEmail?: string;
  initialUsername?: string;
  showForgotPassword?: boolean;
  onSubmit?: (values: AuthValues) => void;
  onModeChange?: (mode: AuthMode) => void;
}

const copy: Record<AuthMode, { title: string; description: string; submit: string }> = {
  login: { title: "Welcome back.", description: "Return to Quiet Room.", submit: "Sign in" },
  register: { title: "Create your space.", description: "Join ShigoChat without adding more noise.", submit: "Create account" },
  forgot: { title: "Reset your password.", description: "Recovery UI preview. Production recovery requires a verified reset flow.", submit: "Continue" },
};

const authTextActionClass =
  "rounded-sm font-medium text-primary outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function ShigoAuthForm({
  mode = "login",
  loading = false,
  error,
  initialEmail = "",
  initialUsername = "",
  showForgotPassword = true,
  onSubmit,
  onModeChange,
}: ShigoAuthFormProps) {
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");

  useEffect(() => setEmail(initialEmail), [initialEmail]);
  useEffect(() => setUsername(initialUsername), [initialUsername]);
  useEffect(() => setPassword(""), [mode]);

  const current = copy[mode];
  const passwordValid = mode === "forgot" || (mode === "register" ? password.length >= 8 : password.length > 0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    if (!trimmedEmail || (mode === "register" && !trimmedUsername) || !passwordValid) return;

    onSubmit?.({
      email: trimmedEmail,
      username: mode === "register" ? trimmedUsername : undefined,
      password: mode === "forgot" ? undefined : password,
    });
  };

  const disabled = loading || !email.trim() || (mode === "register" && !username.trim()) || !passwordValid;

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div>
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-md bg-foreground text-xs font-bold text-background ring-1 ring-inset ring-primary/20">
            S
            <span aria-hidden="true" className="absolute inset-x-1 bottom-0 h-px bg-primary/70" />
          </div>
          <div><p className="text-sm font-semibold tracking-[-0.01em]">ShigoChat</p><p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Shigo Midnight</p></div>
        </div>
        <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-[2.15rem]">{current.title}</h1>
        <p className="mt-2.5 text-sm leading-6 text-muted-foreground">{current.description}</p>
      </div>

      {error ? <div role="alert" className="border-l-2 border-destructive/70 bg-destructive/[0.045] px-3 py-2.5 text-sm text-destructive">{error}</div> : null}

      <div className="space-y-4.5">
        {mode === "register" ? (
          <div className="space-y-2"><Label htmlFor={`auth-${mode}-username`}>Display name</Label><Input id={`auth-${mode}-username`} value={username} onChange={(event) => setUsername(event.target.value)} leftIcon={<UserRound />} autoComplete="username" disabled={loading} required /></div>
        ) : null}
        <div className="space-y-2"><Label htmlFor={`auth-${mode}-email`}>Email</Label><Input id={`auth-${mode}-email`} value={email} onChange={(event) => setEmail(event.target.value)} type="email" leftIcon={<Mail />} autoComplete="email" disabled={loading} required /></div>
        {mode !== "forgot" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between"><Label htmlFor={`auth-${mode}-password`}>Password</Label>{mode === "login" && showForgotPassword ? <button type="button" onClick={() => onModeChange?.("forgot")} className={`${authTextActionClass} text-xs`}>Forgot password?</button> : null}</div>
            <Input id={`auth-${mode}-password`} value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={mode === "register" ? 8 : undefined} autoComplete={mode === "login" ? "current-password" : "new-password"} disabled={loading} required />
            {mode === "register" ? <p className="text-[11px] leading-5 text-muted-foreground">Use at least 8 characters. The production API remains responsible for final validation.</p> : null}
          </div>
        ) : null}
      </div>

      <Button type="submit" className="w-full shadow-[0_0_18px_hsl(var(--primary)/0.08)]" loading={loading} disabled={disabled}>{current.submit}</Button>

      <div className="text-center text-sm text-muted-foreground">
        {mode === "login" ? <>New here? <button type="button" onClick={() => onModeChange?.("register")} className={authTextActionClass}>Create an account</button></> : null}
        {mode === "register" ? <>Already have an account? <button type="button" onClick={() => onModeChange?.("login")} className={authTextActionClass}>Sign in</button></> : null}
        {mode === "forgot" ? <button type="button" onClick={() => onModeChange?.("login")} className={authTextActionClass}>Back to sign in</button> : null}
      </div>
    </form>
  );
}
