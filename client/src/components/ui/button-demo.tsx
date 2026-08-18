"use client";

import { Button } from "components/ui/button";

export function ButtonDemo() {
  return (
    <div className="rounded-2xl border border-border bg-background p-8 text-foreground shadow-sm">
      <Button>Click me</Button>
    </div>
  );
}

export default ButtonDemo;
