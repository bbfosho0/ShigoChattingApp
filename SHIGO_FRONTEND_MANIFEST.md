# SHIGO_FRONTEND_MANIFEST.md

> **Status:** Canonical frontend design and migration specification for `storybook-typescript-baseline`.
>
> **Purpose:** Define the exact visual direction, component sources, architecture, integration rules, Storybook targets, migration order, and completion criteria for replacing ShigoChat's frontend presentation layer with a coherent 21st.dev-informed design system.
>
> **Scope:** Frontend only. Preserve the existing backend, APIs, Socket.IO behavior, authentication behavior, application data flow, and domain logic unless a separate task explicitly changes them.

---

## 1. Product North Star

ShigoChat should feel like a **quiet, premium messenger**, not a dashboard template, AI chat clone, Discord skin, or generic shadcn application.

### Working design name

**Shigo Midnight**

### Experience statement

> Quiet luxury messenger + midnight sanctuary + restrained futuristic interaction.

### The core contrast

The product may be cinematic at the edges, but the actual conversation workspace must remain calm.

**Expressive surfaces:**

- splash
- authentication
- ambient audio
- major transitions
- brand moments
- selective magnetic interaction

**Quiet surfaces:**

- message thread
- composer
- settings
- menus
- profile controls
- forms
- precision interactions

The spectacular effects should frame the conversation, not compete with it.

---

## 2. Non-Negotiable Product Principles

1. **ShigoChat must look like one product.** 21st.dev is a source registry, not a unified design system. Components from different authors must be normalized into Shigo tokens, spacing, motion, typography, and iconography.
2. **Human chat semantics only.** Do not import AI model selectors, reasoning states, prompt suggestions, agent tool output, model pickers, or other AI-chat-specific affordances into the human conversation UI.
3. **The message thread is the visual priority.** Navigation and ambient controls support it rather than dominate it.
4. **Dark mode is first-class, not an inversion pass.** Light and dark modes must feel like the same product.
5. **No giant arbitrary component sizing.** Full-viewport layouts are reserved for true immersive surfaces such as splash/auth shader experiences.
6. **No accidental visual nesting.** Avoid card-inside-card slabs, duplicated frames, unnecessary wrappers, and stacked borders.
7. **Motion must communicate state.** Decorative movement should be sparse and deliberate.
8. **Lucide is the standard product icon family.** Third-party source icons should be converted to Lucide where practical.
9. **Accessibility is part of the design.** Keyboard, focus, reduced motion, touch, screen-reader labels, and contrast are required.
10. **The redesign must not force a framework migration.** The architecture remains React + CRA + Storybook Webpack5 + Tailwind 3.4 + mixed JSX/TSX unless explicitly changed by a separate migration plan.

---

## 3. Current Frontend Baseline

### Runtime/tooling

- React 19
- Create React App / `react-scripts` 5
- Storybook 10.5 React Webpack5 + CRA preset
- TypeScript 5.1-compatible mixed JSX/TSX baseline
- Tailwind CSS 3.4.x
- shadcn-compatible structure
- Lucide React
- Framer Motion
- GSAP only where specifically justified
- Radix primitives where appropriate

### Canonical project paths

```text
client/src/components/ui/   reusable TSX UI primitives and product UI
client/src/hooks/           reusable hooks
client/src/lib/             utility helpers
client/src/stories/         Storybook stories
client/src/index.css        global semantic tokens and theme CSS
client/components.json      shadcn-compatible path config
```

### Current production surfaces to replace visually

```text
client/src/pages/Chatroom.jsx
client/src/pages/Login.jsx
client/src/pages/Register.jsx
client/src/pages/SplashScreen.jsx

client/src/components/MessageBubble.jsx
client/src/components/MessageInput.jsx
client/src/components/MusicPlayer.jsx
client/src/components/Preferences.jsx
```

Do not destroy their working behavior while replacing their presentation layer.

---

## 4. Canonical Visual System

## 4.1 Color direction

### Dark mode - primary product mode

| Role | Target |
|---|---|
| App background | `#090A0F` |
| Elevated shell | `#0E1017` |
| Card/panel | `#131620` |
| Hover surface | `#191C27` |
| Stronger raised surface | `#202431` |
| Main text | `#F4F4F7` |
| Secondary text | `#A1A3B0` |
| Muted text | `#6F7280` |
| Primary violet | `#8173F5` |
| Primary highlight | `#9A8CFF` |
| Rare signal teal | `#58CFC0` |
| Warning | `#D9A65F` |
| Destructive | `#E15A72` |
| Border | white at roughly 8-10% opacity |

### Light mode

| Role | Target |
|---|---|
| App background | `#F7F6FA` |
| Sidebar / secondary shell | `#F0EFF5` |
| Card | `#FFFFFF` |
| Hover surface | `#ECEAF2` |
| Main text | `#18171D` |
| Secondary text | `#67636F` |
| Muted text | `#8A8591` |
| Primary violet | `#6857D8` |
| Primary highlight | `#8173F5` |
| Signal teal | `#2EA89A` |
| Border | `#E4E1EA` |

### Color usage rules

