import { render, screen } from "@testing-library/react";

import { ShigoBrandArtwork } from "./shigo-brand-artwork";

it("keeps the original responsive light and dark artwork as first-class brand layers", () => {
  render(<ShigoBrandArtwork />);

  expect(screen.getByTestId("shigo-artwork-desktop-light")).toHaveAttribute(
    "src",
    expect.stringContaining("DesktopLightBackgroundSplash.png")
  );
  expect(screen.getByTestId("shigo-artwork-desktop-dark")).toHaveAttribute(
    "src",
    expect.stringContaining("DesktopDarkBackgroundSplash.png")
  );
  expect(screen.getByTestId("shigo-artwork-mobile-light")).toHaveAttribute(
    "src",
    expect.stringContaining("MobileLightBackgroundSplash.png")
  );
  expect(screen.getByTestId("shigo-artwork-mobile-dark")).toHaveAttribute(
    "src",
    expect.stringContaining("MobileDarkBackgroundSplash.png")
  );
});
