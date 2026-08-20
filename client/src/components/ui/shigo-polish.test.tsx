import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";

jest.mock("components/ui/popover", () => ({
  Popover: ({ children }: { children: ReactNode }) => <>{children}</>,
  PopoverTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  PopoverContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

import { FileAttachment } from "components/ui/file-attachment";
import { Input } from "components/ui/input";
import { ShigoAuthForm } from "components/ui/shigo-auth-form";
import { ShigoComposer } from "components/ui/shigo-composer";

describe("Shigo Midnight final polish", () => {
  it("gives password visibility a comfortable semantic focus target", () => {
    render(<Input type="password" aria-label="Password" />);

    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle.className).toContain("size-10");
    expect(toggle.className).toContain("focus-visible:ring-2");
    expect(toggle.className).toContain("focus-visible:ring-ring");
  });

  it("moves composer focus treatment to the composer surface and suppresses the native blue textarea ring", () => {
    render(<ShigoComposer allowAttachments={false} />);

    const textarea = screen.getByRole("textbox", { name: "Message Quiet Room" });
    const composer = textarea.parentElement?.parentElement;

    expect(composer?.className).toContain("focus-within:ring-1");
    expect(composer?.className).toContain("focus-within:ring-ring");
    expect(textarea.className).toContain("focus:ring-0");
    expect(textarea.className).toContain("focus-visible:ring-0");
  });

  it("uses the semantic focus language for auth text actions", () => {
    render(<ShigoAuthForm mode="login" onModeChange={jest.fn()} />);

    const createAccount = screen.getByRole("button", { name: "Create an account" });
    expect(createAccount.className).toContain("focus-visible:ring-2");
    expect(createAccount.className).toContain("focus-visible:ring-ring");
  });

  it("keeps attachment removal visually small but gives it a larger hit area", () => {
    render(
      <FileAttachment
        attachment={{ id: "spec", name: "spec.pdf", type: "application/pdf" }}
        onRemove={jest.fn()}
      />
    );

    const remove = screen.getByRole("button", { name: "Remove spec.pdf" });
    expect(remove.className).toContain("size-9");
    expect(remove.className).toContain("focus-visible:ring-2");
    expect(remove.querySelector("svg")?.getAttribute("width")).toBe("14");
  });
});
