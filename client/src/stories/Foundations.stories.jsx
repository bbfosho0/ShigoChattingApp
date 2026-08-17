import React from "react";

const swatches = [
  ["Canvas", "var(--sc-canvas)"],
  ["Surface", "var(--sc-surface)"],
  ["Raised", "var(--sc-surface-raised)"],
  ["Panel", "var(--sc-panel)"],
  ["Accent", "var(--sc-accent)"],
  ["Own message", "var(--sc-bubble-own)"],
  ["Incoming message", "var(--sc-bubble-other)"],
  ["Success", "var(--sc-success)"],
  ["Danger", "var(--sc-danger)"],
];

const meta = {
  title: "ShigoChat/Foundations",
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};

export default meta;

export const SemanticTokens = {
  render: () => (
    <main className="min-h-screen sc-app-bg p-8 sc-text-primary">
      <div className="mx-auto max-w-4xl space-y-10">
        <header className="max-w-xl">
          <p className="sc-room-kicker">ShigoChat / foundations</p>
          <h1 className="sc-serif mt-3 text-4xl font-medium">Quiet surfaces, clear signals.</h1>
          <p className="mt-3 max-w-lg text-sm leading-7 sc-text-secondary">
            The room uses a small semantic palette so light and moonlit-dark themes remain siblings rather than inversions.
          </p>
        </header>
        <section aria-labelledby="token-heading">
          <h2 id="token-heading" className="text-xs font-bold uppercase tracking-[0.16em] sc-text-secondary">Semantic color tokens</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {swatches.map(([name, color]) => (
              <div key={name} className="overflow-hidden rounded-xl" style={{ border: "1px solid var(--sc-border)" }}>
                <div className="h-20" style={{ background: color }} />
                <div className="p-3 sc-surface-raised">
                  <p className="text-sm font-semibold">{name}</p>
                  <span className="text-xs sc-text-secondary">{color}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl p-6 sc-panel">
            <p className="sc-room-kicker">Typography</p>
            <h2 className="sc-serif mt-3 text-3xl">Expressive identity</h2>
            <p className="mt-2 text-sm leading-6 sc-text-secondary">Disciplined sans-serif text keeps controls and conversation easy to scan.</p>
          </div>
          <div className="rounded-2xl p-6 sc-panel">
            <p className="sc-room-kicker">Accessibility</p>
            <p className="mt-3 text-sm leading-6 sc-text-secondary">Visible focus, 44px touch targets, semantic controls, live feedback, and reduced-motion behavior are part of the foundation.</p>
          </div>
        </section>
      </div>
    </main>
  ),
};
