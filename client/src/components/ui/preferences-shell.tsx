import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import {
  AccountSettingsPanel,
  AmbientSettingsPanel,
  AppearanceSettingsPanel,
  SecuritySettingsPanel,
} from "components/ui/settings-panels";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { shigoPanel, shigoSpringSoft } from "lib/shigo-motion";

export type PreferencesSection = "account" | "appearance" | "ambient" | "security";

export interface PreferencesShellProps {
  children?: React.ReactNode;
  defaultSection?: PreferencesSection;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  name?: string;
  email?: string;
  theme?: "light" | "dark";
  playing?: boolean;
  progress?: number;
  volume?: number;
  securityLoading?: boolean;
  onAccountSave?: (name: string, email: string) => void;
  onThemeChange?: (theme: "light" | "dark") => void;
  onTogglePlay?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSeek?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  onUpdatePassword?: (currentPassword: string, newPassword: string) => void;
  onDeleteAccount?: () => void;
}

export function PreferencesContent({
  defaultSection = "account",
  name,
  email,
  theme,
  playing,
  progress,
  volume,
  securityLoading,
  onAccountSave,
  onThemeChange,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onUpdatePassword,
  onDeleteAccount,
}: Omit<PreferencesShellProps, "children" | "open" | "onOpenChange">) {
  const [section, setSection] = useState<PreferencesSection>(defaultSection);
  const triggerClassName = "relative w-full overflow-hidden border-b border-transparent px-2 pb-2.5 pt-2 text-muted-foreground data-[state=active]:border-primary/55 data-[state=active]:bg-primary/[0.035] data-[state=active]:text-foreground data-[state=active]:shadow-none";

  const panel = section === "account"
    ? <AccountSettingsPanel name={name} email={email} onSave={onAccountSave} />
    : section === "appearance"
      ? <AppearanceSettingsPanel theme={theme} onThemeChange={onThemeChange} />
      : section === "ambient"
        ? <AmbientSettingsPanel playing={playing} progress={progress} volume={volume} onTogglePlay={onTogglePlay} onPrevious={onPrevious} onNext={onNext} onSeek={onSeek} onVolumeChange={onVolumeChange} />
        : <SecuritySettingsPanel minPasswordLength={8} loading={securityLoading} onUpdatePassword={onUpdatePassword} onDeleteAccount={onDeleteAccount} />;

  return (
    <Tabs value={section} onValueChange={(value) => setSection(value as PreferencesSection)} className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="min-w-0 px-4 pt-4 sm:px-6 sm:pt-5">
        <TabsList className="grid min-h-0 w-full grid-cols-2 gap-1 border-0 bg-transparent p-0 sm:grid-cols-4">
          <TabsTrigger className={triggerClassName} value="account">Account</TabsTrigger>
          <TabsTrigger className={triggerClassName} value="appearance">Appearance</TabsTrigger>
          <TabsTrigger className={triggerClassName} value="ambient">Ambient</TabsTrigger>
          <TabsTrigger className={triggerClassName} value="security">Security</TabsTrigger>
        </TabsList>
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 pb-5 sm:px-6 sm:pb-6">
        <TabsContent value={section} forceMount className="mt-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              data-shigo-preferences-panel
              key={section}
              variants={shigoPanel}
              initial="enter"
              animate="center"
              exit="exit"
              transition={shigoSpringSoft}
            >
              {panel}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </div>
    </Tabs>
  );
}

export function PreferencesShell({ children, open, onOpenChange, ...props }: PreferencesShellProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children ? <SheetTrigger asChild>{children}</SheetTrigger> : null}
      <SheetContent className="gap-0 overflow-hidden bg-card sm:max-w-xl">
        <SheetHeader className="pb-3 pr-10 sm:pb-4">
          <SheetTitle className="tracking-[-0.02em]">Preferences</SheetTitle>
          <SheetDescription>Account, appearance, ambient audio, and security.</SheetDescription>
        </SheetHeader>
        <SheetBody className="flex min-w-0 overflow-hidden p-0">
          <PreferencesContent {...props} />
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
