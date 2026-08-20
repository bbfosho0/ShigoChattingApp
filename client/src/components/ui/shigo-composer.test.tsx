import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("components/ui/popover", () => ({
  Popover: ({ children }: { children: ReactNode }) => <>{children}</>,
  PopoverTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  PopoverContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

import { ShigoComposer } from "./shigo-composer";

test("uses the signature raised composer material and quiet keyboard guidance", () => {
  render(<ShigoComposer allowAttachments={false} />);

  const textbox = screen.getByRole("textbox", { name: "Message Quiet Room" });
  const composer = textbox.closest("[data-shigo-composer]");
  expect(composer).toHaveClass("bg-shigo-raised");
  expect(composer).toHaveClass("focus-within:ring-1");
  expect(composer).toHaveClass("shadow-none");

  const guidance = screen.getByText(/enter to send/i);
  expect(guidance.className).toContain("opacity-0");
  expect(guidance.className).toContain("group-focus-within:opacity-100");
});

test("adds restrained energy only when send becomes available", () => {
  render(<ShigoComposer allowAttachments={false} />);
  const textbox = screen.getByRole("textbox", { name: "Message Quiet Room" });
  const send = screen.getByRole("button", { name: "Send message" });

  expect(send).toBeDisabled();
  fireEvent.change(textbox, { target: { value: "Ready" } });
  expect(send).toBeEnabled();
  expect(send.className).toContain("shadow-[0_0_16px_hsl(var(--primary)/0.16)]");
});
