import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RoomState from "./RoomState";

test("renders an inline retry state for room load failures", () => {
  const onRetry = jest.fn();
  render(<RoomState kind="error" onRetry={onRetry} />);

  expect(screen.getByRole("alert")).toHaveTextContent("The room could not load.");
  fireEvent.click(screen.getByRole("button", { name: /try again/i }));
  expect(onRetry).toHaveBeenCalledTimes(1);
});

test("renders a live loading status", () => {
  render(<RoomState kind="loading" />);
  expect(screen.getByRole("status")).toHaveTextContent("Opening the room");
});
