# Shigo Midnight: Living Sanctuary, implementation plan

**Status:** Approved implementation plan, execution started
**Spec:** `docs/superpowers/specs/2026-08-20-shigo-living-sanctuary-design.md`
**Branch baseline:** `storybook-typescript-baseline` at `c13f4eff83b7f8f56551d56635c8fc5c9b87075d`
**Date:** 2026-08-20

## Mission

Implement **Shigo Midnight: Living Sanctuary** by restoring the emotional life of the earlier ShigoChat experience while preserving the validated structural foundation from the current redesign.

This is an architectural visual-and-motion pass, not a layout rewrite.

## Protected invariants

- `CONVERSATION_MEASURE_CLASS = "mx-auto w-full max-w-3xl"`
- sparse-history gravity near the composer
- current sender grouping logic and day separators
- sidebar geometry: `72px` rail, `224px` expanded
- mobile drawer below `md`
- expanded sidebar only at `xl`
- Preferences mobile 2x2 navigation
- production forgot-password remains disabled
- auth, socket, message CRUD, backend semantics
- semantic focus visibility and hit targets
- reduced-motion correctness
- Shigo semantic token architecture
- teal as semantic accent, not decorative neon

## Execution phases

1. Motion foundation
2. Restore artwork-backed brand surfaces
3. Splash motion pass
4. Auth motion and atmosphere pass
5. Global tactile controls
6. Quiet Room environment and header life
7. Sidebar interaction language
8. Message motion and conversational life
9. Composer as kinetic signature
10. Preferences and overlay motion
11. Ambient player polish
12. Route and state transitions
13. Storybook motion coverage
14. GitHub visual evidence expansion
15. Final verification and sign-off pack

## Phase 1, motion foundation

- replace `framer-motion` with `motion`
- add shared semantic motion tokens and root `MotionConfig`
- add reduced-motion helpers
- verify app and Storybook

## Phase 2, artwork-backed brand surfaces

Use the existing responsive assets:

- `client/src/DesktopDarkBackgroundSplash.png`
- `client/src/DesktopLightBackgroundSplash.png`
- `client/src/MobileDarkBackgroundSplash.png`
- `client/src/MobileLightBackgroundSplash.png`

Compose them with restrained shader, vignette, and editorial typography. Preserve the `100dvh` Splash viewport fix.

## Phase 3, Splash motion

Add slow artwork drift, subtle desktop pointer response, brand/moon entrance and breathing motion, staggered copy entrance, progress reveal, and reduced-motion-safe behavior.

## Phase 4, auth motion and atmosphere

Reuse the artwork family, add form/validation/theme transition motion, tactile field/button behavior, and preserve production `showForgotPassword={false}`.

## Phase 5, global tactile controls

Make shared controls respond with restrained hover lift, press compression, and semantic icon micro-reactions without breaking Radix composition or accessibility.

## Phase 6, Quiet Room environment and header

Add restrained ambient edge atmosphere and tactile header actions while preserving the 768px reading plane and current header geometry.

## Phase 7, sidebar

Animate the active violet seam with layout continuity, row hover/press behavior, and rail-to-expanded transitions while keeping exact 72px/224px dimensions.

## Phase 8, messages

Add own/other entrance motion, grouped continuity, animated action controls, and safe edit/delete layout transitions without changing message logic.

## Phase 9, composer

Make focus, sendable state, send action, attachments, reply banner, and emoji/popover transitions the strongest kinetic interaction in Quiet Room without affecting textarea/send behavior.

## Phase 10, Preferences and overlays

Animate selected seam, section transitions, sheets, dialogs, toggles, and sliders while preserving mobile containment and 2x2 nav.

## Phase 11, ambient player

Add restrained play/pause, playback, progress, and volume feedback. No large visualizer.

## Phase 12, route/state transitions

Prioritize Splash -> Login/Chat, Login <-> Register, and Preferences open/close only where routing remains safe.

## Phase 13, Storybook coverage

Expose interactive motion states for Splash, auth, Quiet Room, sidebar, messages, composer, Preferences, and transient surfaces.

## Phase 14, GitHub visual evidence

Expand the current capture manifest for settled-state visual review. Continue checking Splash bottom coverage, auth full-canvas, Quiet Room dark/light, focused composer, grouped messages, Preferences, and responsive widths.

## Phase 15, final verification

Run the full engineering workflow and final GitHub visual evidence workflow. Inspect the generated screenshots directly before sign-off.

## Performance and accessibility rules

- animate transform and opacity by default
- avoid continuous expensive blur animation
- avoid per-frame React state for pointer motion
- simplify mobile motion
- disable continuous/parallax motion under `prefers-reduced-motion`
- hover must never be the only way to discover an action
- keep keyboard focus obvious

## Not in scope

- Render deployment updates
- backend architecture changes
- auth recovery implementation
- widening the conversation column
- replacing the current semantic token system
- readable wallpaper imagery behind transcript text
- a loud audio visualizer
- framework rewrite
