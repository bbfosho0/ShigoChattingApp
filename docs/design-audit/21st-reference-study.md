# Shigo Midnight Reference Study

Status: approved implementation reference

This document refines `REDESIGN_PROPOSAL.md`. It does not replace it. ShigoChat remains a custom design system built on the existing semantic tokens and application architecture.

## Reference order

Use external references in this order:

1. Themes for visual-system calibration.
2. Templates for composition and responsive reasoning.
3. Components for narrowly scoped implementation solutions.

A reference is a donor, not an identity. Every decision below is explicitly classified as **preserve**, **adapt**, or **reject**.

## Non-negotiable Shigo identity

Preserve:

- electric violet as the primary expressive brand/action accent,
- near-black/navy dark foundation,
- alabaster/lavender light foundation,
- teal as a semantic signal rather than a second general-purpose brand accent,
- Lucide iconography,
- Inter for product UI and message text,
- Playfair Display for expressive brand moments,
- the existing semantic token architecture in `client/src/index.css`,
- reduced-motion behavior,
- current messaging/authentication contracts.

Do not import a complete external theme, template, component stack, or alternate token system.

## Theme donor matrix

| Shigo role | Existing system | Reference | Decision | Implementation interpretation |
| --- | --- | --- | --- | --- |
| Dark background | Shigo | Cosmic Night | **adapt** | Keep Shigo near-black/navy ownership. Borrow only the idea of purple-aware dark surface stepping and atmospheric depth without bright outlines. |
| Navigation shell | Shigo | Cosmic Night | **adapt** | Use quiet violet-biased separation, not neon or space-themed decoration. Navigation must remain subordinate to conversation. |
| Raised surfaces | Shigo | Cosmic Night + Modern Minimal | **adapt** | Retain semantic `--card` / `--shigo-raised`, but simplify elevation and let tonal separation do more work. |
| Primary violet | Shigo | Violet Bloom | **preserve** | Keep Shigo violet. Treat Violet Bloom as a saturation-density ceiling, not a palette target. |
| Light background | Shigo | Amethyst Haze | **adapt** | Keep alabaster/lavender. Use Amethyst Haze only to calibrate tonal spacing between background, shell, raised, and muted surfaces. |
| Borders | Shigo | Modern Minimal | **adapt** | Reduce border frequency. Preserve borders where they communicate containment, focus, state, or overlay boundaries. |
| Shadows | Shigo | Modern Minimal | **adapt** | Simplify routine shadows. Reserve stronger elevation for floating/transient surfaces. |
| Radius | Shigo | Modern Minimal | **adapt** | Tighten routine geometry. Keep larger softness for expressive/auth contexts and true capsule controls. |
| Focus ring | Shigo semantic system | Modern Minimal | **adapt** | Normalize all focus-visible treatment through `--ring`. Reject hard-coded blue focus styling. |
| Chat density | Shigo | T3 Chat | **adapt** | Calibrate message readability, metadata quietness, transcript/composer balance, and shell-to-content ratio only. |
| Premium restraint | Shigo | Elegant Luxury | **adapt** | Borrow spacing restraint and hierarchy, not warm luxury colors or ornamental treatment. |
| Dark austerity | Shigo | Darkmatter | **reject** | Do not push Shigo toward void-black, harsh monochrome, or lifeless contrast. Use only as a negative boundary. |

### Cosmic Night

Useful:

- near-black/purple foundation,
- controlled violet surface relationships,
- dark surface stepping,
- atmospheric depth without relying on bright borders.

Reject:

- overt space aesthetics,
- excessive neon,
- decorative sci-fi motifs,
- saturated purple on every surface.

### Modern Minimal

Useful:

- radius discipline,
- button geometry,
- restrained borders,
- low-noise shadows,
- typography discipline,
- clear semantic focus treatment,
- interaction precision.

This is the main discipline reference for correcting ShigoChat's current overuse of pills, borders, shadows, and nested containment.

### Amethyst Haze

Useful:

- lavender surface relationships,
- tonal separation in light mode,
- muted violet hierarchy,
- quiet raised-surface differentiation.

Reject dreamy/mystical styling that weakens Shigo's precision.

### Violet Bloom

Use only as an upper bound on total violet density. If a routine Shigo screen approaches Violet Bloom's overall saturation, the screen has too much violet.

### T3 Chat

Use only for chat-specific calibration:

- transcript contrast,
- composer hierarchy,
- message readability,
- chat density,
- muted metadata,
- balance between shell and conversation.

Do not adopt its product identity or palette wholesale.

### Elegant Luxury

Use only for restraint, spacing, premium hierarchy, and the idea that luxury can come from editing rather than effects.

