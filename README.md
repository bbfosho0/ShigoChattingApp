# ShigoChat

ShigoChat is a full-stack real-time chat application built around one shared conversation space called **Quiet Room**. The production application combines a React client, JWT authentication, MongoDB persistence, Socket.IO realtime updates, message CRUD, light/dark themes, account controls, shared ambient audio, and secure email-based password recovery.

The `storybook-typescript-baseline` branch contains the **Shigo Midnight** frontend migration plus a Storybook + TypeScript + shadcn-compatible component lab. The production presentation layer consumes the TSX system through compatibility-preserving JSX adapters while the existing REST, Socket.IO, context, storage, and routing contracts remain intact.

Live site: https://shigochat.onrender.com/

## Architecture

### Client

- React 19
- Create React App 5
- React Router 7
- Storybook 10.5 using React Webpack5 + `@storybook/preset-create-react-app`
- TypeScript 5.1.6 with mixed JS/TS support
- Tailwind CSS 3.4
- Radix UI primitives
- Lucide React
- Framer Motion and GSAP
- Axios and Socket.IO Client

### Server

- Node.js
- Express 5
- Socket.IO 4
- Mongoose 8
- JWT + bcryptjs
- express-validator
- express-rate-limit
- Nodemailer
- MongoDB

## Supported Runtime

Use **Node.js 22.12 or newer in the Node 22 line** as the primary development/runtime baseline. The client and server manifests allow Node 22 through Node 24 so CI can verify both supported LTS/runtime families.

Required package-manager baseline:

```text
npm >= 10
```

The compatibility workflow verifies from committed lockfiles with `npm ci`.

## Shigo Midnight Frontend

The canonical design and migration decisions live in:

```text
SHIGO_FRONTEND_MANIFEST.md
```

The implementation includes:

- semantic light/dark design tokens
- typography, spacing, radius, elevation, motion, and Lucide icon foundations
- reusable Radix-backed UI primitives
- desktop sidebar and collapsed navigation
- mobile Sheet navigation
- presence-aware profile surfaces
- composable message, conversation, composer, attachment, and emoji UI
- account, appearance, ambient, and security preferences
- unified login/register/recovery presentation
- custom Shigo shader/splash experience
- canonical Quiet Room and authentication Storybook compositions
- production wiring that preserves the existing application contracts

## Storybook

From `client/`:

```bash
npm ci
npm run storybook
```

Storybook runs at:

```text
http://localhost:6006
```

Build the static Storybook bundle with:

```bash
npm run build-storybook
```

## Repository Guardrails

This branch intentionally does **not** use:

- Vite
- `@storybook/react-vite`
- `@vitejs/plugin-react`
- custom TSX loaders
- CRACO
- `react-app-rewired`
- arbitrary webpack aliases
- Next.js
- Tailwind CSS 4
- bulk JSX-to-TSX conversion

Create React App 5 is retained intentionally as compatibility debt for this branch. It has an old dependency tree and stale TypeScript peer metadata, so `client/.npmrc` contains a repository-local peer-resolution compatibility shim. Do not interpret residual vulnerabilities trapped exclusively below `react-scripts@5.0.1` as permission to run `npm audit fix --force`; replacing CRA must be a deliberate migration with its own verification plan.

## Import Convention

TypeScript uses:

```json
"baseUrl": "src"
```

Use CRA-safe absolute imports:

```tsx
import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { useScreenSize } from "hooks/use-screen-size";
```

Do not introduce `@/...` aliases unless the build system is intentionally migrated.

## API Overview

### Authentication

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a user and receive a JWT |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `POST` | `/api/auth/forgot-password` | Request a neutral, email-based recovery challenge |
| `POST` | `/api/auth/reset-password` | Consume a one-time recovery token and set a new password |
| `PATCH` | `/api/auth/change-password` | Change an authenticated user's password and return a replacement JWT |

Password recovery uses opaque 32-byte random tokens. Only SHA-256 token hashes are stored in MongoDB. Recovery tokens expire after 30 minutes and are consumed atomically once. Forgot-password responses intentionally do not reveal whether an account exists.

