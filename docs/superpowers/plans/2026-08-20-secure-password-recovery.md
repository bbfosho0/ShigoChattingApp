# Secure Password Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add secure email-based password recovery, one-time expiring reset tokens, abuse controls, JWT revocation, Shigo-branded recovery UI, and complete CI/visual verification.

**Architecture:** Recovery uses opaque random tokens whose SHA-256 hashes are stored in MongoDB, with a dedicated TTL-backed token model. Authentication JWTs carry an `authVersion` checked against the current user record, so password reset revokes old REST and Socket.IO sessions. Outbound email is isolated behind a provider-neutral Nodemailer SMTP service, and the client reuses the Living Sanctuary auth system for request, reset, invalid, and success states.

**Tech Stack:** Node.js 22-24, Express 5, Mongoose 8, bcryptjs, jsonwebtoken, express-validator, express-rate-limit, Nodemailer, React 19, React Router 7, Axios, Motion 13, Storybook 10, CRA Jest, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-20-secure-password-recovery-design.md`

## Global Constraints

- Reset tokens are 32 cryptographically random bytes and only SHA-256 hashes are stored.
- Reset tokens expire after 30 minutes and are single-use.
- Forgot-password responses must not reveal account existence through content or an obvious fast path.
- Reset URLs are derived from configured `CLIENT_URL`, never the request Host header.
- New passwords require at least 8 characters on register, authenticated change, and reset.
- Successful recovery does not automatically log the user in.
- Password reset invalidates all previously issued JWTs.
- Authenticated password change invalidates other sessions but returns a fresh JWT for the current session.
- Recovery endpoints are rate limited: forgot per IP 10/15 min, forgot per normalized email 3/15 min, reset per IP 10/15 min.
- Client reset tokens are captured into memory, immediately removed from the visible URL/history, and protected by a `no-referrer` document policy.
- SMTP credentials and reset tokens must never be committed.
- Do not modify Render deployment configuration in this implementation.
- Preserve all Living Sanctuary layout, motion, responsive, chat, and accessibility contracts outside the auth/security scope.

---

### Task 1: Establish server recovery test and dependency infrastructure

**Files:**
- Modify: `server/package.json`
- Modify: `server/package-lock.json`
- Modify: `.github/workflows/storybook-baseline-verify.yml`
- Create: `server/test/authTokens.test.js`

**Interfaces:**
- Produces: server test command `npm test`, and testable auth helper contract for later tasks.

- [ ] **Step 1: Add the first failing auth-token test**

Create `server/test/authTokens.test.js` using Node's built-in test runner:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const { generateResetToken, hashResetToken } = require("../lib/authTokens");

test("reset token is opaque and only its deterministic hash is persisted", () => {
  const raw = generateResetToken();
  assert.match(raw, /^[a-f0-9]{64}$/);
  assert.equal(raw.length, 64);
  assert.equal(hashResetToken(raw), hashResetToken(raw));
  assert.notEqual(hashResetToken(raw), raw);
});
```

- [ ] **Step 2: Run the server test through the CI harness and confirm RED**

Run in GitHub Actions after opening a temporary draft PR to `main`:

```bash
cd server
npm test
```

Expected: FAIL because `../lib/authTokens` does not exist.

- [ ] **Step 3: Add dependencies and scripts**

`server/package.json` must include:

```json
"scripts": {
  "dev": "nodemon server.js",
  "start": "node server.js",
  "test": "node --test test/*.test.js"
},
"dependencies": {
  "express-rate-limit": "^8.1.0",
  "nodemailer": "^7.0.6"
}
```

Keep all existing dependencies. Add `supertest` only if route-level tests require it; otherwise test route services/helpers without introducing another dependency.

Regenerate `server/package-lock.json` with the supported npm runtime, never by hand-editing resolved package entries.

- [ ] **Step 4: Make CI run server tests before the production audit**

Add:

```yaml
- name: Run server regression tests
  working-directory: server
  run: npm test
```

Also extend the server syntax block as new files are added in later tasks.

- [ ] **Step 5: Commit**

```bash
git add server/package.json server/package-lock.json server/test/authTokens.test.js .github/workflows/storybook-baseline-verify.yml
git commit -m "test: establish password recovery server harness"
```

---

### Task 2: Add token helpers and authentication versioning

