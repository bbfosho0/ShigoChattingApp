# 21st candidate 12402

- Name: Agent Chat — Basic
- Source: 21st.dev demo 12402; preview: https://cdn.21st.dev/21st.dev/agent-chat/default/preview.1777455058428.png
- Decision: staged for comparison; no runtime installation.
- Dependencies: none; original source also uses clsx/tailwind-merge patterns.
- Compatibility: React is portable, but generic agent roles, utility styling, and registry install instructions require ShigoChat adaptation.
- Accessibility: native textarea/buttons are present; hover-only removal controls require keyboard/focus improvement before adoption.
- Responsive: auto-resizing textarea and flexible chips are useful; max-width and utility styling must be tokenized.
- Adaptation boundary: preserve ShigoChat REST, Socket.IO, message states, and existing theme tokens.

