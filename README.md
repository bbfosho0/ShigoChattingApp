---
post_title: "ShigoChat Architecture Blueprint"
author1: "ShigoChat Team"
post_slug: "shigochat-architecture"
microsoft_alias: "shigochat"
featured_image: "https://example.com/images/shigochat-cover.png"
categories: ["architecture"]
tags: ["react", "express", "socket-io", "tailwind"]
ai_note: "Generated with AI assistance"
summary: "Cohesive overview of the ShigoChat sanctuary-inspired chat platform and how to build, run, and extend it."
post_date: "2025-12-01"
---

<!-- markdownlint-disable-next-line MD041 -->
## ShigoChat: Sanctuary-Inspired Chat Experience

ShigoChat is a full-stack conversation sanctuary. The React client delivers a glassmorphic interface, theme-aware transitions, and ambient audio, while the Express + Socket.IO backend keeps messages, presence, and safeguards flowing in real time. Every interaction honors the sanctuary charter: interfaces should breathe, transitions should feel like memory, and security must remain sacred.

## Quick Facts

| Layer | Technology | Notes |
| --- | --- | --- |
| Experience | React 19, React Router 7, Tailwind CSS 3, Framer Motion 12, Lucide Icons, Axios 1.9, Socket.IO Client 4.8, react-hot-toast | CRA runtime with Theme + Auth contexts |
| Services | Node.js 18+, Express 5.1, Socket.IO 4.8, Mongoose 8.15, bcryptjs 3, jsonwebtoken 9, express-validator 7, cors 2.8 | Stateless JWT auth; MongoDB Atlas data store |
| Tooling | npm, dotenv, nodemon, PostCSS, Tailwind plugins | Local dev + build support |

## Sanctuary Principles

- Interfaces must breathe: generous whitespace, gentle glass layers, calm typography.
- Interaction flows mimic memory: Framer Motion eases every view change and toast.
- Emotion leads architecture: ThemeContext, MusicPlayer, and sensory cues stay first-class.
- Security is sacred: validation everywhere, JWT-authenticated sockets, curated CORS.

## Repository Map

```text
.
├─ client/
│  ├─ public/
│  └─ src/
│     ├─ components/        # MessageBubble, MessageInput, MusicPlayer
│     ├─ context/           # AuthContext, ThemeContext
│     ├─ pages/             # SplashScreen, Register, Login, Chatroom
│     └─ App.jsx, index.js, index.css
├─ server/
│  ├─ routes/               # auth.js, messages.js
│  ├─ models/               # User.js, Message.js
│  ├─ middleware/           # auth.js, validators.js
│  └─ server.js
├─ README.md
└─ package.json
```

## Setup Guide

### Prerequisites

- Node.js 18+ with npm
- MongoDB Atlas (or local MongoDB) connection string
- Optional: Render/Railway (backend) and Netlify/Vercel (frontend)

### Install Dependencies

```bash
git clone https://github.com/bbfosho0/ShigoChattingApp.git
cd ShigoChattingApp

cd server && npm install
cd ../client && npm install
```

### Environment Variables

`server/.env`

```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-very-secret-key
CLIENT_URL=https://your-frontend.example.com
```

`client/.env`

```env
REACT_APP_API_URL=http://localhost:5000
```

### Local Development

```bash
# Terminal 1 – API + Socket.IO
cd server
npm run dev

# Terminal 2 – React client
cd client
npm start
```

Visit <http://localhost:3000>. Free-tier MongoDB clusters may take up to a minute to wake.

## Key Features

- **Sanctuary UI**: Glass panels, floating blobs, system-aware light/dark palettes, and gentle motion.
- **Identity & Auth**: bcrypt-backed registration/login with JWTs persisted through `AuthContext`.
- **Realtime Messaging**: Create, edit, delete, and synchronize messages through Socket.IO with optimistic UI.
- **Ambient Emotion Layer**: `MusicPlayer` surfaces curated playlists, remembers state, and responds to theme changes.
- **Accessibility**: Focus-visible states, ARIA hints, keyboard-friendly forms, and reduced motion fallbacks.
- **Security Guardrails**: `express-validator`, ownership checks, rate limiting, and curated CORS origins.

## Architectural Overview

1. **Experience Layer** (`client/src/pages`) renders Splash, Register, Login, and Chatroom with Tailwind + Framer Motion.
2. **State Layer** couples `AuthContext`, `ThemeContext`, and the ambient `MusicPlayer` to keep identity, theme, and audio in sync.
3. **API Layer** exposes `/api/auth` and `/api/messages`, validating every payload before persistence.
4. **Realtime Layer** shares the HTTP server via Socket.IO, authenticating each connection and broadcasting lifecycle events.
5. **Data Layer** stores `User` and `Message` models in MongoDB with timestamps and population helpers.

This flow keeps React unaware of MongoDB specifics, keeps Express ignorant of motion assets, and funnels every realtime change through authenticated sockets.

## Implementation Notes

- **Routing**: `App.jsx` uses React Router 7 with guarded `/chat` access; `<Navigate>` enforces login.
- **Sockets**: `Chatroom.jsx` holds a singleton socket via `useRef`, registers listeners, and disconnects on cleanup.
- **Validation**: `validators.js` contains shared `express-validator` rules consumed by auth/message routers.
- **Security**: `verifyToken` middleware protects every message route and the socket handshake; rate limiting is applied to auth routes.
- **Styling**: Tailwind config extends blur, radii, and gradients to maintain the glass aesthetic; focus states remain high contrast.

## Workflow & Standards

- Start with the sanctuary charter, then open a feature branch per change.
- Extend existing contexts/hooks before adding new global state containers.
- Keep commits small and prefer PRs that touch either `client/` or `server/` unless a contract change requires both.
- Re-use the established socket helper; avoid multiple simultaneous connections per user.
- Never commit `node_modules`, `.env`, or build artifacts—`.gitignore` already guards them.

## Testing Strategy

- **Frontend**: CRA Testing Library scaffolding (`App.test.js`, `setupTests.js`) is ready for context, hook, and component tests.
- **Backend**: Add Supertest suites for `/api/auth` and `/api/messages`, plus Jest unit tests for middleware and validators.
- **Manual**: Before merging, exercise login, theme toggle, message CRUD, ambient audio, and socket reconnection behavior.

## Deployment Notes

- Build the client via `npm run build` and host on Netlify/Vercel or any static host.
- Deploy the server on Render/Railway (Node 18 runtime) with environment variables configured in the dashboard.
- Ensure the deployed backend exposes WebSocket support and that `CLIENT_URL` matches the hosted frontend origin.
- If both tiers share a hostname, serve the CRA build through Express’ static middleware for simplicity.

## Extension Ideas

- Typing indicators and presence pulses that share the existing Socket.IO channel.
- Threaded conversations or reactions layered on top of the `Message` schema.
- Ambient soundscape variations keyed to time of day or theme mode.
- GitHub Actions workflow for lint + test + deploy, keeping sanctuary standards enforced automatically.

## Support & Contributions

1. Open an issue describing the enhancement or fix with sanctuary context (how it impacts emotion, flow, or safety).
2. Fork or branch from `main`, keeping the change scoped to `client/` or `server/` when possible.
3. Add or update tests and documentation, then open a PR that references the issue.
4. Expect reviews focused on sanctuary fidelity, validation coverage, and socket hygiene.

ShigoChat thrives when every change deepens the sanctuary. Build gently, validate rigorously, and keep the experience breathing.

