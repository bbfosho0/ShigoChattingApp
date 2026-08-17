# 21st.dev integration ledger

## Active policy

- 21st.dev is used through the installed `21st` Codex plugin for research, retrieval, and selective local adaptation.
- Retrieved code may be copied into ShigoChat only after review; ensure their dependencies are installed
- No ShigoChat theme or token set is published publicly.
- Every adopted reference must have a source ID, rationale, dependency note, adaptation note, and Storybook story ID.

## Current verification

- Plugin: `21st@codex-marketplace-global` 0.4.0, installed and enabled.
- Account usage: paid tier; unlimited search and component-code retrieval reported.
- Catalog search: blocked by upstream `catalog search failed` for component queries.
- 21st AI generation: blocked by the account's free-generation limit; the endpoint returned the 21st pricing link.
- Adopted 21st catalog components: none yet. No component is being represented as 21st-sourced until its code and demo can be retrieved.

## Local adaptation coverage while the catalog is unavailable

The following ShigoChat primitives now carry the intended pattern families and are rendered in Storybook:

- composer/input bar
- grouped, edited, pending, failed, and action-visible messages
- room header and presence
- drawers and mobile navigation
- empty, loading, error, and retry states
- light/dark semantic foundations

These are local ShigoChat implementations, not 21st catalog copies. The catalog gate remains open for a future verified candidate.

## Chrome catalog discovery — 2026-08-17

The component-search MCP endpoint is still unreliable, so the 21st community catalog was reviewed directly in Chrome. The catalog exposed the following relevant source pages:

- Chat Bubble — Jakob Hoeg Mørk: `https://21st.dev/community/components/jakobhoeg/chat-bubble`
- Chat Message List — Jakob Hoeg Mørk: `https://21st.dev/community/components/jakobhoeg/chat-message-list/default`
- Chat Input — Jakob Hoeg Mørk: `https://21st.dev/community/components/jakobhoeg/chat-input/default`
- Composer Input — Ravi Katiyar: `https://21st.dev/community/components/ravikatiyar162/composer-input`
- Drawer — Edil Ozi: `https://21st.dev/community/components/Edil-ozi/drawer`
- Empty state collection: `https://21st.dev/community/components/s/empty-state`

Verified through the 21st MCP after extracting demo IDs from the catalog pages:

- `12400` Input Bar / With attachments
- `12401` Input Bar / Toolbar actions
- `12402` Agent Chat / Basic
- `12403` Agent Chat / Empty centered
- `12404` Agent Chat / Error

Selection status: research/retrieval only. No external component has been installed into the application yet. The strongest adaptation targets are message actions, composer state handling, empty/error recovery, and drawer semantics. Generic AI-agent framing, glow, gradients, and decorative motion remain rejected.

## Broader UI/UX discovery — 2026-08-17

Additional candidates found through the 21st community catalog:

### Forms and auth

- Field — Coss: `https://21st.dev/community/components/coss.com/field`
  - Candidate for accessible labels, descriptions, required states, disabled states, and validation messaging.
  - Pattern-only until its Base UI dependency is evaluated against the CRA stack.
- Form Validation collection: `https://21st.dev/community/components/s/form-validation`
  - Research source for inline validation and recovery states.
- Auth Form — Bankkroll: `https://21st.dev/community/components/bankkroll/auth-form-1`
  - Research-only; its larger dependency set is unnecessary for ShigoChat.
- Login Form — PrebuiltUI: `https://21st.dev/community/components/prebuiltui/login-form`
  - Rejected as a direct install because it uses generic rounded/indigo styling and social-auth assumptions outside the product scope.

### Navigation and overlays

- Modern sideBar — Sonu Kumar: `https://21st.dev/community/components/uniquesonu/modern-side-bar`
  - Candidate for mobile close behavior, active navigation, and profile/online status patterns.
  - Adaptation must remove dashboard search/badges and preserve room-first navigation.
