# Shigo Midnight: Living Sanctuary

**Status:** Approved design direction, implementation not started  
**Branch baseline:** `storybook-typescript-baseline` at `46f161fd0183ca1c1b0079a12e887180a6bbd995`  
**Date:** 2026-08-20

## 1. Purpose

The Shigo Midnight redesign successfully established a stronger structural and visual foundation, but the finished product became too restrained. It reads as polished and premium, yet comparatively lifeless next to the earlier deployed ShigoChat experience.

This pass restores the emotional qualities that made the earlier ShigoChat memorable without undoing the validated redesign.

The chosen direction is **Hybrid Resurrection**, expressed as **Shigo Midnight: Living Sanctuary**.

The product should feel calm at rest, gently alive in the environment, and tactile the moment the user interacts with it.

## 2. Problem statement

The current redesign has several strengths that must remain protected:

- disciplined responsive structure
- 768px maximum conversation measure
- strong message grouping and sparse-message gravity
- improved semantic tokens and dark/light themes
- restrained violet/teal identity
- cleaner Preferences and auth architecture
- accessible hit targets and focus treatment
- Storybook coverage and GitHub visual evidence

However, the redesign removed or muted several sources of personality from the earlier deployed experience:

- dedicated illustrated background artwork
- cinematic page entrance and exit motion
- animated brand mark behavior
- continuous but subtle environmental movement
- stronger hover and press feedback
- richer relationship between artwork, typography, and interface surfaces

The result is visually coherent but too static.

## 3. Design thesis

**Shigo should be quiet, not inert.**

The Living Sanctuary direction combines three layers:

1. **Old Shigo soul**
   - original responsive artwork
   - dreamy moonlit atmosphere
   - emotional brand imagery
   - animated brand presence

2. **New Shigo discipline**
   - current Quiet Room layout
   - current typography hierarchy
   - current message grouping
   - current composer structure
   - current responsive behavior
   - current semantic token system

3. **Motion as interaction language**
   - tactile hover and press responses
   - spring-based state transitions
   - animated layout continuity
   - subtle ambient movement
   - reduced-motion-safe behavior

The desired feeling is **a living midnight sanctuary**, not a static dashboard and not a flashy animation demo.

## 4. Non-negotiable protections

The implementation must not regress any of the following:

- `CONVERSATION_MEASURE_CLASS = "mx-auto w-full max-w-3xl"`
- sparse conversations remain anchored near the composer
- current sender grouping logic and day separators
- current 72px rail and 224px expanded sidebar geometry
- mobile drawer behavior below `md`
- full sidebar appears at `xl`, not `lg`
- Preferences mobile 2x2 navigation
- production forgot-password remains disabled until a verified reset-token/email flow exists
- current message CRUD, Socket.IO, auth, and backend behavior
- keyboard accessibility and visible semantic focus treatment
- prefers-reduced-motion support
- teal remains primarily semantic/presence-oriented rather than becoming decorative neon
- core messaging remains readable and conversation-first

## 5. Motion technology decision

### 5.1 Standardize on Motion for React

The branch currently depends on `framer-motion@12.12.2`, which provides the underlying Motion capabilities, but the modern package and import path should be adopted deliberately:

- remove `framer-motion`
- add `motion`
- use imports from `motion/react`

Do not keep both packages unless a concrete compatibility blocker is discovered during implementation.

### 5.2 GSAP role

Keep `gsap` installed, but do not use it for routine UI hover, press, layout, panel, message, popover, or route transitions.

GSAP is reserved for a future cinematic sequence only when a timeline is materially easier or more expressive than Motion.

### 5.3 One root motion configuration

Introduce one shared motion configuration layer rather than scattering unrelated transition values throughout the app.

Suggested ownership:

```text
client/src/lib/shigo-motion.ts
client/src/components/ui/shigo-motion-provider.tsx
```

The exact filenames may change if existing architecture suggests a better owner, but responsibilities must remain separated:

- motion constants and variants
- spring definitions
- reduced-motion-aware helpers
- root `MotionConfig`

## 6. Motion vocabulary

The system should expose a compact semantic vocabulary rather than component-specific magic numbers.

Conceptual tokens:

```text
shigoSpringSoft
shigoSpringSnappy
shigoHoverLift
shigoPress
shigoEnter
shigoExit
shigoPanel
shigoMessageSelf
shigoMessageOther
shigoPopover
shigoAmbient
```

### 6.1 Default tactile response

Most interactive controls should respond approximately as follows:

**Hover**

