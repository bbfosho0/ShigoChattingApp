import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

import ResetPassword from "./ResetPassword";
import { ThemeContext } from "../context/ThemeContext";

jest.mock("axios");
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

function renderReset(entry = "/reset-password?token=secret-reset-token") {
  window.history.replaceState({}, "", entry);
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <ThemeContext.Provider value={{ darkMode: true, toggleDarkMode: jest.fn() }}>
        <ResetPassword />
      </ThemeContext.Provider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

test("captures the reset token once and immediately removes it from browser history", () => {
  renderReset();

  expect(window.location.pathname).toBe("/reset-password");
  expect(window.location.search).toBe("");
  expect(localStorage.getItem("token")).toBeNull();
  expect(sessionStorage.getItem("token")).toBeNull();
  expect(document.documentElement.outerHTML).not.toContain("secret-reset-token");
});

test("submits only the in-memory token and confirmed new password without auto-login", async () => {
  axios.post.mockResolvedValueOnce({
    data: { message: "Password reset. Sign in with your new password." },
  });
  renderReset();

  fireEvent.change(screen.getByLabelText(/^new password$/i), {
    target: { value: "new-password-123" },
  });
  fireEvent.change(screen.getByLabelText(/confirm password/i), {
    target: { value: "new-password-123" },
  });
  fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/api/auth/reset-password`,
      { token: "secret-reset-token", newPassword: "new-password-123" }
    );
  });

  expect(screen.getByText(/password reset/i)).toBeInTheDocument();
  expect(localStorage.getItem("token")).toBeNull();
  expect(localStorage.getItem("user")).toBeNull();
});

test("missing or rejected tokens render the same invalid recovery state", async () => {
  const { unmount } = renderReset("/reset-password");
  expect(screen.getByText(/invalid or has expired/i)).toBeInTheDocument();
  unmount();

  axios.post.mockRejectedValueOnce({ response: { status: 400 } });
  renderReset();
  fireEvent.change(screen.getByLabelText(/^new password$/i), { target: { value: "new-password-123" } });
  fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "new-password-123" } });
  fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

  await waitFor(() => expect(screen.getByText(/invalid or has expired/i)).toBeInTheDocument());
});
