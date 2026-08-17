"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "lib/utils";

const labelVariants = cva(
  "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-foreground",
        destructive: "text-destructive",
        muted: "text-muted-foreground",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
  optional?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, variant, size, required, optional, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(labelVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {required ? (
        <span className="ml-1 text-destructive" aria-label="required">
          *
        </span>
      ) : null}
      {optional && !required ? (
        <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
      ) : null}
    </label>
  )
);

Label.displayName = "Label";

export { Label, labelVariants };
