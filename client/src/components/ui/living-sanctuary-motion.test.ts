import fs from "fs";
import path from "path";

const uiSource = (name: string) => fs.readFileSync(path.join(__dirname, name), "utf8");
const srcSource = (name: string) => fs.readFileSync(path.join(__dirname, "../..", name), "utf8");

describe("Living Sanctuary motion contracts", () => {
  it("gives native buttons tactile Motion hover and press without replacing the Slot path", () => {
    const source = uiSource("button.tsx");
    expect(source).toContain("motion.button");
    expect(source).toContain("shigoHoverLift");
    expect(source).toContain("shigoPress");
    expect(source).toContain("<Slot");
  });

  it("animates auth content and artwork while keeping auth behavior in the existing form", () => {
    const form = uiSource("shigo-auth-form.tsx");
    const art = uiSource("auth-shader-pane.tsx");
    expect(form).toContain("<motion.form");
    expect(form).toContain("<AnimatePresence");
    expect(art).toContain('data-shigo-auth-art-motion');
  });

  it("adds living navigation cues without changing sidebar geometry", () => {
    const source = uiSource("app-sidebar.tsx");
    expect(source).toContain('layoutId="shigo-sidebar-active"');
    expect(source).toContain('data-shigo-sidebar-seam');
    expect(source).toContain('collapsed ? "w-[4.5rem]" : "w-56"');
  });

  it("animates message presence and removal inside the existing conversation measure", () => {
    const message = uiSource("shigo-message.tsx");
    const conversation = uiSource("shigo-conversation.tsx");
    expect(message).toContain("<motion.article");
    expect(conversation).toContain("<AnimatePresence");
    expect(conversation).toContain("CONVERSATION_MEASURE_CLASS");
  });

  it("makes composer state changes kinetic without replacing the semantic composer surface", () => {
    const source = uiSource("shigo-composer.tsx");
    expect(source).toContain('data-shigo-composer-motion');
    expect(source).toContain("<AnimatePresence");
    expect(source).toContain("data-shigo-composer");
  });

  it("animates preferences panels and ambient audio with deterministic motion", () => {
    const preferences = uiSource("preferences-shell.tsx");
    const ambient = uiSource("ambient-player.tsx");
    expect(preferences).toContain('data-shigo-preferences-panel');
    expect(ambient).toContain('data-shigo-spectrum-bar');
    expect(ambient).toContain("motion.span");
  });

  it("adds low-amplitude Quiet Room atmosphere and selective route transitions", () => {
    const composition = uiSource("quiet-room-composition.tsx");
    const chatroom = srcSource("pages/Chatroom.jsx");
    const app = srcSource("App.jsx");
    expect(composition).toContain('data-shigo-atmosphere-motion');
    expect(chatroom).toContain('data-shigo-atmosphere-motion');
    expect(app).toContain("<AnimatePresence");
    expect(app).toContain("motion.div");
  });
});
