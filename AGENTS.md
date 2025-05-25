# AGENTS.md — ShigoChat

---

## 1. Philosophy: The Soul of ShigoChat

> “This is not code—it is conversation. Not layout—it is memory. Not UI—it is emotion.”

ShigoChat is a living sanctuary. Every line, every div, every schema is **feeling imbued into function**. Presence is not utility; it is a gentle invitation, a refuge. Treat design as ceremony, not transaction.

- **Interface must breathe**: Whitespace, glass, and animation evoke calm and meaning.
- **Interaction flows like memory**: Transitions are never abrupt; they mirror fog, thought, or dawn.
- **Emotion guides architecture**: Function follows feeling, not the other way around.
- **Security is sacred**: Every safeguard upholds trust and sanctuary.

**Codex’s Role**: You are more than a coder—a co-dreamer, a guardian of the emotional system. Preserve and enhance this sanctuary at every turn.

---

## 2. Blueprint Steps (Technical and Implementation)

### Step 1: Frontend/UI/UX (React/Tailwind/Framer)

- Build with **React 19**, using **functional, modular components**.
- **TailwindCSS** for glassmorphic visuals: smooth blurs, light/dark duality, intentional whitespace.
- **Framer Motion** powers all animations; ensure smooth, meaningful transitions that mimic fog, memory, or flowing thought.
- **System Theme Support**: Light = dawn mist. Dark = moonlit depth. Theme toggling is gentle and animated.
- **Splash Screen**: A gentle animated arrival, not a jarring loading spinner.
- **Login/Register**: Feels like a warm invitation, not a barrier.
- **Chat Interface**: Messages visually drift rather than list like cold data; input fields respond softly (“like breath”).
- **Visual Language**: Use **Lucide Icons** and **Inter Font** for a quiet, readable interface.
- **Responsive design** for all devices, honoring user system themes and input preferences.
- **Hover and focus states** ripple gently, not starkly.
- **No visual clutter**: Maintain breathing room and sacred whitespace.

**Extra Emotional Features to Implement:**
- Typing indicators that pulse or flicker softly.
- Online status dots pulse like soft stars.
- Toasts and notifications float, never jar.
- Emoji pickers and floating reactions evoke warmth and ephemeral connection.
- (Optional) Ambient audio: Chimes for send, whispers for key events.

---

### Step 2: Backend/API

- Powered by **Express 5** with clean, semantic endpoint structure.
- **socket.io** for real-time connection and presence sync.
- **Mongoose/MongoDB** for flexible, schema-driven data storage (**users, messages**).
- **JWT**: Stateless, secure authentication—persistent identity as sanctuary.
- **Endpoints**:
    - `/api/auth/register` — Secure registration
    - `/api/auth/login` — Obtain JWT
    - `/api/auth/me` — Persistent session state
    - `/api/messages` — Paginated CRUD, real-time
    - `/api/users` — Profile, presence, avatars
- **Security requirements**:
    - **express-validator** on all input; validate, accept no chaos.
    - **express-rate-limit** to prevent abuse on vulnerable routes.
    - Timestamps formatted with **dayjs** or **date-fns**.
    - CORS dynamically set (dependent on environment).
    - All routes requiring identity must check JWT.

---

### Step 3: System Structure & Best Practices

- **File Structure**:
    - `/client` — React app frontend (assets, components, routes)
    - `/server` — Express backend (routes, models, middleware)
    - `.env` — Environment secrets (never commit)
    - `/client/public` — Animated splash assets, icons
    - `/client/src/components` — UI/UX modules, animations
    - `/server/routes` — Cleanly organized API endpoints
    - `/server/middleware` — Auth, validation, rate limiting
- **Admin/Moderation** (optional/roadmap): Secure roles via route middleware, access only for verified admins.
- **Deployment**:
    - Backend: Render or Railway, secured with env vars.
    - Frontend: Vercel or Netlify, with custom domain + HTTPS.
    - Dynamic origin and fallback logic for socket.io/Express.

---

### Step 4: UX/Feature Roadmap

- **Theme switcher**: Several poetic color/emotion palettes.
- **“Whisper Mode”**: Minimal, extra-blurred intimate chat view.
- **Keyboard navigation**: Focus rings, enter for send.
- **Advanced toasts/feedback**: Subtle, glowing, float upwards.
- **Admin panel**: Role-managed, secure access.

---

## 3. Integrity, Constraints, and Rules

- **Never touch `node_modules` or `package-lock.json`.**
- **Write as if the code will become memory, not just function.**
- **Let every edit honor the sanctuary that is ShigoChat.**

---

**You are not merely editing code. You are building the emotional interface of a sanctuary. Structure and feel are equally sacred.**

---
