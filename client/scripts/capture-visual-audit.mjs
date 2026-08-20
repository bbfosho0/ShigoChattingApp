import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.STORYBOOK_URL || "http://127.0.0.1:6006";
const outputRoot = path.resolve(process.cwd(), "visual-audit");
const screenshotsDir = path.join(outputRoot, "screenshots");

const targets = [
  { title: "Compositions/Quiet Room", name: "Desktop", width: 1440, height: 1000, theme: "dark" },
  { title: "Compositions/Quiet Room", name: "Desktop", width: 1280, height: 900, theme: "dark" },
  { title: "Compositions/Quiet Room", name: "Tablet", width: 1024, height: 800, theme: "dark" },
  { title: "Compositions/Quiet Room", name: "Tablet", width: 900, height: 800, theme: "dark" },
  { title: "Compositions/Quiet Room", name: "Tablet", width: 768, height: 800, theme: "dark" },
  { title: "Compositions/Quiet Room", name: "Mobile", width: 390, height: 844, theme: "dark" },
  { title: "Compositions/Quiet Room", name: "Mobile", width: 360, height: 800, theme: "dark" },
  { title: "Compositions/Quiet Room", name: "Empty", width: 900, height: 700, theme: "dark" },
  { title: "Compositions/Quiet Room", name: "Loading", width: 900, height: 700, theme: "dark" },
  { title: "Compositions/Quiet Room", name: "Preferences Open", width: 1440, height: 1000, theme: "dark" },
  { title: "Compositions/Quiet Room", name: "Light Desktop", width: 1440, height: 1000, theme: "light" },
  { title: "Compositions/Quiet Room", name: "Light Mobile", width: 390, height: 844, theme: "light" },

  { title: "Messaging/Conversation", name: "One Message", width: 900, height: 700, theme: "light" },
  { title: "Messaging/Conversation", name: "Two Messages Grouped", width: 900, height: 700, theme: "light" },
  { title: "Messaging/Conversation", name: "Alternating Senders", width: 900, height: 700, theme: "light" },
  { title: "Messaging/Conversation", name: "Long Transcript", width: 900, height: 700, theme: "light" },
  { title: "Messaging/Conversation", name: "Dark", width: 900, height: 700, theme: "dark" },
  { title: "Messaging/Message", name: "Grouped Other", width: 900, height: 420, theme: "light" },
  { title: "Messaging/Message", name: "Grouped Own", width: 900, height: 420, theme: "light" },
  {
    title: "Messaging/Composer",
    name: "Audit Surface",
    width: 900,
    height: 500,
    theme: "dark",
    focusSelector: '[aria-label="Message Quiet Room"]',
    fillValue: "A quiet message with just enough energy.",
  },

  { title: "Settings/Preferences Shell", name: "Account", width: 900, height: 800, theme: "dark" },
  { title: "Settings/Preferences Shell", name: "Security", width: 900, height: 800, theme: "dark" },
  { title: "Settings/Preferences Shell", name: "Mobile Appearance", width: 390, height: 844, theme: "dark" },
  { title: "Settings/Preferences Shell", name: "Mobile Security", width: 360, height: 800, theme: "dark" },
  { title: "Settings/Preferences Shell", name: "Light Appearance", width: 900, height: 800, theme: "light" },
  { title: "Settings/Preferences Shell", name: "Light Mobile Appearance", width: 390, height: 844, theme: "light" },

  { title: "Auth/Login", name: "Default", width: 1440, height: 1000, theme: "dark" },
  { title: "Auth/Login", name: "Error", width: 1440, height: 1000, theme: "dark" },
  { title: "Auth/Register", name: "Default", width: 1440, height: 1000, theme: "dark" },
  { title: "Auth/Mobile", name: "Login", width: 390, height: 844, theme: "dark" },
  { title: "Auth/Mobile", name: "Register", width: 390, height: 844, theme: "dark" },

  { title: "Experience/Splash", name: "Default", width: 1280, height: 900, theme: "dark" },
  { title: "Experience/Splash", name: "Default", width: 390, height: 844, theme: "dark" },
  { title: "Experience/Splash", name: "Default", width: 1280, height: 900, theme: "dark", reducedMotion: true },
];

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function resolveStory(index, target) {
  const entries = Object.values(index.entries || index.stories || {});
  return entries.find((entry) => {
    if (entry.type && entry.type !== "story") return false;
    const entryName = entry.name || entry.story;
    return entry.title === target.title && entryName === target.name;
  });
}

