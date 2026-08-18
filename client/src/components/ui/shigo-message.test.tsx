import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("components/ui/popover", () => ({
  Popover: ({ children }: { children: ReactNode }) => <>{children}</>,
  PopoverTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  PopoverContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock("components/ui/presence-avatar", () => ({
  PresenceAvatar: ({ fallback }: { fallback: string }) => <div aria-label="Avatar">{fallback}</div>,
}));

import { ShigoMessage, type ShigoMessageData } from "components/ui/shigo-message";

const baseMessage: ShigoMessageData = {
  id: "message-1",
  senderId: "yoshi",
  senderName: "Yoshi",
  content: "Original message",
  createdAt: "2026-08-18T20:43:00",
};

describe("ShigoMessage production behavior", () => {
  it("does not render reply or reaction actions without callbacks", () => {
    render(
      <ShigoMessage
        message={baseMessage}
        currentUserId="yoshi"
        onEdit={() => undefined}
        onDelete={() => undefined}
      />
    );

    expect(screen.queryByRole("button", { name: "Reply" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "React" })).not.toBeInTheDocument();
  });

  it("uses updated message content when editing after a prop update", () => {
    const onEdit = jest.fn();
    const { rerender } = render(
      <ShigoMessage
        message={baseMessage}
        currentUserId="yoshi"
        onEdit={onEdit}
        onDelete={() => undefined}
      />
    );

    rerender(
      <ShigoMessage
        message={{ ...baseMessage, content: "Updated from the server" }}
        currentUserId="yoshi"
        onEdit={onEdit}
        onDelete={() => undefined}
      />
    );

    fireEvent.click(screen.getAllByRole("button", { name: "Edit message" })[0]);

    expect(screen.getByRole("textbox", { name: "Edit message" })).toHaveValue(
      "Updated from the server"
    );
  });
});
