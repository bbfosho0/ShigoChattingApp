# Final Compatibility Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the completed Shigo Midnight migration against production security, dependency, lifecycle, responsive-interaction, and Node/runtime compatibility issues without changing the intentional CRA + Storybook architecture.

**Architecture:** Keep Create React App 5, React 19, Storybook React Webpack5 with the CRA preset, Tailwind 3.4, mixed JSX/TSX, the existing REST API, and Socket.IO event contracts. Apply only targeted patch/minor dependency upgrades and focused component/runtime fixes, then validate the exact committed lockfiles on supported Node LTS runtimes.

**Tech Stack:** React 19, Create React App 5, Storybook 10.5, TypeScript 5.1.6, Tailwind 3.4, Radix UI, React Router 7, Axios, Express 5, Socket.IO 4, Mongoose 8, JWT, npm lockfile v3.

**Spec:** `SHIGO_FRONTEND_MANIFEST.md`

## Global Constraints

- Keep Create React App and `@storybook/preset-create-react-app`; do not introduce Vite, CRACO, react-app-rewired, or custom TSX loaders.
- Keep Tailwind CSS 3.4; do not introduce Tailwind 4 syntax.
- Keep React Router within major version 7 for this pass; do not migrate to framework/RSC mode.
- Keep mixed JSX/TSX and CRA-safe `baseUrl: "src"` imports.
- Preserve the existing REST message CRUD and Socket.IO event names/payload shapes.
- Preserve ThemeContext and MusicContext behavior.
- Do not run `npm audit fix --force`.
- Treat remaining `react-scripts@5.0.1` transitive audit findings as documented build-tool debt unless a non-breaking in-place remediation exists.
- Production password reset must not permit an unauthenticated caller to set a password with only an email address.
- Verification must use committed lockfiles via `npm ci`, not an uncommitted `npm install` state.

---

### Task 1: Remove the insecure self-service password reset path

**Files:**
- Modify: `server/routes/auth.js`
- Modify: `client/src/pages/Login.jsx`
- Modify: `client/src/components/ui/shigo-auth-form.tsx`
- Modify: `README.md`

**Interfaces:**
- Consumes: existing `/api/auth/login`, `/api/auth/register`, and authenticated `/api/auth/change-password` contracts.
- Produces: production login UI with no insecure forgot-password action; server no longer mutates passwords from an unauthenticated email-only request.

- [ ] **Step 1: Remove production exposure of the unsafe reset action**

Add a presentation flag to `ShigoAuthForm`:

```tsx
export interface ShigoAuthFormProps {
  // existing props...
  showForgotPassword?: boolean;
}
```

Default it to `true` for reusable Storybook/demo coverage, but render the login-mode forgot-password button only when `showForgotPassword` is true. In `Login.jsx`, pass `showForgotPassword={false}` and remove the `ResetPasswordDialog` state/import/handler from production.

- [ ] **Step 2: Disable the unsafe server mutation endpoint**

Remove the password-writing implementation for `POST /api/auth/forgot-password`. Do not replace it with a fake token flow. Until a verified email/token challenge exists, either remove the route entirely or return a non-mutating `501` response with generic copy:

```js
router.post("/forgot-password", (_req, res) => {
  res.status(501).json({
    message: "Self-service password reset is not configured."
  });
});
```

The route must never call `User.findOne`, `bcrypt.hash`, or `user.save()`.

- [ ] **Step 3: Preserve authenticated password change**

Do not modify `/api/auth/change-password` semantics. It must continue requiring JWT authentication, current password verification, and a minimum six-character new password.

- [ ] **Step 4: Update API documentation**

Change README auth documentation so forgot-password is explicitly unavailable until a verified reset-token/email flow is implemented. Remove any text implying that knowing an email is enough to reset an account.

- [ ] **Step 5: Run security-oriented static verification**

Run:

```bash
node --check server/routes/auth.js
```

Expected: exit 0. Then search the route file and confirm the forgot-password handler contains no password mutation.

- [ ] **Step 6: Commit**

```bash
git add server/routes/auth.js client/src/pages/Login.jsx client/src/components/ui/shigo-auth-form.tsx README.md
git commit -m "fix: disable insecure self-service password reset"
```

---

### Task 2: Upgrade fixable direct dependencies and remove accidental package self-links

**Files:**
- Modify: `client/package.json`
- Modify: `client/package-lock.json`
- Modify: `server/package.json`
- Modify: `server/package-lock.json`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: existing React 19/CRA 5/Storybook 10 compatibility shim in `client/.npmrc`.
- Produces: lockfiles with patched direct runtime dependencies while retaining existing major-version architecture.

- [ ] **Step 1: Update client direct packages within compatible majors**

Set or resolve at least these secure lines, using the newest non-breaking versions available in the current registry at implementation time:

