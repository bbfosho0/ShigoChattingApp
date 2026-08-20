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
});
