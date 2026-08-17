"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface MenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  showChevron?: boolean;
}

export function Menu({
  trigger,
  children,
  align = "left",
  showChevron = true,
}: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex cursor-pointer items-center bg-transparent p-0 text-inherit"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
        {showChevron ? (
          <ChevronDown
            className="ml-2 size-4 text-muted-foreground transition-transform duration-200"
            data-open={isOpen || undefined}
            aria-hidden="true"
          />
        ) : null}
      </button>

      {isOpen ? (
        <div
          className={`absolute z-50 mt-2 w-56 rounded-md bg-popover text-popover-foreground shadow-lg ring-1 ring-border focus:outline-none ${
            align === "right" ? "right-0" : "left-0"
          }`}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">{children}</div>
        </div>
      ) : null}
    </div>
  );
}

interface MenuItemProps {
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  isActive?: boolean;
  label?: string;
}

export function MenuItem({
  children,
  onClick,
  disabled = false,
  icon,
  isActive = false,
  label,
}: MenuItemProps) {
  return (
    <button
      type="button"
      className={`group relative block h-16 w-full text-center transition-colors ${
        disabled
          ? "cursor-not-allowed text-muted-foreground/50"
          : "text-muted-foreground hover:text-foreground"
      } ${isActive ? "bg-accent" : ""}`}
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="flex h-full items-center justify-center">
        {icon ? (
          <span className="size-6 transition-all duration-200 group-hover:[&_svg]:stroke-[2.5]">
            {icon}
          </span>
        ) : null}
        {children}
      </span>
    </button>
  );
}

export function MenuContainer({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const childrenArray = React.Children.toArray(children);

  if (childrenArray.length === 0) {
    return null;
  }

  return (
    <div className="relative w-16" data-expanded={isExpanded}>
      <div className="relative">
        <div className="relative z-50 size-16 rounded-full bg-muted will-change-transform">
          <div
            onClick={() => setIsExpanded((expanded) => !expanded)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIsExpanded((expanded) => !expanded);
              }
            }}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Close navigation menu" : "Open navigation menu"}
            className="size-full cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {childrenArray[0]}
          </div>
        </div>

        {childrenArray.slice(1).map((child, index) => {
          const isLastItem = index === childrenArray.length - 2;

          return (
            <div
              key={index}
              className="absolute left-0 top-0 size-16 bg-muted will-change-transform"
              style={{
                transform: `translateY(${isExpanded ? (index + 1) * 48 : 0}px)`,
                opacity: isExpanded ? 1 : 0,
                pointerEvents: isExpanded ? "auto" : "none",
                zIndex: 40 - index,
                clipPath: isLastItem
                  ? "circle(50% at 50% 50%)"
                  : "circle(50% at 50% 55%)",
                transition:
                  "transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms",
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "antialiased",
              }}
              aria-hidden={!isExpanded}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}
