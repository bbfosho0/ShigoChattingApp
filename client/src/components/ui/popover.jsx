"use client";;
import * as React from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Cross2Icon } from "@radix-ui/react-icons";

const TRANSITION = {
  type: "spring",
  bounce: 0.05,
  duration: 0.3,
};

const PopoverContext = React.createContext(undefined);

function usePopover() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopover must be used within a PopoverProvider");
  }
  return context;
}

function usePopoverLogic() {
  const uniqueId = React.useId();
  const [isOpen, setIsOpen] = React.useState(false);
  const [note, setNote] = React.useState("");

  const openPopover = () => setIsOpen(true);
  const closePopover = () => {
    setIsOpen(false);
    setNote("");
  };

  return { isOpen, openPopover, closePopover, uniqueId, note, setNote };
}

const PopoverRoot = React.forwardRef(({ children, className }, ref) => {
  const popoverLogic = usePopoverLogic();

  return (
    <PopoverContext.Provider value={popoverLogic}>
      <MotionConfig transition={TRANSITION}>
        <div
          ref={ref}
          className={cn("relative flex items-center justify-center isolate", className)}>
          {children}
        </div>
      </MotionConfig>
    </PopoverContext.Provider>
  );
});
PopoverRoot.displayName = "PopoverRoot";

const PopoverTrigger = React.forwardRef(({ children, className, variant = "outline" }, ref) => {
  const { openPopover, uniqueId } = usePopover();

  return (
    <motion.div key="button" layoutId={`popover-${uniqueId}`}>
      <Button ref={ref} variant={variant} className={className} onClick={openPopover}>
        <motion.span layoutId={`popover-label-${uniqueId}`} className="text-sm">
          {children}
        </motion.span>
      </Button>
    </motion.div>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef(({ children, className }, ref) => {
  const { isOpen, closePopover, uniqueId } = usePopover();
  const contentRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target)
      ) {
        closePopover();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [closePopover]);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closePopover();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closePopover]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          layoutId={`popover-${uniqueId}`}
          className={cn(
            "absolute z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md outline-none",
            className
          )}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
});
PopoverContent.displayName = "PopoverContent";

const PopoverForm = React.forwardRef(({ children, onSubmit, className }, ref) => {
  const { note, closePopover } = usePopover();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(note);
    closePopover();
  };

  return (
    <form
      ref={ref}
      className={cn("flex h-full flex-col", className)}
      onSubmit={handleSubmit}>
      {children}
    </form>
  );
});
PopoverForm.displayName = "PopoverForm";

const PopoverLabel = React.forwardRef(({ children, className }, ref) => {
  const { uniqueId, note } = usePopover();

  return (
    <motion.span
      ref={ref}
      layoutId={`popover-label-${uniqueId}`}
      aria-hidden="true"
      style={{
        opacity: note ? 0 : 1,
      }}
      className={cn(
        "absolute left-4 top-3 select-none text-sm text-muted-foreground",
        className
      )}>
      {children}
    </motion.span>
  );
});
PopoverLabel.displayName = "PopoverLabel";

const PopoverTextarea = React.forwardRef(({ className, id }, ref) => {
  const { note, setNote } = usePopover();

  return (
    <textarea
      ref={ref}
      id={id}
      className={cn(
        "h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      autoFocus
      value={note}
      onChange={(e) => setNote(e.target.value)} />
  );
});
PopoverTextarea.displayName = "PopoverTextarea";

const PopoverFooter = React.forwardRef(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      key="close"
      className={cn(
        "flex items-center justify-between border-t bg-muted/50 px-4 py-3",
        className
      )}>
      {children}
    </div>
  );
});
PopoverFooter.displayName = "PopoverFooter";

const PopoverCloseButton = React.forwardRef(({ className }, ref) => {
  const { closePopover } = usePopover();

  return (
    <Button
      ref={ref}
      type="button"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={closePopover}
      aria-label="Close popover">
      <Cross2Icon className="h-4 w-4" />
    </Button>
  );
});
PopoverCloseButton.displayName = "PopoverCloseButton";

const PopoverSubmitButton = React.forwardRef(({ children = "Submit", className, variant = "default" }, ref) => {
  return (
    <Button
      ref={ref}
      type="submit"
      variant={variant}
      size="sm"
      className={className}
      aria-label="Submit note">
      {children}
    </Button>
  );
});
PopoverSubmitButton.displayName = "PopoverSubmitButton";

const PopoverHeader = React.forwardRef(({ children, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("border-b px-4 py-2.5 font-medium text-foreground/90", className)}>
      {children}
    </div>
  );
});
PopoverHeader.displayName = "PopoverHeader";

const PopoverBody = React.forwardRef(({ children, className }, ref) => {
  return (
    <div ref={ref} className={cn("p-4", className)}>
      {children}
    </div>
  );
});
PopoverBody.displayName = "PopoverBody";

const PopoverButton = React.forwardRef(({ children, onClick, className }, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      className={cn("w-full justify-start gap-2 px-4 py-2 font-normal", className)}
      onClick={onClick}>
      {children}
    </Button>
  );
});
PopoverButton.displayName = "PopoverButton";

export {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverForm,
  PopoverLabel,
  PopoverTextarea,
  PopoverFooter,
  PopoverCloseButton,
  PopoverSubmitButton,
  PopoverHeader,
  PopoverBody,
  PopoverButton,
};