- Violet is the brand/action identity.
- Teal is a **signal**, not a second brand color. Use it for presence, ambient/audio states, and rare active indicators.
- Destructive red/pink is reserved for destructive actions and errors.
- Do not put violet gradients on every card.
- Do not use saturated color backgrounds behind long-form chat text.
- Keep most surfaces neutral and let state/color appear in small, high-value places.

---

## 4.2 Semantic token target

The final implementation should continue using shadcn-style semantic tokens rather than hard-coding source-library palettes throughout components.

Required semantic families:

```text
--background
--foreground
--card
--card-foreground
--popover
--popover-foreground
--primary
--primary-foreground
--secondary
--secondary-foreground
--muted
--muted-foreground
--accent
--accent-foreground
--destructive
--destructive-foreground
--border
--input
--ring
```

Add Shigo-specific semantic signals only when a generic token is insufficient:

```text
--shigo-signal
--shigo-signal-foreground
--shigo-presence-online
--shigo-presence-away
--shigo-presence-offline
--shigo-ambient
--shigo-own-message
--shigo-other-message
```

Do not create parallel author-specific token systems from imported 21st components.

---

## 4.3 Typography

### UI typeface

**Inter**

Use for:

- navigation
- messages
- forms
- settings
- controls
- timestamps
- buttons

### Editorial/brand typeface

**Playfair Display** may remain as a restrained Shigo signature font for:

- splash headline
- auth visual-pane tagline
- rare brand/editorial accents

Do not use Playfair for controls, message text, or dense product UI.

### Type scale

| Purpose | Target |
|---|---|
| Tiny metadata | 11-12px |
| Labels / navigation | 13px |
| Body / messages | 14-15px |
| Section heading | 16-18px |
| Panel title | 20-24px |
| Auth heading | 30-40px |
| Splash/brand hero | 48-72px responsive |

Avoid tiny unreadable SaaS typography. 12px is the practical floor for ordinary visible metadata.

---

## 4.4 Radius system

```text
6px    compact micro-control
8px    menus / small controls
12px   buttons / inputs / nav rows
16px   cards / composer / message surfaces
20px   larger panels / auth blocks
24px   expressive large containers
999px  pill buttons / avatars / circular controls
```

Avoid random component-specific radii.

---

## 4.5 Spacing and density

Use a 4px base rhythm.

Preferred gaps:

```text
4  micro
8  compact relationship
12 control group
16 standard component spacing
20 medium section spacing
24 panel spacing
32 major section spacing
48+ immersive/auth spacing only
```

The chat workspace should be denser than the auth/splash experience.

---

## 4.6 Shadow and border philosophy

Dark mode relies primarily on **surface contrast + border contrast**, not huge drop shadows.

Use:

- 1px low-opacity borders
- subtle inner highlights when useful
- soft shadow only for floating surfaces
- stronger shadow only for dialog/sheet/popover elevation

Do not put a heavy `shadow-2xl` on every ordinary card.

---

## 4.7 Motion language

### Micro-interactions

```text
75-180ms
```

Examples:

- hover
- focus
- icon stroke
- button press
- toggle state

### Panel/sheet transitions

```text
220-320ms
```

### Expressive auth/splash motion

```text
400-800ms
```

### Rules

- honor `prefers-reduced-motion`
- do not animate message layout continuously
- do not run expensive pointer effects inside the conversation thread
- no perpetual breathing/pulsing on ordinary controls
- magnetic cursor only on approved expressive surfaces

---

## 4.8 Iconography

**Canonical icon family: Lucide React.**

Target treatment:

- normal stroke: `1.5`
- emphasized/active stroke: `2`
- compact control icons: 14-16px
- ordinary product icons: 16-18px
- large standalone icons: 20-24px

Canonical mapping:

| Function | Lucide icon |
|---|---|
| Quiet Room | `Hash` or `MessageCircle` |
| Search | `Search` |
| Preferences | `Settings2` |
| Theme | `Sun`, `Moon` |
| Profile | `UserRound` |
| Logout | `LogOut` |
| Send | `ArrowUp` |
| Attachment | `Paperclip` |
| Emoji | `Smile` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| Audio | `Volume2` |
| Play | `Play` |
| Pause | `Pause` |
| Sidebar | `PanelLeftOpen`, `PanelLeftClose` |
| Close | `X` |

Convert Tabler/other icon packages from copied components unless retaining them is technically necessary.

---

# 5. Selected 21st.dev Source Families

These are the preferred source families. Future agents should start here before searching for alternatives.

## 5.1 Arun Dass - application shell architecture

**Use for:** desktop application shell/sidebar hierarchy.

Primary source:

- Dashboard Sidebar: https://21st.dev/@arunjdass/components/dashboard-sidebar

Why selected:

- restrained Charcoal Ink / Alabaster direction
- collapsible shell behavior
- useful micro-contrast hierarchy
- Lucide icons
- product-like density
- much closer to Shigo than generic dashboard/sidebar alternatives

What to copy:

- shell proportions
- collapsed/expanded behavior
- nav hierarchy
- bottom account/settings treatment
- active-row behavior

What to remove:

- SaaS workspace switcher semantics
- analytics/dashboard content
- unnecessary nested sections
- command/search affordance until Shigo has enough searchable destinations

---

## 5.2 Jakob Hoeg - messaging primitives

**Use for:** final production message primitives and composer architecture.

Sources:

- Chat Bubble: https://21st.dev/@jakobhoeg/components/chat-bubble
- Chat Input: https://21st.dev/community/components/jakobhoeg/chat-input/default

Why selected:

- composable message pieces rather than a whole AI chat app
- clean separation of message, avatar, action, and content
- suitable for wiring to existing human-chat domain logic

Do not import AI-specific state from adjacent chat examples.

---

## 5.3 HextaUI / Preet Suthar - messaging reference and motion details

**Use for:** conversation composition reference and selective tab motion.

Sources:

- Messaging Conversation: https://21st.dev/community/components/preetsuthar17/messaging-conversation
- Tabs: https://21st.dev/community/components/preetsuthar17/tabs
- Expandable Tabs reference: https://21st.dev/@preetsuthar17/components/expandable-tabs-1

Status:

- Messaging Conversation remains a Storybook reference, not the canonical production thread implementation.
- Tabs are a strong source for motion/interaction language.

---

## 5.4 Efferd / Shaban Haider - auth and account surfaces

**Use for:** auth shell and account settings composition.

Sources:

- Auth Page: https://21st.dev/@sshahaider/components/auth-page
- Account Settings: https://21st.dev/@sshahaider/components/account-settings
- Minimal auth reference: search within https://21st.dev/community/components/s/authentication

Why selected:

- polished split-screen auth composition
- strong responsive account-management patterns
- compatible aesthetic with the Shigo Midnight direction after token normalization

Auth must be one system shared by login/register/recovery rather than separate unrelated pages.

---

## 5.5 ReUI - sheets, avatar presence, structural product primitives

**Use for:** preferences sheet, mobile sheet fallback, avatar indicators, and structural patterns.

Sources:

- Scrollable Sheet: https://21st.dev/community/components/reui/sheet/scrollable
- Side Sheet reference: https://21st.dev/community/components/sean0205/sheet/side
- Avatar Indicator: https://21st.dev/community/components/reui/avatar/indicator
- Avatar family: https://21st.dev/community/components/reui/avatar

Why selected:

- product-focused primitives
- shadcn/Radix architecture
- appropriate for dense settings surfaces
- good presence/avatar extensions

---

## 5.6 Origin UI - utility interaction primitives

**Use for:** slider, popover, dropdown, alert dialog, and other serious application primitives.

Sources:

- Origin UI library: https://21st.dev/@originui
- Slider: https://21st.dev/community/components/originui/slider
- Alert Dialog: https://21st.dev/community/components/originui/alert-dialog
- Dropdown Menu: https://21st.dev/community/components/originui/dropdown-menu/default
- Dropdown with icons: https://21st.dev/community/components/originui/dropdown-menu/menu-with-icons
- Rich dropdown: https://21st.dev/community/components/originui/dropdown-menu/rich-menu
- Popover: https://21st.dev/community/components/originui/popover

Why selected:

- broad, serious product UI coverage
- usually close to shadcn/Radix conventions
- good source for behavior that should remain conventional and precise

---

## 5.7 Ruixen - audio/media surfaces

**Use for:** ambient audio visual treatment and future voice notes.

Sources:

- Waveform Player: https://21st.dev/@ruixen.ui/components/waveform-player
- Voice Message Bubble: https://21st.dev/community/components/ruixenui/voice-message-bubble/default
- Audio catalog: https://21st.dev/community/components/explore/audio-player-ui

Why selected:

- stronger specialized audio UI than generic media controls
- waveform treatment fits Shigo's ambient identity
- can be adapted to existing MusicContext rather than introducing separate state

---

## 5.8 micka_design - buttons

**Use for:** canonical button interaction language.

Source:

- Button: https://21st.dev/community/components/micka_design/button

Status:

- already integrated
- preserve backward-compatible variants
- recolor through Shigo semantic tokens rather than author-specific palette

---

## 5.9 21st Agent Elements - message attachments

**Use for:** composer attachment chips, image previews, and removable message attachments.

Sources:

- Image-only File Attachment: https://21st.dev/community/components/21st.dev/file-attachment/image-only
- Removable File Attachment: https://21st.dev/@21st/components/file-attachment/removable
- Agent Elements docs: https://agent-elements.21st.dev/docs/file-attachment

Adaptation requirement:

- source uses Tabler icons
- convert to Lucide
- remove AI-specific naming/assumptions
- preserve file/image preview behavior

---

## 5.10 Liveblocks - emoji picker

**Use for:** composer emoji selection.

Source:

- Emoji Picker: https://21st.dev/community/components/liveblocks/emoji-picker/default

Status:

- selected
- keep visually compact
- mount from composer popover

---

## 5.11 shadcn - conventional state primitives

**Use for:** skeletons and simple theme-toggle interaction where the stock behavior is already correct.

Sources:

- Theme Toggle: https://21st.dev/community/components/shadcn/toggle/theme-toggle
- Skeleton catalog: https://21st.dev/community/components/shadcn/skeleton

Do not replace stable primitives merely to maximize the number of 21st components used.

---

## 5.12 Serafim - empty states

**Use for:** conversation-empty, search-empty, media-empty, and settings-empty composition inspiration.

Source:

- Empty State: https://21st.dev/@serafimcloud/components/empty-state

Final Shigo empty state should be much quieter than a marketing illustration.

---

## 5.13 21st Shader Builder - bespoke visual identity

**Use for:** splash and auth visual pane only.

Source:

- Shader Builder introduction: https://21st.dev/blog/introducing-shader-builder

Target Shigo shader:

```text
pattern: low-frequency flowing noise / soft metaball feel
background: near-black navy
primary fluid: subdued violet
secondary fluid: cold indigo
accent: extremely faint teal
speed: slow
blur: medium-high
grain: subtle
vignette: pronounced
cursor reaction: low strength
```

Do not put this shader behind the live message thread or settings text.

---

## 5.14 Rafael Porto - future command palette

**Use only after** Shigo gains enough destinations/actions to justify global search.

Source:

- Command Palette: https://21st.dev/@rafa-porto/components/command-palette/command-palette

Status: **future, not current redesign MVP**.

---

# 6. Canonical Component Manifest

| Product need | Primary source | Status | Shigo action |
|---|---|---|---|
| Desktop app shell | Arun Dass Dashboard Sidebar | SELECTED | Adapt architecture |
| Mobile navigation | ReUI side Sheet | SELECTED | Use left-side responsive sheet |
| Auth shell | Efferd Auth Page | SELECTED | Rebuild into shared Shigo auth shell |
| Login form | Shigo auth form | SELECTED | Wire existing login behavior into new shell |
| Register form | Shigo auth form | SELECTED | Same shell as login |
| Password recovery | Shigo auth form | SELECTED | Same shell/state family |
| Message primitive | Jakob Chat Bubble | SELECTED | Adapt to Shigo message model |
| Conversation reference | Hexta Messaging Conversation | REFERENCE | Keep Storybook reference only |
| Composer | Jakob Chat Input | SELECTED | Adapt existing send/autosize logic |
| File attachment | 21st Agent Elements FileAttachment | SELECTED | Convert icons to Lucide |
| Emoji picker | Liveblocks Emoji Picker | SELECTED | Composer popover |
| Avatar/presence | ReUI Avatar Indicator | SELECTED | Extend current avatar primitive |
| Preferences container | ReUI Scrollable Sheet | SELECTED | Right-side settings workspace |
| Settings tabs | Hexta Tabs | SELECTED | Normalize to Shigo tokens |
| Volume sliders | Origin Slider | SELECTED | Ambient settings |
| Profile menu | Origin Dropdown | SELECTED | Adapt existing Radix menu if possible |
| Theme toggle | shadcn Toggle pattern | SELECTED | Wire existing ThemeContext |
| Message action popover | Origin Popover | SELECTED | Mobile/context actions |
| Destructive confirmation | Origin Alert Dialog | SELECTED | Account/settings destructive actions |
| Empty states | Serafim Empty State | SELECTED | Strip to quiet Shigo composition |
| Loading states | shadcn Skeleton | SELECTED | Message/settings skeletons |
| Ambient audio | Ruixen Waveform Player | SELECTED | Wire existing MusicContext |
| Voice message | Ruixen Voice Message Bubble | FUTURE | Not redesign MVP |
| Primary Button | micka_design Button | KEEP | Already integrated |
| Splash/auth atmosphere | 21st Shader Builder | SELECTED | Bespoke Shigo shader |
| Magnetic Cursor | Existing integrated cursor | LIMITED | Splash/auth/brand only |
| Command palette | Rafael Porto | FUTURE | Add only with real search/actions |
| Fluid Menu | existing experiment | REJECT PROD | Storybook novelty only |
| Pricing/marketing blocks | current experiments | OUT OF SCOPE | Do not drive product redesign |

---

# 7. Canonical Production Component Targets

Future implementation should converge on focused product components similar to the following. Exact file splits can be adjusted if implementation evidence suggests a better boundary, but avoid one giant all-purpose file.

## Shell/navigation

```text
client/src/components/ui/app-sidebar.tsx
client/src/components/ui/mobile-nav-sheet.tsx
client/src/components/ui/profile-menu.tsx
client/src/components/ui/presence-avatar.tsx
```

## Messaging

```text
client/src/components/ui/message-thread.tsx
client/src/components/ui/message-bubble.tsx
client/src/components/ui/message-actions.tsx
client/src/components/ui/message-composer.tsx
client/src/components/ui/file-attachment.tsx
client/src/components/ui/emoji-picker.tsx
client/src/components/ui/empty-conversation.tsx
client/src/components/ui/conversation-skeleton.tsx
```

## Settings/account

```text
client/src/components/ui/preferences-sheet.tsx
client/src/components/ui/settings-tabs.tsx
client/src/components/ui/account-settings.tsx
client/src/components/ui/appearance-settings.tsx
client/src/components/ui/ambient-settings.tsx
client/src/components/ui/security-settings.tsx
client/src/components/ui/theme-toggle.tsx
```

