const Baseline = () => (
  <div className="min-h-40 rounded-lg border border-slate-200 bg-white p-6 text-slate-900">
    <h2 className="text-xl font-semibold">JSX Storybook baseline</h2>
    <p className="mt-2 text-sm text-slate-600">
      Existing JSX stories continue to render alongside TypeScript stories.
    </p>
  </div>
);

const meta = {
  title: "Internal/Baseline/JSX",
  component: Baseline,
};

export default meta;

export const Default = {};
