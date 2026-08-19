# ShigoChat Redesign Proposal

Status: audit proposal only. No visual implementation is authorized by this document.

## Current visual diagnosis

ShigoChat has a stronger foundation than its current screen composition suggests. The live product already contains a coherent dark/light semantic theme, a distinct violet-led brand direction, Lucide-based iconography, deliberate auth/splash art direction, useful Storybook state coverage, and functional desktop/mobile shells.

The central problem is structural: the interface currently reads as a polished component system arranged into a messenger, rather than a messenger whose component system disappears behind the conversation.

The rendered evidence points to five primary causes:

1. Sparse conversations sit at the top of a large scroll field and feel disconnected from the composer.
2. The 256 px expanded sidebar has too much visual/semantic weight for a single-room product.
3. Messages are rendered as repeated standalone units rather than grouped conversational sequences.
4. The shell has no intentional tablet state, producing a severe 768/767 px breakpoint jump.
5. Borders, shadows, rounded cards, tiny typography tiers, and pill controls create more component framing than the Shigo Midnight concept needs.

There is also one critical responsive defect: mobile Preferences content can become wider than its sheet and shift laterally as the tab rail scrolls.

## What is already strong and should remain

### Semantic theme foundation

Keep `client/src/index.css` as the central theme owner. The current background, foreground, card, secondary, muted, border, ring, violet primary, teal signal, presence, warning, and message semantic tokens already provide enough vocabulary for the redesign.

Do not introduce a second palette or a parallel design-token system.

### Dark/light identity

The dark theme already starts from a credible near-black/navy family rather than generic charcoal. The light theme already uses an alabaster/lavender cast rather than pure white SaaS gray. Preserve that direction.

### Violet primary, teal signal

Soft electric violet should remain the expressive brand/action accent. Teal should remain secondary and semantic, mainly ambient, presence, and signal contexts. Do not let teal become a second general-purpose brand color.

### Lucide icon language

Lucide is consistent and appropriate. Keep it as the default icon family and refine size/stroke/optical placement rather than importing competing icon systems.

### Auth and splash art direction

The Playfair Display editorial headline, near-black expressive pane, shader/atmospheric layer, and restrained brand copy are the clearest expression of Shigo Midnight today. Preserve this identity while making the form side feel more related to the workspace.

### Motion vocabulary and reduced-motion intent

The global motion tokens are useful, and the production conversation already checks reduced-motion behavior for autoscroll. Keep a small timing/easing vocabulary and improve consistency rather than adding more libraries or effects.

### Storybook state coverage

Keep the existing high-value state stories. They provide useful coverage for conversation, message actions/editing, composer reply/attachment, auth, navigation, preferences, ambient media, and foundations.

## What makes the current interface feel weak/generic

### Repeated component framing

Messages, composer, tabs, settings sections, option cards, sheets, buttons, and sidebar regions frequently use their own border/radius/shadow combination. The result is visually orderly but reads like a component library showcase.

### Conversation is not the strongest spatial object

At 1440 px, the sidebar uses 256 px while the conversation column is capped at 768 px. When the sidebar collapses, the transcript remains 768 px, producing very large gutters instead of allowing the conversation to inherit more visual authority.

### Message rhythm lacks grouping

Incoming messages repeat avatar/name/time treatment. Every message has a large gap and its own framed bubble. Own-message metadata follows a different placement rule. The repetition makes each row a separate object instead of part of a flow.

### Micro-typography is overused

10, 11, 12, 13, and 14 px tiers appear throughout the core workspace. These one-pixel steps do not create enough perceptual hierarchy and make important labels too quiet.

### Default primitives are more generic than the brand system

The global Button primitive defaults to a full pill and currently hardcodes a blue focus ring. The pill geometry is too universal, and the blue focus treatment bypasses the semantic violet ring system.

### Settings hierarchy is nested rather than composed

Preferences uses a sheet, tab capsule, bordered section cards, bordered fields, and bordered option cards. It is technically clean but visually interchangeable with many component-library settings screens.

## Shigo Midnight design principles

