import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { SecuritySettingsPanel } from "components/ui/settings-panels";
const meta={title:"Settings/Security",component:SecuritySettingsPanel,parameters:{layout:"centered"}} satisfies Meta<typeof SecuritySettingsPanel>;export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={render:()=> <div className="w-[min(38rem,88vw)]"><SecuritySettingsPanel onUpdatePassword={()=>undefined} onDeleteAccount={()=>undefined}/></div>};
export const Dark:Story={render:()=> <div className="dark w-[min(42rem,90vw)] rounded-xl bg-background p-6 text-foreground"><SecuritySettingsPanel onUpdatePassword={()=>undefined} onDeleteAccount={()=>undefined}/></div>};
