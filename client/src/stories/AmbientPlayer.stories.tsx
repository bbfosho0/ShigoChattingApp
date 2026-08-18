import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { AmbientPlayer } from "components/ui/ambient-player";

function InteractivePlayer({ compact = false }: { compact?: boolean }) {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(42);
  const [volume, setVolume] = useState(55);
  return (
    <AmbientPlayer
      compact={compact}
      playing={playing}
      progress={progress}
      volume={volume}
      onTogglePlay={() => setPlaying((value) => !value)}
      onSeek={setProgress}
      onVolumeChange={setVolume}
      className={compact ? "w-64" : "w-[min(32rem,82vw)]"}
    />
  );
}

const meta = {
  title: "Media/Ambient Player",
  component: AmbientPlayer,
  parameters: { layout: "centered" },
} satisfies Meta<typeof AmbientPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Compact: Story = { render: () => <InteractivePlayer compact /> };
export const Full: Story = { render: () => <InteractivePlayer /> };
export const Dark: Story = { render: () => <div className="dark rounded-xl bg-background p-8 text-foreground"><InteractivePlayer /></div> };