```json
"axios": "^1.18.0",
"react-router-dom": "^7.18.2"
```

Keep React 19, react-scripts 5.0.1, Storybook 10.5, TypeScript 5.1.6, and Tailwind 3.4 unchanged. Refresh PostCSS to a patched 8.5 release at or above `8.5.23` while remaining on PostCSS 8.

- [ ] **Step 2: Update server direct packages within compatible majors**

Target the patched lines supported by the existing source APIs:

```json
"express": "^5.2.1",
"express-validator": "^7.3.1",
"jsonwebtoken": "^9.0.3",
"mongoose": "^8.24.2",
"socket.io": "^4.8.3"
```

Keep bcryptjs, cors, dotenv, and nodemon unless the audit specifically requires a compatible patch update.

- [ ] **Step 3: Remove unused production-only test dependency**

`mongodb-memory-server` has no source references in the repository. Remove it from `server/package.json` rather than shipping an unused test database runtime package.

- [ ] **Step 4: Remove accidental package self-references**

Remove these entries:

```text
client/package.json -> "client": "file:"
server/package.json -> "server": "file:"
package.json        -> "shigo-chat": "file:"
```

Do not convert the repository to npm workspaces in this pass.

- [ ] **Step 5: Refresh lockfiles using npm, never by manual lock editing**

Run npm install in the affected package directories on Node 22.22+ and commit the generated lockfiles. If the execution environment cannot write a local checkout, use GitHub Actions to generate and upload the exact lockfiles, then commit those artifact contents unchanged.

- [ ] **Step 6: Re-run npm audits**

Run:

```bash
cd client && npm audit --json
cd ../server && npm audit --omit=dev --json
```

Acceptance:
- no known vulnerable direct Axios version;
- no known vulnerable direct React Router 7 version reported by npm audit;
- no vulnerable direct Mongoose, express-validator, jsonwebtoken, or Socket.IO server version reported by npm audit;
- remaining client findings may be accepted only when their dependency path is locked under legacy `react-scripts@5.0.1` and fixing them would require destructive CRA replacement.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json client/package.json client/package-lock.json server/package.json server/package-lock.json
git commit -m "chore: harden dependency compatibility"
```

---

### Task 3: Fix production interaction and lifecycle regressions

**Files:**
- Modify: `client/src/components/ui/shigo-message.tsx`
- Modify: `client/src/components/ui/profile-menu.tsx`
- Modify: `client/src/components/ui/app-sidebar.tsx`
- Modify: `client/src/components/ui/mobile-nav.tsx`
- Modify: `client/src/components/Preferences.jsx`
- Create: `client/src/components/ui/shigo-message.test.tsx`

**Interfaces:**
- Consumes: `ShigoMessageProps`, `ProfileMenuProps`, `AppSidebarProps`, `MobileNavProps`, ThemeContext, MusicContext.
- Produces: no dead production actions, fresh edit drafts, predictable mobile sheet closing, and authenticated password-change requests.

- [ ] **Step 1: Add regression tests for message actions and draft synchronization**

Create tests using React Testing Library that prove:

```tsx
it("does not render reply or reaction actions without callbacks", () => {
  // render ShigoMessage without onReply/onReact
  // assert Reply and React buttons are absent
});

it("uses updated message content when editing after a prop update", () => {
  // render with content A, rerender same id with content B,
  // open Edit, assert textarea contains B
});
```

Run:

```bash
npm test -- --watchAll=false shigo-message.test.tsx
```

Expected before implementation: at least one assertion fails.

- [ ] **Step 2: Synchronize edit draft safely**

In `ShigoMessage`, add `useEffect` so external message updates refresh `draft` when the component is not actively editing:

```tsx
useEffect(() => {
  if (!editing) setDraft(message.content);
}, [editing, message.content]);
```

- [ ] **Step 3: Do not render dead message actions**

Render Reply only when `onReply` exists, React only when `onReact` exists, and keep Edit/Delete conditional on ownership plus callback availability.

- [ ] **Step 4: Remove dead profile navigation**

In `ProfileMenu`, render the Profile item only when `onProfile` is provided. Production currently has no profile destination.

- [ ] **Step 5: Make collapsed ambient control meaningful**

In collapsed `AppSidebar`, make the Ambient audio icon expand the sidebar via `onCollapsedChange?.(false)` so users can reach the actual ambient controls.

- [ ] **Step 6: Control mobile navigation open state**

Give `MobileNav` internal `open` state and wire `<Sheet open={open} onOpenChange={setOpen}>`. Wrap Preferences and Logout callbacks so the nav sheet closes before opening another surface or leaving the page. Keep theme toggling non-destructive.

- [ ] **Step 7: Guard password-change requests against missing auth tokens**

In `Preferences.jsx`, if no token exists, do not send `Authorization: Bearer null`. Show an authentication-required toast and return before the Axios request.

- [ ] **Step 8: Re-run regression tests and TypeScript**

Run:

```bash
npm test -- --watchAll=false shigo-message.test.tsx
npx tsc --noEmit
```

Expected: both exit 0.

- [ ] **Step 9: Commit**

```bash
git add client/src/components/ui/shigo-message.tsx client/src/components/ui/profile-menu.tsx client/src/components/ui/app-sidebar.tsx client/src/components/ui/mobile-nav.tsx client/src/components/Preferences.jsx client/src/components/ui/shigo-message.test.tsx
git commit -m "fix: harden Shigo interaction states"
```

---

### Task 4: Clean server/runtime compatibility warnings and establish supported Node engines

**Files:**
- Modify: `server/server.js`
- Modify: `client/package.json`
- Modify: `server/package.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: Mongoose 8.24.x, jsonwebtoken 9.0.3, Node 22 LTS.
- Produces: warning-free Mongoose connection options and an explicit supported runtime contract.