async function waitForStory(page) {
  await page.waitForFunction(() => {
    const root = document.querySelector("#storybook-root") || document.querySelector("#root");
    return Boolean(root && root.childElementCount > 0);
  }, { timeout: 15000 });

  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });

  await page.waitForTimeout(250);
}

async function prepareTarget(page, target) {
  if (!target.focusSelector) return;
  const control = page.locator(target.focusSelector).first();
  await control.waitFor({ state: "visible", timeout: 10000 });
  if (typeof target.fillValue === "string") {
    await control.fill(target.fillValue);
  }
  await control.focus();
  await page.waitForTimeout(100);
}

await mkdir(screenshotsDir, { recursive: true });

const indexResponse = await fetch(`${baseUrl}/index.json`);
if (!indexResponse.ok) {
  throw new Error(`Could not read Storybook index: ${indexResponse.status} ${indexResponse.statusText}`);
}
const index = await indexResponse.json();

const browser = await chromium.launch({ headless: true });
const manifest = {
  schemaVersion: 2,
  repository: process.env.GITHUB_REPOSITORY || "bbfosho0/ShigoChattingApp",
  sha: process.env.VISUAL_SHA || process.env.GITHUB_SHA || null,
  ref: process.env.VISUAL_REF || process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || null,
  runId: process.env.GITHUB_RUN_ID || null,
  generatedAt: new Date().toISOString(),
  storybookUrl: baseUrl,
  screenshots: [],
  failures: [],
};

try {
  for (const target of targets) {
    const story = resolveStory(index, target);
    if (!story) {
      const message = `Missing Storybook story: ${target.title} / ${target.name}`;
      manifest.failures.push({ ...target, message });
      console.error(message);
      continue;
    }

    const context = await browser.newContext({
      viewport: { width: target.width, height: target.height },
      reducedMotion: target.reducedMotion ? "reduce" : "no-preference",
      colorScheme: target.theme === "dark" ? "dark" : "light",
    });
    const page = await context.newPage();
    const browserEvents = [];

    page.on("console", (message) => {
      if (["warning", "error"].includes(message.type())) {
        browserEvents.push({ type: `console:${message.type()}`, text: message.text() });
      }
    });
    page.on("pageerror", (error) => {
      browserEvents.push({ type: "pageerror", text: error.message });
    });

    const url = `${baseUrl}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`;
    const motionSuffix = target.reducedMotion ? "-reduced-motion" : "";
    const interactionSuffix = target.focusSelector ? "-focused" : "";
    const fileName = [
      slug(target.title),
      slug(target.name),
      `${target.width}x${target.height}`,
      target.theme,
    ].join("--") + `${motionSuffix}${interactionSuffix}.png`;
    const filePath = path.join(screenshotsDir, fileName);

    try {
      const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      if (!response?.ok()) {
        throw new Error(`Story returned HTTP ${response?.status() ?? "unknown"}`);
      }
      await waitForStory(page);
      await prepareTarget(page, target);
      await page.screenshot({ path: filePath, fullPage: false, animations: "disabled" });

      manifest.screenshots.push({
        title: target.title,
        story: target.name,
        storyId: story.id,
        viewport: { width: target.width, height: target.height },
        theme: target.theme,
        reducedMotion: Boolean(target.reducedMotion),
        interaction: target.focusSelector ? { focusSelector: target.focusSelector, fillValue: target.fillValue || null } : null,
        file: `screenshots/${fileName}`,
        browserEvents,
      });
      console.log(`Captured ${fileName}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      manifest.failures.push({ ...target, storyId: story.id, message, browserEvents });
      console.error(`Failed ${target.title} / ${target.name}: ${message}`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}

await writeFile(
  path.join(outputRoot, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8"
);

await writeFile(
  path.join(outputRoot, "README.md"),
  `# Shigo visual audit artifact\n\n` +
    `Commit: \`${manifest.sha || "unknown"}\`\n\n` +
    `This artifact contains browser-rendered Storybook screenshots for the official Shigo visual audit set. ` +
    `Use \`manifest.json\` to map each PNG to its story, viewport, theme, reduced-motion state, interaction preparation, and browser warnings/errors.\n\n` +
    `Captured: ${manifest.screenshots.length}\n\n` +
    `Failures: ${manifest.failures.length}\n`,
  "utf8"
);

if (manifest.failures.length > 0) {
  throw new Error(`Visual evidence capture completed with ${manifest.failures.length} failure(s).`);
}

console.log(`Visual evidence capture complete: ${manifest.screenshots.length} screenshots.`);
