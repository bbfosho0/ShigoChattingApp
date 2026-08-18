import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { ThemeContext } from "../context/ThemeContext";
import { useMusic } from "../context/MusicContext";
import { PreferencesShell } from "./ui/preferences-shell";

const Preferences = ({ open, onClose, user }) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const {
    isPlaying,
    volume,
    progress,
    togglePlay,
    setVolume,
    nextSong,
    prevSong,
    seek,
  } = useMusic();
  const [securityLoading, setSecurityLoading] = useState(false);

  const handleThemeChange = (theme) => {
    const wantsDark = theme === "dark";
    if (wantsDark !== darkMode) toggleDarkMode();
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in again before changing your password.");
      return;
    }

    try {
      setSecurityLoading(true);
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/auth/change-password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Password change failed";
      toast.error(message);
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <PreferencesShell
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose?.();
      }}
      name={user?.username || "User"}
      email={user?.email || ""}
      theme={darkMode ? "dark" : "light"}
      playing={isPlaying}
      progress={progress * 100}
      volume={volume * 100}
      securityLoading={securityLoading}
      onThemeChange={handleThemeChange}
      onTogglePlay={togglePlay}
      onPrevious={prevSong}
      onNext={nextSong}
      onSeek={(value) => seek(value / 100)}
      onVolumeChange={(value) => setVolume(value / 100)}
      onUpdatePassword={handleChangePassword}
    />
  );
};

export default Preferences;
