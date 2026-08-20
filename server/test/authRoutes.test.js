const test = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const request = require("supertest");

const authModule = require("../routes/auth");

const FORGOT_MESSAGE =
  "If an account exists for that email, a recovery link has been sent.";
const INVALID_RESET_MESSAGE = "This recovery link is invalid or has expired.";

function noopMiddleware(req, _res, next) {
  next();
}

function makeApp(overrides = {}) {
  assert.equal(
    typeof authModule.createAuthRouter,
    "function",
    "routes/auth must export createAuthRouter for dependency-injected route verification"
  );

  const app = express();
  app.use(express.json());
  app.use(
    "/api/auth",
    authModule.createAuthRouter({
      forgotPasswordIpLimiter: noopMiddleware,
      forgotPasswordEmailLimiter: noopMiddleware,
      resetPasswordIpLimiter: noopMiddleware,
      verifyTokenMiddleware: (req, _res, next) => {
        req.user = { _id: "user-1", authVersion: 2 };
        next();
      },
      minimumForgotDurationMs: 0,
      defer: (fn) => fn(),
      env: {
        CLIENT_URL: "https://client.example",
      },
      logger: { error() {} },
      ...overrides,
    })
  );
  return app;
}

test("forgot-password returns the same neutral response and only emails known accounts", async () => {
  const sent = [];
  const user = { _id: "user-1", email: "person@example.com" };
  const UserModel = {
    async findOne({ email }) {
      return email === "person@example.com" ? user : null;
    },
  };

  const app = makeApp({
    UserModel,
    generateResetToken: () => "d".repeat(64),
    hashResetToken: () => "h".repeat(64),
    createPasswordResetToken: async () => ({ rawToken: "a".repeat(64) }),
    sendPasswordResetEmail: async (to, url) => sent.push({ to, url }),
  });

  const known = await request(app)
    .post("/api/auth/forgot-password")
    .send({ email: " PERSON@example.com " });
  const unknown = await request(app)
    .post("/api/auth/forgot-password")
    .send({ email: "nobody@example.com" });

  assert.equal(known.status, 200);
  assert.equal(unknown.status, 200);
  assert.deepEqual(known.body, { message: FORGOT_MESSAGE });
  assert.deepEqual(unknown.body, { message: FORGOT_MESSAGE });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "person@example.com");
  const resetUrl = new URL(sent[0].url);
  assert.equal(resetUrl.origin, "https://client.example");
  assert.equal(resetUrl.pathname, "/reset-password");
  assert.equal(resetUrl.searchParams.get("token"), "a".repeat(64));
});

test("forgot-password remains neutral when SMTP delivery fails", async () => {
  const app = makeApp({
    UserModel: { async findOne() { return { _id: "user-1", email: "person@example.com" }; } },
    generateResetToken: () => "d".repeat(64),
    hashResetToken: () => "h".repeat(64),
    createPasswordResetToken: async () => ({ rawToken: "a".repeat(64) }),
    sendPasswordResetEmail: async () => {
      throw new Error("smtp unavailable");
    },
  });

  const response = await request(app)
    .post("/api/auth/forgot-password")
    .send({ email: "person@example.com" });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { message: FORGOT_MESSAGE });
});

test("reset-password uses one generic response for invalid, expired, or used tokens", async () => {
  const app = makeApp({
    consumePasswordResetToken: async () => null,
  });

  for (const token of ["invalid", "expired", "used"]) {
    const response = await request(app)
      .post("/api/auth/reset-password")
      .send({ token, newPassword: "new-password-123" });

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, { message: INVALID_RESET_MESSAGE });
  }
});

test("reset-password changes the password, increments authVersion, revokes live sockets, and does not issue a JWT", async () => {
  let invalidatedUserId = null;
  let disconnectedUserId = null;
  let changedEmail = null;
  const user = {
    _id: "user-1",
    email: "person@example.com",
    password: "old-hash",
    authVersion: 4,
    saved: false,
    async save() {
      this.saved = true;
    },
  };

  const app = makeApp({
    UserModel: { async findById(id) { return id === "user-1" ? user : null; } },
    consumePasswordResetToken: async () => ({ userId: "user-1" }),
    invalidatePasswordResetTokens: async (id) => { invalidatedUserId = id; },
    disconnectUserSockets: async (id) => { disconnectedUserId = id; },
    bcryptLib: { async hash(value) { return `hash:${value}`; } },
    sendPasswordChangedEmail: async (email) => { changedEmail = email; },
  });

  const response = await request(app)
    .post("/api/auth/reset-password")
    .send({ token: "a".repeat(64), newPassword: "new-password-123" });

  assert.equal(response.status, 200);
  assert.equal(response.body.token, undefined);
  assert.equal(user.password, "hash:new-password-123");
  assert.equal(user.authVersion, 5);
  assert.equal(user.saved, true);
  assert.equal(invalidatedUserId, "user-1");
  assert.equal(disconnectedUserId, "user-1");
  assert.equal(changedEmail, "person@example.com");
});

test("authenticated password change revokes old sessions and returns a fresh JWT", async () => {
  let invalidatedUserId = null;
  let disconnectedUserId = null;
  const user = {
    _id: "user-1",
    email: "person@example.com",
    password: "old-hash",
    authVersion: 2,
    async save() {},
  };

  const app = makeApp({
    UserModel: { async findById() { return user; } },
    bcryptLib: {
      async compare(value, hash) { return value === "current-password" && hash === "old-hash"; },
      async hash(value) { return `hash:${value}`; },
    },
    signAuthToken: (savedUser) => `fresh-${savedUser.authVersion}`,
    invalidatePasswordResetTokens: async (id) => { invalidatedUserId = id; },
    disconnectUserSockets: async (id) => { disconnectedUserId = id; },
    sendPasswordChangedEmail: async () => {},
  });

  const response = await request(app)
    .patch("/api/auth/change-password")
    .send({ currentPassword: "current-password", newPassword: "new-password-123" });

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    message: "Password changed.",
    token: "fresh-3",
  });
  assert.equal(user.authVersion, 3);
  assert.equal(user.password, "hash:new-password-123");
  assert.equal(invalidatedUserId, "user-1");
  assert.equal(disconnectedUserId, "user-1");
});

test("register and password mutations enforce at least eight characters", async () => {
  const app = makeApp({
    UserModel: {
      async findOne() { throw new Error("validation should run first"); },
      async findById() { throw new Error("validation should run first"); },
    },
  });

  const register = await request(app)
    .post("/api/auth/register")
    .send({ username: "person", email: "person@example.com", password: "short" });
  const reset = await request(app)
    .post("/api/auth/reset-password")
    .send({ token: "a".repeat(64), newPassword: "short" });
  const change = await request(app)
    .patch("/api/auth/change-password")
    .send({ currentPassword: "current-password", newPassword: "short" });

  for (const response of [register, reset, change]) {
    assert.equal(response.status, 400);
    assert.equal(response.body.errors[0].msg, "Password must be at least 8 characters");
  }
});
