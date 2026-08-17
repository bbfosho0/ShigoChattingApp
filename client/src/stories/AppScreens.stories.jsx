import React from "react";
import { expect } from "storybook/test";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SplashScreen from "../pages/SplashScreen";

const fakeUser = { _id: "story-user", username: "room owner", email: "owner@example.com" };

const withRouterAndAuth = (element, user = null) => (
  <MemoryRouter initialEntries={["/login"]}>
    <AuthContext.Provider value={{ user, setUser: () => {} }}>{element}</AuthContext.Provider>
  </MemoryRouter>
);

const meta = {
  title: "ShigoChat/App screens",
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;

export const Splash = {
  render: () => withRouterAndAuth(<SplashScreen />),
};

export const LoginDefault = {
  render: () => withRouterAndAuth(<Login />),
};

export const LoginValidation = {
  render: () => withRouterAndAuth(<Login />),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Sign in" }));
    await expect(canvas.getByText("Email is required")).toBeVisible();
    await expect(canvas.getByText("Password is required")).toBeVisible();
  },
};

export const ForgotPasswordOpen = {
  render: () => withRouterAndAuth(<Login />),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Forgot password?" }));
    await new Promise((resolve) => setTimeout(resolve, 250));
    await expect(canvas.getByText("Reset your password for this ShigoChat account.")).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Reset password" })).toBeVisible();
  },
};

export const Registration = {
  render: () => withRouterAndAuth(<Register />),
};

export const RegistrationValidation = {
  render: () => withRouterAndAuth(<Register />),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Create account" }));
    await expect(canvas.getByText("Username is required")).toBeInTheDocument();
    await expect(canvas.getByText("Email is required")).toBeInTheDocument();
    await expect(canvas.getByText("Password is required")).toBeInTheDocument();
  },
};

export const AuthenticatedReference = {
  render: () => withRouterAndAuth(<Register />, fakeUser),
};