1. **Conversation first.** Chrome supports the exchange and should lose any contest for attention against the transcript and composer.
2. **Quiet hierarchy, not low contrast everywhere.** Important regions should be obvious through proportion, spacing, type, and controlled surfaces, not by making every element similarly muted.
3. **Few surfaces with explicit jobs.** Background, navigation, workspace, raised control, and transient overlay should be enough for most screens.
4. **Violet is expressive, teal is semantic.** Avoid uncontrolled accent proliferation.
5. **Precision before softness.** Medium radii and crisp alignment should dominate routine product UI. Large soft containers are reserved for expressive/auth contexts.
6. **Grouping before decoration.** Conversation rhythm, settings information architecture, and navigation hierarchy should be solved before adding effects.
7. **Motion explains state or space.** Atmospheric motion belongs primarily to splash/auth/brand moments. Workspace motion should be functional and restrained.
8. **One canonical composition drives the system.** Quiet Room Desktop is approved first, then tokens/primitives are normalized from it, then mobile/settings/auth are derived.

## Proposed composition changes

### Quiet Room as a true application canvas

The production app already fills the viewport and should remain the visual truth. The redesigned canonical Storybook composition should also be represented as a full-viewport screen rather than only as a centered rounded showcase card.

### Reconnect sparse transcript and composer

For short histories, recent messages should visually settle toward the lower portion of the conversation viewport, close enough to the composer to feel like one live exchange. Long histories should continue to scroll normally.

The goal is not to pin every message to the bottom. The goal is to remove the artificial dead field that currently separates a sparse transcript from the place where the next message will be written.

### Use one shared conversation measure

Transcript, day separators, composer, and related message-state UI should derive from one composition-level measure instead of independently repeating `max-w-3xl`.

On wide desktops, allow modest growth beyond the current 768 px when it improves balance, while retaining readable message line lengths through bubble/group max widths.

### Simplify the header

Keep room identity and preferences/theme access, but reduce redundant framing around the hash icon. Promote the room title from micro-UI status to a real conversation-title role.

### Establish an intentional tablet shell

Do not activate the full 256 px sidebar at exactly 768 px. Tablet should use a collapsed rail or mobile-style navigation until there is enough room for expanded navigation plus a comfortable conversation pane.

## Proposed typography system

Use Inter for all product UI and message text. Reserve Playfair Display for expressive splash/auth/brand statements.

Recommended role system:

| Role | Suggested desktop target | Use |
| --- | --- | --- |
| Display | 56-72 px, Playfair | Splash/auth brand statements only |
| Page title | 28-32 px, 600 | Auth/settings top-level headings when needed |
| Section heading | 17-20 px, 600 | Preferences and major subregions |
| Conversation title | 14-16 px, 600 | Quiet Room header |
| Body | 14-15 px, 400 | General explanatory product copy |
| Message body | 14-15 px, 400, generous line height | Conversation content |
| UI label | 12-13 px, 500-600 | Navigation, fields, compact controls |
| Secondary metadata | 11-12 px | Username/time/status metadata |
| Micro metadata | 10-11 px, rare | Keyboard hint or nonessential status only |

Rules:

- Do not use a separate type size merely to make two adjacent labels feel different.
- Use weight, spacing, placement, and semantic color before adding another micro tier.
- Message content must never be visually subordinate to surrounding metadata.
- Uppercase tracked labels should remain rare and should identify real sections, not decorate ordinary controls.

## Proposed surface/color hierarchy

Use the existing semantic owners, with clearer usage rules:

| Role | Token owner | Direction |
| --- | --- | --- |
| App background | `--background` | Main canvas |
| Navigation background | `--shigo-shell` | Distinct but quiet shell |
| Workspace | `--background` | Conversation plane |
| Raised surface | `--card` / `--shigo-raised` | Composer, menus, overlays only when elevation is useful |
| Hover | `--accent` | Low-intensity interaction feedback |
| Selected | `--accent` plus controlled `--primary` emphasis | Selected navigation/settings state |
| Divider | `--border` | Use selectively, not around every region |
| Primary text | `--foreground` | Titles/message body |
| Secondary text | `--muted-foreground` | Supporting labels/status |
| Brand accent | `--primary` | Expressive primary action/focus/selection |
| Secondary signal | `--shigo-signal` | Ambient/presence/signal only |
| Success/presence | `--shigo-presence-online` | Presence/success contexts |
| Warning | `--shigo-warning` | Warning only |
| Error | `--destructive` | Error/destructive only |
| Focus | `--ring` | All focus-visible states |

Dark theme strategy:

