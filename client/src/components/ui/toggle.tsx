import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "lib/utils";

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-[13px] font-medium outline-none transition-[background-color,color,box-shadow] duration-base ease-shigo hover:bg-accent hover:text-accent-foreground focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary/12 data-[state=on]:text-primary",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-border bg-card shadow-panel",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 px-2.5 text-xs",
        lg: "h-10 px-4 text-sm",
        icon: "size-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleProps
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
));
Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
