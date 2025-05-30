## Project Overview
https://shigochat.onrender.com

ShigoChat is more than a chat app — it’s a **sanctuary** that gently invites users into a calm, flowing, and heartfelt environment to share thoughts, feelings, and ephemeral moments. Every interaction, color gradient, and animation has been deliberately curated to evoke warmth, invitation, and sanctuary.

---

## What ShigoChat Is

ShigoChat is a **global messaging thread** platform where registered users can connect in real-time. Instead of private or segmented channels, ShigoChat offers a single, communal space — a sanctuary — where all users can:

- Register a new account to join the conversation.
- Log in securely to participate.
- Send, edit, and delete messages in a shared global chat thread.
- See messages rise and drift visually, echoing presence and gentle interaction.
- Experience ambient, emotion-driven UI with pastel gradients, floating blobs, and soothing animations.
- Toggle between light and dark themes seamlessly.
- Listen to curated ambient music while chatting (optional and non-disruptive).

---

## What I Built

### Emotion-Driven Frontend

- **React 19 Functional Components:** Built with modular, reusable functional React components that prioritize clarity, maintainability, performance, and accessibility.
- **TailwindCSS Glassmorphism:** Implements glassmorphic UI with smooth blurs, pastel gradients, and intentional whitespace that allows the interface to breathe — no clutter, only calm.
- **Framer Motion Animations:** All transitions and interactions are powered by Framer Motion, creating flowing, soft animations that mimic the natural movement of memory and thought.
- **System-Aware Theming:** Automatic detection of system light/dark modes with gentle, animated toggle between dawn mist and moonlit depth themes.
- **Floating Pastel Blobs & Particles:** Ambient visual accents rendered as softly drifting blobs and particles to reinforce the emotional atmosphere and sanctuary feel.
- **Real-Time Chat Interface:** Messages visually drift and float rather than stack like cold data — inputs respond softly like "breath", elevating user experience.
- **Context-Aware Message Editing & Deletion:** Users can seamlessly edit or delete their messages inline with smooth transitions and client/server synchronization.
- **Subtle UI Details (planned):** Polished features including softly pulsing typing indicators, online status dots flickering like stars, and planned emoji pickers and ephemeral reactions.
- **Ambient Music Player:** Integrated music player component adds an ethereal soundscape with curated tracks that play smoothly without disturbing core chat functionality.
- **Responsive Design:** Fully responsive layout that honors user system themes and input preferences across all devices from desktops to mobile.

### Robust, Secure Backend

- **Express 5 API:** Backend built on the latest Express 5 framework with clean and semantic API endpoint structures.
- **Stateless JWT Authentication:** Secure, scalable JWT-based stateless authentication ensures persistent identity while eliminating session risks.
- **MongoDB Atlas with Mongoose:** Leveraged MongoDB Atlas cloud database for highly reliable, scalable, and globally accessible data storage with flexible schema-driven data models for Users and Messages.
- **Socket.IO Real-Time Layer:** Integrated Socket.IO for efficient, authenticated real-time bi-directional communication, presence synchronization, and event broadcasting.
- **Express-Validator:** Extensive input validation middleware protects against malicious or malformed data on all endpoints.
- **Security-First Middleware:** Middleware enforces security best practices including JWT verification, role-based access control, and ownership checks prior to message edits or deletions.
- **Dynamic CORS Configuration:** CORS is dynamically configured to allow trusted frontend origins only, enhancing cross-origin security.
- **Rate Limiting (Planned):** To further safeguard endpoints, express-rate-limit is planned to mitigate abusive request patterns.
- **Password Hashing with bcryptjs:** Passwords are securely salted and hashed before storage to completely eliminate plaintext risks.
- **Robust Error Handling and Logging:** Both server and client include comprehensive error handling with verbose logging, aiding maintainability and debugging.

### Cloud Deployment & DevOps

