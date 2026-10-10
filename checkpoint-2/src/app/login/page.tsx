import type { Metadata } from "next";

import LoginForm from "@/app/login/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to see your RevoShop orders.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-16">
      <LoginForm />
    </main>
  );
}
