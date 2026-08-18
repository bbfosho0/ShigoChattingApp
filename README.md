# ShigoChat

ShigoChat is a full-stack real-time chat application built around one shared conversation space called **Quiet Room**. The production application combines a React client, JWT authentication, MongoDB persistence, Socket.IO realtime updates, message CRUD, light/dark themes, account controls, and shared ambient audio.

The `storybook-typescript-baseline` branch contains the **Shigo Midnight** frontend migration plus a Storybook + TypeScript + shadcn-compatible component lab. The production presentation layer now consumes the new TSX system through compatibility-preserving JSX adapters while the existing REST, Socket.IO, context, storage, and routing contracts remain intact.

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
- MongoDB

## Supported Runtime

Use **Node.js 22.12 or newer in the Node 22 line** as the primary development/runtime baseline. The client and server manifests allow Node 22 through Node 24 so CI can verify both supported LTS/runtime families.

Required package-manager baseline:

```text
npm >= 10
```

The final compatibility workflow verifies from committed lockfiles with `npm ci`.

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
- unified login/register presentation
- custom Shigo shader/splash experience
- canonical Quiet Room Storybook compositions
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
| `POST` | `/api/auth/register` | Create a user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |
| `POST` | `/api/auth/forgot-password` | Disabled until a verified reset-token/email challenge exists |
| `PATCH` | `/api/auth/change-password` | Change password for an authenticated user after current-password verification |

Self-service password reset is intentionally unavailable in production. The previous email-only mutation path was removed because password recovery must prove control of a trusted recovery channel before changing credentials.

### Messages

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/messages` | Fetch chat history |
| `POST` | `/api/messages` | Create a message |
| `PATCH` | `/api/messages/:id` | Edit an owned message |
| `DELETE` | `/api/messages/:id` | Delete an owned message |

Socket.IO uses the same JWT identity model as REST and preserves the existing `sendMessage`, `receiveMessage`, `editMessage`, and `deleteMessage` contracts.

## Local Setup

### Environment variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://your-user:your-password@your-cluster.mongodb.net/your-db
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:3000
```

Create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000
```

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

The permanent compatibility gate must use committed lockfiles rather than an uncommitted install state.

Client verification:

```bash
cd client
npm ci
npm test -- --watchAll=false --runInBand
npx tsc --noEmit
npm run build
npm run build-storybook
```

Server verification:

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

Do not claim the branch is ready unless the exact committed head passes the required CI gate.

## Security Notes

Implemented:

- bcrypt password hashing
- JWT-authenticated REST routes
- JWT-authenticated Socket.IO handshakes
- server-side message ownership enforcement
- request validation
- CORS allowlist through `CLIENT_URL`
- authenticated current-password verification for password changes
- unsafe email-only password mutation disabled
- targeted dependency auditing in CI

Still recommended as separate future work:

- verified email/token password-recovery workflow
- authentication rate limiting
- broader automated API integration tests
- secret rotation policy
- intentional migration away from the legacy CRA 5 build toolchain

For frontend design decisions, see [`SHIGO_FRONTEND_MANIFEST.md`](SHIGO_FRONTEND_MANIFEST.md). For automated coding guidance, see [`AGENTS.md`](AGENTS.md).
