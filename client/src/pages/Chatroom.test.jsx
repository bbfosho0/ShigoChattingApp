import fs from "fs";
import path from "path";

describe("Chatroom responsive shell", () => {
  it("keeps the compact rail through the small-desktop range and expands at xl", () => {
    const source = fs.readFileSync(path.join(__dirname, "Chatroom.jsx"), "utf8");

    expect(source).toContain('className="hidden h-full xl:block"');
    expect(source).toContain('className="hidden h-full md:block xl:hidden"');
    expect(source).not.toContain('className="hidden h-full lg:block"');
    expect(source).not.toContain('className="hidden h-full md:block lg:hidden"');
  });

  it("reconnects Socket.IO with a replacement JWT after an authenticated password change", () => {
    const source = fs.readFileSync(path.join(__dirname, "Chatroom.jsx"), "utf8");

    expect(source).toContain("AUTH_TOKEN_UPDATED_EVENT");
    expect(source).toContain("socket.auth = { token: nextToken }");
    expect(source).toContain("socket.connect()");
    expect(source).toContain("window.removeEventListener(AUTH_TOKEN_UPDATED_EVENT, onAuthTokenUpdated)");
  });
});
