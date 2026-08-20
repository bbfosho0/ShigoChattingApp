import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";

import Preferences from "./Preferences";
import { SecuritySettingsPanel } from "./ui/settings-panels";
import { ThemeContext } from "../context/ThemeContext";

jest.mock("axios");
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("../context/MusicContext", () => ({
  useMusic: () => ({
    isPlaying: false,
    volume: 0.5,
    progress: 0,
    togglePlay: jest.fn(),
    setVolume: jest.fn(),
    nextSong: jest.fn(),
    prevSong: jest.fn(),
    seek: jest.fn(),
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test("authenticated password change stores the replacement JWT", async () => {
  localStorage.setItem("token", "old-token");
  axios.patch.mockResolvedValueOnce({ data: { message: "Password changed.", token: "fresh-token" } });

  render(
    <ThemeContext.Provider value={{ darkMode: true, toggleDarkMode: jest.fn() }}>
      <Preferences open onClose={jest.fn()} user={{ username: "Yoshi", email: "yoshi@example.com" }} />
    </ThemeContext.Provider>
  );

  fireEvent.click(screen.getByRole("tab", { name: /security/i }));
  fireEvent.change(await screen.findByLabelText(/current password/i), { target: { value: "old-password" } });
  fireEvent.change(screen.getByLabelText(/^new password$/i), { target: { value: "new-password" } });
  fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "new-password" } });
  fireEvent.click(screen.getByRole("button", { name: /update password/i }));

  await waitFor(() => {
    expect(axios.patch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/api/auth/change-password`,
      { currentPassword: "old-password", newPassword: "new-password" },
      { headers: { Authorization: "Bearer old-token" } }
    );
  });
  expect(localStorage.getItem("token")).toBe("fresh-token");
});

test("security settings require at least eight characters", () => {
  const onUpdatePassword = jest.fn();
  render(<SecuritySettingsPanel onUpdatePassword={onUpdatePassword} />);

  fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: "current" } });
  fireEvent.change(screen.getByLabelText(/^new password$/i), { target: { value: "1234567" } });
  fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "1234567" } });
  expect(screen.getByRole("button", { name: /update password/i })).toBeDisabled();

  fireEvent.change(screen.getByLabelText(/^new password$/i), { target: { value: "12345678" } });
  fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "12345678" } });
  expect(screen.getByRole("button", { name: /update password/i })).toBeEnabled();
});