**Files:**
- Create: `server/lib/authTokens.js`
- Modify: `server/models/User.js`
- Modify: `server/middleware/auth.js`
- Modify: `server/server.js`
- Modify: `server/routes/auth.js`
- Test: `server/test/authTokens.test.js`

**Interfaces:**
- Produces:
  - `generateResetToken(): string`
  - `hashResetToken(rawToken: string): string`
  - `signAuthToken(user): string`
  - `tokenAuthVersion(payload): number`
  - `verifyAuthTokenAgainstUser(token): Promise<{ _id: string, authVersion: number }>`

- [ ] **Step 1: Extend RED tests for versioned JWTs**

Add assertions that `signAuthToken({ _id: "abc", authVersion: 3 })` produces a JWT whose decoded payload carries `authVersion: 3`, and that the compatibility helper maps a legacy payload with no version to `0`.

- [ ] **Step 2: Implement `server/lib/authTokens.js`**

Use:

```js
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashResetToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function tokenAuthVersion(payload) {
  return Number.isInteger(payload?.authVersion) ? payload.authVersion : 0;
}

function signAuthToken(user) {
  return jwt.sign(
    { _id: user._id, authVersion: Number(user.authVersion || 0) },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}
```

`verifyAuthTokenAgainstUser` verifies signature/expiry, loads `User` by id, compares `tokenAuthVersion(payload)` to `Number(user.authVersion || 0)`, and rejects mismatches.

- [ ] **Step 3: Add `authVersion` to User**

```js
authVersion: { type: Number, default: 0, min: 0 }
```

- [ ] **Step 4: Route all REST and socket auth through the shared verifier**

`middleware/auth.js` becomes async and uses `verifyAuthTokenAgainstUser`.

`server.js` socket handshake uses the same helper, preserving the existing error strings and `socket.user` shape.

- [ ] **Step 5: Replace register/login JWT creation with `signAuthToken`**

Remove direct `jwt.sign` calls from `routes/auth.js`.

- [ ] **Step 6: Verify and commit**

```bash
cd server && npm test
node --check lib/authTokens.js
node --check middleware/auth.js
node --check routes/auth.js
node --check server.js
```

Commit:

```bash
git commit -am "feat: add versioned authentication tokens"
```

---

### Task 3: Add reset-token persistence and lifecycle

**Files:**
- Create: `server/models/PasswordResetToken.js`
- Create: `server/lib/passwordRecovery.js`
- Create: `server/test/passwordRecovery.test.js`

**Interfaces:**
- Produces:
  - `RESET_TOKEN_TTL_MS = 30 * 60 * 1000`
  - `createPasswordResetToken(userId): Promise<{ rawToken: string, expiresAt: Date }>`
  - `consumePasswordResetToken(rawToken): Promise<PasswordResetToken|null>`
  - `invalidatePasswordResetTokens(userId): Promise<void>`

- [ ] **Step 1: Write RED lifecycle tests**

Test that the model defines a TTL index on `expiresAt`, token creation stores only `tokenHash`, and consumption queries on:

```js
{
  tokenHash,
  expiresAt: { $gt: new Date() },
  consumedAt: null
}
```

with an atomic update setting `consumedAt`.

- [ ] **Step 2: Implement the model**

Use a focused schema with `userId`, `tokenHash`, `expiresAt`, `consumedAt`, timestamps, a unique hash index, and:

