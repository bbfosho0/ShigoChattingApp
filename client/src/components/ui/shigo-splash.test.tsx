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
