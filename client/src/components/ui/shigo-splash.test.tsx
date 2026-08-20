import { render, screen } from "@testing-library/react";

jest.mock("components/ui/shigo-shader", () => ({
  ShigoShader: () => <div data-testid="shigo-shader" />,
}));

import { ShigoSplash } from "./shigo-splash";

test("owns the full viewport so no page background can show below the splash", () => {
  render(<ShigoSplash showAction={false} />);
  const heading = screen.getByRole("heading", { name: /a quieter place to connect/i });
  const splash = heading.closest("[data-shigo-splash]");
  expect(splash).toHaveClass("min-h-screen");
  expect(splash).toHaveClass("min-h-[100dvh]");
});

test("exposes the moon identity and live progress inside the brand composition", () => {
  render(<ShigoSplash showAction={false} progress={42} />);
  expect(screen.getByTestId("shigo-moon-mark")).toBeInTheDocument();
  expect(screen.getByTestId("shigo-splash-progress")).toHaveStyle({ width: "42%" });
});
