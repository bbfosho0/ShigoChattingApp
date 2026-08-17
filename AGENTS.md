# AGENTS.md

This file defines the default working rules for automated coding agents in this repository. It applies from the repository root downward unless a more specific `AGENTS.md` exists in a subdirectory.

## Primary Objective

Preserve the working ShigoChat application while evolving the frontend safely.

The `storybook-typescript-baseline` branch is a controlled integration branch for Storybook, TypeScript, shadcn-compatible primitives, and 21st.dev-style components. It is **not** a general framework migration branch.

## Repository Shape

```text
ShigoChattingApp/
├─ client/                    # React 19 + Create React App frontend
│  ├─ .storybook/            # Storybook Webpack5 + CRA preset
│  ├─ components.json        # shadcn-compatible path config
│  ├─ tailwind.config.js     # Tailwind CSS 3
│  ├─ tsconfig.json          # mixed JS/TS support, baseUrl=src
│  └─ src/
│     ├─ components/
│     │  └─ ui/              # reusable TSX UI primitives/components
│     ├─ hooks/              # reusable hooks
│     ├─ lib/utils.ts        # cn()
│     ├─ stories/            # Storybook stories
│     ├─ context/            # existing JSX contexts
│     ├─ pages/              # existing JSX pages
│     └─ index.css           # global styles + semantic theme tokens
└─ server/                    # Express 5 + Socket.IO + Mongoose backend
```

## Non-Negotiable Frontend Guardrails

Do not introduce any of the following unless the user explicitly requests a deliberate migration and the migration is separately planned and verified:

- Vite
- `@storybook/react-vite`
- `@vitejs/plugin-react`
- custom esbuild TSX loaders
- CRACO
- `react-app-rewired`
- custom webpack alias hacks
- Next.js
- Tailwind CSS 4 migration
- `@theme` Tailwind 4 syntax
- bulk JSX-to-TSX conversion
- mass file moves or architecture rewrites

The current Storybook builder is React Webpack5 with the CRA preset. Keep it that way.

## JSX and TSX Coexistence

The repository intentionally supports both.

- Existing production `.js` and `.jsx` files should remain unchanged unless the task directly requires editing them.
- New reusable UI work should normally use `.ts` or `.tsx`.
- Never rewrite TSX to JSX merely to bypass parser or Storybook errors.
- Fix the actual configuration or source error instead.

## Canonical Paths

Reusable UI:

```text
client/src/components/ui
```

Reusable hooks:

```text
client/src/hooks
```

Utility helpers:

```text
client/src/lib
```

Storybook stories:

```text
client/src/stories
```

Global styles and design tokens:

```text
client/src/index.css
```

shadcn configuration:

```text
client/components.json
```

## Import Rules

This project is Create React App with:

```json
"baseUrl": "src"
```

Use absolute imports such as:

```tsx
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { cn } from "lib/utils";
import { useScreenSize } from "hooks/use-screen-size";
```

Do not add `@/...` imports to new code. Many copied shadcn/21st.dev components use `@/components/...`; adapt those imports to the current CRA-safe convention.

## shadcn and 21st.dev Integration Rules

When integrating a supplied component:

1. Inspect the repository before writing.
2. Determine which dependencies and primitives already exist.
3. Reuse existing shared primitives when possible.
4. Do not blindly overwrite `Button`, `Card`, `Input`, `Checkbox`, or other shared files.
5. If a supplied primitive has useful new behavior, merge it backward-compatibly.
6. Keep the component in native TSX.
7. Convert `@/...` imports to CRA-safe imports.
8. Remove framework-specific code that does not belong in CRA, for example `next/link`.
9. Do not install Next.js to satisfy a copied UI snippet.
10. Do not paste Tailwind 4 configuration into this Tailwind 3 project.
11. Prefer existing semantic tokens over introducing a parallel theme system.
12. Give every integration a unique demo filename such as `fluid-menu-demo.tsx` instead of generic `demo.tsx`.
13. Add a dedicated Storybook story.
14. Add light/dark variants where meaningful.
15. Keep the integration isolated from unrelated app code.

## Shared Primitive Compatibility

Shared primitives already have consumers in Storybook and may later be used in production pages.

Before changing one:

- search for existing usages
- preserve existing variant names and props where practical
- add new variants instead of renaming old ones
- keep defaults stable unless the user explicitly wants a visual breaking change
- verify prior stories still compile

Example: if a new Button design introduces `primary`, do not delete an existing `default`, `outline`, `destructive`, or `link` variant that earlier stories use.

## Styling Rules

This branch uses Tailwind CSS 3 and semantic CSS variables.

Prefer:

```text
bg-background
text-foreground
bg-card
text-card-foreground
text-muted-foreground
border-border
bg-primary
text-primary-foreground
bg-secondary
bg-accent
ring-ring
```

