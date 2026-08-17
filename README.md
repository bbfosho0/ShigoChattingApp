# ShigoChat

ShigoChat is a full-stack real-time chat application built around one shared conversation space called **Quiet Room**. The production app combines a React client, JWT authentication, MongoDB persistence, Socket.IO realtime updates, message CRUD, light/dark themes, account controls, and synced ambient audio.

This repository also contains a clean **Storybook + TypeScript + shadcn-compatible UI component lab** on the `storybook-typescript-baseline` branch. That branch is intentionally incremental: the existing Create React App application stays intact while new TS/TSX components are integrated and tested one at a time.

Live site: https://shigochat.onrender.com/

## Repository Tracks

### Production application

The existing ShigoChat app remains a Create React App project with the original JSX application structure and Express backend.

### Storybook TypeScript baseline

Branch: `storybook-typescript-baseline`

Purpose:

- add Storybook without replacing CRA
- allow JSX and TSX to coexist
- support shadcn-style component organization
- integrate 21st.dev and other TSX components incrementally
- keep each component independently reviewable and recoverable
- avoid bundler hacks, bulk conversions, and unrelated redesign changes

The branch uses **Storybook React Webpack5 + the CRA preset**, not Vite.

## Screenshots

The production UI supports light and dark themes.

### Main Application

| Light | Dark |
| --- | --- |
| ![Quiet Room light](docs/screenshots/chat-room-light.png) | ![Quiet Room dark](docs/screenshots/chat-room-dark.png) |
| ![Preferences light](docs/screenshots/preferences-light.png) | ![Preferences dark](docs/screenshots/preferences-dark.png) |

### Authentication

| Light | Dark |
| --- | --- |
| ![Login light](docs/screenshots/login-light.png) | ![Login dark](docs/screenshots/login-dark.png) |
| ![Forgot password light](docs/screenshots/forgot-password-light.png) | ![Forgot password dark](docs/screenshots/forgot-password-dark.png) |
| ![Register light](docs/screenshots/register-light.png) | ![Register dark](docs/screenshots/register-dark.png) |

## Highlights

- **Full-stack chat workflow**: register, log in, fetch message history, send messages, edit/delete owned messages, and receive live updates.
- **Realtime architecture**: Socket.IO shares the Express HTTP server and authenticates socket handshakes with JWTs.
- **MongoDB persistence**: users and messages are stored with Mongoose models.
- **Responsive product UI**: desktop and mobile layouts, light/dark themes, polished auth flows, preferences, and shared ambient audio state.
- **Storybook component lab**: isolated TSX stories for new UI primitives, forms, interactions, hooks, and motion experiments.
- **Mixed JSX + TSX migration path**: existing JSX stays untouched while new TypeScript components can be added safely.

## Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | React 19, Create React App, React Router 7 |
| Styling | Tailwind CSS 3, CSS custom properties, `tailwindcss-animate` |
| UI | shadcn-compatible structure, Radix UI primitives, Lucide React, CVA |
| Motion | Framer Motion, GSAP |
| Storybook | Storybook 10.5, React Webpack5, CRA preset, Docs, a11y |
| TypeScript | TypeScript 5.8 with mixed JS/TS support |
| API Client | Axios, Socket.IO Client |
| Backend | Node.js, Express 5, Socket.IO, Mongoose |
| Auth | JWT, bcryptjs, express-validator |
| Database | MongoDB Atlas |

## UI Component Lab

### Canonical paths

The Storybook branch uses these locations:

```text
client/
├─ .storybook/
│  ├─ main.js
│  └─ preview.js
├─ components.json
├─ tailwind.config.js
├─ tsconfig.json
└─ src/
   ├─ components/
   │  └─ ui/              # reusable shadcn-style UI components
   ├─ hooks/              # reusable React hooks
   ├─ lib/
   │  └─ utils.ts         # cn() helper
   ├─ stories/            # Storybook stories
   └─ index.css           # global styles + semantic theme tokens
```

The default UI component path is:

```text
client/src/components/ui
```

The default global style entry is:

```text
client/src/index.css
```

Hooks belong in:

```text
client/src/hooks
```

### Import convention

This repository is still Create React App. To avoid custom webpack aliasing, TypeScript uses:

```json
"baseUrl": "src"
```

Use CRA-safe absolute imports:

```tsx
import { Button } from "components/ui/button";
import { cn } from "lib/utils";
import { useScreenSize } from "hooks/use-screen-size";
```

Do **not** introduce `@/...` imports unless the entire build system is intentionally migrated and verified. The current branch deliberately avoids that migration.

### Current integrated UI

The baseline currently includes:

- Avatar
- Button with compatibility-preserving variants, icon modes, and loading state
- Card
- Checkbox
- Dropdown Menu
- Fluid Menu
- Input
- Label
- Login Form + interactive WebGL smokey background
- Magnetic Cursor
- Messaging Conversation
- Scroll Area
- Separator
- Sign Up Block
- `useScreenSize` responsive hook

Dedicated demos and Storybook stories live beside or under `src/stories/` so components can be inspected independently from the production app.

## Storybook

From `client/`:

