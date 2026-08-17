"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, X } from "lucide-react";

import { cn } from "lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        destructive: "border-destructive focus-visible:ring-destructive",
        ghost: "border-transparent bg-accent focus-visible:border-input focus-visible:bg-background",
      },
      size: {
        default: "h-10",
        sm: "h-9 text-xs",
        lg: "h-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      type = "text",
      leftIcon,
      rightIcon,
      error = false,
      clearable = false,
      onClear,
      value,
      defaultValue,
      onChange,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(forwardedRef, () => internalRef.current as HTMLInputElement);

    const [showPassword, setShowPassword] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
      defaultValue == null ? "" : String(defaultValue)
    );

    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value ?? "") : internalValue;
    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;
    const showClearButton = clearable && currentValue.length > 0;
    const resolvedVariant = error ? "destructive" : variant;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(event.target.value);
      }
      onChange?.(event);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }
      if (internalRef.current) {
        internalRef.current.value = "";
        internalRef.current.focus();
      }
      onClear?.();
    };

    return (
      <div className="relative w-full">
        {leftIcon ? (
          <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
            {leftIcon}
          </div>
        ) : null}

        <input
          ref={internalRef}
          type={actualType}
          className={cn(
            inputVariants({ variant: resolvedVariant, size }),
            leftIcon ? "pl-10" : undefined,
            rightIcon || isPassword || showClearButton ? "pr-10" : undefined,
            className
          )}
          value={value}
          defaultValue={isControlled ? undefined : defaultValue}
          onChange={handleChange}
          aria-invalid={error || undefined}
          {...props}
        />

        {rightIcon || isPassword || showClearButton ? (
          <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1">
            {rightIcon ? (
              <span className="text-muted-foreground [&_svg]:size-4">{rightIcon}</span>
            ) : null}

            {showClearButton ? (
              <button
                type="button"
                aria-label="Clear input"
                className="text-muted-foreground transition-colors hover:text-foreground"
                onClick={handleClear}
              >
                <X className="size-4" />
              </button>
            ) : null}

            {isPassword ? (
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };
