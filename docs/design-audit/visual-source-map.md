# ShigoChat Visual Problem to Source Map

This map covers P0 and the highest-impact P1 findings from the Playwright baseline. The preferred fix layer is the highest layer that actually owns the visible problem. Token changes should not be used to compensate for composition defects.

## V-001, sparse transcript floats at the top

```text
Rendered problem
Sparse conversation is visually detached from the bottom composer
↓
Composition
Production Quiet Room / Storybook Quiet Room
↓
Component
Chatroom message region / ShigoConversation
↓
Shared primitive
ShigoMessage list layout
↓
CSS / Tailwind
min-h-0 flex-1 overflow-y-auto
mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-5
↓
Semantic token
No color token is the root cause. This is composition/spacing ownership.
```

Preferred correction layer: `Chatroom.jsx` and `shigo-conversation.tsx` layout contract. Introduce sparse-history bottom gravity while preserving ordinary scroll behavior.

## V-002, sidebar competes with conversation

```text
Rendered problem
Navigation and ambient utility carry comparable visual mass to the conversation
↓
Composition
Production Quiet Room desktop shell
↓
Component
AppSidebar + Chatroom
↓
Shared primitive
AmbientPlayer + ProfileMenu + sidebar icon buttons
↓
CSS / Tailwind
w-64 expanded sidebar
h-16 brand band
section labels + mt-7 Ambient section
border-r / border-b / border-t partitions
main conversation independently capped at max-w-3xl
↓
Semantic token
--shigo-shell
--border
--accent
--muted-foreground
```

Preferred correction layer: `AppSidebar` structure and the desktop shell. Do not darken or recolor the sidebar as a substitute for reducing its hierarchy.

## V-003, 768 px breakpoint collapses the workspace

```text
Rendered problem
At 768 px, a 256 px sidebar leaves 512 px for conversation; at 767 px, conversation gets 767 px
↓
Composition
Production responsive shell
↓
Component
Chatroom
↓
Shared primitive
AppSidebar / MobileNav switch
↓
CSS / Tailwind
hidden md:block
w-64
md breakpoint activates full desktop navigation
↓
Semantic token
Not token-driven
```

Preferred correction layer: responsive application-shell composition. Add an intentional tablet navigation state rather than tuning child components for a 512 px desktop pane.

## V-004, mobile Preferences overflows its sheet

```text
Rendered problem
Preferences content extends beyond the 360 px viewport and selected tabs shift content laterally
↓
Composition
Preferences sheet
↓
Component
Preferences -> PreferencesShell -> PreferencesContent
↓
Shared primitive
Sheet + Tabs
↓
CSS / Tailwind
Sheet right: w-[92vw] max-w-md sm:w-[28rem]
Preferences tab wrapper: overflow-x-auto px-6
TabsList: min-w-max
Tabs primitive: inline-flex + whitespace-nowrap triggers
content wrapper: px-6
↓
Semantic token
Not token-driven
```

Preferred correction layer: `preferences-shell.tsx`, with `tabs.tsx` changed only if the general primitive itself is proven responsible. Contain overflow locally and give mobile settings an intentional section-navigation pattern.

## V-005, messages behave as isolated cards instead of grouped conversation

```text
Rendered problem
Avatar/name/time/border/shadow repeat for every incoming message, own metadata follows a separate pattern
↓
Composition
Conversation transcript
↓
Component
ShigoConversation -> ShigoMessage
↓
Shared primitive
PresenceAvatar, Button action toolbar, message surface
↓
CSS / Tailwind
conversation gap-5
message max-w-[82%] sm:max-w-[72%]
rounded-lg border px-4 py-2.5 shadow-panel
incoming identity rendered per message
own timestamp rendered below each bubble
↓
Semantic token
--shigo-own-message
--shigo-other-message
--border
--shadow-panel
--muted-foreground
```

Preferred correction layer: message grouping/data-to-presentation composition first, then `ShigoMessage` surface treatment. Do not start by changing bubble colors.

## V-006, large-screen conversation remains a narrow fixed strip

```text
Rendered problem
Collapsed sidebar gives the workspace more room, but transcript/composer remain 768 px and float between large gutters
↓
Composition
Quiet Room main pane
↓
Component
Chatroom + ShigoConversation + composer wrapper
↓
Shared primitive
Conversation measure
↓
CSS / Tailwind
max-w-3xl repeated for transcript and composer
mx-auto
↓
Semantic token
Not token-driven
```

Preferred correction layer: define one canonical conversation measure owned by the Quiet Room composition and consumed by transcript/composer.

## V-007, composer has double containment

```text
Rendered problem
Composer reads as a card inside a second footer surface
↓
Composition
Quiet Room footer
↓
Component
Chatroom -> MessageInput -> ShigoComposer
↓
Shared primitive
Textarea + Button + Popover
↓
CSS / Tailwind
footer: border-t bg-background/95 backdrop-blur-md
composer: rounded-xl border border-border bg-card shadow-panel
composer hint: text-[10px] + dedicated bottom band
↓
Semantic token
--background
--card
--border
--shadow-panel
--muted-foreground
```

Preferred correction layer: compose footer and composer as one visual system. Retain keyboard/focus behavior, remove redundant surface boundaries.

## V-008, typography relies on one-pixel micro tiers

```text
Rendered problem
10/11/12/13/14 px roles repeat across title, labels, metadata, hints, messages, navigation
↓
Composition
Global application
↓
Component
AppSidebar, Chatroom header, ShigoMessage, ShigoComposer, Preferences, Auth
↓
Shared primitive
Label, Button, Input, Tabs
↓
CSS / Tailwind
text-[10px]
text-[11px]
text-xs
text-[13px]
text-sm
plus muted color to create hierarchy
↓
Semantic token
foreground / muted-foreground are coherent, but typography roles are not centralized
```

Preferred correction layer: typography role system, then update components to use those roles. Keep Playfair Display restricted to expressive brand surfaces.

## V-009, hierarchy is over-framed by borders and shadows

```text
Rendered problem
Many neighboring regions are all independently bordered/shadowed
↓
Composition
Global workspace + settings
↓
Component
AppSidebar, ShigoMessage, ShigoComposer, SettingsSection, Tabs, Sheet
↓
Shared primitive
Card-like containers
↓
CSS / Tailwind
border-border used on nearly every surface
shadow-panel on messages, composer, active tabs, settings sections
shadow-dialog on sheets/auth shells
↓
Semantic token
--border
--shadow-panel
--shadow-floating
--shadow-dialog
--card / --secondary / --shigo-shell
```

Preferred correction layer: usage policy for surfaces and elevation. The existing tokens are sufficient, the problem is too many simultaneous owners.

## V-010, Preferences feels like an embedded settings kit

```text
Rendered problem
Sheet -> tab capsule -> bordered settings card -> bordered controls creates nested component framing
↓
Composition
Preferences
↓
Component
PreferencesShell -> SettingsSection
↓
Shared primitive
Sheet, Tabs, Input, Button, AmbientPlayer
↓
CSS / Tailwind
Sheet border + shadow
TabsList border bg-secondary
SettingsSection rounded-xl border bg-card shadow-panel
option cards rounded-lg border bg-secondary
↓
Semantic token
--card
--secondary
--border
--shadow-panel
```

Preferred correction layer: Preferences information architecture and section composition. Keep primitives but reduce card nesting.

## V-011, Button primitive leaks a generic pill/blue-focus language

```text
Rendered problem
Routine actions inherit full-pill geometry and a blue focus ring inconsistent with the violet Shigo semantic system
↓
Composition
Global
↓
Component
All consumers of Button
↓
Shared primitive
Button
↓
CSS / Tailwind
rounded-full
focus-visible:ring-[#6B97FF]
transition-all duration-75
↓
Semantic token
Should use --radius-* according to role
Should use --ring, currently bypassed by hardcoded blue
```

Preferred correction layer: `button.tsx`, but only after the canonical Quiet Room establishes the intended radius language. This is a true primitive-level cause.

## V-012, conversation title has less authority than header controls

```text
Rendered problem
13 px title + 11 px subtitle sit beside a decorative hash tile and two 36 px icon actions inside a 64 px header
↓
Composition
Quiet Room header
↓
Component
Chatroom / QuietRoomComposition
↓
Shared primitive
Button icon controls
↓
CSS / Tailwind
h-16
text-[13px] font-semibold
text-[11px] text-muted-foreground
size-8 hash tile
size-9 buttons
↓
Semantic token
foreground / muted-foreground / primary
```

Preferred correction layer: header composition and typography role, not an accent-color increase.

## V-013, mobile message-management chrome is persistent

```text
Rendered problem
Own messages permanently reserve a 32 px ellipsis action trigger on mobile
↓
Composition
Mobile transcript
↓
Component
ShigoMessage
↓
Shared primitive
Popover + Button
↓
CSS / Tailwind
sm:hidden action wrapper
Button size icon-sm
flex row beside message bubble
↓
Semantic token
Not token-driven
```

Preferred correction layer: mobile message interaction design. Preserve keyboard/screen-reader discoverability when reducing visual persistence.

## V-014 and V-015, canonical Storybook framing introduces preview artifacts

```text
Rendered problem
Canonical screen appears inside a rounded showcase card; mobile stories measure 1 to 9 px wider than their viewport
↓
Composition
Storybook preview
↓
Component
QuietRoomComposition story
↓
Shared primitive
None
↓
CSS / Tailwind
Story: layout centered
Composition: h-[46rem]
w-[min(78rem,94vw)] desktop
w-[min(24rem,92vw)] mobile
rounded-xl border shadow-dialog
↓
Semantic token
border / shadow-dialog are used for preview framing, not production shell behavior
```

Preferred correction layer: Storybook story contract. Keep component-level showcase stories, but use full-viewport canonical composition stories for design approval and future screenshots.

# Semantic role ownership recommendation

Do not add a second theme system. Normalize existing ownership as follows:

| Visual role | Existing owner |
| --- | --- |
| App background | `--background` |
| Navigation background | `--shigo-shell` |
| Primary workspace | `--background` |
| Raised surface | `--card` / `--shigo-raised` |
| Interactive hover | `--accent` |
| Interactive selected | `--accent`, with `--primary` reserved for expressive emphasis |
| Subtle divider | `--border` |
| Primary text | `--foreground` |
| Secondary text | `--muted-foreground` |
| Micro metadata | `--muted-foreground` with controlled opacity, not new grays |
| Brand accent | `--primary` |
| Secondary signal accent | `--shigo-signal` |
| Presence/success | `--shigo-presence-online` until a general success semantic is justified |
| Warning | `--shigo-warning` |
| Error/destructive | `--destructive` |
| Focus ring | `--ring` |

# Source-trace rule for implementation

When implementation begins, every visual change should start from one of these mapped ownership layers. A lower-level token or primitive should only be changed when multiple rendered problems share that cause. This prevents story-by-story CSS patches and keeps the approved composition as the system source of truth.