```bash
npm install
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

### Story conventions

New integrations should normally receive a dedicated story:

```text
src/stories/<ComponentName>.stories.tsx
```

Use a stable title such as:

```tsx
title: "Components/Fluid Menu"
```

When useful, include both light and dark stories.

## Integrating a New shadcn or 21st.dev Component

1. **Inspect first.** Check whether required primitives and packages already exist.
2. **Do not replace shared primitives blindly.** Extend existing `Button`, `Card`, `Input`, etc. only when backward compatibility can be preserved.
3. **Keep native TSX.** Do not rewrite TypeScript components to JSX to work around parsing issues.
4. **Adapt imports to CRA.** Replace `@/components/ui/...` with `components/ui/...` and `@/lib/utils` with `lib/utils`.
5. **Avoid framework contamination.** Do not install Next.js just because a copied component imports `next/link`; adapt it to the current React Router or plain anchor behavior instead.
6. **Respect Tailwind 3.** Do not paste Tailwind 4 `@theme` or `@import "tailwindcss"` blocks into this branch.
7. **Reuse semantic tokens.** Prefer `bg-background`, `text-foreground`, `border-border`, `bg-card`, `text-muted-foreground`, and related theme tokens.
8. **Create a uniquely named demo.** Use `<component>-demo.tsx` rather than a generic `demo.tsx` that another integration can overwrite.
9. **Add Storybook coverage.** Include meaningful states and interactions.
10. **Verify before merging.** Run the full client verification commands below.

## Architectural Guardrails

The `storybook-typescript-baseline` branch intentionally does **not** use:

- Vite
- `@storybook/react-vite`
- `@vitejs/plugin-react`
- custom esbuild TSX loaders
- CRACO
- `react-app-rewired`
- arbitrary webpack alias hacks
- Next.js
- Tailwind CSS 4
- bulk JSX-to-TSX conversion

Those changes are outside the purpose of this branch and should not be introduced as side effects of component integration.

## Frontend Structure

The production application and the component lab coexist:

```text
client/src/
├─ components/
│  ├─ ui/                 # new reusable TSX component lab
│  ├─ MessageBubble.jsx   # existing production components
│  ├─ MessageInput.jsx
│  ├─ MusicPlayer.jsx
│  └─ Preferences.jsx
├─ hooks/
├─ lib/
├─ context/
│  ├─ AuthContext.js
│  ├─ MusicContext.js
│  └─ ThemeContext.js
├─ pages/
│  ├─ Chatroom.jsx
│  ├─ Login.jsx
│  ├─ Register.jsx
│  └─ SplashScreen.jsx
├─ stories/
├─ App.jsx
├─ index.css
└─ index.js
```

## Backend Structure

```text
server/
├─ middleware/
│  ├─ auth.js
│  └─ validators.js
├─ models/
│  ├─ Message.js
│  └─ User.js
├─ routes/
│  ├─ auth.js
│  └─ messages.js
└─ server.js
```

## API Overview

### Auth

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a new user |
| `POST` | `/api/auth/login` | Log in and receive JWT |
| `POST` | `/api/auth/forgot-password` | Reset a password for an account email |
| `PATCH` | `/api/auth/change-password` | Change password for authenticated user |

### Messages

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/messages` | Fetch chat history |
| `POST` | `/api/messages` | Create a message |
| `PATCH` | `/api/messages/:id` | Edit an owned message |
| `DELETE` | `/api/messages/:id` | Delete an owned message |

## Local Setup

### Prerequisites

- Node.js 20 recommended for the Storybook verification workflow
- npm
- MongoDB connection string for backend development

### Install

```bash
git clone https://github.com/bbfosho0/ShigoChattingApp.git
cd ShigoChattingApp

git switch storybook-typescript-baseline

cd server
npm install

cd ../client
npm install
```

`npm install` is important after pulling component integrations because dependency changes should regenerate `client/package-lock.json` through npm rather than by hand.

### Environment Variables

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

### Run the production app locally

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

## Verification

Before considering a component integration complete, run from `client/`:

```bash
npm install
npx tsc --noEmit
npm run build
npm run build-storybook
```

For interactive inspection:

```bash
npm run storybook
```

The branch also contains `.github/workflows/storybook-baseline-verify.yml`, which is intended to run dependency installation, TypeScript checking, the CRA production build, and the Storybook static build.

Do not claim a component is fully verified unless these commands, or the equivalent CI workflow, actually complete successfully.

## Engineering Notes

- The frontend never talks directly to MongoDB. It only talks to the Express API.
- Message ownership is enforced server-side before edits/deletes.
- Socket connections use the same JWT model as REST requests.
- Existing JSX is valid and should remain JSX unless a targeted migration is intentionally requested.
- New reusable UI work should prefer TypeScript and the `components/ui` structure.
- Shared primitives should remain backward compatible with existing stories and production usage.
- CSS custom properties in `src/index.css` are the source of truth for semantic light/dark tokens.

## Security Considerations

Implemented:

- bcrypt password hashing
- JWT authentication
- authenticated message routes
- authenticated Socket.IO handshake
- request validation
- CORS allowlist through `CLIENT_URL`

Recommended before production hardening:

- email-based reset tokens for forgot-password
- rate limiting on authentication endpoints
- automated API tests for auth and message ownership
- periodic secret rotation

## Why This Project Matters

ShigoChat demonstrates both end-to-end product engineering and controlled frontend evolution: a working full-stack realtime application can continue shipping while a modern TypeScript component system is introduced incrementally, visibly, and without destabilizing the original architecture.

For automated coding guidance, see [`AGENTS.md`](AGENTS.md).