## Media

```text
client/src/components/ui/ambient-player.tsx
client/src/components/ui/ambient-player-compact.tsx
```

## Auth/experience

```text
client/src/components/ui/auth-shell.tsx
client/src/components/ui/auth-form.tsx
client/src/components/ui/shigo-shader.tsx
client/src/components/ui/shigo-splash.tsx
```

## Generic primitives likely still needed

```text
client/src/components/ui/textarea.tsx
client/src/components/ui/tooltip.tsx
client/src/components/ui/popover.tsx
client/src/components/ui/sheet.tsx
client/src/components/ui/tabs.tsx
client/src/components/ui/slider.tsx
client/src/components/ui/alert-dialog.tsx
client/src/components/ui/skeleton.tsx
client/src/components/ui/toggle.tsx
```

Do not create duplicates if a compatible shared primitive already exists.

---

# 8. Old-to-New Production Mapping

## `client/src/pages/Chatroom.jsx`

Preserve:

- socket connection lifecycle
- message fetching
- message send/edit/delete behavior
- authenticated user context
- room semantics
- existing API calls

Replace visual composition with:

```text
AppSidebar
MobileNavSheet
MessageThread
MessageComposer
PreferencesSheet
AmbientPlayerCompact
ProfileMenu
```

## `client/src/components/MessageBubble.jsx`

Preserve:

- sender resolution
- own/other state
- timestamps
- edit/delete behavior
- edited indicator
- message content handling

Replace presentation with final `message-bubble.tsx` based on Jakob-style primitives.

## `client/src/components/MessageInput.jsx`

Preserve:

- autosizing textarea
- Enter to send
- Shift+Enter newline
- disabled state
- trim/empty protection
- send callback

Replace presentation with `message-composer.tsx`.

## `client/src/components/MusicPlayer.jsx`

Preserve:

- current playback state
- existing MusicContext integration
- track selection/state
- volume behavior

Replace presentation with Ruixen-inspired compact/full ambient player components.

## `client/src/components/Preferences.jsx`

Preserve:

- existing account/preferences API wiring
- theme context
- music settings
- password/account actions

Replace composition with `PreferencesSheet` + settings tabs.

## `client/src/pages/Login.jsx` and `Register.jsx`

Preserve:

- auth requests
- validation behavior
- navigation
- error handling

Replace presentation with one shared `AuthShell` and state-specific `AuthForm`.

## `client/src/pages/SplashScreen.jsx`

Preserve:

- route/progress behavior
- application entry semantics

Replace visual treatment with Shigo shader + restrained brand motion.

---

# 9. Message UX Specification

The final conversation should feel editorial and calm rather than bubble-heavy.

### Required message information

- avatar/presence for other users where appropriate
- sender name
- timestamp
- content
- edited state
- own-message distinction
- edit/delete actions
- future reaction/attachment slots

### Visual direction

- subtle surfaces rather than saturated speech balloons
- own message may receive faint violet treatment
- other message remains neutral
- no giant gradient bubble backgrounds
- hover actions appear without shifting message layout
- mobile actions move into a popover/context control

### Density target

Messages should visually fit more naturally into a desktop conversation than the current card-like bubbles.

---

# 10. Composer UX Specification

Required behavior:

- textarea autosizes up to a sensible maximum
- Enter sends
- Shift+Enter adds newline
- send control becomes active only when valid text/attachment state exists
- attachment button slot
- emoji picker slot
- attachment preview row
- editing/reply state can appear above composer later
- disabled/offline state supported

Target visual:

```text
┌────────────────────────────────────────────────────────────┐
│ [attachment preview chips when present]                    │
│                                                            │
│ +   Message Quiet Room...                          ☺   ↑   │
└────────────────────────────────────────────────────────────┘
```

The composer is one elevated surface, not a stack of nested cards.

---

# 11. Sidebar UX Specification

Expanded desktop target:

```text
SHIGOCHAT
A quieter place to connect

SPACE
# Quiet Room
  4 online

AMBIENT
[ compact player ]

────────────────

YG  Yoshi
    online

[theme] [preferences] [logout]
```

Collapsed target:

```text
S

#
♫

YG
```

Rules:

- roughly 240-270px expanded
- roughly 56-68px collapsed
- do not overload with fake dashboard sections
- preserve a clear app/content boundary
- mobile uses a proper sheet/drawer rather than squeezing desktop navigation

---

# 12. Preferences UX Specification

Open from the right as a product workspace.

Target sections:

```text
Account
Appearance
Ambient
Security
```

Potential future section:

```text
Notifications
```

Requirements:

- scrollable content body
- persistent title/close affordance
- tabs remain accessible on narrow widths
- destructive account actions visually separated from normal settings
- settings use existing contexts/API behavior, not duplicate state

---

# 13. Auth UX Specification

Login, register, and recovery must share one shell.

Desktop:

