# Shigo Midnight Art Direction Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the validated Shigo Midnight UX foundation into a visually unmistakable, premium messenger while preserving the proven conversation geometry, responsive behavior, accessibility, and interaction contracts, and fix the Splash white-strip viewport defect.

**Architecture:** Keep the current semantic token architecture in `client/src/index.css` as the single design-system owner. Apply a coherent art-direction motif, **Midnight Velvet + Luminous Seam**, through existing Shigo components and a small shared Quiet Room header primitive so production and Storybook cannot drift. Use the existing GitHub Actions visual-evidence workflow as the rendered acceptance gate after every major visual phase.

**Tech Stack:** React 19, TypeScript/JSX, Tailwind CSS 3.4, Storybook 10, Lucide, existing Shigo semantic CSS tokens, existing motion tokens, GitHub Actions visual evidence pipeline.

**Spec:** `docs/design-audit/REDESIGN_PROPOSAL.md`, `docs/design-audit/21st-reference-study.md`

## Global Constraints

- Preserve electric violet as the primary expressive brand/action accent.
- Preserve the near-black/navy dark foundation and alabaster/lavender light foundation.
- Teal remains semantic only: presence, ambient, signal, success. Do not use teal as decorative atmosphere.
- Keep Lucide iconography, Inter for product UI/messages, and Playfair Display only for expressive brand moments.
- Keep `client/src/index.css` as the single semantic token owner. Do not add a parallel token/theme system.
- Preserve the 768 px conversation measure in `CONVERSATION_MEASURE_CLASS`.
- Preserve message grouping logic, sparse bottom gravity, user-controlled scroll behavior, mobile drawer behavior, and the current `xl` expanded-sidebar breakpoint.
- Preserve all authentication and messaging behavior contracts.
- Do not enable production email-only forgot-password reset; the Storybook-only presentation stays non-production.
- Preserve semantic violet focus treatment and the recently enlarged interaction targets.
- No workspace shaders, parallax, magnetic cursor, glassmorphism, neon framing, or decorative teal glow.
- Atmospheric motion remains confined to auth/splash; workspace motion stays functional and restrained.
- Respect `prefers-reduced-motion` for every new transition/effect.
- Do not deploy or update Render as part of this plan.
- Do not widen the transcript to create visual impact. Art direction must work on the validated geometry.
- Do not delete useful Storybook `Reference/...` or `Internal/...` material.

## Art Direction Target

### Motif: Midnight Velvet + Luminous Seam

**Midnight Velvet** means dark surfaces should feel deep, soft, and layered without becoming void-black or glassy. Use very low-opacity violet-aware tonal depth, controlled edge highlights, and deliberate surface stepping. The workspace remains quiet enough for messages to dominate.

**Luminous Seam** means selected/focused/brand-critical states receive one precise violet cue: a thin seam, restrained inner highlight, or low-energy halo. Never stack seam + bright border + glow + gradient on one routine control.

### Surface rules

1. App canvas: near-black/navy, with one static low-opacity violet atmospheric wash in Quiet Room.
2. Navigation shell: slightly more violet-biased/dense than the canvas, no floating-card appearance.
3. Routine message surfaces: tonal contrast first, no routine drop shadow.
4. Composer: raised terminal surface with a precise top/edge highlight and a subtle violet focus halo.
5. Floating menus/dialogs: keep actual elevation/shadow because they genuinely float.
6. Auth/splash: highest visual expression, with Playfair + shader + editorial negative space.

### Acceptance impression

The final result must read as a designed identity rather than a polished component library. At a glance, it should not resemble Discord, Slack, a generic shadcn dashboard, an AI chatbot, or a 21st.dev showcase.

---

### Task 1: Fix the Splash viewport defect before visual enrichment

**Files:**
- Create: `client/src/components/ui/shigo-splash.test.tsx`
- Modify: `client/src/components/ui/shigo-splash.tsx`
- Verify: `client/src/stories/ShigoSplash.stories.tsx`
- Verify: `client/scripts/capture-visual-audit.mjs`

**Interfaces:**
- Consumes: existing `ShigoSplashProps` and existing fullscreen Splash stories.
- Produces: a reusable Splash surface that owns a full viewport itself and cannot expose the underlying light `body` below it.

- [ ] **Step 1: Write the failing Splash viewport regression test**

