import fs from "fs";
import path from "path";

describe("SplashScreen composition", () => {
  it("passes live progress into the cinematic Splash instead of rendering a detached loader", () => {
    const source = fs.readFileSync(path.join(__dirname, "SplashScreen.jsx"), "utf8");

    expect(source).toContain('<ShigoSplash showAction={false} progress={progress} />');
    expect(source).not.toContain('bottom-8 left-1/2 z-20 w-36');
  });
});
