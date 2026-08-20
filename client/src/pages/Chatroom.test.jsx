import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import Chatroom from "./Chatroom";

const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  disconnect: jest.fn(),
  connected: false,
};

jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("socket.io-client", () => ({
  io: jest.fn(() => mockSocket),
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { error: jest.fn() },
}));

jest.mock("../components/MessageInput", () => () => <div data-testid="composer" />);
jest.mock("../components/MusicPlayer", () => () => null);
jest.mock("../components/Preferences", () => () => null);
jest.mock("../components/ui/app-sidebar", () => ({
  AppSidebar: ({ collapsed }) => (
    <aside data-testid={collapsed ? "sidebar-compact" : "sidebar-expanded"} />
  ),
}));
jest.mock("../components/ui/mobile-nav", () => ({
  MobileNav: () => <div data-testid="mobile-nav" />,
}));
jest.mock("../components/ui/shigo-conversation", () => ({
  ShigoConversation: () => <div data-testid="conversation" />,
}));

describe("Chatroom responsive shell", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
    mockSocket.on.mockClear();
    mockSocket.off.mockClear();
    mockSocket.disconnect.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("keeps the compact rail through the small-desktop range and expands at xl", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: { _id: "yoshi", username: "Yoshi", email: "yoshi@example.com" },
            setUser: jest.fn(),
          }}
        >
          <ThemeContext.Provider value={{ darkMode: true, toggleDarkMode: jest.fn() }}>
            <Chatroom />
          </ThemeContext.Provider>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const expandedWrapper = screen.getByTestId("sidebar-expanded").parentElement;
    const compactWrapper = screen.getByTestId("sidebar-compact").parentElement;

    expect(expandedWrapper?.className).toContain("xl:block");
    expect(expandedWrapper?.className).not.toContain("lg:block");
    expect(compactWrapper?.className).toContain("md:block");
    expect(compactWrapper?.className).toContain("xl:hidden");
    expect(compactWrapper?.className).not.toContain("lg:hidden");
  });
});
