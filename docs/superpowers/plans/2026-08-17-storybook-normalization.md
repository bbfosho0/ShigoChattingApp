# Storybook Normalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Normalize the Storybook component lab so imported 21st.dev/shadcn components render at predictable, realistic sizes and positions under the existing CRA + Tailwind 3 architecture.

**Architecture:** Keep Create React App, Storybook React Webpack5, mixed JSX/TSX, and the existing shadcn-compatible paths. Fix the compatibility layer first by moving Tailwind from 3.3 to the latest 3.4 line, then normalize non-immersive stories to centered/padded presentation while preserving fullscreen only for intentionally immersive demos such as shader/auth and magnetic-cursor experiences.

**Tech Stack:** React 19, Create React App, Storybook 10.5 React Webpack5, TypeScript 5.8, Tailwind CSS 3.4, Radix UI, Lucide React.

**Spec:** User-reported Storybook sizing/centering regression shown in the Messaging Conversation story and the repository guardrails in `AGENTS.md`.

## Global Constraints

- Keep Create React App and `@storybook/react-webpack5`.
- Do not add Vite, Next.js, Tailwind 4, CRACO, custom webpack aliases, or bulk JSX-to-TSX conversion.
- Preserve existing component APIs unless a bug requires a backward-compatible adjustment.
- Keep fullscreen layout only for demos whose purpose depends on filling the viewport.
- Do not hand-edit generated lockfile internals; regenerate with `npm install` locally when package versions change.
- Verification target: `npm install`, `npx tsc --noEmit`, `npm run build`, `npm run build-storybook`.

---

### Task 1: Repair Tailwind compatibility baseline

**Files:**
- Modify: `client/package.json`
- Regenerate locally after pull: `client/package-lock.json`

**Interfaces:**
- Consumes: current Tailwind 3.3 configuration and existing utility classes.
- Produces: Tailwind 3.4 support for `size-*` utilities already used by Avatar, Button, Input, Checkbox, Fluid Menu, Messaging Conversation, and other copied components.

- [ ] **Step 1: Establish the failing compatibility condition**

Confirm the branch declares `tailwindcss` 3.3.x while source files use classes such as `size-8`, `size-4`, and `[&_svg]:size-4`.

- [ ] **Step 2: Verify the expected framework behavior**

Use Tailwind's official v3.4 release notes to confirm `size-*` was introduced in v3.4.

- [ ] **Step 3: Implement the minimal compatibility fix**

Change `client/package.json` from Tailwind 3.3.x to the latest 3.4.x release without changing PostCSS configuration or migrating to Tailwind 4.

- [ ] **Step 4: Regenerate dependencies locally**

Run:

```bash
cd client
npm install
```

Expected: lockfile resolves Tailwind 3.4.x while keeping the existing CRA/PostCSS pipeline.

- [ ] **Step 5: Commit**

```bash
git add client/package.json client/package-lock.json
git commit -m "fix: align Tailwind with imported UI utilities"
```

### Task 2: Normalize Storybook presentation rules

**Files:**
- Modify: `client/src/components/ui/button-demo.tsx`
- Modify: `client/src/stories/Button.stories.tsx`
- Modify: `client/src/stories/FluidMenu.stories.tsx`
- Modify: `client/src/stories/MessagingConversation.stories.tsx`
- Modify: `client/src/stories/SignUpBlock.stories.tsx`
- Modify: `client/src/stories/UseScreenSize.stories.tsx`
- Modify: `client/src/stories/LoginForm.stories.tsx`
- Preserve fullscreen: `client/src/stories/MagneticCursor.stories.tsx`

**Interfaces:**
- Consumes: global Storybook `layout: "padded"` from `.storybook/preview.js`.
- Produces: predictable story canvases where ordinary components use `centered` or `padded`, and only immersive demos opt into `fullscreen`.

- [ ] **Step 1: Establish the failing layout pattern**

Confirm ordinary component stories override the global preview with `layout: "fullscreen"` and wrap content in `min-h-screen`.

- [ ] **Step 2: Normalize Button stories**

Use `layout: "centered"`; remove `min-h-screen` wrappers; keep compact flex/grid groups with reasonable max widths and padding.

- [ ] **Step 3: Normalize Fluid Menu stories**

Use `layout: "centered"`; remove top-biased `items-start` fullscreen canvas behavior; give the expanding stack enough local vertical room without consuming the viewport.

- [ ] **Step 4: Normalize Messaging Conversation stories**

Use `layout: "centered"`; render inside a bounded responsive wrapper rather than a fullscreen canvas.

- [ ] **Step 5: Normalize Sign Up and useScreenSize stories**

Use centered/padded presentation and remove unnecessary viewport-height wrappers.

- [ ] **Step 6: Keep immersive stories explicit**

Keep the Smokey Background login story and Magnetic Cursor fullscreen. Override only Login `FormOnly` to centered presentation.

- [ ] **Step 7: Commit**

```bash
git add client/src/components/ui/button-demo.tsx client/src/stories
git commit -m "fix: normalize Storybook component layouts"
```

### Task 3: Normalize Messaging Conversation dimensions

**Files:**
- Modify: `client/src/components/ui/messaging-conversation.tsx`

**Interfaces:**
- Consumes: `className?: string` override API.
- Produces: a bounded default conversation card that remains overrideable by future app-shell compositions.

- [ ] **Step 1: Preserve the public API**

Keep `className?: string` and all current child behavior.

- [ ] **Step 2: Replace viewport-driven default sizing**

Replace `h-[75vh]`/`grow` defaults with a fixed-but-responsive preview height such as `h-[32rem]` plus a viewport-aware `max-h`, while retaining `min-h-0`, `overflow-hidden`, and responsive width constraints.

- [ ] **Step 3: Keep message transcript scrolling inside the card**

Do not move scrolling to the page/story wrapper; `ScrollArea` remains the transcript scroller.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/ui/messaging-conversation.tsx
git commit -m "fix: bound messaging conversation preview size"
```

### Task 4: Verify the normalized baseline

**Files:**
- No production files unless verification reveals a specific regression.

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: compile/build evidence and a rendered QA checklist for the user's local Storybook.

- [ ] **Step 1: Install dependencies**

```bash
cd client
npm install
```

- [ ] **Step 2: TypeScript verification**

```bash
npx tsc --noEmit
```

Expected: exit 0.

- [ ] **Step 3: CRA production build**

```bash
npm run build
```

Expected: exit 0.

- [ ] **Step 4: Storybook static build**

```bash
npm run build-storybook
```

Expected: exit 0.

- [ ] **Step 5: Rendered QA**

At `http://localhost:6006`, inspect desktop and a narrow viewport for Button, Fluid Menu, Messaging Conversation, Sign Up Block, useScreenSize, Login Form, and Magnetic Cursor. Confirm no escaped avatars/icons, no unnecessary full-viewport whitespace, and consistent centering.

- [ ] **Step 6: Commit any lockfile-only reconciliation**

```bash
git add client/package-lock.json
git commit -m "chore: refresh frontend lockfile"
```
