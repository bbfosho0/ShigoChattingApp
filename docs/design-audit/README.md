# ShigoChat Visual Audit Baseline

Audit date: 2026-08-18
Branch: `storybook-typescript-baseline`
Starting HEAD: `feac51d419c643c4203a264b520bcfd5be8758f0`

## Audit method

This audit treats Playwright-rendered application and Storybook output as the visual source of truth. Source inspection was used only after rendering to trace visible problems to compositions, components, primitives, Tailwind classes, and semantic tokens.

No UI implementation changes are part of this audit phase.

Screenshots were captured by the Playwright worker and intentionally left untracked. The Git repository keeps the audit structure and written evidence, while `baseline/desktop`, `baseline/tablet`, `baseline/mobile`, and `iterations` are reserved for approved screenshot assets if they are later copied into the repository.

## Development surfaces

- Application: `http://localhost:3000`
- Storybook: `http://localhost:6006`
- Both surfaces loaded successfully through Playwright.
- The unauthenticated application redirects to `/login` as expected.
- For visual inspection of the real `/chat` shell, Playwright supplied a temporary localStorage audit identity and mocked only the initial `GET **/api/messages` response. This changed no source files.
- The temporary fake token causes `Socket connect_error: Authentication error: invalid token`. This is an audit-harness limitation, not a product visual defect.
- No material Storybook console or network failures were observed during the baseline sweep.

## Standard viewports

| Class | Viewport |
| --- | --- |
| Desktop wide | 1440 x 1000 |
| Desktop normal | 1280 x 900 |
| Tablet | 1024 x 768 |
| Breakpoint probe | 769 / 768 / 767 x 800 |
| Mobile large | 430 x 900 |
| Mobile | 390 x 844 |
| Small mobile | 360 x 800 |

## Screenshot registry

### Production application

| Screen | Viewport | Evidence file |
| --- | --- | --- |
| Login | 1440 x 1000 | `app-login-1440x1000.png` |
| Login | 390 x 844 | `login-live-mobile-390x844.png` |
| Register | 1440 x 1000 | `register-live-desktop-1440x1000.png` |
| Register | 390 x 844 | `register-live-mobile-390x844.png` |
| Splash | 1440 x 1000 | `splash-live-desktop-1440x1000.png` |
| Splash | 390 x 844 | `splash-live-mobile-390x844.png` |
| Quiet Room, expanded | 1440 x 1000 | `app-chat-1440x1000-audit.png` |
| Quiet Room, collapsed | 1440 x 1000 | `app-chat-collapsed-1440x1000-audit.png` |
| Quiet Room, dark collapsed | 1440 x 1000 | `app-chat-dark-collapsed-1440x1000-audit.png` |
| Message hover actions | 1440 x 1000 | `app-chat-hover-actions-1440x1000-audit.png` |
| Preferences, account | 1440 x 1000 | `app-preferences-1440x1000-audit.png` |
| Preferences, appearance | 1440 x 1000 | `app-preferences-appearance-1440x1000-audit.png` |
| Preferences, dark | 1440 x 1000 | `app-preferences-dark-1440x1000-audit.png` |
| Quiet Room | 1280 x 900 | `app-chat-responsive-1280x900.png` |
| Quiet Room | 1024 x 768 | `app-chat-responsive-1024x768.png` |
| Quiet Room | 769 x 800 | `app-chat-responsive-769x800.png` |
| Quiet Room | 768 x 800 | `app-chat-responsive-768x800.png` |
| Quiet Room | 767 x 800 | `app-chat-responsive-767x800.png` |
| Quiet Room | 430 x 900 | `app-chat-responsive-430x900.png` |
| Quiet Room, dark | 390 x 844 | `app-chat-dark-mobile-390x844-audit.png` |
| Quiet Room, dark | 360 x 800 | `app-chat-dark-mobile-360x800-audit.png` |
| Mobile navigation open | 360 x 800 | `app-mobile-nav-open-360x800-audit.png` |
| Preferences, mobile account | 360 x 800 | `app-preferences-mobile-360x800-audit.png` |
| Preferences, mobile security | 360 x 800 | `app-preferences-security-mobile-360x800-audit.png` |

