import { render, screen } from "@testing-library/react";

jest.mock("@radix-ui/react-dialog", () => {
  const React = require("react");
  const part = (tag = "div") =>
    React.forwardRef(({ children, ...props }, ref) =>
      React.createElement(tag, { ref, ...props }, children)
    );

  const Root = ({ children }) => <>{children}</>;
  const Trigger = part("button");
  const Close = part("button");
  const Portal = ({ children }) => <>{children}</>;
  const Overlay = part("div");
  const Content = part("div");
  const Title = part("h2");
  const Description = part("p");

  Overlay.displayName = "Overlay";
  Content.displayName = "Content";
  Title.displayName = "Title";
  Description.displayName = "Description";

  return { Root, Trigger, Close, Portal, Overlay, Content, Title, Description };
});

import { SheetContent } from "components/ui/sheet";

describe("Sheet interaction targets", () => {
  it("keeps the close icon restrained inside a comfortable semantic target", () => {
    render(<SheetContent>Preferences</SheetContent>);

    const close = screen.getByRole("button", { name: "Close" });
    expect(close.className).toContain("size-10");
    expect(close.className).toContain("focus-visible:ring-2");
    expect(close.querySelector("svg")?.getAttribute("width")).toBe("16");
  });
});
