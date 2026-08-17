import React from "react";
import Preferences from "../components/Preferences";
import MusicPlayer from "../components/MusicPlayer";

const user = { username: "room owner", email: "owner@example.com" };

const meta = {
  title: "ShigoChat/Room support",
  parameters: {
    design: { type: "figma", url: "https://www.figma.com/design/Srny3gef0k6rBZVkTFEzPC" },
  },
};

export default meta;

export const AmbientMusic = { render: () => <div className="w-[min(420px,90vw)]"><MusicPlayer /></div> };

export const PreferencesOpen = {
  render: () => <Preferences open onClose={() => {}} user={user} onLogout={() => {}} returnFocusRef={{ current: null }} />,
  parameters: { layout: "fullscreen" },
};