Create `shigo-splash.test.tsx` that renders `<ShigoSplash showAction={false} />`, locates the outer Splash surface from the `A quieter place to connect.` heading, and asserts that the root contains a viewport-filling minimum-height class (`min-h-screen` plus `min-h-[100dvh]`, or the final equivalent selected during implementation).

```tsx
import { render, screen } from "@testing-library/react";
import { ShigoSplash } from "./shigo-splash";

test("owns the full viewport so no page background can show below the splash", () => {
  render(<ShigoSplash showAction={false} />);
  const heading = screen.getByRole("heading", { name: /a quieter place to connect/i });
  const splash = heading.closest("[data-shigo-splash]");
  expect(splash).toHaveClass("min-h-screen");
  expect(splash).toHaveClass("min-h-[100dvh]");
});
```

- [ ] **Step 2: Run the new test and verify RED**

Run:

```bash
cd client
npm test -- --watchAll=false --runInBand shigo-splash.test.tsx
```

Expected: FAIL because the current root only guarantees `min-h-[36rem]`.

- [ ] **Step 3: Make the reusable Splash own the viewport**

In `SplashContent`, add `data-shigo-splash` and replace the fixed 36rem minimum as the primary sizing rule with viewport-safe sizing:

```tsx
<div
  data-shigo-splash
  className="relative flex min-h-screen min-h-[100dvh] w-full flex-col overflow-hidden bg-[#090A0F] text-white"
>
```

Keep the internal header/main/footer flex composition. Do not solve this with a Storybook-only background override.

- [ ] **Step 4: Run the Splash test and existing client tests**

```bash
npm test -- --watchAll=false --runInBand shigo-splash.test.tsx
npm test -- --watchAll=false --runInBand
```

Expected: PASS.

- [ ] **Step 5: Verify rendered evidence**

Run the existing GitHub visual evidence workflow after push and inspect at minimum:

- Splash 1280x900 dark
- Splash 390x844 dark
- Splash 1280x900 reduced motion

