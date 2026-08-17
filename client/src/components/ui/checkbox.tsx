"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "lib/utils";

const checkboxVariants = cva(
  "peer shrink-0 rounded-sm border border-border bg-background text-primary-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
  {
    variants: {
      size: {
        sm: "size-3",
        default: "size-4",
        lg: "size-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  description?: string;
  error?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size, label, description, error, id, checked, ...props }, ref) => {
  const generatedId = React.useId();
  const checkboxId = id || generatedId;
  const iconSize = size === "sm" ? 10 : size === "lg" ? 14 : 12;
  const describedBy = [
    description ? `${checkboxId}-description` : null,
    error ? `${checkboxId}-error` : null,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        <CheckboxPrimitive.Root
          ref={ref}
          id={checkboxId}
          checked={checked}
          className={cn(checkboxVariants({ size }), className)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          {...props}
        >
          <CheckboxPrimitive.Indicator asChild>
            <span className="flex items-center justify-center text-current">
              <AnimatePresence mode="wait" initial={false}>
                {checked === "indeterminate" ? (
                  <motion.svg
                    key="indeterminate"
                    width={iconSize}
                    height={iconSize}
                    viewBox="0 0 14 14"
                    fill="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.path
                      d="M3 7h8"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="check"
                    width={iconSize}
                    height={iconSize}
                    viewBox="0 0 14 14"
                    fill="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.path
                      d="M2.5 7l3 3 6-6"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </span>
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {label || description ? (
          <div className="grid gap-1.5 leading-none">
            {label ? (
              <label
                htmlFor={checkboxId}
                className="cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </label>
            ) : null}
            {description ? (
              <p
                id={`${checkboxId}-description`}
                className="text-xs text-muted-foreground"
              >
                {description}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {error ? (
        <p id={`${checkboxId}-error`} className="ml-6 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants, type CheckboxProps };
