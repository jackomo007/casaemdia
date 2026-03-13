import { AuthForm } from "@/features/auth/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fbf9ff,#f2f4fb)] px-4 py-8">
      <div className="w-full max-w-3xl">
        <AuthForm mode="register" />
      </div>
    </main>
  );
}