- Drawer — Edil Ozi: `https://21st.dev/community/components/Edil-ozi/drawer`
  - Strong candidate for accessible preferences/mobile navigation semantics.
- Sheet — shadcn/ui: `https://21st.dev/community/components/shadcn/sheet/onlu-content`
  - Candidate for preference sections and focus-managed content.
- Drawer — coss.com: `https://21st.dev/community/components/coss.com/drawer/default`
  - Research-only for swipe/nested drawer behavior; likely too dependency-heavy for this pass.

### Loading and recovery

- Skeleton — ReUI: `https://21st.dev/community/components/reui/skeleton/default`
  - Pattern-only; ShigoChat currently uses inline editorial loading states rather than skeleton-heavy dashboards.
- Empty state collection: `https://21st.dev/community/components/s/empty-state`
  - Candidate source for restrained empty/error copy and retry affordances.

### Selection rule

21st is now the primary research and pattern source, but not every surface should be a literal registry component. Each candidate still has to beat the local primitive on usability, accessibility, responsive behavior, or craft. Runtime registry dependencies, generic AI framing, gradients, glow, glass, and inaccessible hover-only interactions remain excluded.

## Interaction primitives and presence discovery — 2026-08-17

### Core controls

- Fluid Button — Micka Design: `https://21st.dev/community/components/micka_design/button`
  - Candidate for primary/secondary/quiet/loading variants and icon sizing.
  - Adapt locally; reject its visual language if it conflicts with ShigoChat tokens.
- shadcn/ui Button: `https://21st.dev/community/components/shadcn/button/default`
  - Reference for disabled, destructive, outline, ghost, icon, and loading states.
- Tooltip Icon Button — Serafim: `https://21st.dev/community/components/serafimcloud/tooltip-icon-button`
  - Candidate for icon-button labels and placement; must retain visible labels/focus behavior and never become hover-only access.
- Form Field — Coss: `https://21st.dev/community/components/coss.com/field`
  - Candidate for label, description, required, disabled, and error semantics.

### Menus and contextual actions

- Popover — Prism UI: `https://21st.dev/community/components/Codehagen/popover`
  - Candidate for contextual message actions and small room controls; evaluate dependency weight and remove command-palette/dashboard extras.
- Menu — Coss: `https://21st.dev/community/components/coss.com/menu/nested-menu`
  - Candidate for theme/music preference menus with keyboard navigation.
- Dropdown Menu — ReUI: `https://21st.dev/community/components/reui/dropdown-menu/default`
  - Candidate for action menus; adapt labels and remove profile/inbox/dashboard assumptions.
- Command Palette — Rafael Porto: `https://21st.dev/community/components/rafa-porto/command-palette/command-palette`
  - Pattern-only. ShigoChat does not currently need a global command palette, so do not add it as a feature.

### Presence

- Avatar Status collection: `https://21st.dev/s/avatar-status`
  - Candidate for the room presence indicator and small member stack.
  - Adapt to text-plus-status semantics; status cannot rely on color alone.
- Modern sideBar — Sonu Kumar: `https://21st.dev/community/components/uniquesonu/modern-side-bar`
  - Candidate for responsive navigation and online profile treatment; remove search, badges, and dashboard density.

### Loading and recovery

- Skeleton — ReUI: `https://21st.dev/community/components/reui/skeleton/default`
  - Pattern-only for loading rhythm; preserve ShigoChat’s inline editorial loading state.
- Empty state collection: `https://21st.dev/community/components/s/empty-state`
  - Candidate for restrained empty/error/retry copy and composition.

### Rejections

- Ant Design button collection rejected: adds `antd` and is visually/architecturally heavier than the existing stack.
- Generic command palettes rejected as feature expansion.
- Dashboard sidebars with badges/search rejected for the private single-room product posture.

## Adaptation matrix — 2026-08-17