### Darkmatter

Treat mainly as a negative comparison. Reject void-black austerity, severe monochrome, and contrast that makes the product feel sterile.

## Template study

Templates are structural references. No template codebase or framework architecture is to be transplanted into ShigoChat.

### Vercel Chatbot

Source: `vercel/chatbot`.

**Useful**

- conversation geometry,
- transcript-to-bottom-composer relationship,
- long-history behavior,
- sparse and empty conversation composition,
- mobile composer treatment,
- responsive shell behavior.

**Inappropriate**

- model selection,
- AI/tool/reasoning state,
- regenerate controls,
- prompt suggestions,
- assistant-centric information architecture.

**Adaptable**

- shell proportions,
- composer anchoring,
- transcript scrolling patterns,
- mobile compression principles.

**Reject**

- Next.js architecture migration,
- AI SDK semantics,
- assistant/user role modeling as the product identity.

### Next Shadcn Admin Dashboard

**Useful**

- responsive navigation patterns,
- settings/account hierarchy,
- mobile settings architecture,
- form ergonomics,
- authentication layout structure.

**Inappropriate**

- dashboard density in Quiet Room,
- analytics/data-grid composition,
- admin-console visual language.

**Adaptable**

- compact/expanded navigation behavior,
- settings section organization,
- responsive form composition.

**Reject**

- copying dashboard shell composition into the messenger,
- framework or routing migration.

### Shadcn Dashboard + Landing

**Useful**

- responsive shell cross-checks,
- settings/auth primitive consistency,
- collapsible navigation,
- light/dark parity.

**Inappropriate**

- generic SaaS landing/dashboard identity,
- card-grid composition in core messaging.

**Adaptable**

- breakpoint reasoning,
- form and navigation consistency.

**Reject**

- application architecture transplant,
- dashboard-first information hierarchy.

## Component study

A component may be adapted only when it solves an identified Shigo problem.

### Composer Input, adapt selectively

Useful for:

- responsive composer actions,
- attachment handling/removal hierarchy,
- toolbar organization,
- mobile compression,
- internal composer layout.

Apply those ideas inside `ShigoComposer`. Do not replace ShigoComposer wholesale or add unrelated rich-input behavior.

### Chat Message List, adapt behavior

Useful for:

- user-controlled auto-scroll,
- bottom anchoring,
- long-conversation behavior,
- latest-message handling.

Its `useAutoScroll` concept is a behavioral reference. Shigo's existing data and message architecture remains authoritative.

### Chat Bubble, adapt decomposition only

Useful for separating responsibilities among:

- message content,
- avatar,
- identity,
- actions,
- grouping.

Reject per-message framing that would reinforce the current card problem.

### Agent Chat, geometry reference only

Useful for:

- shell geometry,
- transcript/composer relationship,
- attachment/error-state organization,
- empty-state placement.

Reject:

- user/assistant role semantics,
- AI state architecture,
- Agent Elements as a dependency.

### Message Dock, reject for core messenger

Its animated character-selector/dock model conflicts with:

- conversation-first layout,
- restrained workspace motion,
- quiet navigation,
- ShigoChat's human messenger identity.

### Agent Elements stack, reject as architecture

Do not introduce model selectors, tool displays, reasoning states, agent state, or AI message infrastructure. Individual implementation ideas may be inspected only when they solve a specific existing Shigo defect.

## Implementation rules derived from the study

1. Geometry before token tuning.
2. Grouping before bubble decoration.
3. One canonical conversation measure shared by transcript, separators, and composer.
4. Conversation has greater visual authority than navigation.
5. Tablet is its own composition state, not a one-pixel switch between desktop and mobile.
6. Surface hierarchy is limited to base, shell, raised, interactive, and overlay roles.
7. Routine UI should not stack background + border + radius + shadow without a clear reason.
8. Violet expresses identity/action, teal communicates semantic signal.
9. Core messaging motion remains functional/spatial/feedback-oriented and restrained.
10. Auth and splash may be more expressive, but must still inherit Shigo's geometry, semantic focus, and control language.

## Sources reviewed

- 21st Community Themes, including Modern Minimal, Elegant Luxury, T3 Chat, Violet Bloom, Amethyst Haze, Darkmatter, and Cosmic Night.
- 21st Composer Input by Ravi Katiyar.
- 21st Chat Message List by Jakob Hoeg Mørk.
- 21st Chat Bubble by Jakob Hoeg Mørk.
- 21st Agent Chat / Agent Elements-derived shell.
- 21st Message Dock by Isaiah.
- Vercel `vercel/chatbot`.
- Shadcn Dashboard admin template references.
- Shadcn Dashboard + Landing template reference.
