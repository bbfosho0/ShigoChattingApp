const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("production Socket.IO wiring places sessions in user rooms and injects live revocation", () => {
  const source = fs.readFileSync(path.join(__dirname, "../server.js"), "utf8");

  assert.match(source, /socket\.join\(`user:\$\{String\(socket\.user\._id\)\}`\)/);
  assert.match(source, /io\.in\(`user:\$\{String\(userId\)\}`\)\.disconnectSockets\(true\)/);
  assert.match(source, /createAuthRouter\(\{\s*disconnectUserSockets,/);
});
