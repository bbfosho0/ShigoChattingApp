import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MessageBubble from "./MessageBubble";

const message = {
  _id: "message-1",
  content: "A quiet hello.",
  sender: { _id: "user-1", username: "Yoshi" },
  createdAt: "2026-08-17T12:00:00.000Z",
};

test("reveals owned message actions on mobile disclosure", () => {
  render(<MessageBubble message={message} userId="user-1" onDelete={jest.fn()} onEdit={jest.fn()} />);

  const disclosure = screen.getByRole("button", { name: /show message actions/i });
  expect(disclosure).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(disclosure);

  expect(disclosure).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("button", { name: /^edit$/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /^delete$/i })).toBeInTheDocument();
});