```text
┌───────────────────────────────────┬────────────────────────┐
│                                   │                        │
│        living Shigo shader        │      SHIGOCHAT         │
│                                   │                        │
│ A quieter place to connect.       │  Welcome back.         │
│                                   │                        │
│ subtle brand / ambient motion     │  Email                 │
│                                   │  Password              │
│                                   │                        │
│                                   │  [ Continue ]          │
│                                   │                        │
└───────────────────────────────────┴────────────────────────┘
```

Mobile:

- collapse to one form-focused column
- retain only a restrained shader/brand accent
- no huge decorative panel stealing vertical space

Do not keep Smokey Login and Sign Up Block as two unrelated final experiences.

---

# 14. Ambient Audio UX Specification

Sidebar compact player:

```text
AMBIENT

Rainfall
Quiet Mix

▶  ━━━━━●━━━━
```

Preferences full player:

```text
Rainfall
Quiet Mix

▂▃▅▆▄▂▇▅▄▂▁▃▆▅▂▁▃
─────────●─────────

◀      ▶/❚❚      ▶▶

Volume
━━━━━━━━●━━━━━━
```

Rules:

- use existing MusicContext as source of truth
- do not create separate playback state in sidebar and preferences
- waveform animation must not consume unnecessary CPU while hidden
- reduced-motion mode should simplify animation

---

# 15. Empty, Loading, Error, and Presence States

A redesign is incomplete without states.

## Conversation empty

```text
        ◌

It's quiet in here.

Say something when you're ready.
```

No giant CTA unless the action is truly necessary.

## Conversation loading

Use subtle skeleton rows with avatar/message geometry.

## Message send failure

Required later:

- visible non-destructive error state
- retry affordance
- do not silently remove failed message

## Presence

Conventional semantics:

```text
online  emerald
away    amber
offline neutral gray
```

Do not use violet as presence status.

---

# 16. Storybook Canonical Inventory

Before production replacement, Storybook should expose the following design-system coverage.

## Foundations

```text
Foundations/Theme
Foundations/Typography
Foundations/Colors
Foundations/Spacing
Foundations/Radius
Foundations/Shadows
Foundations/Icons
```

## Primitives

```text
Components/Avatar
Components/Presence Avatar
Components/Button
Components/Input
Components/Textarea
Components/Checkbox
Components/Label
Components/Tooltip
Components/Popover
Components/Dropdown Menu
Components/Tabs
Components/Slider
Components/Sheet
Components/Dialog
Components/Alert Dialog
Components/Skeleton
Components/Toggle
```

## Messaging

```text
Messaging/Message/Other
Messaging/Message/Own
Messaging/Message/Edited
Messaging/Message/Actions
Messaging/Message/Edit Mode
Messaging/Message/Attachment
Messaging/Conversation/Default
Messaging/Conversation/Empty
Messaging/Conversation/Loading
Messaging/Composer/Default
Messaging/Composer/With Attachment
Messaging/Composer/Disabled
Messaging/Emoji Picker
```

## Navigation

```text
Navigation/App Sidebar/Expanded
Navigation/App Sidebar/Collapsed
Navigation/Mobile Nav
Navigation/Profile Menu
```

## Settings

```text
Settings/Preferences Shell
Settings/Account
Settings/Appearance
Settings/Ambient
Settings/Security
```

## Media

```text
Media/Ambient Player/Compact
Media/Ambient Player/Full
```

## Auth

```text
Auth/Login
Auth/Register
Auth/Forgot Password
Auth/Mobile
```

## Experience

```text
Experience/Splash
Experience/Auth Shader
Experience/Magnetic Cursor
```

## Full compositions

```text
Compositions/Quiet Room/Desktop
Compositions/Quiet Room/Desktop Sidebar Collapsed
Compositions/Quiet Room/Mobile
Compositions/Quiet Room/Empty
Compositions/Quiet Room/Loading
Compositions/Quiet Room/Preferences Open
```

The full compositions are the gate before wiring the new design into production pages.

---

# 17. Storybook Presentation Rules

1. Ordinary components use `centered` or `padded` Storybook layouts.
2. Only true immersive experiences use `fullscreen`.
3. Do not put `min-h-screen` around every component demo.
4. Storybook stories must use realistic product dimensions.
5. Do not hide component sizing defects with oversized wrappers.
6. Include dark variants for major Shigo surfaces.
7. Include mobile/narrow variants for shell, auth, composer, and settings.
8. Components must not leak horizontal scroll into the Storybook iframe.
9. Focus states must be visually contained and intentional.
10. Full-page demos own the iframe with an explicit immersive layout rather than accidental document sizing.

---

# 18. 21st.dev Adaptation Rules

Every copied component must be treated as source material, not sacred code.

## Required adaptations

### Imports

Convert:

```tsx
@/components/ui/...
@/lib/utils
```

to CRA-safe imports:

```tsx
components/ui/...
lib/utils
```

### Next.js

Do not install Next.js for:

```tsx
next/link
next/image
next-themes
```

Adapt to:

- React Router or regular anchors as appropriate
- standard image handling
- existing ThemeContext

### Tailwind 4

Do not copy:

```css
@import "tailwindcss";
@theme { ... }
```

Translate required tokens/utilities into Tailwind 3.4 config or `index.css`.

