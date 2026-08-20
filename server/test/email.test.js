const test = require("node:test");
const assert = require("node:assert/strict");

const { buildSmtpConfig, buildPasswordResetMessage } = require("../services/email");

test("SMTP configuration is provider-neutral and environment driven", () => {
  const config = buildSmtpConfig({
    SMTP_HOST: "smtp.example.com",
    SMTP_PORT: "587",
    SMTP_SECURE: "false",
    SMTP_USER: "smtp-user",
    SMTP_PASS: "smtp-pass",
  });

  assert.deepEqual(config, {
    host: "smtp.example.com",
    port: 587,
    secure: false,
    auth: { user: "smtp-user", pass: "smtp-pass" },
  });
});

test("reset email contains the trusted reset URL but never a password", () => {
  const message = buildPasswordResetMessage(
    "person@example.com",
    "https://shigochat.example/reset-password?token=opaque-token",
    { SMTP_FROM: "ShigoChat <no-reply@example.com>" }
  );

  assert.equal(message.to, "person@example.com");
  assert.equal(message.from, "ShigoChat <no-reply@example.com>");
  assert.match(message.text, /30 minutes/i);
  assert.match(message.text, /https:\/\/shigochat\.example\/reset-password\?token=opaque-token/);
  assert.doesNotMatch(message.text, /password:\s+\S+/i);
});