### Storybook canonical and state evidence

The Storybook sweep includes Quiet Room desktop, normal desktop, collapsed, tablet, mobile, small mobile, preferences, mobile nav, login, register, splash, conversation, ambient player, typography, colors, radius, message actions, edit mode, reply composer, attachment composer, empty conversation, and loading conversation.

Representative filenames include:

- `audit-quiet-room-desktop-1440x1000.png`
- `audit-quiet-room-desktop-normal-1280x900.png`
- `audit-quiet-room-collapsed-1280x900.png`
- `audit-quiet-room-tablet-1024x768.png`
- `audit-quiet-room-mobile-390x844.png`
- `audit-quiet-room-small-mobile-360x800.png`
- `audit-preferences-desktop-1280x900.png`
- `audit-preferences-mobile-390x844.png`
- `audit-login-story-desktop-1440x1000.png`
- `audit-register-story-desktop-1440x1000.png`
- `audit-splash-desktop-1440x1000.png`
- `audit-messaging-conversation-1280x900.png`
- `audit-typography-1280x900.png`
- `audit-colors-1280x900.png`
- `audit-radius-1280x900.png`
- `audit-state-message-actions-900x600.png`
- `audit-state-message-edit-900x600.png`
- `audit-state-composer-reply-900x500.png`
- `audit-state-composer-attachment-900x600.png`
- `audit-state-conversation-empty-900x600.png`
- `audit-state-conversation-loading-900x600.png`

## Ranked findings

### P0, structural

### V-001, sparse conversations have the wrong vertical center of gravity

Severity: High
Scope: Systemic
Evidence: production Quiet Room at 1440 x 1000 and 1280 x 900

Observed:
Four recent messages occupy only the top portion of the message viewport while the composer is anchored to the bottom, leaving a large dead field between conversation and composer.

Why it matters:
A messenger should make the active exchange feel spatially connected to the composer. The current layout reads more like a scrollable component demo mounted above an input area.

Likely source:
`Chatroom.jsx` and `shigo-conversation.tsx`, specifically the top-starting `max-w-3xl` message column with fixed `gap-5` and no sparse-transcript bottom anchoring.

Recommendation:
Correct this at the conversation composition layer. Preserve normal scroll behavior for long histories, but bottom-anchor sparse transcripts so recent messages and composer form one interaction zone.

### V-002, the navigation shell has too much visual authority for the product IA

Severity: High
Scope: Systemic
Evidence: production expanded desktop at 1440 and 1280

Observed:
A 256 px sidebar contains brand, a labeled Space section, the only room, an Ambient section with a player, Preferences, and a full profile block. Meanwhile the conversation itself is constrained to 768 px.

Why it matters:
The eye reads navigation and utility chrome as a peer to the conversation rather than as support for it. For a single-room messenger, that hierarchy is backwards.

Likely source:
`AppSidebar`, its fixed `w-64` expanded width, section structure, ambient placement, multiple border partitions, and the independently constrained conversation measure.

Recommendation:
Reduce the sidebar's semantic and visual weight before changing colors. Keep ShigoChat identity, room access, ambient controls, profile, and preferences, but compress secondary utilities and let conversation own the larger mass.

### V-003, the tablet breakpoint is structurally discontinuous

Severity: High
Scope: Responsive
Evidence: production 769, 768, and 767 px probes

Observed:
At 768 px the full 256 px desktop sidebar is present, leaving a 512 px main workspace. At 767 px the sidebar disappears and the conversation gets the full 767 px width. One pixel changes available conversation width by 255 px.

Why it matters:
The interface does not intentionally adapt through tablet widths. It abruptly switches between desktop and mobile compositions.

Likely source:
`Chatroom.jsx` uses `hidden md:block` for the full sidebar with no intermediate tablet state.

Recommendation:
Introduce a deliberate tablet shell, most likely collapsed navigation by default or a higher threshold for the expanded desktop rail. Do not merely move the existing breakpoint.

### V-004, mobile Preferences has real horizontal overflow

Severity: Critical
Scope: Responsive / behavioral
Evidence: production Preferences at 360 x 800, Storybook Preferences at 390 x 844

