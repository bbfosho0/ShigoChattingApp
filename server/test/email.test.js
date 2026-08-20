const test = require("node:test");
const assert = require("node:assert/strict");

const { buildSmtpConfig, buildPasswordResetMessage } = require("../services/email");

test("SMTP configuration is provider-neutral, environment driven, and requires TLS for STARTTLS transports", () => {
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
    requireTLS: true,
    auth: { user: "smtp-user", pass: "smtp-pass" },
  });
});

test("implicit TLS transports do not request a STARTTLS upgrade", () => {
  const config = buildSmtpConfig({
    SMTP_HOST: "smtp.example.com",
    SMTP_PORT: "465",
    SMTP_SECURE: "true",
    SMTP_USER: "smtp-user",
    SMTP_PASS: "smtp-pass",
  });

  assert.equal(config.secure, true);
  assert.equal(config.requireTLS, false);
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
