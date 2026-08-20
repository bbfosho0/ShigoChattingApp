"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import { cn } from "lib/utils";

const buttonVariants = cva(
  [
    "group relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md font-medium outline-none",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-fast ease-shigo",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        secondary:
          "bg-accent text-foreground hover:bg-accent/80 active:bg-accent",
        tertiary:
          "border border-border bg-transparent text-foreground hover:bg-muted active:bg-muted/60",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted active:bg-muted/60",
        ghost:
          "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/60",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-1.5 px-4 text-[13px]",
        sm: "h-8 gap-1 px-3 text-xs",
        md: "h-9 gap-1.5 px-4 text-[13px]",
        lg: "h-10 gap-1.5 px-5 text-sm",
        "icon-sm": "size-8 rounded-full p-0 [&_svg]:size-3.5",
        icon: "size-9 rounded-full p-0 [&_svg]:size-4",
        "icon-lg": "size-10 rounded-full p-0 [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  /** Backward-compatible arbitrary leading content. Prefer leadingIcon for Lucide icons. */
  leftIcon?: React.ReactNode;
  /** Backward-compatible arbitrary trailing content. Prefer trailingIcon for Lucide icons. */
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leadingIcon: LeadingIcon,
      trailingIcon: TrailingIcon,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isIconOnly =
      size === "icon" || size === "icon-sm" || size === "icon-lg";
    const iconSize = size === "sm" ? 14 : size === "lg" ? 20 : 16;
    const classes = cn(buttonVariants({ variant, size }), className);

    if (asChild) {
      return (
        <Slot
          className={classes}
          ref={ref}
          aria-busy={loading || undefined}
          aria-disabled={disabled || loading || undefined}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const leadingContent = LeadingIcon ? (
      <LeadingIcon
        aria-hidden="true"
        size={iconSize}
        strokeWidth={1.5}
        className="transition-[stroke-width] duration-75 group-hover:[stroke-width:2]"
      />
    ) : (
      leftIcon
    );

    const trailingContent = TrailingIcon ? (
      <TrailingIcon
        aria-hidden="true"
        size={iconSize}
        strokeWidth={1.5}
        className="transition-[stroke-width] duration-75 group-hover:[stroke-width:2]"
      />
    ) : (
      rightIcon
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <>
            <span
              aria-hidden="true"
              className="flex items-center justify-center gap-[inherit] opacity-0"
            >
              {!isIconOnly ? leadingContent : null}
              {children}
              {!isIconOnly ? trailingContent : null}
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              <svg
                aria-hidden="true"
                className="size-8"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M 12 12 C 14 8.5 19 8.5 19 12 C 19 15.5 14 15.5 12 12 C 10 8.5 5 8.5 5 12 C 5 15.5 10 15.5 12 12 Z"
                  stroke="currentColor"
                  strokeWidth="1.125"
                  strokeLinecap="round"
                  pathLength="100"
                  className="animate-button-infinity"
                />
              </svg>
            </span>
          </>
        ) : isIconOnly ? (
          <span className="[&_svg]:transition-[stroke-width] [&_svg]:duration-75 group-hover:[&_svg]:[stroke-width:2]">
            {children}
          </span>
        ) : (
          <>
            {leadingContent}
            <span>{children}</span>
            {trailingContent}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