Observed:
At 360 px the sheet itself is 331 px wide, but its internal preferences region reaches about 398 px. The tab strip and tab panels extend outside the sheet. Selecting Security also shifts the internal content left, producing negative-x content while keeping the selected tab visible.

Why it matters:
Controls and content become partially off-canvas on a canonical mobile width. This is a functional responsive defect, not cosmetic polish.

Likely source:
`PreferencesShell` plus `Tabs`, specifically the `min-w-max` four-tab list inside padded containers, intrinsic content width, and the 92vw sheet.

Recommendation:
Fix containment and mobile section navigation at the Preferences composition layer. Every child must honor available sheet width. Use an intentionally scrollable tab rail with isolated overflow or a mobile-specific compact section selector, not intrinsic width that expands the panel.

### V-005, messaging is item-oriented rather than conversation-oriented

Severity: High
Scope: Core product
Evidence: production and Storybook messaging states

Observed:
Each incoming message repeats avatar, sender, timestamp, border, background, shadow, and a large inter-message gap. Own messages use a separate timestamp below the bubble. Consecutive messages do not visually group by sender or time.

Why it matters:
The screen looks like well-arranged message components rather than an inhabited, high-end conversation product. Repetition adds UI mass and weakens conversational rhythm.

Likely source:
`ShigoConversation` maps each message independently with `gap-5`; `ShigoMessage` owns repeated metadata and a fully framed `rounded-lg border ... shadow-panel` container.

Recommendation:
Establish sender/time grouping in the conversation model first. Use stronger spacing between groups and much tighter spacing within groups, show identity once per group where appropriate, and reduce framing before tuning individual bubble colors.

### P1, systemic

### V-006, the workspace reading measure is too rigid on large screens

Severity: Medium-High
Scope: Systemic

Observed:
The message and composer columns stay at 768 px while the main pane expands substantially, especially after the sidebar collapses. The result is very large symmetric gutters and a narrow visual strip floating inside the workspace.

Likely source:
`max-w-3xl` is repeated in production conversation and composer ownership.

Recommendation:
Create one shared conversation measure and alignment rule. Let it grow modestly on wide screens while keeping readable line lengths, and use the same geometry for transcript, day separators, and composer.

### V-007, the composer is contained twice

Severity: Medium
Scope: Systemic

Observed:
The composer sits inside a bordered/translucent footer and is itself a rounded bordered card with a panel shadow. A persistent 10 px keyboard-instruction row adds another band.

Why it matters:
The primary interaction looks more like a nested widget than a quiet continuation of the conversation.

Likely source:
`Chatroom.jsx` footer plus `ShigoComposer` surface classes.

Recommendation:
Choose one primary containment layer. Keep input affordance and focus clarity, but remove redundant border/shadow hierarchy and demote keyboard guidance.

### V-008, typography has too many micro tiers

Severity: Medium
Scope: Systemic

Observed:
The workspace repeatedly uses 10, 11, 12, 13, and 14 px text for hints, metadata, labels, room titles, section labels, and message body. The differences are technically consistent but perceptually weak.

Why it matters:
Hierarchy becomes dependent on tiny one-pixel jumps and muted color rather than clear role distinctions.

Recommendation:
Normalize typography into explicit roles: Display, Page title, Section heading, Conversation title, Body, Message body, UI label, Secondary metadata, and Micro metadata. Reserve 10 px for genuinely optional microcopy.

### V-009, borders and shadows are doing too much of the hierarchy work

Severity: Medium
Scope: Systemic

Observed:
Sidebar partitions, selected surfaces, message bubbles, composer, settings cards, tabs, sheets, and many controls are all separated with borders and/or panel shadows.

Why it matters:
The interface becomes a collection of framed components. Quiet luxury needs stronger composition, spacing, and controlled surface contrast, with borders used selectively.

Recommendation:
Keep the existing semantic token foundation. Reassign each surface to a clear role and remove redundant boundaries before adding any new colors or effects.

### V-010, Preferences reads as a generic settings template

Severity: Medium-High
Scope: Preferences

Observed:
A right sheet contains a bordered tab capsule, then bordered card sections, then bordered inputs and option cards. On desktop, the account form places two 171 px fields side by side inside a 448 px sheet.

