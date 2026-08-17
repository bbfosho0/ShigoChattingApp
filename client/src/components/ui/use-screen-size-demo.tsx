"use client";

import { useEffect, useState } from "react";
import { Laptop, Monitor, Smartphone, Tablet } from "lucide-react";

import { Card } from "components/ui/card";
import { type ScreenSize, useScreenSize } from "hooks/use-screen-size";

const breakpoints: Array<{
  size: ScreenSize;
  min: number;
  max?: number;
}> = [
  { size: "xs", min: 0, max: 639 },
  { size: "sm", min: 640, max: 767 },
  { size: "md", min: 768, max: 1023 },
  { size: "lg", min: 1024, max: 1279 },
  { size: "xl", min: 1280, max: 1535 },
  { size: "2xl", min: 1536 },
];

const DeviceIcon = ({ size }: { size: ScreenSize }) => {
  switch (size) {
    case "xs":
    case "sm":
      return <Smartphone className="size-6 text-primary" aria-hidden="true" />;
    case "md":
      return <Tablet className="size-6 text-primary" aria-hidden="true" />;
    case "lg":
      return <Laptop className="size-6 text-primary" aria-hidden="true" />;
    case "xl":
    case "2xl":
      return <Monitor className="size-6 text-primary" aria-hidden="true" />;
  }
};

function ScreenSizeDemo() {
  const screenSize = useScreenSize();
  const [windowWidth, setWindowWidth] = useState(0);
  const currentSize = screenSize.toString();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 p-6 md:grid-cols-2">
      <Card className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Current Screen Size</h3>
            <p className="text-sm text-muted-foreground">
              Resize your browser window to see changes.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 text-5xl font-bold">
              <span>{currentSize}</span>
              <DeviceIcon size={currentSize} />
            </div>
            <div className="text-sm text-muted-foreground">
              Window width: {windowWidth}px
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {breakpoints.map(({ size, min, max }) => (
              <div
                key={size}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-2"
              >
                <span className="font-mono">{size}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {max === undefined ? `${min}px+` : `${min}px - ${max}px`}
                  </span>
                  {screenSize.equals(size) ? (
                    <span
                      aria-label="Current breakpoint"
                      className="size-2 rounded-full bg-primary"
                    />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="mb-2 text-lg font-medium">About useScreenSize</h3>
            <p className="text-sm text-muted-foreground">
              A hook for responsive breakpoint detection with TypeScript support.
            </p>
          </div>

          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
            {`const screenSize = useScreenSize()

screenSize.equals("md")
screenSize.lessThan("lg")
screenSize.greaterThan("sm")
screenSize.lessThanOrEqual("xl")
screenSize.greaterThanOrEqual("md")
screenSize.toString()`}
          </pre>

          <div className="flex flex-col gap-4">
            <div>
              <h4 className="mb-2 text-sm font-medium">Features</h4>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>Type-safe breakpoint comparisons</li>
                <li>Automatic window resize handling</li>
                <li>Tailwind CSS breakpoint alignment</li>
                <li>Comparable size utilities</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium">Current comparisons</h4>
              <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                <li>At least md: {String(screenSize.greaterThanOrEqual("md"))}</li>
                <li>Below xl: {String(screenSize.lessThan("xl"))}</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export { ScreenSizeDemo };
export default ScreenSizeDemo;
