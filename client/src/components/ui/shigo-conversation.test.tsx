import { render, screen } from "@testing-library/react";

import { ShigoConversation } from "components/ui/shigo-conversation";

const messages = [
  {
    id: "message-1",
    senderId: "alice",
    senderName: "Alice",
    content: "Hello from Alice.",
    createdAt: "2026-08-18T20:40:00",
  },
];

describe("ShigoConversation layout", () => {
  it("bottom-anchors a sparse transcript so it stays visually connected to the composer", () => {
    render(<ShigoConversation messages={messages} currentUserId="yoshi" autoScroll={false} />);

    const article = screen.getByText("Hello from Alice.").closest("article");
    expect(article).not.toBeNull();

    const transcriptStack = article?.parentElement;
    expect(transcriptStack?.className).toContain("min-h-full");
    expect(transcriptStack?.className).toContain("justify-end");
  });

  it("shows sender identity once for consecutive messages in the same conversation group", () => {
    render(
      <ShigoConversation
        currentUserId="yoshi"
        autoScroll={false}
        messages={[
          {
            id: "alice-1",
            senderId: "alice",
            senderName: "Alice",
            content: "First thought.",
            createdAt: "2026-08-18T20:40:00",
          },
          {
            id: "alice-2",
            senderId: "alice",
            senderName: "Alice",
            content: "Same thought, continued.",
            createdAt: "2026-08-18T20:42:00",
          },
        ]}
      />
    );

    expect(screen.getAllByText("Alice")).toHaveLength(1);
    expect(screen.getByText("First thought.")).toBeInTheDocument();
    expect(screen.getByText("Same thought, continued.")).toBeInTheDocument();
  });

  it("starts a new sender group after a meaningful time gap", () => {
    render(
      <ShigoConversation
        currentUserId="yoshi"
        autoScroll={false}
        messages={[
          {
            id: "alice-1",
            senderId: "alice",
            senderName: "Alice",
            content: "Earlier message.",
            createdAt: "2026-08-18T20:40:00",
          },
          {
            id: "alice-2",
            senderId: "alice",
            senderName: "Alice",
            content: "Later message.",
            createdAt: "2026-08-18T20:51:00",
          },
        ]}
      />
    );

    expect(screen.getAllByText("Alice")).toHaveLength(2);
  });
});