- translate Y by roughly -1px where appropriate
- scale around 1.01 to 1.02 for contained buttons, not large surfaces
- slightly strengthen surface or border contrast
- allow icons to react independently by 1 to 3px or a few degrees when semantically useful

**Press**

- scale to approximately 0.97 to 0.985
- return with a short spring

These are design intents, not universal literal values. Tiny controls, destructive actions, sliders, text links, and touch-only surfaces may need different treatment.

### 6.2 Rule against animation-demo behavior

Do not default to:

- scale 1.1
- large rotations
- bouncing
- exaggerated glow
- long elastic overshoot
- constant motion on every surface

The product must feel tactile, not toy-like.

## 7. Artwork strategy

The original responsive Shigo artwork is intentionally restored as first-class brand material.

Existing branch assets:

```text
client/src/DesktopDarkBackgroundSplash.png
client/src/DesktopLightBackgroundSplash.png
client/src/MobileDarkBackgroundSplash.png
client/src/MobileLightBackgroundSplash.png
```

These must not be replaced by generic generated gradients.

### 7.1 Splash composition

The new Splash should combine, not choose between, the old and new visual systems.

Layer order:

```text
responsive original artwork
  + slow image drift / Ken Burns movement
  + current Shigo shader at restrained opacity
  + vignette / tonal depth layer
  + editorial Shigo typography and moon identity
  + progress / transition UI
```

The image remains recognizable. The shader acts as atmosphere, not replacement artwork.

### 7.2 Desktop artwork motion

Desktop may use subtle pointer-relative movement, but movement should remain in the single-digit-pixel range.

Base ambient motion may slowly shift scale from about 1.00 to 1.03 over several seconds.

The movement must never make text appear to float uncontrollably or cause visible crop pumping.

### 7.3 Mobile artwork motion

Mobile should avoid pointer assumptions. Use slow scale/drift only.

### 7.4 Theme transitions

Dark/light changes on auth and brand surfaces should crossfade between the appropriate artwork rather than instantly swapping the whole visual environment.

## 8. Splash experience

Splash becomes the most expressive brand surface in the product.

Required behavior:

- full viewport ownership, preserving the existing `100dvh` strip fix
- responsive desktop/mobile artwork
- slow background drift
- restrained shader motion layered above artwork
- brand mark entrance
- moon mark breathing animation
- eyebrow/headline/subtitle staggered entrance
- progress line reveal and fill
- cinematic but short route exit
- reduced-motion mode removes transforms and ambient loops while preserving hierarchy and immediate progress feedback

The current editorial headline can remain, but the scene should feel embedded in the artwork rather than placed on top of a generic shader canvas.

## 9. Authentication surfaces

Login and Register should visually belong to the same world as Splash.

### 9.1 Background

Use the same responsive artwork family with:

- restrained blur or soft focus when needed for legibility
- dark/light tonal overlays
- low-opacity shader movement
- subtle depth/parallax on desktop only

### 9.2 Form motion

- page/form entrance on first mount
- focus transitions on fields
- button hover and press motion
- password visibility icon reaction
- validation message entrance/exit
- Login/Register mode changes use `AnimatePresence` when the architecture allows without breaking routing semantics
- theme changes crossfade artwork and tonal environment

Production forgot-password remains disabled.

## 10. Quiet Room environment

Quiet Room must become more alive without placing a distracting wallpaper behind the transcript.

### 10.1 Ambient layer

Use a very restrained environmental treatment at the workspace edges:

- subtle violet bloom
- optional blurred fragment or color DNA derived from the original artwork
- extremely light pointer/parallax response on capable desktop devices
- no readable image content behind primary message text
- no high-contrast motion under the transcript

The center reading plane remains calm.

### 10.2 Header

The shared Quiet Room header receives:

- subtle mount/room-entry animation
- hover/tap responses on actions
- animated theme change icon
- optional micro-shift in room metadata when presence/status changes later

No structural height change.

## 11. Sidebar interaction language

The sidebar should feel tactile and spatial.

### 11.1 Active room seam

Use Motion layout continuity for the violet selection seam.

A shared `layoutId` should allow the seam to glide if more destinations exist later.

### 11.2 Rows

On hover:

- surface tint blooms in
- icon moves about 1 to 2px in a semantically appropriate direction
- text may shift about 1px
- presence/signal indicators strengthen slightly

On press:

- restrained scale compression

### 11.3 Collapse/expand

Use layout animation for the rail-to-sidebar transition instead of treating it as a plain CSS width transition only.

The final dimensions remain exactly 72px and 224px.

Text/icon disappearance and appearance should sequence cleanly so labels do not visibly squash.

