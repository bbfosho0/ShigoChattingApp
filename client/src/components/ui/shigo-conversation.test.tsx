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
});
