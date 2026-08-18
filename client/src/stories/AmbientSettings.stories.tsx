import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { AmbientSettingsPanel } from "components/ui/settings-panels";
function Demo(){const [playing,setPlaying]=useState(true);const [volume,setVolume]=useState(55);return <AmbientSettingsPanel playing={playing} progress={42} volume={volume} onTogglePlay={()=>setPlaying(v=>!v)} onVolumeChange={setVolume}/>;}
const meta={title:"Settings/Ambient",component:AmbientSettingsPanel,parameters:{layout:"centered"}} satisfies Meta<typeof AmbientSettingsPanel>;export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={render:()=> <div className="w-[min(38rem,88vw)]"><Demo/></div>};
export const Dark:Story={render:()=> <div className="dark w-[min(42rem,90vw)] rounded-xl bg-background p-6 text-foreground"><Demo/></div>};