### Motion

Prefer existing `framer-motion` when the source can be safely translated from `motion/react`.

Install another animation package only when it provides behavior that cannot be reasonably preserved with the existing stack.

### Icons

Convert Tabler/Heroicon/etc. usage to Lucide unless technically inappropriate.

### Shared primitives

Do not overwrite shared Button/Card/Input/etc. blindly.

Merge useful source APIs backward-compatibly.

### Demo sizing

Remove copied `h-screen`, `min-h-screen`, giant `w-screen`, or arbitrary huge presentation wrappers unless the component is truly a page/immersive experience.

---

# 19. Dependency Policy

Install dependencies only when the selected component lands.

Likely future Radix dependencies may include:

```text
@radix-ui/react-dialog
@radix-ui/react-popover
@radix-ui/react-alert-dialog
@radix-ui/react-slider
@radix-ui/react-tabs
@radix-ui/react-tooltip
@radix-ui/react-toggle
```

Do not preinstall all of them just because this manifest lists future components.

Other likely source-specific dependencies must be evaluated at integration time.

Rules:

- reuse existing Lucide
- reuse existing Framer Motion where safe
- do not add full frameworks
- regenerate `package-lock.json` after dependency changes
- never hand-edit lockfile dependency trees

---

# 20. Explicit Rejections and Anti-Patterns

Do not use the following as final product direction unless the product requirements change.

## Rejected patterns

- AI model selectors in human chat
- AI reasoning/thinking blocks
- giant gradient AI composer borders
- floating dock as main navigation
- Fluid Menu as main navigation
- excessive glassmorphism
- shader behind message content
- magnetic cursor over message text/composer/settings
- 3D cards for routine application UI
- constant animated backgrounds
- neon cyberpunk palette
- different icon family per imported component
- full Next.js templates
- full 21st templates replacing working application architecture
- Tailwind 4 migration as a side effect of a component import
- separate light/dark visual identities
- nested card frames without purpose
- full-screen demo wrappers for normal components
- marketing/pricing components inside the core chat product without a real product requirement

## Existing experiment verdicts

| Existing experiment | Production verdict |
|---|---|
| Button | KEEP |
| Messaging Conversation | REFERENCE / PARTIAL REUSE |
| Smokey Login | STORYBOOK EXPERIMENT |
| Sign Up Block | STORYBOOK EXPERIMENT |
| Fluid Menu | STORYBOOK ONLY |
| Magnetic Cursor | SPLASH/AUTH ONLY |
| useScreenSize | KEEP |
| Pricing/Feature marketing blocks | OUT OF CORE PRODUCT SCOPE |

---

# 21. Implementation Order

The order matters. Do not jump directly into replacing `Chatroom.jsx` with half-finished components.

## Phase 0 - foundations

- finalize semantic Shigo Midnight token values in `index.css`
- normalize typography
- normalize radius/shadow/motion rules
- create Storybook foundation stories

**Gate:** light/dark foundations reviewed visually.

## Phase 1 - primitives

Add/normalize:

- Tooltip
- Textarea
- Popover
- Sheet
- Tabs
- Slider
- Alert Dialog
- Skeleton
- Toggle
- Presence Avatar

**Gate:** TypeScript + CRA build + Storybook build pass; desktop and mobile component QA.

## Phase 2 - shell/navigation

Build:

- App Sidebar
- collapsed sidebar
- Mobile Nav Sheet
- Profile Menu

**Gate:** static shell composition looks coherent at desktop and mobile sizes.

## Phase 3 - messaging system

Build:

- message primitives
- message actions
- message edit state
- message thread
- composer
- attachments
- emoji picker
- empty/loading states

**Gate:** complete static Quiet Room conversation in Storybook, including own/other/edit/empty/loading/disabled states.

## Phase 4 - settings and ambient media

Build:

- Preferences Sheet
- settings tabs
- account settings
- appearance settings
- ambient settings
- security settings
- compact/full ambient player

**Gate:** Preferences-open composition in Storybook.

## Phase 5 - auth

Build one shared auth system:

- Auth Shell
- Login
- Register
- Forgot Password
- mobile auth

**Gate:** all auth states visibly belong to the same system.

## Phase 6 - splash/brand experience

Build:

- Shigo Shader
- Shigo Splash
- limited Magnetic Cursor integration

**Gate:** reduced-motion mode and normal mode both work.

## Phase 7 - production wiring

Replace presentation in production surfaces one boundary at a time while preserving behavior.

Recommended order:

1. MessageBubble
2. MessageInput
3. Chatroom shell
4. Preferences
5. MusicPlayer
6. Login/Register
7. SplashScreen

Do not rewrite backend/API logic during this phase.

## Phase 8 - final QA/polish

- accessibility
- keyboard navigation
- reduced motion
- touch
- responsive layouts
- scroll traps
- clipping/overlap
- error/loading/empty states
- performance
- production build
- Storybook build

---

# 22. Verification Contract

Every meaningful integration must run:

```bash
cd client
npm install          # only when dependencies changed
npx tsc --noEmit
npm run build
npm run build-storybook
```

Interactive QA:

