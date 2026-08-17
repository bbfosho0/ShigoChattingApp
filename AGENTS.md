# ShigoChat contributor contract

## Read first

Before changing the application, read README.md, .21st/DESIGN.md, and .21st/INTEGRATION.md. The README is the user-facing setup and architecture reference; the .21st documents are authoritative for visual and component research decisions.

## Repository boundaries

- Preserve existing user changes. Inspect the working tree before editing and do not reset, overwrite, or broadly clean unrelated files.
- Do not commit secrets, environment files, credentials, API keys, or database connection strings.
- Do not stop or kill unrelated processes. Do not publish, deploy, merge, or run destructive database actions unless explicitly requested.
- Keep changes scoped to the requested product behavior or documentation.

## Architecture and product invariants

ShigoChat is a React client with REST and Socket.IO communication to an Express server backed by MongoDB and Mongoose. Authentication, message ownership, password flows, realtime events, theme persistence, and shared music state are existing contracts.

- Keep REST routes, MongoDB models, JWT authentication, Socket.IO events, and music behavior compatible.
- Do not add speculative rooms, reactions, threads, unread counts, profiles, command palettes, or other feature expansion.
- The frontend must not connect directly to MongoDB.

## Frontend and design rules

- Use the existing semantic CSS tokens and preserve light and moonlit-dark themes.
- Prefer semantic native controls with labels, visible focus, keyboard access, announced state changes, and touch targets of at least 44px.
- Preserve multiline composer behavior, Enter-to-send, Shift+Enter newline, edit/delete states, retry/error states, drawer dismissal, and reduced-motion alternatives.
- Validate responsive behavior at 375x812, 768x1024, 1024x768, and 1440x900 when a UI surface changes.
- Keep conversation content primary; atmosphere and motion remain restrained. Framer Motion is the existing JavaScript motion system.

## 21st.dev and Storybook

- 21st.dev is a research and pattern source, not a runtime dependency. Retrieve and review source before adapting it, stage candidates separately, keep production code locally owned, and record source/demo IDs, rationale, dependencies, decisions, and Storybook coverage in .21st/INTEGRATION.md.
- Do not claim a candidate is adopted merely because it was retrieved.
- Storybook stories must use deterministic local fixtures and must not require credentials, MongoDB, Socket.IO, backend services, or network access.
- Visual changes need explicit light/dark coverage plus interaction and accessibility coverage where behavior changes.
- Chromatic is an optional external review. Report it as unrun unless a build was actually executed and linked.

## Validation and reporting

For frontend or Storybook changes, run the narrowest relevant checks first, then the broader checks:

    cd client
    npm test -- --watchAll=false --runInBand
    npm run build
    npm run test-storybook -- --watch=false
    npm run build-storybook

Use backend startup and live browser checks only when the task requires them and the required environment is available. Separate product failures, test failures, environment warnings, and unrun external checks in the handoff. The Windows Node assertion that can appear after a completed Storybook build is an environment cleanup warning unless the build itself fails.
