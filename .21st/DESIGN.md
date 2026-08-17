# ShigoChat design context

ShigoChat is a private-group chat product built around a calm, immersive Quiet Room. The design lane is quiet-luxury editorial: warm paper and bone in light mode, deep ink and moonlit surfaces in dark mode, restrained amethyst accents, expressive serif identity typography, and disciplined sans-serif UI text.

## Implementation rules

- Preserve the existing React, CRA, Tailwind, Framer Motion, REST, MongoDB, authentication, and Socket.IO architecture.
- Use existing semantic CSS tokens before adding visual values.
- Keep conversation content dominant; atmosphere stays peripheral.
- Use Framer Motion for intentional interaction transitions and CSS for ambient texture.
- Respect keyboard operation, visible focus, 44px touch targets, semantic controls, announced states, and reduced motion.
- Keep loading, empty, fetch-error, retry, sending, edit, delete, and drawer states explicit.
- Do not add reactions, threads, unread counts, profiles, multiple rooms, or other speculative features.

## 21st.dev usage

Use 21st.dev MCP to research chat shells, input bars, grouped messages, drawers, empty states, and accessible interaction patterns. Adapt those patterns into local ShigoChat primitives. Do not install a runtime registry dependency or publish this theme publicly.

## Storybook workflow

Storybook is the rendered source of truth. Stories use deterministic local fixtures and must render without backend services, credentials, sockets, or network calls. Every visual change should be discoverable through Storybook MCP, previewable at target viewports, and checked with interaction and accessibility tests.
