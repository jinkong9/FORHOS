import { LoginForm } from "@/features/auth/ui/LoginForm";

export function LoginPage() {
  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <LoginForm />
    </section>
  );
}
