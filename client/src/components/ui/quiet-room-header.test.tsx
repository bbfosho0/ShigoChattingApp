import { render, screen } from "@testing-library/react";

import { QuietRoomHeader } from "./quiet-room-header";

test("renders room identity and optional controls from one shared header", () => {
  render(
    <QuietRoomHeader
      mobileNav={<button type="button">Open navigation</button>}
      onToggleTheme={jest.fn()}
      onPreferences={jest.fn()}
      darkMode
      showThemeToggle
    />
  );

  expect(screen.getByText("Quiet Room")).toBeInTheDocument();
  expect(screen.getByText("A calm shared space for conversation.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Open navigation" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Switch to light mode" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Open preferences" })).toBeInTheDocument();
});