Why it matters:
Settings feels embedded from a component kit rather than derived from the messenger's calm workspace language.

Recommendation:
Simplify the information architecture and nesting. Preserve the four domains, but make the settings shell itself provide hierarchy so individual sections need less card framing.

### V-011, the global Button primitive conflicts with Shigo Midnight precision

Severity: Medium
Scope: Primitive

Observed:
Every Button defaults to `rounded-full`, including primary CTAs, and the focus ring is hardcoded `#6B97FF` instead of the semantic `--ring` token.

Why it matters:
The pill language makes routine controls feel more generic and soft than the rest of the system, while the hardcoded blue creates an uncontrolled accent outside the violet semantic system.

Recommendation:
After canonical composition approval, normalize button radius by size/use case and route focus through the semantic ring token. Keep pills only where the product specifically benefits from them.

### V-012, the current conversation header is too quiet relative to its chrome

Severity: Medium
Scope: Workspace

Observed:
The title is 13 px and subtitle 11 px inside a 64 px header with a separate hash tile and two 36 px action buttons.

Why it matters:
The current conversation identity has less optical authority than the controls surrounding it.

Recommendation:
Promote the conversation-title role slightly, simplify redundant icon framing, and keep the header spatially light.

### V-013, mobile message actions are visually persistent

Severity: Medium
Scope: Messaging / mobile

Observed:
Own messages expose a 32 px ellipsis action control alongside the bubble in the normal mobile transcript.

Why it matters:
Routine conversation carries persistent management chrome even when no action is intended.

Recommendation:
Evaluate a less intrusive action affordance, such as press/long-press or a trailing control that appears only on focused/selected message state, while preserving discoverability and accessibility.

### V-014, Storybook's canonical composition framing is not a faithful full-screen product baseline

Severity: Medium
Scope: Audit infrastructure

Observed:
`QuietRoomComposition` uses a fixed 46rem height, capped viewport width, rounded border, dialog shadow, and the story uses `layout: centered`. Mobile stories use a capped 92vw card. This adds showcase-card styling around the product shell.

Why it matters:
It can make the canonical app composition look more like a portfolio component demo than the real production viewport and can hide or introduce responsive artifacts.

Recommendation:
After the design direction is approved, keep component stories but make canonical screen stories full-viewport or add dedicated full-viewport variants for visual regression.

### V-015, Storybook mobile compositions add preview-only overflow

Severity: Medium
Scope: Audit infrastructure

Observed:
The Quiet Room mobile story measured 391 px at a 390 px viewport and 363 px at 360 px. The Preferences story measured 399 px at 390 px.

Why it matters:
Preview framing can be mistaken for production overflow.

Recommendation:
Separate preview-shell defects from production defects. Production Quiet Room itself measured exactly 390 and 360 px wide, while production Preferences still has its own genuine overflow defect.

### P2, polish after P0/P1

- Optical icon alignment and stroke tuning.
- Timestamp placement refinements after message grouping is approved.
- Hover easing and shadow intensity.
- Minor label tracking and metadata contrast.
- Splash/auth atmospheric tuning after static compositions are settled.

## Behavioral observations

- Desktop sidebar collapse and expansion work in the production shell.
- Mobile navigation opens as a left sheet and remains within a 360 px viewport.
- Preferences opens through the real application interaction path.
- Theme switching works through Preferences and the header.
- Desktop message edit/delete actions appear on hover/focus.
- Mobile own-message actions use an ellipsis popover trigger.
- Keyboard tab order reaches sidebar controls, header actions, message edit/delete actions, then the composer. No obvious keyboard trap was observed in the sampled path.
- Storybook supplies useful explicit states for message actions/editing, composer reply/attachment, loading, and empty conversation.

## Current audit conclusion

ShigoChat already has a credible semantic foundation and a recognizable brand direction. Its weakness is not that it needs more decoration. The main screen currently behaves like a strong component library assembled into a messenger, rather than a messenger whose component system is subordinate to conversation. The redesign should therefore begin with conversation geometry, message grouping, navigation hierarchy, responsive shell behavior, and containment, then normalize primitives from the approved composition.