Acceptance: zero white/light strip at any edge; dark surface reaches the exact viewport bottom.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/ui/shigo-splash.tsx client/src/components/ui/shigo-splash.test.tsx
git commit -m "fix: make Shigo splash fill viewport"
```

---

### Task 2: Refine the semantic Midnight Velvet foundation

**Files:**
- Modify: `client/src/index.css`
- Modify: `client/src/components/ui/shigo-foundations.tsx`
- Verify: `client/src/stories/FoundationsColors.stories.tsx`
- Verify: `client/src/stories/FoundationsShadows.stories.tsx`
- Verify: `client/src/stories/FoundationsTypography.stories.tsx`

**Interfaces:**
- Consumes: existing semantic variables (`--background`, `--shigo-shell`, `--shigo-raised`, `--shigo-own-message`, `--shigo-other-message`, `--primary`, `--ring`, existing shadow/motion variables).
- Produces: refined existing token values and documented foundation previews. No second token namespace.

- [ ] **Step 1: Add a token-contract regression assertion to `shigo-polish.test.tsx`**

Assert that production Shigo surfaces continue to use semantic classes (`bg-background`, `bg-shigo-shell`, `bg-shigo-raised`, `bg-shigo-own-message`, `bg-shigo-other-message`) rather than new hard-coded routine colors. This protects the single-owner token architecture during the pass.

- [ ] **Step 2: Run the targeted test and verify it protects the current contract**

```bash
npm test -- --watchAll=false --runInBand shigo-polish.test.tsx
```

- [ ] **Step 3: Refine existing dark token values, not names**

Adjust only existing dark semantic values to increase visible depth between canvas, shell, raised controls, and messages. Keep changes small enough that violet remains an accent rather than a wash. Target relationships:

- `--background`: deepest neutral/navy plane.
- `--shigo-shell`: visibly distinct but still subordinate.
- `--shigo-raised`: one controlled step above shell for composer/control surfaces.
- `--shigo-other-message`: slightly more legible against the canvas than today.
- `--shigo-own-message`: slightly richer violet tint than today, still far below Violet Bloom saturation density.
- Keep `--ring` unchanged unless contrast testing proves a small adjustment is required.

Do not introduce teal into any of these surfaces.

- [ ] **Step 4: Refine light-mode parity**

Preserve alabaster/lavender bias. Increase differentiation between `--background`, `--shigo-shell`, and `--shigo-raised` without reverting to neutral gray or pure-white card stacks.

- [ ] **Step 5: Update `shigo-foundations.tsx` only if previews need clearer labels/examples**

Foundation stories should make canvas, shell, raised, own-message, other-message, focus, and floating elevation visually comparable.

- [ ] **Step 6: Run tests, TypeScript, Storybook build**

```bash
npm test -- --watchAll=false --runInBand
npx tsc --noEmit
npm run build-storybook
```

- [ ] **Step 7: Commit**

```bash
git add client/src/index.css client/src/components/ui/shigo-foundations.tsx client/src/components/ui/shigo-polish.test.tsx
git commit -m "refactor: deepen Shigo Midnight surface hierarchy"
```

---

### Task 3: Create one shared Quiet Room header and art-direct the workspace canvas

**Files:**
- Create: `client/src/components/ui/quiet-room-header.tsx`
- Create: `client/src/components/ui/quiet-room-header.test.tsx`
- Modify: `client/src/pages/Chatroom.jsx`
- Modify: `client/src/components/ui/quiet-room-composition.tsx`
- Modify: `client/src/stories/QuietRoomComposition.stories.tsx`

**Interfaces:**
- Produces:

```ts
export interface QuietRoomHeaderProps {
  mobileNav?: ReactNode;
  onToggleTheme?: () => void;
  onPreferences?: () => void;
  darkMode?: boolean;
  showThemeToggle?: boolean;
}
```

- The header owns room identity and header action styling only. Production retains routing/state callbacks.
- `quiet-room-composition.tsx` must consume the same header so visual review cannot drift from production.

- [ ] **Step 1: Write the failing header tests**

Test that the shared header renders `Quiet Room`, the calm-room supporting copy, an optional mobile-nav slot, Preferences control, and optional theme control with existing accessible labels.

- [ ] **Step 2: Run test and verify RED because the shared primitive does not exist**

```bash
npm test -- --watchAll=false --runInBand quiet-room-header.test.tsx
```

- [ ] **Step 3: Implement the shared header with Luminous Seam styling**

Visual target:

- 56px height remains unchanged.
- `Quiet Room` becomes a 14-15px/600 conversation title.
- supporting line remains 11-12px and clearly subordinate.
- hash mark receives restrained violet emphasis, not its own framed badge.
- replace the strong full-width border impression with a lower-energy semantic divider or gradient hairline.
- header actions remain compact and visually quieter than room identity.

Do not use Playfair in the workspace header.

- [ ] **Step 4: Replace duplicated header implementations in production and Storybook composition**

`Chatroom.jsx` and `quiet-room-composition.tsx` must use `QuietRoomHeader`.

- [ ] **Step 5: Add static Midnight Velvet workspace atmosphere**

Apply one non-interactive, non-animated violet-aware background layer to the Quiet Room main canvas. Use pseudo/absolute layers or CSS gradients at very low opacity. Requirements:

- no teal decorative glow,
- no blur-through-glass panels,
- no moving shader,
- atmosphere must disappear perceptually behind message content,
- text contrast remains unchanged,
- light mode gets an equally restrained lavender cast rather than a dark-mode effect transplanted into light mode.

- [ ] **Step 6: Add a light-theme composition variant**

Extend `QuietRoomComposition` with a `theme?: "dark" | "light"` prop instead of hard-coding `dark`, then add `LightDesktop` and `LightMobile` stories.

- [ ] **Step 7: Run tests and Storybook build**

```bash
npm test -- --watchAll=false --runInBand quiet-room-header.test.tsx shigo-conversation.test.tsx
npx tsc --noEmit
npm run build-storybook
```

- [ ] **Step 8: Commit**

```bash
git add client/src/components/ui/quiet-room-header.tsx client/src/components/ui/quiet-room-header.test.tsx client/src/pages/Chatroom.jsx client/src/components/ui/quiet-room-composition.tsx client/src/stories/QuietRoomComposition.stories.tsx
git commit -m "feat: art direct Quiet Room canvas and header"
```

---

### Task 4: Make navigation feel bespoke without regaining visual weight

**Files:**
- Modify: `client/src/components/ui/app-sidebar.tsx`
- Modify: `client/src/components/ui/profile-menu.tsx` only if needed for bottom-region continuity
- Modify: `client/src/stories/AppSidebar.stories.tsx`
- Test: extend `client/src/components/ui/shigo-polish.test.tsx`

**Interfaces:**
- Preserve all `AppSidebarProps` callbacks and the 72px/224px geometry.

- [ ] **Step 1: Add regression assertions for sidebar geometry**

Lock `w-[4.5rem]` collapsed and `w-56` expanded so art direction cannot accidentally undo validated shell proportions.

- [ ] **Step 2: Replace the selected-room card cue with the Luminous Seam**

Visual target for expanded Quiet Room item:

- low-energy violet tint, weaker than current card-like selection,
- a precise 1-2px violet seam/indicator on the leading edge,
- no drop shadow,
- no oversized radius,
- title remains stronger than status.

Collapsed selected state should echo the same identity using a small violet seam/dot/edge cue instead of a larger filled button.

- [ ] **Step 3: Refine the Shigo monogram/header block**

Make the `S` mark feel more like brand hardware and less like a generic primary-color square. Preserve readable contrast and medium radius. Keep it restrained enough that Quiet Room remains the sidebar's main semantic target.

- [ ] **Step 4: Reduce ambient/profile section banding**

Use spacing and tonal continuity before separators. Keep actual boundaries only where interaction or hierarchy needs them.

- [ ] **Step 5: Run targeted and full tests**

```bash
npm test -- --watchAll=false --runInBand shigo-polish.test.tsx
npm test -- --watchAll=false --runInBand
```

- [ ] **Step 6: Commit**

```bash
git add client/src/components/ui/app-sidebar.tsx client/src/components/ui/profile-menu.tsx client/src/stories/AppSidebar.stories.tsx client/src/components/ui/shigo-polish.test.tsx
git commit -m "refactor: give Shigo navigation a luminous seam"
```

---

### Task 5: Art-direct message material and grouped rhythm

**Files:**
- Modify: `client/src/components/ui/shigo-message.tsx`
- Modify: `client/src/components/ui/shigo-message.test.tsx`
- Verify: `client/src/components/ui/shigo-conversation.tsx`
- Modify: `client/src/stories/ShigoMessage.stories.tsx`
- Modify: `client/src/stories/ShigoConversation.stories.tsx`

**Interfaces:**
- Preserve `MessageGroupPosition`, sender grouping, metadata logic, edit/reply/react/delete contracts, and mobile action behavior.

- [ ] **Step 1: Add group-position rendering tests before styling changes**

Extend tests to render `single`, `start`, `middle`, and `end` positions for incoming and own messages and assert stable semantic data attributes/classes used for radius styling. Introduce `data-group-position={groupPosition}` and `data-message-owner={own ? "self" : "other"}` if no stable selector exists.

- [ ] **Step 2: Run tests and verify RED for the new stable selectors**

- [ ] **Step 3: Implement stable selectors without changing behavior**

- [ ] **Step 4: Refine message surfaces**

Target:

- routine bubbles remain shadowless,
- received messages use refined `--shigo-other-message`,
- own messages use the richer-but-restrained `--shigo-own-message`,
- one extremely subtle inner/top highlight is allowed only if it improves material separation,
- no bright border around every bubble,
- message body remains the strongest text inside the message unit.

- [ ] **Step 5: Make group geometry visibly intentional**

Use `groupPosition` to tighten the corners that visually connect consecutive messages while keeping a comfortable outer contour. Do not turn the transcript into Telegram/Discord mimicry. The change should be visible at a glance but secondary to the content.

- [ ] **Step 6: Refine metadata and actions**

- sender identity: clear but quieter than message body,
- timestamp/edited metadata: one consistent low-authority tier,
- desktop action bar: tonal popover, not a competing floating toolbar,
- mobile action button remains accessible and only persists where current group-end logic requires it.

- [ ] **Step 7: Run message/conversation tests**

```bash
npm test -- --watchAll=false --runInBand shigo-message.test.tsx shigo-conversation.test.tsx
```

- [ ] **Step 8: Commit**

```bash
git add client/src/components/ui/shigo-message.tsx client/src/components/ui/shigo-message.test.tsx client/src/stories/ShigoMessage.stories.tsx client/src/stories/ShigoConversation.stories.tsx
git commit -m "feat: refine Shigo message material and grouping"
```

---

### Task 6: Turn the composer into the signature Shigo interaction object

**Files:**
- Modify: `client/src/components/ui/shigo-composer.tsx`
- Create or extend: `client/src/components/ui/shigo-composer.test.tsx`
- Modify: `client/src/stories/ShigoComposer.stories.tsx`

**Interfaces:**
- Preserve send, attachment, emoji, reply, disabled, keyboard, and textarea-resize behavior.

- [ ] **Step 1: Write/extend behavioral tests before style changes**

Cover:

- Enter sends and Shift+Enter does not,
- send disabled when content/attachments are empty,
- reply cancel remains reachable,
- attachment/emoji controls retain accessible names,
- root exposes a stable `data-shigo-composer` selector for visual/contract tests.

- [ ] **Step 2: Run targeted tests and verify any new selector assertion is RED**

- [ ] **Step 3: Apply the signature terminal-surface treatment**

Target:

- slightly deeper raised surface than surrounding canvas,
- precise top/edge highlight rather than a generic card border,
- medium radius remains,
- no glass blur,
- no routine drop shadow,
- focus-within gets a single violet semantic halo/seam using `--ring`/`--primary`,
- active send button may receive a very small violet energy halo only while send is enabled,
- attachment/reply bands inherit the same material language.

- [ ] **Step 4: Demote keyboard guidance**

Keep the guidance for desktop, but make it appear only when the composer is focused or otherwise lower its constant visual presence. Do not remove accessible keyboard behavior.

- [ ] **Step 5: Verify reply/attachment/disabled stories**

- [ ] **Step 6: Run tests**

```bash
npm test -- --watchAll=false --runInBand shigo-composer.test.tsx
npm test -- --watchAll=false --runInBand
```

- [ ] **Step 7: Commit**

```bash
git add client/src/components/ui/shigo-composer.tsx client/src/components/ui/shigo-composer.test.tsx client/src/stories/ShigoComposer.stories.tsx
git commit -m "feat: make composer the Shigo signature interaction"
```

---

### Task 7: Bring Preferences and transient surfaces into the same visual language

**Files:**
- Modify: `client/src/components/ui/preferences-shell.tsx`
- Modify: `client/src/components/ui/settings-panels.tsx`
- Modify: `client/src/stories/PreferencesShell.stories.tsx`
- Test: existing Preferences/sheet/hit-target tests; extend only if a behavior contract changes.

**Interfaces:**
- Preserve 2x2 mobile section navigation, current section contracts, sheet containment, 40px close target, and existing settings behavior.

- [ ] **Step 1: Capture current Preferences behavior through existing tests before editing**

```bash
npm test -- --watchAll=false --runInBand sheet-hit-target.test.tsx shigo-polish.test.tsx
```

- [ ] **Step 2: Refine hierarchy without reintroducing nested cards**

Target:

- section headings gain stronger typography/spacing,
- selected section uses a low-energy violet seam/tint consistent with navigation,
- fields/options rely on alignment and tonal surface stepping before borders,
- security separation uses spacing/hairline, not a new card,
- mobile remains stable at 360px and 390px.

- [ ] **Step 3: Keep transient overlays genuinely elevated**

Sheets/popovers/dialogs may retain stronger shadow than workspace surfaces because they float. Do not flatten them to the point that modality becomes ambiguous.

- [ ] **Step 4: Run tests and Storybook build**

```bash
npm test -- --watchAll=false --runInBand
npx tsc --noEmit
npm run build-storybook
```

- [ ] **Step 5: Commit**

```bash
git add client/src/components/ui/preferences-shell.tsx client/src/components/ui/settings-panels.tsx client/src/stories/PreferencesShell.stories.tsx
git commit -m "refactor: align preferences with Shigo art direction"
```

---

### Task 8: Push auth and Splash farther as expressive brand moments

**Files:**
- Modify: `client/src/components/ui/auth-shell.tsx`
- Modify: `client/src/components/ui/auth-shader-pane.tsx`
- Modify: `client/src/components/ui/shigo-auth-form.tsx` only for visual hierarchy, not validation/behavior
- Modify: `client/src/components/ui/shigo-splash.tsx`
- Verify: `client/src/components/ui/shigo-shader.tsx`
- Modify: auth/splash Storybook stories only as necessary for final state coverage

**Interfaces:**
- Preserve login/register mode switching, loading/error behavior, mobile compact mode, shader reduced-motion behavior, Splash auto-navigation wrapper behavior, and disabled forgot-password production behavior.

- [ ] **Step 1: Run auth/splash-related tests before editing**

Use existing auth/polish tests plus the new Splash viewport test.

- [ ] **Step 2: Refine desktop AuthShell composition**

Target:

- reduce the impression of a generic SaaS modal/card,
- preserve asymmetric split layout,
- art pane remains the strongest branded area,
- form pane feels like the same material family as Quiet Room,
- border/shadow are restrained and only communicate the large composed surface,
- no inner form card is added.

- [ ] **Step 3: Refine mobile auth**

Compact/mobile should feel like a deliberate full-canvas brand surface, not a floating boxed card. Preserve readable form width and 40px password targets.

- [ ] **Step 4: Enrich Splash without increasing noise**

Keep Playfair headline, shader, header/footer, and concise copy. Improve editorial balance through typography, negative space, atmospheric gradient calibration, and brand micro-detail only. Do not add new decorative objects merely to make it busier.

The viewport-fill fix from Task 1 remains mandatory and must not regress.

- [ ] **Step 5: Verify reduced motion**

No new expressive movement may run under `prefers-reduced-motion: reduce`. Static atmospheric depth remains allowed.

- [ ] **Step 6: Run tests/types/builds**

```bash
npm test -- --watchAll=false --runInBand
npx tsc --noEmit
npm run build
npm run build-storybook
```

- [ ] **Step 7: Commit**

```bash
git add client/src/components/ui/auth-shell.tsx client/src/components/ui/auth-shader-pane.tsx client/src/components/ui/shigo-auth-form.tsx client/src/components/ui/shigo-splash.tsx client/src/stories
git commit -m "feat: elevate Shigo auth and splash art direction"
```

---

### Task 9: Refine motion as a system, not as decoration

**Files:**
- Modify only components touched above where motion needs adjustment.
- Modify `client/src/index.css` only if existing motion variables require calibration.

**Interfaces:**
- Keep existing timing vocabulary: `--motion-fast`, `--motion-base`, `--motion-slow`, `--motion-panel`, `--motion-expressive`, `--ease-standard`, `--ease-emphasized`.

- [ ] **Step 1: Inventory every new transition introduced in Tasks 3-8**

Classify each as functional, spatial, feedback, atmospheric, or brand.

- [ ] **Step 2: Remove decorative workspace motion**

Workspace atmosphere must be static. Message bubbles do not pulse. Sidebar seams do not glow continuously. Composer halo appears only through interaction state.

- [ ] **Step 3: Normalize timing**

- hover/focus color/opacity: fast/base,
- composer focus/send feedback: base/slow,
- sidebar/sheet spatial transitions: panel,
- auth/splash atmospheric/brand transitions: expressive only where already appropriate.

- [ ] **Step 4: Verify reduced-motion behavior**

Use existing CSS global reduction plus component-specific guards where JS animation exists.

- [ ] **Step 5: Run full client verification**

```bash
npm test -- --watchAll=false --runInBand
npx tsc --noEmit
npm run build
npm run build-storybook
```

- [ ] **Step 6: Commit**

```bash
git add client/src/index.css client/src/components/ui client/src/pages
git commit -m "refactor: normalize Shigo Midnight motion language"
```

---

### Task 10: Expand GitHub visual evidence for art-direction sign-off

**Files:**
- Modify: `client/scripts/capture-visual-audit.mjs`
- Verify: `.github/workflows/shigo-visual-evidence.yml`

**Interfaces:**
- Preserve artifact naming `shigo-visual-audit-<head-sha>` and 30-day retention.
- Continue producing `manifest.json` with story, viewport, theme, reduced-motion, and browser events.

- [ ] **Step 1: Add art-direction comparison targets**

Keep the existing 27-state set and add at minimum:

- Quiet Room Desktop light 1440x1000,
- Quiet Room Mobile light 390x844,
- Quiet Room Desktop dark 1280x900,
- Quiet Room tablet dark 1024x800,
- Quiet Room tablet dark 900x800,
- Quiet Room mobile dark 430x900,
- Composer typed/focused state at desktop width if Storybook has or gains a deterministic story,
- Splash 1440x1000 dark in addition to 1280x900,
- Auth desktop/mobile states after art direction.

- [ ] **Step 2: Add a deterministic typed/focused composer Storybook state if needed**

Do not simulate manual focus in the screenshot script when the same state can be represented deterministically in a story.

- [ ] **Step 3: Run local syntax/build checks for the capture script**

```bash
node --check client/scripts/capture-visual-audit.mjs
cd client
npm run build-storybook
```

- [ ] **Step 4: Push and require both GitHub workflows to pass on the exact head SHA**

Required checks:

- `Verify Storybook TypeScript baseline`
- `Capture Shigo visual evidence`

- [ ] **Step 5: Retrieve the generated artifact through GitHub and inspect the contact set**

Sign-off matrix:

1. Quiet Room has visible premium identity without distracting from conversation.
2. Navigation remains subordinate.
3. Luminous seam is consistent across selected/focused states and never becomes neon.
4. Message grouping feels more human and materially intentional.
5. Composer is recognizably the signature interaction object.
6. Dark and light themes feel intentionally related, not like color inversions.
7. Auth/Splash are more expressive than workspace but clearly the same product.
8. Splash has **no white/light strip** at the bottom at any captured viewport.
9. 768px conversation measure, sparse gravity, scroll behavior, and responsive shell remain intact.
10. 360/390/430 mobile views remain intentional and unclipped.
11. Reduced-motion Splash remains visually complete and static.
12. No browser errors introduced in the manifest.

- [ ] **Step 6: Commit**

```bash
git add client/scripts/capture-visual-audit.mjs client/src/stories
git commit -m "test: expand Shigo art direction visual evidence"
```

---

### Task 11: Final engineering gate and handoff

**Files:**
- No new product files unless verification exposes a defect.
- Update design audit docs only if implementation materially changes documented visual rules.

- [ ] **Step 1: Run the complete client gate**

```bash
cd client
npm test -- --watchAll=false --runInBand
npx tsc --noEmit
npm run build
npm run build-storybook
```

- [ ] **Step 2: Run root/server verification through the existing GitHub workflow**

Do not weaken audit policy, Node matrix, or Windows launcher smoke tests.

- [ ] **Step 3: Confirm exact branch head and both workflows are green**

Record the final SHA in the implementation handoff.

- [ ] **Step 4: Retrieve the final GitHub visual artifact and produce the final visual sign-off report**

Report P0/P1/P2/P3 findings. Do not declare Art Direction complete if a P0/P1 remains. Any P2 must be explicitly accepted or fixed.

- [ ] **Step 5: Do not deploy Render**

Deployment remains a separate user-controlled decision after visual approval.

- [ ] **Step 6: Final commit only if documentation changed**

```bash
git add docs/design-audit
git commit -m "docs: record Shigo Midnight art direction outcome"
```

## Self-Review

### Spec coverage

- Conversation-first hierarchy: Tasks 3-6.
- Violet primary / teal semantic: Global constraints + Tasks 2-6.
- Premium restraint without glass/neon: Art Direction Target + Tasks 2-8.
- 768px conversation measure preserved: Global constraints + Task 10 sign-off.
- Sidebar hierarchy and responsive geometry preserved: Task 4.
- Grouped messages preserved and visually strengthened: Task 5.
- Composer integration and signature treatment: Task 6.
- Preferences containment/mobile behavior preserved: Task 7.
- Auth/Splash expression strengthened: Task 8.
- Splash white-strip defect explicitly fixed and regression-tested: Task 1 + Task 10.
- Reduced motion: Global constraints + Tasks 8-10.
- GitHub-hosted visual evidence: Task 10.
- No Render deployment: Global constraints + Task 11.

### Placeholder scan

No TBD/TODO/fill-later steps remain. Each task names concrete files, acceptance targets, verification commands, and commit boundaries.

### Type/interface consistency

The only new shared product interface is `QuietRoomHeaderProps`; both production `Chatroom.jsx` and Storybook `quiet-room-composition.tsx` consume it. `QuietRoomComposition` gains only a visual `theme` prop, with no production behavior coupling.

## Execution Order

Execute tasks strictly in order. Task 1 is a standalone defect correction and visual baseline repair. Tasks 2-9 form the art-direction implementation. Task 10 is the rendered evidence expansion and sign-off gate. Task 11 is final verification only.
