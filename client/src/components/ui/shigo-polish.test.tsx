import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";

jest.mock("components/ui/popover", () => ({
  Popover: ({ children }: { children: ReactNode }) => <>{children}</>,
  PopoverTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  PopoverContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock("components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  Tooltip: ({ children }: { children: ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  TooltipContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock("components/ui/profile-menu", () => ({
  ProfileMenu: () => <div data-testid="profile-menu" />,
}));

jest.mock("components/ui/presence-avatar", () => ({
  PresenceAvatar: ({ fallback }: { fallback: string }) => <div aria-label="Avatar">{fallback}</div>,
}));

import { AppSidebar } from "components/ui/app-sidebar";
import { FileAttachment } from "components/ui/file-attachment";
import { Input } from "components/ui/input";
import { ShigoAuthForm } from "components/ui/shigo-auth-form";
import { ShigoComposer } from "components/ui/shigo-composer";
import { ShigoMessage } from "components/ui/shigo-message";

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

  it("keeps semantic surface ownership and validated sidebar geometry", () => {
    const { rerender, unmount } = render(<AppSidebar />);
    const expanded = document.querySelector("aside");
    expect(expanded?.className).toContain("bg-shigo-shell");
    expect(expanded?.className).toContain("w-56");

    rerender(<AppSidebar collapsed />);
    const collapsed = document.querySelector("aside");
    expect(collapsed?.className).toContain("w-[4.5rem]");
    unmount();

    const { unmount: unmountComposer } = render(<ShigoComposer allowAttachments={false} />);
    const textarea = screen.getByRole("textbox", { name: "Message Quiet Room" });
    expect(textarea.parentElement?.parentElement?.className).toContain("bg-shigo-raised");
    unmountComposer();

    const own = {
      id: "self",
      senderId: "yoshi",
      senderName: "Yoshi",
      content: "Own semantic surface",
      createdAt: "2026-08-18T20:43:00",
    };
    const { unmount: unmountOwn } = render(<ShigoMessage message={own} currentUserId="yoshi" />);
    expect(screen.getByText("Own semantic surface").parentElement?.className).toContain("bg-shigo-own-message");
    unmountOwn();

    render(<ShigoMessage message={{ ...own, id: "other", senderId: "alice", senderName: "Alice", content: "Other semantic surface" }} currentUserId="yoshi" />);
    expect(screen.getByText("Other semantic surface").parentElement?.className).toContain("bg-shigo-other-message");
  });
});
