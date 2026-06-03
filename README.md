# ShigoChat

ShigoChat is a full-stack real-time chat application built around one shared conversation space called **Quiet Room**. It combines a polished React interface with JWT authentication, MongoDB persistence, Socket.IO updates, message CRUD, light/dark themes, account password management, and synced ambient audio controls.

The project is designed as a production-style portfolio piece: the frontend focuses on responsive product polish and interaction design, while the backend demonstrates practical API design, authentication, database modeling, and realtime event handling.

## Screenshots

The UI is fully themed. The screenshots below show the same core flows in both light and dark modes.

### Main Application

<table>
  <tr>
    <td width="50%">
      <strong>Quiet Room - Light</strong><br />
      <sub>Realtime chat feed with message history, composer, shared room identity, synced ambient controls, and authenticated user actions.</sub>
    </td>
    <td width="50%">
      <strong>Quiet Room - Dark</strong><br />
      <sub>The same production chat workflow rendered in the darker moonlit theme.</sub>
    </td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/chat-room-light.png" alt="ShigoChat Quiet Room chat interface in light mode" /></td>
    <td><img src="docs/screenshots/chat-room-dark.png" alt="ShigoChat Quiet Room chat interface in dark mode" /></td>
  </tr>
  <tr>
    <td width="50%">
      <strong>Preferences - Light</strong><br />
      <sub>Account, appearance, password management, and expanded music controls in a focused settings drawer.</sub>
    </td>
    <td width="50%">
      <strong>Preferences - Dark</strong><br />
      <sub>Synced audio controls and account settings remain consistent across themes.</sub>
    </td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/preferences-light.png" alt="ShigoChat preferences drawer in light mode" /></td>
    <td><img src="docs/screenshots/preferences-dark.png" alt="ShigoChat preferences drawer in dark mode" /></td>
  </tr>
</table>

### Authentication

<table>
  <tr>
    <td width="50%">
      <strong>Login - Light</strong><br />
      <sub>Polished authentication entry point with theme-aware sanctuary visuals.</sub>
    </td>
    <td width="50%">
      <strong>Login - Dark</strong><br />
      <sub>The same auth flow in the dark visual system.</sub>
    </td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/login-light.png" alt="ShigoChat login page in light mode" /></td>
    <td><img src="docs/screenshots/login-dark.png" alt="ShigoChat login page in dark mode" /></td>
  </tr>
  <tr>
    <td width="50%">
      <strong>Forgot Password - Light</strong><br />
      <sub>In-app password reset flow connected to the Express auth API.</sub>
    </td>
    <td width="50%">
      <strong>Forgot Password - Dark</strong><br />
      <sub>Password recovery presented inside the same focused auth card.</sub>
    </td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/forgot-password-light.png" alt="ShigoChat forgot password panel in light mode" /></td>
    <td><img src="docs/screenshots/forgot-password-dark.png" alt="ShigoChat forgot password panel in dark mode" /></td>
  </tr>
  <tr>
    <td width="50%">
      <strong>Register - Light</strong><br />
      <sub>Matching account creation screen with validation-backed API integration.</sub>
    </td>
    <td width="50%">
      <strong>Register - Dark</strong><br />
      <sub>Consistent account creation experience across the full theme system.</sub>
    </td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/register-light.png" alt="ShigoChat register page in light mode" /></td>
    <td><img src="docs/screenshots/register-dark.png" alt="ShigoChat register page in dark mode" /></td>
  </tr>
</table>

### Brand Entry

<table>
  <tr>
    <td width="50%">
      <strong>Splash - Light</strong><br />
      <sub>Brand-forward loading state that routes users into the auth or chat experience.</sub>
    </td>
    <td width="50%">
      <strong>Splash - Dark</strong><br />
      <sub>The moonlit entry screen used for dark-mode sessions.</sub>
    </td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/splash-light.png" alt="ShigoChat splash screen in light mode" /></td>
    <td><img src="docs/screenshots/splash-dark.png" alt="ShigoChat splash screen in dark mode" /></td>
  </tr>
</table>

## Highlights

- **Full-stack chat workflow**: register, log in, fetch message history, send messages, edit/delete owned messages, and receive live updates.
- **Realtime architecture**: Socket.IO shares the Express HTTP server and authenticates socket handshakes with JWTs.
- **MongoDB Atlas persistence**: users and messages are stored with Mongoose models and populated sender metadata.
- **Secure account flows**: bcrypt password hashing, JWT sessions, protected message routes, authenticated password changes, and password reset support.
- **Responsive product UI**: desktop sidebar layout, mobile navigation drawer, calm visual system, polished auth screens, and accessible controls.
- **Synced ambient player**: one shared music state powers both the compact sidebar player and the full settings player.
- **Theme system**: persisted light/dark mode with CSS design tokens and theme-aware components.

## Tech Stack