## 12. Global buttons and icon controls

The shared `Button` primitive should become the main tactile-motion owner where possible.

The implementation should avoid forcing Motion wrappers in places where Radix `Slot` composition or accessibility semantics would break.

Expected behavior:

- hover lift on appropriate contained buttons
- press compression
- icon-specific micro-reactions
- loading state remains stable with no layout jump
- disabled controls do not animate as actionable controls
- destructive actions remain restrained

Semantic examples:

- Send arrow rises slightly on hover
- Settings gear rotates a few degrees
- theme icon rotates/crossfades lightly
- attach icon tilts a few degrees
- sidebar collapse icon nudges in collapse direction

## 13. Messages

Messages should animate as living conversation objects while remaining readable.

### 13.1 New message entrance

Received message:

```text
opacity 0 -> 1
x about -8 -> 0
y about 4 -> 0
scale about .985 -> 1
```

Own message mirrors horizontal direction.

Use a short soft spring.

### 13.2 Group continuity

Grouped message geometry must remain intact.

Motion should respect existing `single/start/middle/end` group positions.

Do not create per-bubble movement that visually breaks a grouped stack.

### 13.3 Actions

Desktop hover action bar should animate from approximately:

```text
opacity 0
translateY 4
scale .97
```

to its resting state.

### 13.4 Edit/delete

- edit mode should morph using layout animation where practical
- deleted messages should collapse smoothly through `AnimatePresence`
- no animation may delay the actual mutation request or create false success feedback

## 14. Composer as kinetic signature

The composer is the most important interactive object in Quiet Room.

### 14.1 Focus state

When focus enters:

- composer lifts around 1px
- top luminous seam becomes slightly stronger
- internal controls reach full visual presence
- violet focus energy strengthens without becoming a neon glow

### 14.2 Typing/send state

When content changes from unsendable to sendable:

- Send control wakes via a small spring
- violet halo subtly increases

Hover:

- send arrow rises slightly

Press:

- control compresses

Successful local submit:

- arrow can make a tiny upward impulse before reset
- composer returns to empty state smoothly

### 14.3 Attachments and reply

- attachments animate in/out through `AnimatePresence`
- reply banner expands/collapses with layout animation
- emoji popover uses shared popover motion

No animation may interfere with textarea height measurement or Enter-to-send behavior.

## 15. Preferences and overlays

### 15.1 Preferences navigation

The selected violet seam should use shared layout motion between Account, Appearance, Ambient, and Security.

Panel changes should use a restrained directional transition:

```text
old panel: opacity 1 -> 0, x 0 -> -8
new panel: opacity 0 -> 1, x 8 -> 0
```

Direction may reverse when moving backward if ordering is known.

### 15.2 Sheet and dialog

- opening sheet uses short spring translation
- closing is slightly faster
- dialogs use scale/opacity rather than large travel
- backdrop fades independently

### 15.3 Toggles and sliders

- toggle thumb uses spring layout movement
- slider handle may scale slightly during active drag
- do not animate values in ways that imply lag

## 16. Music / ambient player

The ambient player should reinforce the concept of a living sanctuary.

Potential behaviors:

- play/pause icon morph or crossfade
- active playback indicator breathes very subtly
- track/progress changes animate without jumping
- volume interactions remain tactile

Do not add a large audio visualizer unless it can remain extremely subtle and performant.

## 17. Navigation and route transitions

Use `AnimatePresence` only where routing structure supports it cleanly.

Priority transitions:

- Splash -> Login/Chat
- Login <-> Register
- Preferences open/close

Do not add route animation complexity to every navigation event if it risks stale routes or delayed interaction.

## 18. Reduced motion and accessibility

Motion is additive. Accessibility remains non-negotiable.

### 18.1 Reduced motion

When `prefers-reduced-motion: reduce` is active:

- disable ambient parallax
- disable continuous image drift
- remove translation/scale entrances where possible
- use opacity-only state changes or immediate state changes
- do not delay navigation for cinematic exit motion
- keep focus, active, and selected states visually obvious

### 18.2 Input methods

Hover-specific affordances must not be the sole means of discovering an action.

Touch:

- press feedback remains useful
- no pointer-follow effects

Keyboard:

- focus-visible behavior remains intact
- motion cannot move focused elements enough to impair tracking

## 19. Performance requirements

The Living Sanctuary must remain smooth on ordinary laptops and phones.

Rules:

