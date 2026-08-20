import fs from "fs";
import path from "path";

const captureSource = fs.readFileSync(
  path.join(__dirname, "../scripts/capture-visual-audit.mjs"),
  "utf8"
);
const splashStories = fs.readFileSync(
  path.join(__dirname, "stories/ShigoSplash.stories.tsx"),
  "utf8"
);

describe("Living Sanctuary visual evidence contract", () => {
  it("applies the requested Tailwind theme class inside each Storybook iframe", () => {
    expect(captureSource).toContain('document.documentElement.classList.toggle("dark"');
  });

  it("captures an in-progress cinematic Splash state", () => {
    expect(splashStories).toContain("export const Progress");
    expect(captureSource).toContain('{ title: "Experience/Splash", name: "Progress"');
  });

  it("captures the playing ambient player as a first-class Living Sanctuary state", () => {
    expect(captureSource).toContain('{ title: "Media/Ambient Player", name: "Dark"');
  });
});
