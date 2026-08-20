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

  it("captures every canonical password recovery state", () => {
    const recoveryTargets = [
      '{ title: "Auth/Forgot Password", name: "Default"',
      '{ title: "Auth/Forgot Password", name: "Sent"',
      '{ title: "Auth/Forgot Password", name: "Mobile"',
      '{ title: "Auth/Reset Password", name: "Default"',
      '{ title: "Auth/Reset Password", name: "Invalid"',
      '{ title: "Auth/Reset Password", name: "Success"',
      '{ title: "Auth/Reset Password", name: "Mobile"',
    ];

    recoveryTargets.forEach((target) => expect(captureSource).toContain(target));
  });
});
