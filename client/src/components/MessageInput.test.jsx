import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import MessageInput from "./MessageInput";

test("exposes the sending state while the message request is pending", async () => {
  let resolveSend;
  const onSend = jest.fn(() => new Promise((resolve) => { resolveSend = resolve; }));

  render(<MessageInput onSend={onSend} />);
  const input = screen.getByRole("textbox", { name: /message input/i });

  fireEvent.change(input, { target: { value: "A quiet hello." } });
  fireEvent.click(screen.getByRole("button", { name: /send message/i }));

  expect(onSend).toHaveBeenCalledWith("A quiet hello.");
  expect(screen.getByRole("button", { name: /sending message/i })).toBeDisabled();
  expect(screen.getByRole("status")).toHaveTextContent("Sending quietly");

  resolveSend();
  await waitFor(() => expect(input).toHaveValue(""));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

