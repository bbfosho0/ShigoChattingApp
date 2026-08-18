import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { ShigoAuthPage } from "components/ui/shigo-auth-page";
const meta={title:"Auth/Forgot Password",component:ShigoAuthPage,parameters:{layout:"centered"}} satisfies Meta<typeof ShigoAuthPage>;export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={args:{initialMode:"forgot",onSubmit:()=>undefined},decorators:[(Story)=><div className="dark bg-background p-6 text-foreground"><Story/></div>]};
