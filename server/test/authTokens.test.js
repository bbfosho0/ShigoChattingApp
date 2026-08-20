const test = require("node:test");
const assert = require("node:assert/strict");

const {
  generateResetToken,
  hashResetToken,
  signAuthToken,
  tokenAuthVersion,
} = require("../lib/authTokens");

test("reset token is opaque and only its deterministic hash is persisted", () => {
  const raw = generateResetToken();

  assert.match(raw, /^[a-f0-9]{64}$/);
  assert.equal(raw.length, 64);
  assert.equal(hashResetToken(raw), hashResetToken(raw));
  assert.notEqual(hashResetToken(raw), raw);
});

test("auth JWT carries the current authentication version", () => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "test-secret-that-is-long-enough-for-ci";

  try {
    const jwt = require("jsonwebtoken");
    const token = signAuthToken({ _id: "507f1f77bcf86cd799439011", authVersion: 3 });
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    assert.equal(payload.authVersion, 3);
    assert.equal(payload._id, "507f1f77bcf86cd799439011");
  } finally {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});

test("legacy JWT payloads are treated as authentication version zero", () => {
  assert.equal(tokenAuthVersion({ _id: "legacy-user" }), 0);
  assert.equal(tokenAuthVersion({ _id: "versioned-user", authVersion: 4 }), 4);
});
