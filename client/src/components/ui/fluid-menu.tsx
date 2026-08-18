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
  className?: string;
  ariaExpanded?: boolean;
}

export function MenuItem({
  children,
  onClick,
  disabled = false,
  icon,
  isActive = false,
  label,
  className = "",
  ariaExpanded,
}: MenuItemProps) {
  return (
    <button
      type="button"
      className={`group relative block h-16 w-full text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring ${
        disabled
          ? "cursor-not-allowed text-muted-foreground/50"
          : "text-muted-foreground hover:text-foreground"
      } ${isActive ? "bg-accent" : ""} ${className}`}
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      aria-expanded={ariaExpanded}
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

  const firstChild = childrenArray[0];
  const expandedHeight = 64 + Math.max(childrenArray.length - 1, 0) * 68;
  const toggleMenu = () => setIsExpanded((expanded) => !expanded);

  const trigger = React.isValidElement<MenuItemProps>(firstChild) ? (
    React.cloneElement(firstChild, {
      onClick: () => {
        if (firstChild.props.disabled) return;
        firstChild.props.onClick?.();
        toggleMenu();
      },
      ariaExpanded: isExpanded,
    })
  ) : (
    <button
      type="button"
      onClick={toggleMenu}
      aria-expanded={isExpanded}
      aria-label={isExpanded ? "Close navigation menu" : "Open navigation menu"}
      className="flex size-16 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
    >
      {firstChild}
    </button>
  );

  return (
    <div
      className="relative w-16 transition-[height] duration-300 ease-out"
      data-expanded={isExpanded}
      style={{ height: isExpanded ? expandedHeight : 64 }}
    >
      <div className="relative">
        <div className="relative z-50 size-16 overflow-hidden rounded-full bg-muted will-change-transform">
          {trigger}
        </div>

        {childrenArray.slice(1).map((child, index) => (
          <div
            key={index}
            className="absolute left-0 top-0 size-16 overflow-hidden rounded-full bg-muted will-change-transform"
            style={{
              transform: `translateY(${isExpanded ? (index + 1) * 68 : 0}px)`,
              opacity: isExpanded ? 1 : 0,
              pointerEvents: isExpanded ? "auto" : "none",
              zIndex: 40 - index,
              transition:
                "transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 260ms ease",
              backfaceVisibility: "hidden",
              WebkitFontSmoothing: "antialiased",
            }}
            aria-hidden={!isExpanded}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