Avoid creating a separate copied token system unless required by the task.

Do not add Tailwind 4 constructs such as:

```css
@import "tailwindcss";
@theme inline { ... }
```

The current global style entry is `client/src/index.css`.

## Dependency Rules

Before adding a package:

1. Check `client/package.json`.
2. Reuse an installed equivalent where sensible.
3. Add only packages actually required by the component.
4. Do not add an entire framework to satisfy one import.
5. Do not manually fabricate `package-lock.json` entries.

After dependency changes, run:

```bash
cd client
npm install
```

and commit the resulting `package-lock.json` if it changes.

Current examples:

- use existing `framer-motion` instead of adding a second animation package unless a component specifically requires another API
- use existing `lucide-react`
- use existing Radix primitives when they match the requirement
- GSAP and `vecteur` are valid dependencies for the magnetic cursor component

## Storybook Rules

Story files belong in:

```text
client/src/stories/<ComponentName>.stories.tsx
```

Use clear stable titles:

```tsx
const meta = {
  title: "Components/Magnetic Cursor",
  component: MagneticCursorDemo,
} satisfies Meta<typeof MagneticCursorDemo>;
```

For hooks:

```text
Hooks/useScreenSize
```

Stories should expose meaningful states, not just one happy-path screenshot. Depending on the component, include:

- default
- dark
- variants
- sizes
- loading
- disabled
- interactive states

Do not create one giant catch-all story file for unrelated components.

## Accessibility Expectations

When integrating copied UI, fix obvious accessibility defects without changing the requested design intent.

Examples:

- use a real `<button>` instead of clickable `<div role="button">` when possible
- preserve keyboard access
- add `aria-label` to icon-only controls
- add `aria-invalid` and error descriptions to form fields
- support Escape/outside-click behavior for custom menus
- honor reduced-motion preferences for animation-heavy interactions when practical

## Performance and Lifecycle Expectations

Copied visual components often contain hidden lifecycle problems. Fix them during integration if the fix is behavior-preserving.

Watch for:

- `requestAnimationFrame` loops without cancellation
- event listeners without cleanup
- WebGL resources without cleanup
- effects that recreate expensive graphics work on every pointer move
- GSAP tweens/tickers left active after unmount
- unnecessary state updates inside high-frequency pointer handlers

Storybook should be safe to mount and unmount a component repeatedly.

## Production Application Boundaries

Do not wire component-lab demos directly into production pages unless the task explicitly asks for production integration.

The Storybook branch currently acts as an evaluation and integration layer. A component existing in `components/ui` does not automatically mean the production UI should be replaced with it.

## Backend Boundaries

The backend lives in `server/` and uses Express, Socket.IO, Mongoose, JWT, bcrypt, and validators.

Do not change backend APIs while integrating a frontend component unless the component task explicitly requires backend behavior.

Do not expose MongoDB credentials or other secrets in frontend code.

## Required Verification

For frontend/component changes, run from `client/`:

```bash
npm install
npx tsc --noEmit
npm run build
npm run build-storybook
```

For interactive review:

```bash
npm run storybook
```

Do not claim the integration is verified unless those commands, or equivalent CI checks, actually pass.

The repository includes:

```text
.github/workflows/storybook-baseline-verify.yml
```

which is intended to validate install, TypeScript, CRA build, and Storybook build.

## Failure Diagnosis

If Storybook fails on TSX syntax such as:

```text
import type
export type
```

or reports TSX being parsed as JSX, do **not** convert the source to JSX and do not add ad hoc esbuild loaders.

Check first:

- Storybook builder is still `@storybook/react-webpack5`
- CRA preset is still present
- TypeScript is installed
- `tsconfig.json` includes `src`
- the error is not caused by duplicate imports/identifiers in the story itself

If an identifier is declared twice, fix the duplicate declaration rather than changing the build pipeline.

## Source Control Discipline

For incremental component work:

- keep changes narrowly scoped
- avoid unrelated formatting churn
- prefer small logical commits
- do not rewrite branch history unless explicitly requested
- do not merge to `main` unless explicitly requested
- do not create a new branch unless explicitly requested

The active integration branch is:

```text
storybook-typescript-baseline
```

## Completion Checklist

Before reporting a component task complete, confirm:

- [ ] correct canonical path used
- [ ] imports adapted for CRA
- [ ] no unnecessary packages added
- [ ] no shared primitive broken
- [ ] no Tailwind 4 / Vite / Next contamination
- [ ] unique demo file added when applicable
- [ ] Storybook story added
- [ ] obvious accessibility issues addressed
- [ ] animation/listener cleanup handled
- [ ] TypeScript check passed
- [ ] CRA build passed
- [ ] Storybook build passed
- [ ] lockfile regenerated after dependency changes

If verification cannot be run, state that explicitly instead of implying success.