Successful password reset increments the user's authentication version, revoking previously issued REST and Socket.IO JWT sessions. Recovery does **not** automatically log the user in. Authenticated password change also revokes older sessions, but returns a replacement JWT so the current client can remain signed in.

### Messages

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/messages` | Fetch chat history |
| `POST` | `/api/messages` | Create a message |
| `PATCH` | `/api/messages/:id` | Edit an owned message |
| `DELETE` | `/api/messages/:id` | Delete an owned message |

Socket.IO uses the same version-aware JWT identity model as REST and preserves the existing `sendMessage`, `receiveMessage`, `editMessage`, and `deleteMessage` contracts.

## Local Setup

### Environment variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://your-user:your-password@your-cluster.mongodb.net/your-db
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:3000

# SMTP provider configuration for recovery/security email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=ShigoChat <no-reply@example.com>

# Optional. Configure only to match the trusted reverse-proxy topology.
# Example for one trusted proxy hop:
TRUST_PROXY=1
```

Create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

`CLIENT_URL` is the trusted origin used for CORS and recovery-link generation. Password reset URLs are never derived from the request `Host` header.

Real recovery email will not send until valid `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` values are configured on the deployed server. `SMTP_SECURE` controls TLS mode for the selected provider. Do not commit SMTP credentials, JWT secrets, database credentials, or recovery tokens.

`TRUST_PROXY` is optional and must reflect the deployment's actual reverse-proxy topology. Leaving it unset keeps Express's default direct-client behavior.

### Install from committed lockfiles

```bash
git clone https://github.com/bbfosho0/ShigoChattingApp.git
cd ShigoChattingApp
git switch storybook-typescript-baseline

cd server
npm ci

cd ../client
npm ci
```

### Run

Backend:

```bash
cd server
npm start
```

Frontend:

```bash
cd client
npm start
```

Storybook:

```bash
cd client
npm run storybook
```

## Verification Contract

The permanent compatibility gate uses committed lockfiles rather than an uncommitted install state.

Client verification:

```bash
cd client
npm ci
npm test -- --watchAll=false --runInBand
npx tsc --noEmit
npm run build
npm run build-storybook
node --check scripts/capture-visual-audit.mjs
```

Server verification:

```bash
cd server
npm ci
npm test
npm audit --omit=dev
node --check server.js
node --check routes/auth.js
node --check routes/messages.js
node --check middleware/auth.js
node --check middleware/authRateLimits.js
node --check middleware/validators.js
node --check lib/authTokens.js
node --check lib/passwordRecovery.js
node --check services/email.js
node --check models/User.js
node --check models/Message.js
node --check models/PasswordResetToken.js
```

Do not claim the branch is ready unless the exact committed head passes the required CI gate and the visual-evidence workflow captures every required Storybook state without failures.

## Security Notes

Implemented:

- bcrypt password hashing
- versioned JWT-authenticated REST routes
- versioned JWT-authenticated Socket.IO handshakes
- password-triggered session revocation through `authVersion`
- server-side message ownership enforcement
- request validation
- CORS allowlist through `CLIENT_URL`
- authenticated current-password verification for password changes
- fresh current-session JWT after authenticated password change
- opaque, hash-only, one-time password reset tokens with a 30-minute TTL
- account-enumeration-resistant forgot-password responses and minimum route timing
- recovery rate limiting per IP and normalized email
- trusted `CLIENT_URL` recovery-link generation
- provider-neutral SMTP recovery and password-changed notifications
- reset-token removal from browser history and a `no-referrer` document policy
- eight-character minimum password policy aligned across registration, reset, and authenticated change flows
- targeted dependency auditing and server regression tests in CI

Still recommended as separate future work:

- secret rotation policy
- broader abuse monitoring/alerting around authentication endpoints
- intentional migration away from the legacy CRA 5 build toolchain

For frontend design decisions, see [`SHIGO_FRONTEND_MANIFEST.md`](SHIGO_FRONTEND_MANIFEST.md). For automated coding guidance, see [`AGENTS.md`](AGENTS.md).
