import { LoginForm, SmokeyBackground } from "components/ui/login-form";

export default function LoginFormDemo() {
  return (
    <main className="relative h-screen w-screen bg-gray-900">
      <SmokeyBackground className="absolute inset-0" />
      <div className="relative z-10 flex h-full w-full items-center justify-center p-4">
        <LoginForm />
      </div>
    </main>
  );
}