- **MongoDB Atlas Cloud Database:** Utilized MongoDB Atlas as the database service, benefiting from automated backups, scalable clusters, global distribution, performance optimization, and enterprise-grade security features including network access controls and encryption-at-rest.
- **Render.com Backend Deployment:** The backend Express API and WebSocket server are deployed on [Render](https://render.com), leveraging managed infrastructure that provides automatic TLS, horizontal scaling, auto deploys from GitHub, zero downtime, and easy environment variable management.
- **Render Static Site for Frontend (Active Deployment):** The frontend is deployed as a static site on Render, leveraging its global CDN to ensure efficient delivery, client-side routing support via manual rewrite rules, and fast load times across regions. 
- **Environment & Secrets Management:** Environment variables, including JWT secrets and MongoDB URIs, are securely managed on Render, ensuring no secrets are committed to source control.
- **CI/CD Ready:** The project is structured to seamlessly integrate with continuous integration and delivery pipelines for rapid iterations and confidence in deployments.

---

## Technologies & Tools Employed

| Layer           | Technologies / Libraries                    | Why / How                                     |
|-----------------|--------------------------------------------|----------------------------------------------|
| **Frontend**    | React 19, TailwindCSS, Framer Motion       | Modern, performant, expressive UI/UX          |
|                 | Lucide Icons, Inter Font                    | Quiet, elegant visual and typographic language |
|                 | React Router DOM                            | Modular, declarative routing                   |
|                 | React Hot Toast                             | Floating, non-jarring notifications           |
|                 | Socket.IO Client                            | Real-time updates with stable connection      |
|                 | Axios                                      | Seamless cross-platform HTTP requests         |
| **Backend**    | Express 5                                   | Clean, modular, and future-proof server framework |
|                 | MongoDB Atlas & Mongoose                    | Scalable cloud NoSQL DB with schema validation  |
|                 | Socket.IO Server                            | Real-time bi-directional communication        |
|                 | JSON Web Tokens (JWT)                       | Stateless, scalable, secure authentication      |
|                 | bcryptjs                                   | Industry standard password hashing             |
|                 | express-validator                           | Rigorously validate and sanitize user input   |
|                 | cors                                       | Protect API from unauthorized cross-origin access |
| **DevOps & Cloud** | MongoDB Atlas Cloud DB                  | Managed, resilient, and globally distributed database |
|                 | Render.com Backend Hosting                  | Managed backend hosting with automatic TLS and scaling |
|                 | Environment Variable Security               | Secrets safely stored and injected at runtime  |
| **Other**      | Lottie React (planned for animations)        | Enables subtle, emotionally resonant animations |
|                 | ESLint & Prettier (assumed)                 | Enforce code quality and style consistency      |

---

## Key Architectural & Implementation Highlights

- **Full JWT Authentication Lifecycle:** Stateless JWT tokens authenticate REST API requests and authorize each Socket.IO connection, improving scalability without server-side session storage.
- **Ownership Enforcement on Message Modification:** Backend strictly checks that only message senders can edit or delete their messages, preserving data integrity and trust.
- **Socket.IO Events for Syncing Messages:** Incoming message creations, edits, and deletes are broadcast in real-time to all connected clients, with careful verification and sender validation to prevent spoofing.
- **Robust React Context Management:** Authentication and theming contexts manage global app state cleanly, ensuring consistent user identity and light/dark mode application.
- **Floating Blobs & Particle Animations:** Reused React components and carefully timed Framer Motion animations create soft, ethereal background visuals that heighten the sanctuary experience.
- **Seamless Dark and Light Mode:** System preference detection augmented with manual toggle keeps UI in sync with user environment and preference, animating smoothly.
- **Optimistic UI Updates:** Message sends update locally first for instant feedback before server confirmation, ensuring snappy, fluid interaction.
- **Accessible and ARIA-Friendly UI:** Form inputs, buttons, and dynamic content provide proper ARIA attributes and keyboard accessibility.
- **Environment-Driven API URLs:** The React app dynamically configures API base URLs from environment variables for flexibility between development and production.

---

## What I Learned & Demonstrated

- Crafting **emotionally intelligent UX/UI** that feels alive and engaging rather than transactional.
- Mastering **full-stack real-time applications**, from secure REST APIs and token auth to authenticated WebSockets.
- Implementing **robust validation and security best practices** with layered middleware and ownership enforcement.
- Handling **complex socket lifecycles and synchronization** to prevent race conditions, duplication, and ghost messages.
- Designing **highly modular, reusable React components** that prioritize user delight, accessibility, and maintainability.
- Managing **dual dark/light theming** with smooth system-aware toggling across large component trees.
- Building a **music player component** that integrates seamlessly without disrupting core app function or sound experience.
- Navigating **MongoDB Atlas cloud** for database provisioning, connection cost optimization, and security.
- Deploying **a stable, secure backend & frontend on Render** with live reloading and centralized logs.
- Structuring project folders and code for **scalability and clear separation of concerns** in a real-world application.

---

## Summary

ShigoChat is my personal testament to building software that embodies soul and sanctuary. It is a refined full-stack project showcasing my skills in modern JavaScript ecosystems, real-time communication, and emotionally-aware design.  