```bash
npm run storybook
```

Minimum viewport checks for layout-bearing components:

```text
Desktop: approximately 1440 x 900
Mobile: approximately 390 x 844
```

For each visual component check:

- clipping
- unexpected overflow
- giant sizing
- off-center layout
- nested frames
- focus ring geometry
- keyboard activation
- hover state
- dark mode
- mobile width
- text wrapping
- reduced motion when relevant

Build success alone is not visual verification.

---

# 23. Production Acceptance Criteria

The frontend replacement is not complete until all of the following are true.

## Visual coherence

- [ ] one recognizable Shigo visual language across every screen
- [ ] dark and light modes share structure and hierarchy
- [ ] Lucide is the standard icon family
- [ ] no random source-library colors remain
- [ ] no obvious copied-component stylistic collisions

## Messaging

- [ ] own/other messages
- [ ] timestamps
- [ ] sender identity
- [ ] edit
- [ ] delete
- [ ] edited state
- [ ] composer autosize
- [ ] Enter/Shift+Enter behavior
- [ ] disabled state
- [ ] empty state
- [ ] loading state
- [ ] mobile actions

## Shell

- [ ] expanded desktop sidebar
- [ ] collapsed desktop sidebar
- [ ] mobile navigation
- [ ] profile menu
- [ ] preferences entry
- [ ] ambient player entry

## Settings

- [ ] account
- [ ] appearance
- [ ] ambient
- [ ] security
- [ ] destructive confirmations

## Auth

- [ ] login
- [ ] register
- [ ] recovery
- [ ] mobile
- [ ] shared shell

## Quality

- [ ] keyboard usable
- [ ] reduced motion usable
- [ ] no horizontal scroll leaks
- [ ] no Storybook sizing pathologies
- [ ] no uncleaned animation/event lifecycle
- [ ] TypeScript passes
- [ ] CRA production build passes
- [ ] Storybook build passes

---

# 24. Source Index

Primary research sources used for this manifest:

1. 21st.dev home/catalog: https://21st.dev/
2. Community themes: https://21st.dev/community/themes
3. Dashboard Sidebar - Arun Dass: https://21st.dev/@arunjdass/components/dashboard-sidebar
4. Auth Page - Efferd/Shaban Haider: https://21st.dev/@sshahaider/components/auth-page
5. Account Settings - Shaban Haider: https://21st.dev/@sshahaider/components/account-settings
6. Chat Bubble - Jakob Hoeg: https://21st.dev/@jakobhoeg/components/chat-bubble
7. Chat Input - Jakob Hoeg: https://21st.dev/community/components/jakobhoeg/chat-input/default
8. Messaging Conversation - Hexta: https://21st.dev/community/components/preetsuthar17/messaging-conversation
9. Hexta Tabs: https://21st.dev/community/components/preetsuthar17/tabs
10. ReUI Scrollable Sheet: https://21st.dev/community/components/reui/sheet/scrollable
11. ReUI Avatar Indicator: https://21st.dev/community/components/reui/avatar/indicator
12. Origin Slider: https://21st.dev/community/components/originui/slider
13. Origin Alert Dialog: https://21st.dev/community/components/originui/alert-dialog
14. Origin Dropdown Menu: https://21st.dev/community/components/originui/dropdown-menu/default
15. Liveblocks Emoji Picker: https://21st.dev/community/components/liveblocks/emoji-picker/default
16. 21st File Attachment: https://21st.dev/community/components/21st.dev/file-attachment/image-only
17. 21st removable File Attachment: https://21st.dev/@21st/components/file-attachment/removable
18. Agent Elements FileAttachment docs: https://agent-elements.21st.dev/docs/file-attachment
19. Ruixen Waveform Player: https://21st.dev/@ruixen.ui/components/waveform-player
20. Ruixen Voice Message Bubble: https://21st.dev/community/components/ruixenui/voice-message-bubble/default
21. micka_design Button: https://21st.dev/community/components/micka_design/button
22. shadcn Theme Toggle: https://21st.dev/community/components/shadcn/toggle/theme-toggle
23. Serafim Empty State: https://21st.dev/@serafimcloud/components/empty-state
24. Shader Builder: https://21st.dev/blog/introducing-shader-builder
25. Rafael Porto Command Palette: https://21st.dev/@rafa-porto/components/command-palette/command-palette
26. Chat component catalog: https://21st.dev/community/components/explore/chat-components
27. Audio component catalog: https://21st.dev/community/components/explore/audio-player-ui
28. Origin UI library: https://21st.dev/@originui

---

# 25. Agent Directive

Before integrating a new frontend component on `storybook-typescript-baseline`:

1. Read `AGENTS.md`.
2. Read this manifest.
3. Check whether the required product need already has a **SELECTED** source here.
4. Prefer the selected source over a new random 21st component.
5. If proposing a replacement source, explain why it materially improves the selected choice before changing direction.
6. Integrate into Storybook first.
7. Do not wire into production until the relevant Storybook composition gate is satisfied.
8. Preserve existing application behavior while replacing presentation.

This document is the frontend redesign source of truth until explicitly superseded by the user.
