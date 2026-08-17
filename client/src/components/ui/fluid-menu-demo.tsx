"use client";

import {
  Home,
  Mail,
  Menu as MenuIcon,
  Settings,
  User,
  X,
} from "lucide-react";

import { MenuContainer, MenuItem } from "components/ui/fluid-menu";

export function MenuDemo() {
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-2xl font-bold text-transparent">
          Fluid Navigation
        </h2>
        <p className="text-sm text-muted-foreground">
          A fluid circular menu with smooth transitions
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-foreground/10 to-transparent blur-3xl" />
        <MenuContainer>
          <MenuItem
            label="Toggle navigation menu"
            icon={
              <div className="relative size-6">
                <div className="absolute inset-0 origin-center rotate-0 scale-100 opacity-100 transition-all duration-300 ease-in-out [div[data-expanded=true]_&]:rotate-180 [div[data-expanded=true]_&]:scale-0 [div[data-expanded=true]_&]:opacity-0">
                  <MenuIcon size={24} strokeWidth={1.5} />
                </div>
                <div className="absolute inset-0 origin-center -rotate-180 scale-0 opacity-0 transition-all duration-300 ease-in-out [div[data-expanded=true]_&]:rotate-0 [div[data-expanded=true]_&]:scale-100 [div[data-expanded=true]_&]:opacity-100">
                  <X size={24} strokeWidth={1.5} />
                </div>
              </div>
            }
          />
          <MenuItem label="Home" icon={<Home size={24} strokeWidth={1.5} />} />
          <MenuItem label="Messages" icon={<Mail size={24} strokeWidth={1.5} />} />
          <MenuItem label="Profile" icon={<User size={24} strokeWidth={1.5} />} />
          <MenuItem label="Settings" icon={<Settings size={24} strokeWidth={1.5} />} />
        </MenuContainer>
      </div>
    </div>
  );
}

export default MenuDemo;
