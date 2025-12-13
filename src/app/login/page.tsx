
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/actions/auth";
import { Button } from "@/components/ui/button";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      className="w-full mt-6 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-12 shadow-lg shadow-orange-500/20 transition-all" 
      aria-disabled={pending} 
      disabled={pending}
    >
      {pending ? "Logging in..." : "Log in"}
    </Button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa] relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-orange-200/20 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-200/20 blur-[120px]" />

      <div className="w-full max-w-md p-10 rounded-4xl bg-white shadow-soft-lg relative z-10 border border-white/50">
        <div className="flex flex-col items-center mb-10">
          <div className="h-16 w-16 rounded-3xl bg-linear-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-orange-500/30 mb-6 font-display">
            N
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">Welcome back</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Enter your credentials to access your account
          </p>
        </div>

        <form action={dispatch} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full rounded-2xl bg-gray-50 border border-transparent px-4 py-3.5 text-sm font-medium text-foreground outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-200 transition-all placeholder:text-gray-400"
              id="email"
              type="email"
              name="email"
              placeholder="admin@nexus.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-muted-foreground ml-1" htmlFor="password">
              Password
            </label>
            <input
              className="w-full rounded-2xl bg-gray-50 border border-transparent px-4 py-3.5 text-sm font-medium text-foreground outline-none focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-200 transition-all placeholder:text-gray-400"
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm font-bold text-center bg-red-50 p-3 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-1 duration-200">
              {errorMessage}
            </div>
          )}

          <LoginButton />
        </form>

        <div className="mt-8 text-center text-xs font-bold text-muted-foreground">
          <p>Don&apos;t have an account? <span className="text-orange-600 cursor-pointer hover:underline">Contact Support</span></p>
        </div>
      </div>
    </div>
  );
}
