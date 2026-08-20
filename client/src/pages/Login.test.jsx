import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";

import Login from "./Login";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const navigate = jest.fn();

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  useNavigate: () => navigate,
}));
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

function renderLogin() {
  return render(
    <ThemeContext.Provider value={{ darkMode: true, toggleDarkMode: jest.fn() }}>
      <AuthContext.Provider value={{ user: null, setUser: jest.fn() }}>
        <Login />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

test("production login exposes secure forgot-password recovery and submits email only", async () => {
  axios.post.mockResolvedValueOnce({
    data: { message: "If an account exists for that email, a recovery link has been sent." },
  });
  renderLogin();

  fireEvent.click(screen.getByRole("button", { name: /forgot password/i }));
  expect(screen.getByRole("heading", { name: /find your way back/i })).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "person@example.com" },
  });
  fireEvent.click(screen.getByRole("button", { name: /send recovery link/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/api/auth/forgot-password`,
      { email: "person@example.com" }
    );
  });

  expect(screen.getByText(/if an account exists for that email/i)).toBeInTheDocument();
  expect(axios.post.mock.calls[0][1]).not.toHaveProperty("password");
});

test("switching recovery modes clears stale auth errors", () => {
  renderLogin();
  fireEvent.click(screen.getByRole("button", { name: /forgot password/i }));
  expect(screen.queryByRole("alert")).not.toHaveTextContent(/sign in failed/i);
  fireEvent.click(screen.getByRole("button", { name: /back to sign in/i }));
  expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
});
