"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/actions/auth";
import { Button } from "@/components/ui/button";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full mt-4" aria-disabled={pending} disabled={pending}>
      {pending ? "Logging in..." : "Log in"}
    </Button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[100px]" />

      <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-linear-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20 mb-4">
            N
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              id="email"
              type="email"
              name="email"
              placeholder="admin@nexus.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-lg">
              {errorMessage}
            </div>
          )}

          <LoginButton />
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Don&apos;t have an account? Contact your administrator.</p>
        </div>
      </div>
    </div>
  );
}