| Area | Tools |
| --- | --- |
| Frontend | React 19, Create React App, React Router 7, Tailwind CSS 3, Framer Motion, Lucide React |
| Client State | React Context for auth, theme, and shared music playback |
| API Client | Axios, Socket.IO Client |
| Backend | Node.js, Express 5, Socket.IO, Mongoose |
| Auth & Validation | JWT, bcryptjs, express-validator |
| Database | MongoDB Atlas |
| Tooling | npm, dotenv, nodemon, PostCSS |

## Core Features

### Authentication

- Email/password registration and login
- JWT stored client-side for authenticated API calls
- Passwords hashed with bcrypt before persistence
- Protected `/chat` route in the React app
- Authenticated Socket.IO handshake
- Forgot-password reset flow
- Change-password form in Preferences

### Messaging

- One global chat feed presented as **Quiet Room**
- Fetch existing messages from MongoDB
- Send new messages through the REST API
- Broadcast new messages through Socket.IO
- Edit and delete only the signed-in user's own messages
- Realtime edit/delete sync across connected clients
- Date separators and sender metadata in the UI

### Frontend Experience

- Figma-inspired sanctuary visual design
- Responsive desktop and mobile layouts
- Sidebar with room identity, ambient player, theme controls, user summary, and logout
- Preferences drawer for account, theme, and music controls
- Synced music player state across multiple player surfaces
- Light and dark themes with persisted user preference
- Accessible form labels, button labels, and keyboard-friendly composer behavior

## Architecture

```text
React client
  |
  | REST: auth, messages, password flows
  | Socket.IO: realtime message events
  v
Express + Socket.IO server
  |
  | Mongoose models
  v
MongoDB Atlas
```

### Frontend Structure

```text
client/src/
├─ components/
│  ├─ MessageBubble.jsx
│  ├─ MessageInput.jsx
│  ├─ MusicPlayer.jsx
│  └─ Preferences.jsx
├─ context/
│  ├─ AuthContext.js
│  ├─ MusicContext.js
│  └─ ThemeContext.js
├─ pages/
│  ├─ Chatroom.jsx
│  ├─ Login.jsx
│  ├─ Register.jsx
│  └─ SplashScreen.jsx
├─ App.jsx
├─ index.css
└─ index.js
```

### Backend Structure

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

### Socket Events

| Event | Direction | Purpose |
| --- | --- | --- |
| `sendMessage` | client -> server | Notify server that a new message should be broadcast |
| `receiveMessage` | server -> clients | Broadcast a populated new message |
| `editMessage` | both | Sync message edits |
| `deleteMessage` | both | Sync message deletions |

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas connection string, or a local MongoDB URI

### Install

```bash
git clone https://github.com/bbfosho0/ShigoChattingApp.git
cd ShigoChattingApp

cd server
npm install

cd ../client
npm install
```

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

### Run Locally

Terminal 1:

```bash
cd server
npm start
```

Expected backend output:

```text
Server running on port 5000
MongoDB connected
```

Terminal 2:

```bash
cd client
npm start
```

Open:

```text
http://localhost:3000
```

## Deployment Notes

This app is split into two deployable parts:

- **Backend service**: deploy `server/` to Render, Railway, Heroku, or another Node host.
- **Frontend static site**: deploy `client/` to Netlify, Vercel, Render Static Sites, or similar.

Backend environment variables:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
CLIENT_URL=https://your-frontend-domain
```

Frontend environment variable:

```env
REACT_APP_API_URL=https://your-backend-domain
```

The MongoDB connection string belongs only on the backend host. It should never be committed to GitHub or exposed in frontend code.

## Engineering Notes

- The frontend never talks directly to MongoDB. It only talks to the Express API.
- Message ownership is enforced server-side before edits/deletes.
- Socket connections are authenticated with the same JWT used by REST requests.
- The chat view stores the socket instance in a ref to avoid duplicate connections.
- The music player uses a shared React context so multiple UI controls stay synchronized.
- The visual design uses CSS custom properties for consistent light/dark theming.

## Security Considerations

Implemented:

- bcrypt password hashing
- JWT auth
- authenticated message routes
- authenticated socket handshake
- basic request validation
- CORS allowlist using `CLIENT_URL`

Recommended before production hardening:

- Replace the simple forgot-password flow with email-based reset tokens.
- Add rate limiting to auth endpoints.
- Add automated API tests for auth and message ownership.
- Rotate secrets periodically and use host-managed environment variables.
- Remove deprecated Mongoose connection options.

## Validation Checklist

Before shipping changes, verify:

- `npm run build` in `client/`
- Backend starts and logs `MongoDB connected`
- Register/login work against the deployed backend
- Message send/edit/delete work for the signed-in user
- Realtime message updates appear across two browser sessions
- Light/dark mode persists
- Preferences password change works
- Sidebar and Preferences music players stay synchronized

## Why This Project Matters

ShigoChat demonstrates the kind of work expected in real product engineering:

- building and integrating a full-stack feature set
- preserving working application behavior during a visual redesign
- connecting frontend state, backend APIs, realtime events, and persistent data
- handling authentication and ownership checks
- shipping responsive UI that is more than a static mockup
- documenting setup, deployment, and operational boundaries clearly

It is intentionally small in product scope, but complete enough to show end-to-end engineering judgment.