- animate `transform` and `opacity` by default
- avoid animating expensive blur values continuously
- avoid per-frame React state for pointer movement
- use Motion values/transforms or CSS variables for pointer-driven effects
- shader and artwork layers must not trigger layout
- avoid multiple full-screen WebGL/shader canvases
- pause or remove ambient loops when the relevant surface is unmounted
- keep mobile motion simpler than desktop motion
- do not increase image asset count unless a clear design need emerges

The four existing artwork files are already large assets, so the implementation should not duplicate them into additional generated variants.

## 20. Storybook requirements

Storybook must expose motion-critical states so animation can be reviewed intentionally.

Required stories or interaction states include:

- Splash desktop dark with artwork
- Splash desktop light with artwork
- Splash mobile dark
- Splash reduced motion
- Login desktop dark
- Login mobile dark
- Quiet Room desktop dark
- Quiet Room light
- sidebar expanded and collapsed
- message incoming/self/grouped
- message actions visible
- composer resting
- composer focused
- composer sendable
- composer attachment state
- Preferences Account
- Preferences panel transition target
- sheet/dialog open

Static screenshot CI cannot prove animation quality by itself, so stories should also be usable interactively in Storybook.

## 21. GitHub visual evidence

Keep the existing GitHub screenshot pipeline.

The final visual matrix must continue checking:

- 1440 desktop
- 1280 desktop
- 1024 small desktop
- tablet rail states
- 390 mobile
- 360 mobile where relevant
- dark/light
- reduced motion
- Splash bottom-edge coverage
- auth full-canvas coverage
- Quiet Room transcript geometry
- focused composer
- grouped messages
- Preferences containment

The screenshots should judge the resting frame after motion settles.

## 22. Motion-specific automated testing

Do not write tests that assert arbitrary animation frame timings.

Tests should instead verify contracts such as:

- Motion provider respects reduced-motion preference
- continuous ambient transforms are disabled under reduced motion
- interactive elements preserve aria labels and keyboard behavior after Motion wrappers
- message deletion still removes the correct item
- composer send behavior remains unchanged
- attachments/reply state still enter and leave correctly
- sidebar dimensions remain 72px/224px
- Splash retains `100dvh` coverage
- production Login still sets `showForgotPassword={false}`

## 23. Implementation phases

The later implementation plan should divide work into reviewable phases in this order:

1. Motion package migration and shared motion foundation
2. Reintroduce responsive artwork and rebuild Splash as image + shader + motion
3. Bring auth into the same artwork/motion environment
4. Add global tactile Button/icon behavior
5. Animate sidebar selection and collapse/expand
6. Animate messages and message actions
7. Make composer the kinetic signature
8. Animate Preferences, sheets, dialogs, toggles, and sliders
9. Refine ambient player motion
10. Add restrained Quiet Room environmental movement
11. Expand Storybook motion review states and tests
12. Full engineering CI and GitHub visual evidence review

Each phase should be independently reviewable and should not wait until the end to discover design drift.

## 24. Explicit non-goals

This pass does not include:

- backend changes
- new chat features
- multiple rooms
- new social features
- deployment changes
- Render updates
- enabling production forgot-password
- a new design system replacement
- replacing the original artwork with generated imagery
- adding constant movement to every static text element
- large cursor-follow gimmicks throughout the product
- turning Quiet Room into a shader or glassmorphism showcase

## 25. Acceptance criteria

The pass is successful when all of the following are true:

### Brand and atmosphere

- Splash visibly uses the original responsive Shigo artwork again
- artwork and current shader coexist rather than one replacing the other
- auth belongs to the same visual world
- Quiet Room remains calm but no longer feels visually dead

### Interaction

- essentially every actionable button/control has appropriate hover or press feedback on devices that support it
- sidebar interactions feel spatial and tactile
- new messages enter with restrained direction-aware motion
- message actions animate into place
- composer visibly responds to focus, sendable state, hover, press, attachments, and reply state
- Preferences navigation and panels transition smoothly

### Restraint

- no major surface bounces or scales excessively
- constant motion is limited to brand/ambient surfaces and playback indicators
- transcript readability is never compromised

### Accessibility

- reduced motion removes continuous/parallax movement and avoids transform-heavy entrances
- keyboard focus remains stable and visible
- touch interaction does not depend on hover

### Engineering

- all existing regression tests remain green
- TypeScript remains green
- app and Storybook builds remain green
- Windows launcher remains green
- visual capture workflow remains green
- no protected layout/security invariant regresses

## 26. Final product definition

**Shigo Midnight: Living Sanctuary** should feel gently awake before the user touches anything, then tactile and responsive the moment they interact.

The old Shigo contributed soul. The new Shigo contributed discipline. This pass deliberately keeps both.