- Keep the existing near-black/navy family.
- Increase perceived hierarchy by assigning surfaces more deliberately, not by introducing more dark values.
- Avoid simultaneous border + shadow + transparency unless the element genuinely floats.

Light theme strategy:

- Keep the alabaster/lavender background bias.
- Use clean white/raised surfaces sparingly.
- Avoid falling back to neutral gray SaaS cards.

## Proposed messaging language

### Group by conversational sequence

Consecutive messages from the same sender within a reasonable time window should form one group.

Within a group:

- avatar and sender identity appear once where appropriate,
- messages use tight vertical rhythm,
- timestamps are reduced or consolidated,
- edited/reaction/reply metadata attaches directly to the relevant message without creating a new visual band.

Between groups:

- use a larger spacing step,
- preserve clear sender change,
- let whitespace do more work than borders.

### Reduce bubble-card treatment

Do not eliminate all bubbles blindly. Incoming/outgoing distinction still needs to be immediate. Instead:

- reduce shadow usage on ordinary messages,
- use subtle surface contrast and shape rather than a framed card for every line,
- reserve stronger outlines/elevation for edit/reply/action states.

### Unify metadata logic

Incoming and own timestamps should feel like two variants of the same metadata system rather than unrelated placements.

### Message actions

Desktop actions can remain hover/focus driven but should feel attached to the message rather than like a floating mini-toolbar competing with it.

On mobile, the permanent ellipsis next to every own message should be reconsidered. A less persistent but accessible action pattern is preferable.

### Composer relationship

Composer should visually complete the conversation plane. Remove double containment, keep clear focus/send states, and demote persistent keyboard guidance.

## Proposed navigation language

### Expanded desktop

- Keep a left navigation area, but reduce its visual weight.
- Quiet Room should be unmistakably selected without becoming a large card.
- Ambient audio should become a secondary utility, not a major navigation section with equal mass.
- Profile and Preferences remain accessible but should not create another large visual block unless opened.

### Collapsed desktop

- Keep the 72 px concept as a useful compact mode.
- Preserve tooltips and focus-visible behavior.
- Ensure the collapsed state causes the main composition to rebalance, not merely expose larger empty gutters.

### Tablet

Use collapsed navigation or an off-canvas/mobile pattern by default. Avoid the current full 256 px rail at the 768 px threshold.

### Mobile

The left sheet works behaviorally and stays within the viewport. Simplify its internal hierarchy so the single-room product does not require a desktop-sized navigation model copied into a drawer.

## Proposed motion language

Classify all motion before implementation:

- Functional: focus, hover, send/disabled/loading feedback.
- Spatial: sidebar collapse, sheets, mobile nav, preferences transitions.
- Feedback: message edit/save, reactions, attachment changes.
- Atmospheric: subtle auth/splash background movement.
- Brand: optional magnetic interaction on splash/auth only.

Timing vocabulary should continue to use the existing global motion variables.

Recommendations:

- CSS transitions for color/opacity/simple transforms.
- Framer Motion only for meaningful React layout/state transitions.
- GSAP only where an approved high-expression interaction genuinely needs timeline/control capability.
- Do not add workspace parallax, magnetic cursor, ambient glow movement, or shader effects.
- Respect `prefers-reduced-motion` for every new transition or effect.

## Desktop strategy

1. Make Quiet Room Desktop the approved canonical composition.
2. Correct transcript vertical gravity.
3. Rebalance navigation versus workspace mass.
4. Establish the shared conversation measure.
5. Establish grouped message rhythm.
6. Integrate composer visually with the transcript.
7. Refine header hierarchy.
8. Only then normalize typography, surface, radius, and button/input primitives from what the approved screen proves it needs.

The target should feel calm because unnecessary interface is absent, not because everything is low-contrast.

## Mobile strategy

Mobile is a separate composition, not a shrunken desktop.

Priorities:

1. Fix Preferences horizontal overflow before visual refinement.
2. Keep the conversation full-width and composer reachable without obstruction.
3. Preserve 360 px as a hard stress case.
4. Use a compact navigation model appropriate to one primary room.
5. Reduce persistent message-management chrome.
6. Keep tap targets comfortably large even if visual chrome is reduced.
7. Ensure long messages, edit state, replies, attachments, and sheets remain within the viewport.
8. Test 430, 390, and 360 px after every major mobile composition change.

## Auth/splash strategy

