import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { ShigoAuthPage } from "components/ui/shigo-auth-page";
const meta={title:"Auth/Login",component:ShigoAuthPage,parameters:{layout:"centered"}} satisfies Meta<typeof ShigoAuthPage>;export default meta;type Story=StoryObj<typeof meta>;
export const Default:Story={args:{initialMode:"login",onSubmit:()=>undefined},decorators:[(Story)=><div className="dark bg-background p-6 text-foreground"><Story/></div>]};
export const Error:Story={args:{initialMode:"login",error:"That email and password combination was not recognized.",onSubmit:()=>undefined},decorators:[(Story)=><div className="dark bg-background p-6 text-foreground"><Story/></div>]};