| Responsibility | 21st reference | Retrieval | Decision | Local Storybook coverage |
|---|---|---|---|---|
| Composer and input bar | `12400`, `12401`, Chat Input | Known demo code retrieved | Adapted locally; multiline input, send state, and keyboard submit preserved | `shigochat-21st-adaptations--message-actions-and-composer` |
| Human message hierarchy | Chat Bubble, Chat Message List, `12402` | Direct pages and known demo code | Adapted locally; agent framing removed, private-room metadata/actions retained | `shigochat-design-system--message-states`, `shigochat-21st-adaptations--message-actions-and-composer` |
| Empty and error recovery | `12403`, `12404`, Empty State collection | Known demo code plus pattern research | Adapted locally; room shell and composer remain visible | `shigochat-room-states--empty`, `shigochat-room-states--error`, `shigochat-21st-adaptations--inline-recovery-states` |
| Drawer and mobile navigation | Edil Ozi Drawer, shadcn Sheet | Source pages reviewed | Adapted locally with dialog semantics, Escape, focus entry/restoration, and scrim | `shigochat-21st-adaptations--preferences-drawer`, `shigochat-21st-adaptations--mobile-navigation-drawer` |
| Fields and auth validation | Coss Field, Form Validation collection | Source pages reviewed; heavy dependency options rejected | Adapted locally with native labels, descriptions, `aria-invalid`, and recovery copy | `shigochat-21st-adaptations--buttons-and-fields`, `shigochat-21st-adaptations--auth-form-state` |
| Presence and room identity | Avatar Status, Modern Sidebar | Source pages reviewed | Adapted locally; status has text fallback and dashboard density is rejected | `shigochat-21st-adaptations--room-identity-and-presence` |
| Buttons and icon buttons | shadcn Button, Fluid Button, Tooltip Icon Button | Source pages reviewed | Adapted locally with semantic variants, 44px targets, and visible focus | `shigochat-21st-adaptations--buttons-and-fields` |
| Menus and command patterns | Coss Menu, ReUI Dropdown, Command Palette | Source pages reviewed | Menu patterns research-only; command palette rejected as feature expansion | Intentionally none |
| Skeleton loading | ReUI Skeleton | Source page reviewed | Rejected for current room; inline editorial loading is clearer and lighter | `shigochat-21st-adaptations--inline-recovery-states` |

### Ownership result

No external registry component is installed as a runtime dependency. Selected references are owned by ShigoChat as tokenized React primitives in `client/src/components/Primitives.jsx`, while production surfaces preserve existing backend contracts. The 21st catalog search endpoint remains unreliable for free-form component queries; known-demo retrieval and direct catalog research are recorded rather than represented as successful catalog search.

## Retrieval staging — 2026-08-17

The authenticated known-demo retrieval workflow returned source and demo payloads for all five requested Agent Elements candidates. Original payloads are preserved for review under `client/src/components/21st-candidates/`:

| Demo | Staged source | Evaluation result |
|---|---|---|
| 12400 — Input Bar / With attachments | `21st-candidates/12400/SOURCE.tsx` | Pattern retained for composer auto-resize, attachment slots, and send/stop states; generic styling and hover-only removal controls rejected for literal install. |
| 12401 — Input Bar / Toolbar actions | `21st-candidates/12401/SOURCE.tsx` | Toolbar composition evaluated; no new product action requirement, so pattern-only. |
| 12402 — Agent Chat / Basic | `21st-candidates/12402/SOURCE.tsx` | Message grouping and composer composition evaluated; agent framing rejected, local message primitive remains authoritative. |
| 12403 — Agent Chat / Empty centered | `21st-candidates/12403/SOURCE.tsx` | Centered empty-state composition evaluated and adapted into local room-state stories without registry coupling. |
| 12404 — Agent Chat / Error | `21st-candidates/12404/SOURCE.tsx` | Inline error/retry pattern evaluated and adapted into local room-state stories. |

All staged files include the retrieved demo code, dependency notes, accessibility/responsive notes, and the no-runtime-registry decision. No new npm dependency was added and no external source was imported directly into production.