```js
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

- [ ] **Step 3: Implement lifecycle helpers**

`createPasswordResetToken` first invalidates existing outstanding records for the user, then creates a record with hashed token and 30-minute expiry. `consumePasswordResetToken` uses `findOneAndUpdate` atomically and returns the consumed record.

- [ ] **Step 4: Run tests and commit**

```bash
cd server && npm test
node --check models/PasswordResetToken.js
node --check lib/passwordRecovery.js
```

Commit:

```bash
git add server/models/PasswordResetToken.js server/lib/passwordRecovery.js server/test/passwordRecovery.test.js
git commit -m "feat: add one-time password reset tokens"
```

---

### Task 4: Add SMTP email service and recovery rate limits

**Files:**
- Create: `server/services/email.js`
- Create: `server/middleware/authRateLimits.js`
- Create: `server/test/email.test.js`
- Create: `server/test/authRateLimits.test.js`
- Modify: `server/server.js`

**Interfaces:**
- Produces:
  - `sendPasswordResetEmail(to, resetUrl): Promise<void>`
  - `sendPasswordChangedEmail(to): Promise<void>`
  - `forgotPasswordIpLimiter`
  - `forgotPasswordEmailLimiter`
  - `resetPasswordIpLimiter`

- [ ] **Step 1: Write RED configuration tests**

Test that email configuration reads only the documented SMTP environment names, uses one lazy reusable transporter, and never constructs URLs from request host data. Test rate limiter constants exactly match 10/15 min, 3/15 min, and 10/15 min with `standardHeaders` enabled and legacy headers disabled.

- [ ] **Step 2: Implement provider-neutral Nodemailer service**

Create the transporter from `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASS`. Throw a configuration error when required values are missing. Use `SMTP_FROM` for both mail types.

- [ ] **Step 3: Implement rate limits**

Use `express-rate-limit`. Normalize email using:

```js
function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}
```

The email limiter key includes the client IP plus normalized email, preventing one address from being spammed while avoiding a single global shared bucket.

- [ ] **Step 4: Configure trusted proxy explicitly**

In `server.js`:

```js
if (process.env.TRUST_PROXY) {
  const parsed = Number(process.env.TRUST_PROXY);
  app.set("trust proxy", Number.isFinite(parsed) ? parsed : process.env.TRUST_PROXY);
}
```

Do not assume proxy count when the environment variable is absent.

- [ ] **Step 5: Verify and commit**

```bash
cd server && npm test
node --check services/email.js
node --check middleware/authRateLimits.js
```

Commit:

```bash
git add server/services/email.js server/middleware/authRateLimits.js server/test/email.test.js server/test/authRateLimits.test.js server/server.js
git commit -m "feat: add recovery email and abuse controls"
```

---

### Task 5: Implement forgot/reset routes and password-change revocation

**Files:**
- Modify: `server/routes/auth.js`
- Create: `server/test/authRoutes.test.js`
- Modify: `.github/workflows/storybook-baseline-verify.yml`

**Interfaces:**
- Produces:
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
  - `PATCH /api/auth/change-password` returning `{ message, token }`

- [ ] **Step 1: Write RED route tests**

Cover exact neutral forgot response, trusted `CLIENT_URL`, email failure neutrality, invalid/expired/used reset response equivalence, successful reset password hash + `authVersion` increment, token single-use, and authenticated change returning a fresh JWT.

- [ ] **Step 2: Normalize validation to 8 characters**

Registration, change, and reset validation must use:

```js
.isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
```

Keep login validation as non-empty only.

- [ ] **Step 3: Implement forgot-password**

Record `startedAt = Date.now()`, normalize email, generate/hash token material on every path, find user, create recovery record only when found, build:

```js
const resetUrl = new URL("/reset-password", process.env.CLIENT_URL);
resetUrl.searchParams.set("token", rawToken);
```

Wait until a fixed minimum route duration, return the neutral success response, then schedule email delivery through `setImmediate()` only when a user exists. Log mail failures without changing the committed response.

- [ ] **Step 4: Implement reset-password**

Consume the token atomically, reject invalid/expired/used tokens with one response, bcrypt the new password, increment authVersion, save, invalidate remaining reset records, schedule changed-email notification, and return success without JWT.

- [ ] **Step 5: Upgrade authenticated change-password**

After verifying current password, hash the new password, increment authVersion, save, sign a fresh JWT, invalidate outstanding reset records, schedule changed-email notification, and return:

```json
{ "message": "Password changed.", "token": "<fresh JWT>" }
```

- [ ] **Step 6: Verify CI syntax/test coverage and commit**

Add syntax checks for all new server files and ensure `npm test` runs in CI.

Commit:

```bash
git add server/routes/auth.js server/test/authRoutes.test.js .github/workflows/storybook-baseline-verify.yml
git commit -m "feat: implement secure password recovery routes"
```

---

### Task 6: Enable production forgot-password request UI

**Files:**
- Modify: `client/src/pages/Login.jsx`
- Modify: `client/src/components/ui/shigo-auth-form.tsx`
- Modify: `client/src/components/ui/shigo-auth-page.tsx`
- Create: `client/src/pages/Login.test.jsx`

**Interfaces:**
- Produces login-local modes `login | forgot`, `forgotSent: boolean` presentation state.

- [ ] **Step 1: Write RED client contract tests**

Assert production Login no longer contains `showForgotPassword={false}`, forgot submission POSTs only `{ email }`, and the neutral sent copy is available after success.

- [ ] **Step 2: Upgrade auth form copy/state**

Forgot copy becomes:

```text
Title: Find your way back.
Description: Enter your email and we will send a secure recovery link if an account exists.
Submit: Send recovery link
```

Add a `success` or `submitted` presentation prop that renders the neutral response without exposing account existence.

- [ ] **Step 3: Wire Login mode and request**

Login owns `mode`, switches to forgot when requested, calls `/api/auth/forgot-password` with only `{ email }`, shows the same public message returned by the API, and resets errors when switching modes.

- [ ] **Step 4: Verify and commit**

```bash
cd client && npm test -- --watchAll=false --runInBand
npx tsc --noEmit
```

Commit:

```bash
git add client/src/pages/Login.jsx client/src/pages/Login.test.jsx client/src/components/ui/shigo-auth-form.tsx client/src/components/ui/shigo-auth-page.tsx
git commit -m "feat: enable secure forgot password requests"
```

---

### Task 7: Add the reset-password route and secure token handling

**Files:**
- Create: `client/src/components/ui/shigo-reset-password-form.tsx`
- Create: `client/src/pages/ResetPassword.jsx`
- Create: `client/src/pages/ResetPassword.test.jsx`
- Modify: `client/src/App.jsx`
- Modify: `client/public/index.html`

**Interfaces:**
- Produces public `/reset-password` route and reset form states `default | invalid | success`.

- [ ] **Step 1: Write RED tests**

Test that the page captures `?token=abc` into memory, calls `window.history.replaceState({}, "", "/reset-password")`, blocks password mismatch, sends `{ token, newPassword }`, and never stores the reset token in localStorage/sessionStorage.

- [ ] **Step 2: Add no-referrer policy**

In `client/public/index.html` head:

```html
<meta name="referrer" content="no-referrer" />
```

- [ ] **Step 3: Implement reset form**

Use two password `Input`s, minimum 8, matching validation, Living Sanctuary Motion transitions, an invalid/expired state, success state, and a normal `Sign in` action. Do not automatically authenticate.

- [ ] **Step 4: Implement page token capture**

On first mount, read query token into a `useRef`, immediately replace history to `/reset-password`, then submit the in-memory token to `/api/auth/reset-password`.

- [ ] **Step 5: Add public route**

Import `ResetPassword` in `App.jsx` and add:

```jsx
<Route path="/reset-password" element={<ResetPassword />} />
```

The route remains public regardless of current AuthContext state.

- [ ] **Step 6: Verify and commit**

```bash
cd client && npm test -- --watchAll=false --runInBand
npx tsc --noEmit
npm run build
```

Commit:

```bash
git add client/public/index.html client/src/App.jsx client/src/pages/ResetPassword.jsx client/src/pages/ResetPassword.test.jsx client/src/components/ui/shigo-reset-password-form.tsx
git commit -m "feat: add secure reset password experience"
```

---

### Task 8: Refresh the current session after authenticated password change

**Files:**
- Modify: `client/src/components/Preferences.jsx`
- Modify: `client/src/components/ui/preferences-shell.tsx`
- Modify: `client/src/components/ui/settings-panels.tsx`
- Create: `client/src/components/Preferences.test.jsx`

**Interfaces:**
- Consumes: `PATCH /api/auth/change-password` response `{ message, token }`.

- [ ] **Step 1: Write RED tests**

Assert Preferences stores `res.data.token` into `localStorage.token`, and SecuritySettingsPanel enforces 8 characters.

- [ ] **Step 2: Store the replacement JWT**

Change the PATCH call to capture the response and require a token before declaring success:

```js
const res = await axios.patch(...);
if (res.data?.token) localStorage.setItem("token", res.data.token);
```

- [ ] **Step 3: Normalize UI minimum to 8**

Set `SecuritySettingsPanel` default to 8 and pass `minPasswordLength={8}` from PreferencesContent.

- [ ] **Step 4: Verify and commit**

```bash
cd client && npm test -- --watchAll=false --runInBand
npx tsc --noEmit
```

Commit:

```bash
git add client/src/components/Preferences.jsx client/src/components/Preferences.test.jsx client/src/components/ui/preferences-shell.tsx client/src/components/ui/settings-panels.tsx
git commit -m "feat: keep current session after password change"
```

---

### Task 9: Add canonical recovery Storybook states and visual evidence

**Files:**
- Rewrite: `client/src/stories/AuthForgotPassword.stories.tsx`
- Create: `client/src/stories/AuthResetPassword.stories.tsx`
- Modify: `client/scripts/capture-visual-audit.mjs`
- Modify: `client/src/visual-audit-contract.test.ts`

**Interfaces:**
- Produces canonical stories:
  - `Auth/Forgot Password / Default`
  - `Auth/Forgot Password / Sent`
  - `Auth/Forgot Password / Mobile`
  - `Auth/Reset Password / Default`
  - `Auth/Reset Password / Invalid`
  - `Auth/Reset Password / Success`
  - `Auth/Reset Password / Mobile`

- [ ] **Step 1: Add RED visual-audit contract assertions**

The test must require all seven story targets in the capture source.

- [ ] **Step 2: Make Forgot stories full-canvas Living Sanctuary states**

Use `layout: "fullscreen"`, dark artwork-backed `ShigoAuthPage`, and explicit sent-state args.

- [ ] **Step 3: Add Reset stories**

Render the reset form inside the same artwork + `AuthShell` composition used by Login/Register, with explicit default, invalid, success, and compact mobile states.

- [ ] **Step 4: Extend capture targets**

Add the seven canonical screenshots at desktop 1440x1000 and mobile 390x844 as appropriate. Preserve all existing 37 Living Sanctuary targets.

- [ ] **Step 5: Verify and commit**

```bash
cd client
npm test -- --watchAll=false --runInBand
npx tsc --noEmit
npm run build-storybook
node --check scripts/capture-visual-audit.mjs
```

Commit:

```bash
git add client/src/stories/AuthForgotPassword.stories.tsx client/src/stories/AuthResetPassword.stories.tsx client/scripts/capture-visual-audit.mjs client/src/visual-audit-contract.test.ts
git commit -m "test: add password recovery visual evidence"
```

---

### Task 10: Documentation, full CI, rendered audit, and cleanup

**Files:**
- Modify: `README.md`
- Modify: `.github/workflows/storybook-baseline-verify.yml` if final syntax/test file list requires it

**Interfaces:**
- Produces documented production environment contract and final verified branch head.

- [ ] **Step 1: Update README auth API and environment documentation**

Document:

```text
POST /api/auth/forgot-password
POST /api/auth/reset-password
PATCH /api/auth/change-password -> returns replacement JWT
```

and environment variables:

```text
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
SMTP_FROM
CLIENT_URL
TRUST_PROXY
```

State clearly that real production mail will not send until valid SMTP credentials are configured on the server deployment.

- [ ] **Step 2: Run full engineering CI on the exact branch head**

Required green gates:

```text
Linux Node 22.22
Linux Node 24
Windows Node 24
client tests
TypeScript
production client build
Storybook build
client dependency policy
server tests
server production audit
server syntax checks
Windows launcher smoke test
```

- [ ] **Step 3: Run GitHub visual evidence on the exact same head**

Require zero capture failures. Download the artifact and directly inspect forgot request, sent, mobile, reset default, invalid, success, and mobile frames plus existing Login/Register states.

- [ ] **Step 4: Security invariant inspection**

Verify from final source:

```text
no raw reset token field in Mongo model
no password/reset token in email logs
no Host-derived reset URL
no auto-login after reset
authVersion checked by REST and socket auth
change-password returns and client stores fresh JWT
no-referrer meta exists
8-char policy aligned server/client
```

- [ ] **Step 5: Close the temporary CI PR unmerged**

Keep `main` untouched and do not deploy Render.

- [ ] **Step 6: Final commit if docs changed after verification**

If README changes create a new head, rerun both engineering and visual workflows before claiming completion.

## Self-review result

- Spec coverage: all token lifecycle, enumeration resistance, SMTP, rate limiting, authVersion revocation, trusted URL, client token hygiene, password policy, session refresh, Storybook evidence, deployment docs, and final verification requirements map to Tasks 1-10.
- Placeholder scan: no TBD/TODO implementation gaps remain.
- Type/interface consistency: `signAuthToken`, `verifyAuthTokenAgainstUser`, reset-token helpers, mail functions, route response shapes, and client storage contracts use one name/signature throughout.
- Scope remains one subsystem: authentication recovery and credential-session invalidation. No chat/layout or deployment implementation is included.