- [ ] **Step 1: Remove obsolete Mongoose connection options**

Replace:

```js
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
```

with:

```js
mongoose.connect(process.env.MONGO_URI)
```

The old flags are obsolete in the current MongoDB driver line and generated deprecation warnings locally.

- [ ] **Step 2: Declare supported Node runtime**

Add an engines contract to client and server package manifests:

```json
"engines": {
  "node": ">=22.12 <25",
  "npm": ">=10"
}
```

Use Node 22 as the primary documented runtime. Node 24 is a compatibility test target only after jsonwebtoken 9.0.3 passes the complete server checks.

- [ ] **Step 3: Correct README version/runtime claims**

Update stale documentation:
- TypeScript is 5.1.6, not 5.8;
- Node 20 is no longer the recommended baseline;
- production JSX presentation adapters have been migrated to Shigo Midnight TSX components rather than remaining untouched;
- document CRA 5 as intentional legacy build-tool debt.

- [ ] **Step 4: Verify server syntax**

Run the existing server `node --check` gate across entrypoint, routes, middleware, and models.

- [ ] **Step 5: Commit**

```bash
git add server/server.js client/package.json server/package.json README.md
git commit -m "chore: define supported runtime compatibility"
```

---

### Task 5: Final exact-head compatibility verification

**Files:**
- Modify: `.github/workflows/storybook-baseline-verify.yml`
- Optionally modify: `README.md` only if final audit results require a documented exception.

**Interfaces:**
- Consumes: exact committed package manifests and lockfiles from Tasks 1-4.
- Produces: one reproducible release gate for the exact branch head.

- [ ] **Step 1: Convert the temporary audit workflow into the permanent strict gate**

Primary matrix runtime:

```yaml
strategy:
  matrix:
    node: ["22.22.0", "24.x"]
```

For each runtime, verify client and server from committed lockfiles. If Node 24 exposes an upstream dependency incompatibility that is not present after jsonwebtoken 9.0.3, document it and constrain engines/CI to Node 22 rather than weakening verification.

- [ ] **Step 2: Run client verification from lockfile**

Required commands:

```bash
cd client
npm ci
npm test -- --watchAll=false --runInBand
npx tsc --noEmit
npm run build
npm run build-storybook
```

All must exit 0.

- [ ] **Step 3: Run server verification from lockfile**

Required commands:

```bash
cd server
npm ci
npm audit --omit=dev --json
node --check server.js
node --check routes/auth.js
node --check routes/messages.js
node --check middleware/auth.js
node --check middleware/validators.js
node --check models/User.js
node --check models/Message.js
```

The audit must contain no unresolved high/critical production findings that have a compatible direct dependency fix available.

- [ ] **Step 4: Capture client audit separately from build-tool debt**

Run full client audit and inspect direct vulnerable packages. Do not claim `react-scripts` transitive vulnerabilities are fixed if they remain. Record the residual CRA toolchain risk accurately rather than using `--force`.

- [ ] **Step 5: Re-open the temporary draft PR only as needed for PR-triggered verification, then close it without merging**

Confirm the workflow run is attached to the exact branch head and every required job/step is green.

- [ ] **Step 6: Final diff sanity check**

Compare the final branch to the pre-hardening head and confirm changes are limited to:
- security hardening;
- targeted dependency/lockfile updates;
- compatibility/runtime cleanup;
- interaction regression fixes/tests;
- CI/documentation.

No Vite, Next.js, Tailwind 4, bulk TS conversion, or backend protocol redesign may appear.

- [ ] **Step 7: Commit final workflow/doc adjustments**

```bash
git add .github/workflows/storybook-baseline-verify.yml README.md
git commit -m "ci: enforce final Shigo compatibility gate"
```