Auth and splash may carry more expression than the workspace.

Keep:

- Playfair Display for the main brand statement,
- the near-black expressive art pane,
- restrained shader/atmospheric depth,
- concise Shigo Midnight copy,
- stronger composition than ordinary product screens.

Refine:

- make form-side controls use the same radius/focus/action language as the approved workspace,
- reduce generic SaaS form-card cues,
- keep primary CTA hierarchy clear,
- keep magnetic cursor optional and restricted to intentional brand moments,
- verify reduced-motion and mobile performance before enabling higher-expression effects.

The transition from splash/auth into Quiet Room should feel like the same brand lowering its intensity for conversation, not like entering a different product.

## Elements to remove or simplify

- Full-card border/shadow treatment on every ordinary message.
- Repeated avatar/name/timestamp treatment for every consecutive incoming message.
- Redundant composer footer + composer-card containment.
- Excessive use of `rounded-full` for routine buttons.
- Hardcoded blue button focus ring, route focus through `--ring`.
- Multiple sidebar section bands when the IA does not justify them.
- Persistent 10 px keyboard guidance if it can be contextual or less prominent.
- Excessive Preferences card nesting.
- Full expanded sidebar at tablet widths where it collapses the conversation.
- Storybook-only centered showcase framing as the sole canonical composition baseline.

## Elements worth making more expressive

- Splash headline and atmospheric background.
- Auth brand pane and transition into the app.
- Quiet Room selected-state detail, using restrained violet.
- Composer focus/send moment, subtle and functional.
- Presence/ambient signal using teal only where semantically meaningful.
- Empty Quiet Room state, using typography and space rather than extra decoration.
- A small number of brand microinteractions that do not enter routine message reading.

## Ordered implementation sequence

This sequence begins only after user approval of this proposal.

1. **Canonical Quiet Room geometry**
   - Convert the design-review Storybook composition to a faithful full-viewport reference or add an equivalent canonical variant.
   - Correct sparse transcript vertical gravity.
   - Establish the shared conversation measure.

2. **Navigation hierarchy**
   - Rebalance expanded desktop sidebar.
   - Preserve and refine collapsed state.
   - Establish the intended tablet navigation state.

3. **Messaging language**
   - Introduce sender/time grouping.
   - Reduce per-message framing.
   - Normalize metadata placement.
   - Refine desktop/mobile action affordances without changing behavior contracts.

4. **Composer integration**
   - Remove double containment.
   - Keep reply/attachment/edit-related behavior intact.
   - Normalize hint/focus/send hierarchy.

5. **Header hierarchy**
   - Promote conversation title.
   - Simplify redundant icon framing.
   - Align header geometry with the approved transcript measure.

6. **Derive the design system from the approved composition**
   - Normalize typography roles.
   - Normalize surface/elevation usage.
   - Normalize radius language.
   - Fix Button semantic focus/radius behavior.
   - Keep Input and other primitives aligned with semantic tokens.

7. **Preferences**
   - First fix the mobile overflow defect.
   - Then derive the settings hierarchy from the approved workspace language.
   - Reduce nested card framing.

8. **Tablet and mobile Quiet Room**
   - Build intentional responsive composition from desktop principles.
   - Verify 1024, 768, 430, 390, and 360 px through Playwright.

9. **Login and Register**
   - Preserve expressive identity.
   - Apply approved primitive and typography language.
   - Verify empty/populated/error/loading/focus states.

10. **Splash**
    - Keep as the highest-expression surface.
    - Refine motion only after static composition is approved.
    - Verify reduced motion and performance.

11. **Motion pass**
    - Audit every motion by functional/spatial/feedback/atmospheric/brand class.
    - Remove ornamental motion that competes with conversation.

12. **Visual regression protection**
    - Add deterministic Playwright screenshot baselines only after visual approval.
    - Keep canonical Storybook contracts focused on meaningful states.

13. **Integrated QA**
    - Fresh Playwright inspection of final HEAD across desktop/tablet/mobile and dark/light.
    - Functional tests, TypeScript, CRA production build, Storybook build, server checks, accessibility and console review.
    - Final review document with remaining intentional compromises and debt.

## Approval gate

No implementation should begin until this proposal is approved or revised. The first implementation target after approval is Quiet Room Desktop, not global primitive cleanup and not a simultaneous application-wide redesign.
