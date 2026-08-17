import { expect, fn } from "storybook/test";
import MessageConversation, { DEMO_MESSAGES, DEMO_OTHER } from "../components/ui/messaging-conversation";

const meta = { title: "ShigoChat/21st candidates/Messaging conversation", component: MessageConversation, parameters: { layout: "fullscreen" } };
export default meta;
const frame = "min-h-screen w-full bg-background p-4 text-foreground sm:p-8";

export const Default = { render: () => <div className={frame}><MessageConversation onAction={fn()} /></div>, play: async ({ canvas }) => { await expect(canvas.getByRole("log", { name: "Conversation transcript" })).toBeInTheDocument(); await expect(canvas.getByText("Alice")).toBeInTheDocument(); } };
export const Empty = { render: () => <div className={frame}><MessageConversation messages={[]} /></div> };
export const StatusVariants = { render: () => <div className="grid min-h-screen gap-4 bg-background p-4 text-foreground md:grid-cols-3"><MessageConversation className="h-[420px]" other={{ ...DEMO_OTHER, status: "online" }} /><MessageConversation className="h-[420px]" other={{ ...DEMO_OTHER, status: "dnd" }} /><MessageConversation className="h-[420px]" other={{ ...DEMO_OTHER, status: "offline" }} /></div> };
export const MessageActions = { render: () => <div className={frame}><MessageConversation messages={[DEMO_MESSAGES[1]]} onAction={fn()} /></div>, play: async ({ canvas, userEvent }) => { const button = canvas.getByRole("button", { name: "Message actions" }); await userEvent.click(button); await expect(button.ownerDocument.querySelector('[role="menu"]')).toBeVisible(); await userEvent.keyboard("{Escape}"); } };
export const UserActions = { render: () => <div className={frame}><MessageConversation onAction={fn()} /></div>, play: async ({ canvas, userEvent }) => { const button = canvas.getByRole("button", { name: "User actions" }); await userEvent.click(button); await expect(button.ownerDocument.querySelector('[role="menu"]')).toBeVisible(); } };
