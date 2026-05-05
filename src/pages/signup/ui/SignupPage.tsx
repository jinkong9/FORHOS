import { SignupForm } from "@/features/auth/ui/SignupForm";

export function SignupPage() {
  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <SignupForm />
    </section>
  );
}
