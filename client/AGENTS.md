# Frontend Agent Rules

This file supplements the repository-root `AGENTS.md` for work under `client/`.

## Required frontend spec

Before selecting, integrating, replacing, or redesigning any frontend component, read:

```text
../SHIGO_FRONTEND_MANIFEST.md
```

`SHIGO_FRONTEND_MANIFEST.md` is the canonical source of truth for:

- Shigo Midnight visual direction
- selected 21st.dev source families and component links
- semantic token targets
- typography, radius, spacing, motion, and icon rules
- Storybook target inventory
- old-to-new production component mapping
- implementation order and phase gates
- explicit rejected patterns/components
- production acceptance criteria

## Selection rule

If the manifest marks a product need as `SELECTED`, use that source as the default starting point.

Do not replace a selected source with a random alternative merely because another 21st.dev component looks interesting in isolation. If proposing a different source, first document why it materially improves the selected option in product fit, accessibility, maintainability, or implementation quality.

## Storybook-first rule

New redesign work must land in Storybook before production wiring unless the user explicitly requests otherwise.

For layout-bearing work, include realistic desktop and mobile/narrow states. Avoid `min-h-screen`, `h-screen`, or `w-screen` in ordinary component demos. Reserve immersive viewport ownership for true page-level experiences such as splash/auth shader surfaces.

## Production boundary

When production wiring begins, preserve the existing application behavior in the current JSX pages/components and replace presentation incrementally. Do not rewrite Socket.IO, authentication, REST API, MusicContext, ThemeContext, or backend behavior as a side effect of visual migration.

## Existing experiment status

The manifest, not the presence of a component in `components/ui`, determines whether a Storybook experiment is approved for production.

Examples:

- Button: keep
- Messaging Conversation: reference/partial reuse
- Smokey Login: Storybook experiment
- Sign Up Block: Storybook experiment
- Fluid Menu: Storybook only
- Magnetic Cursor: splash/auth only
- pricing/marketing blocks: outside the core chat redesign unless a real product need appears

All other repository-root frontend, dependency, accessibility, verification, and source-control rules still apply.
