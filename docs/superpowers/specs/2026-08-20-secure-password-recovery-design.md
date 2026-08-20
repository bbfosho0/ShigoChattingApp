# ShigoChat Secure Password Recovery Design

**Status:** Approved architecture formalized for implementation review  
**Branch:** `secure-password-recovery`  
**Baseline:** `1b712b326607ec1741451b98ac0e1d0c55c4b17d`  
**Date:** 2026-08-20

## 1. Purpose

Implement a production-grade self-service password recovery flow for ShigoChat without reintroducing the unsafe email-only password mutation that was intentionally disabled.

The recovery flow must prove control of the account's email address before changing credentials, resist account enumeration and automated abuse, expire and consume reset credentials safely, revoke old authenticated sessions after a reset, and fit the existing Shigo Midnight / Living Sanctuary auth experience.

## 2. Current state

The current server exposes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`, currently returning `501`
- `PATCH /api/auth/change-password`, authenticated and current-password protected

The current `User` model contains only `username`, `email`, and a bcrypt password hash.

The client already has a `forgot` mode in `ShigoAuthForm`, but production Login passes `showForgotPassword={false}` because the secure backend does not yet exist.

The authenticated JWT currently contains the user id only, so changing a password does not revoke previously issued JWTs until they expire.

## 3. Security requirements

The implementation will follow these rules:

1. Password-reset requests return the same response whether or not an account exists.
2. Public response timing is deliberately normalized so a missing account does not return through a visibly faster path.
3. Reset tokens are opaque random values generated with Node's cryptographically secure `crypto` APIs.
4. Only a SHA-256 hash of a reset token is stored in MongoDB. The raw token exists only in the reset URL sent to the user.
5. Tokens are linked to one user, expire after 30 minutes, and are single use.
6. A new reset request invalidates that user's previous outstanding reset tokens.
7. Recovery endpoints are rate limited.
8. Reset URLs are built only from the configured trusted client origin, never from the incoming `Host` header.
9. Password reset requires a new password and confirmation in the client. The server enforces the same minimum password policy independently.
10. Successful recovery does not automatically log the user in.
11. Successful recovery invalidates all previously issued authentication tokens.
12. Existing authenticated password changes also revoke previous sessions while returning a fresh token to the current session so the person changing their password is not unexpectedly logged out.
13. Email content never contains a password.
14. The reset page removes the raw token from the visible URL/history as soon as the client has captured it in memory.
15. The application uses a `no-referrer` policy so reset-token URLs are not leaked through browser referrer headers.
16. Recovery remains usable with reduced motion and keyboard-only navigation.

## 4. Chosen architecture

### 4.1 Opaque database-backed reset tokens

Use a dedicated `PasswordResetToken` Mongoose model rather than JWT reset links.

Fields:

```text
userId      ObjectId, required, indexed
tokenHash   String, required, unique
expiresAt   Date, required, TTL indexed
consumedAt  Date, nullable
createdAt   Date
```

A reset request generates 32 random bytes and encodes them as hex. The raw token is sent in the email. `sha256(rawToken)` is stored in MongoDB.

The TTL index is cleanup only. Reset authorization always explicitly checks `expiresAt > now` and `consumedAt == null`.

The reset route atomically marks a matching token consumed before changing the password, preventing reuse. If the subsequent password update unexpectedly fails, the user can request another reset token.

### 4.2 Provider-neutral SMTP email transport

Add Nodemailer and a small `server/services/email.js` owner.

SMTP means **Simple Mail Transfer Protocol**. It is the standard protocol an application uses to hand outbound email to an email server/provider.

ShigoChat will not hard-code a provider. The service reads:

```text
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
SMTP_FROM
CLIENT_URL
```

This allows Resend SMTP, Postmark, SendGrid, Amazon SES, Gmail for development, or another compatible provider without changing application code.

Create one reusable Nodemailer transporter rather than one connection object per message.

Email responsibilities:

- `sendPasswordResetEmail(to, resetUrl)`
- `sendPasswordChangedEmail(to)`

Reset URLs use `CLIENT_URL` only and HTTPS in production.

If SMTP is not configured, the server logs a configuration error and recovery email delivery is unavailable until deployment variables are provided. No credentials are committed to the repository.

### 4.3 Recovery request endpoint

`POST /api/auth/forgot-password`

Input:

```json
{ "email": "person@example.com" }
```

Behavior:

1. Validate and trim email.
2. Apply IP and normalized-email request rate limits.
3. Search for the account.
4. Generate and hash random-token material on both found and not-found paths so the missing-account path does not skip the security work entirely.
5. If an account is found:
   - delete or invalidate previous outstanding reset tokens for the user
   - create a fresh token record
   - construct a trusted `CLIENT_URL/reset-password?token=...` URL
   - schedule reset-email delivery after the neutral public response has been committed
6. Hold the public response until a small minimum response duration has elapsed so missing accounts do not return through an obviously faster path.
7. Return the same neutral response for existent and non-existent accounts:

```json
{
  "message": "If an account exists for that email, a password reset link has been sent."
}
```

Email-delivery failures are logged server-side and never change this public response. This keeps delivery-provider latency and account existence out of the request timing channel. A future multi-instance/high-volume deployment can replace the post-response dispatch with a durable shared job queue without changing the route contract.

### 4.4 Reset endpoint

`POST /api/auth/reset-password`

Input:

```json
{
  "token": "<opaque reset token>",
  "newPassword": "..."
}
```

Behavior:

1. Rate limit reset attempts.
2. Validate the password policy.
3. SHA-256 hash the supplied token.
4. Atomically consume a matching unexpired, unconsumed token.
5. Load the user.
6. Hash the new password with bcrypt.
7. Increment `authVersion`.
8. Save the user.
9. Invalidate any other outstanding recovery tokens for the user.
10. Send a password-changed notification email.
11. Return success without issuing a login JWT.

Invalid, expired, or already-used reset tokens return the same invalid-token response.

### 4.5 Authentication versioning and session revocation

Add to `User`:

```text
authVersion: Number, default 0
```

Every new login/register JWT includes the user's current authentication version:

```json
{
  "_id": "...",
  "authVersion": 0
}
```

Create one shared `signAuthToken(user)` helper so register, login, and authenticated password change cannot drift.

REST `verifyToken` becomes asynchronous:

1. verify JWT signature/expiry
2. load the user auth version
3. reject the token if its `authVersion` differs from the current user value
4. attach the verified identity to `req.user`

Socket.IO authentication performs the same comparison during handshake.

A recovery reset increments `authVersion`, invalidating every existing JWT.

Authenticated `PATCH /change-password` also increments `authVersion`, but returns a newly signed JWT carrying the new version. The Preferences client replaces `localStorage.token` with that returned token. Other sessions become invalid immediately while the current password-change session continues normally.

### 4.6 Password policy normalization

The Shigo UI currently communicates an 8-character minimum for new accounts while server password-change validation accepts 6.

The implementation standardizes new password creation/change/reset to a minimum of 8 characters at both client and server validation boundaries.

This does not attempt a larger password-policy redesign.

## 5. Abuse controls

Add `express-rate-limit` to the server.

Initial recovery request limits:

- per IP: 10 requests per 15 minutes
- per normalized email identifier: 3 requests per 15 minutes

Initial reset submission limit:

- per IP: 10 attempts per 15 minutes

The cryptographically strong reset token remains the primary authorization secret.

Use modern `RateLimit-*` response headers and disable legacy `X-RateLimit-*` headers.

The current deployment is effectively single-instance, so the default in-memory limiter store is sufficient for this scope. If ShigoChat later runs multiple API instances, the limiter store must move to a shared backend so limits cannot be bypassed across instances.

Because Render sits behind a reverse proxy, proxy trust must be explicit rather than guessed. Add a deployment variable such as:

```text
TRUST_PROXY=1
```

and configure Express from that value so IP-based rate limiting sees the real client address.

Rate limiting applies equally to valid and invalid account identifiers, so it does not become an account-enumeration oracle.

## 6. Client experience

### 6.1 Forgot-password request

Production Login will enable `showForgotPassword`.

The existing auth surface will switch between `login` and `forgot` mode locally instead of creating a disconnected visual page.

Forgot mode:

- email input
- `Send recovery link` action
- neutral success state
- `Back to sign in`
- Living Sanctuary motion vocabulary
- no account-existence disclosure

The current preview copy is replaced with production copy.

### 6.2 Reset-password route

Add public client route:

```text
/reset-password
```

The email link initially includes the raw token as a query parameter.

On mount the page:

1. reads `token`
2. stores it in component memory only
3. immediately replaces browser history with `/reset-password`, removing the secret from the visible URL

The client application also declares a `no-referrer` policy in its document metadata so the original token-bearing navigation cannot be leaked as a referrer to unrelated destinations.

The form includes:

- new password
- confirm new password
- 8-character minimum guidance
- invalid/expired token state
- loading state
- reset success state
- return-to-sign-in action

After success the user signs in normally. There is no automatic authentication.

### 6.3 Auth presentation

The reset page uses the same artwork-backed Living Sanctuary auth shell as Login/Register so recovery feels like part of ShigoChat rather than an admin utility.

## 7. Email content

### Reset email

Subject example:

```text
Reset your ShigoChat password
```

Content:

- states that a reset was requested
- includes one clear HTTPS reset link
- states the 30-minute expiry
- says to ignore the message if the recipient did not request it
- never includes the user's password

### Password-changed email

Sent after recovery or authenticated password change.

Content:

- confirms that the password changed
- advises the user to request another reset if the change was unexpected
- contains no password or authentication token

## 8. Files and responsibilities

Expected new server owners:

```text
server/models/PasswordResetToken.js
server/services/email.js
server/lib/authTokens.js
server/middleware/authRateLimits.js
```

Expected modified server files:

```text
server/models/User.js
server/routes/auth.js
server/middleware/auth.js
server/server.js
server/package.json
server/package-lock.json
```

Expected client additions:

```text
client/src/pages/ResetPassword.jsx
client/src/components/ui/shigo-reset-password-form.tsx
```

Expected client modifications:

```text
client/src/pages/Login.jsx
client/src/components/ui/shigo-auth-form.tsx
client/src/App.jsx
client/src/components/Preferences.jsx
client/public/index.html
```

Storybook should gain canonical recovery request/reset states rather than mixing them into generic reference stories.

## 9. Testing strategy

### Server

Introduce automated server tests for the recovery/auth helpers and route behavior.

Required cases:

- forgot-password returns identical success message for existing and missing account
- token generator produces high-entropy opaque token and stores only hash
- expired token rejected
- consumed token rejected
- valid token changes password
- valid token cannot be reused
- successful reset increments `authVersion`
- old JWT rejected after reset
- current password change returns a fresh JWT and invalidates old JWT
- rate limiter is mounted on recovery endpoints
- reset URL uses configured `CLIENT_URL`, not request Host
- email failure does not expose whether the account exists
- missing-account and existing-account requests both pass through the response-normalization path

Use dependency boundaries so tests do not require sending real email.

### Client

Required cases:

- production Login exposes Forgot password
- forgot submission sends only email
- neutral success UI
- reset route captures token then removes it from browser URL/history
- document referrer policy is `no-referrer`
- password confirmation mismatch blocks submit
- invalid/expired token state renders correctly
- successful reset directs the user back to normal sign-in
- authenticated password change stores returned replacement JWT

### Visual evidence

Add canonical Storybook/browser captures for:

- forgot-password request desktop dark
- forgot-password sent desktop dark
- forgot-password mobile dark
- reset-password default desktop dark
- reset-password invalid/expired
- reset-password success
- reset-password mobile

The existing visual evidence workflow remains the sign-off mechanism.

## 10. Deployment configuration

The implementation can be fully tested without real email credentials by mocking the mail service.

Actual production delivery requires configuring the server deployment with:

```text
SMTP_HOST=<provider smtp host>
SMTP_PORT=<provider port>
SMTP_SECURE=true|false
SMTP_USER=<provider username>
SMTP_PASS=<provider password/api credential>
SMTP_FROM="ShigoChat <no-reply@your-domain>"
CLIENT_URL=https://shigochat.onrender.com
TRUST_PROXY=1
```

For common SMTP ports, port 465 normally uses `SMTP_SECURE=true`; port 587 normally starts unencrypted and upgrades with STARTTLS, so `SMTP_SECURE=false`.

No SMTP password, API key, reset token, or other secret belongs in git.

## 11. Explicit non-goals

This feature does not include:

- SMS recovery
- security questions
- MFA recovery
- account-email verification redesign
- a general-purpose background-job queue
- changing the chat data model
- changing Quiet Room layout
- deploying or modifying Render itself without separate deployment authorization/credentials

## 12. Acceptance criteria

The feature is complete when:

1. A registered user can request a recovery email without the public API revealing whether the email exists through response content or an obvious fast-path timing difference.
2. A configured SMTP provider receives and delivers an opaque, expiring reset link.
3. The link opens a Shigo-branded reset screen.
4. The raw reset token is removed from visible browser history after capture and is protected by a no-referrer policy.
5. A valid token can change the password exactly once within 30 minutes.
6. Expired, invalid, and consumed tokens cannot change credentials.
7. A reset invalidates all older JWTs and requires normal login afterward.
8. Authenticated password changes invalidate other sessions but refresh the current session token.
9. Recovery endpoints are rate limited.
10. Production Login exposes recovery only after this secure flow exists.
11. Server/client tests, TypeScript, production build, Storybook, Windows launcher, audits, and final browser visual evidence are green on the exact branch head.
