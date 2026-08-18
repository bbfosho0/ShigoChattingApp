import { useState } from "react";

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
  onThemeChange?: (theme: "light" | "dark") => void;
  onTogglePlay?: () => void;
  onVolumeChange?: (value: number) => void;
}

export function PreferencesContent({
  defaultSection = "account",
  name,
  email,
  theme,
  playing,
  progress,
  volume,
  onThemeChange,
  onTogglePlay,
  onVolumeChange,
}: Omit<PreferencesShellProps, "children" | "open" | "onOpenChange">) {
  const [section, setSection] = useState<PreferencesSection>(defaultSection);

  return (
    <Tabs value={section} onValueChange={(value) => setSection(value as PreferencesSection)} className="flex min-h-0 flex-1 flex-col">
      <div className="overflow-x-auto px-6 pt-5">
        <TabsList className="min-w-max">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="ambient">Ambient</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        <TabsContent value="account"><AccountSettingsPanel name={name} email={email} /></TabsContent>
        <TabsContent value="appearance"><AppearanceSettingsPanel theme={theme} onThemeChange={onThemeChange} /></TabsContent>
        <TabsContent value="ambient"><AmbientSettingsPanel playing={playing} progress={progress} volume={volume} onTogglePlay={onTogglePlay} onVolumeChange={onVolumeChange} /></TabsContent>
        <TabsContent value="security"><SecuritySettingsPanel /></TabsContent>
      </div>
    </Tabs>
  );
}

export function PreferencesShell({ children, open, onOpenChange, ...props }: PreferencesShellProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children ? <SheetTrigger asChild>{children}</SheetTrigger> : null}
      <SheetContent className="gap-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border pb-5">
          <SheetTitle>Preferences</SheetTitle>
          <SheetDescription>Account, appearance, ambient audio, and security in one place.</SheetDescription>
        </SheetHeader>
        <SheetBody className="flex p-0">
          <PreferencesContent {...props} />
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
