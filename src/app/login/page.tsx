
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "@/actions/auth";
import { Button } from "@/components/ui/button";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      className="w-full mt-6 rounded-full bg-[#e9590c] hover:bg-[#e9590c]/90 text-white font-bold h-14 shadow-lg shadow-[#e9590c]/25 transition-all text-base"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          Signing in...
        </span>
      ) : (
        "Sign In"
      )}
    </Button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div className="flex min-h-screen bg-[#f8f6f5] dark:bg-[#1a1c20] relative overflow-hidden">
      {/* Left Panel — Coral gradient branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e9590c] via-[#f07030] to-[#e9590c]" />

        {/* Decorative circles */}
        <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-white/10 blur-xl" />
        <div className="absolute bottom-[15%] right-[15%] w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute top-[60%] left-[40%] w-32 h-32 rounded-full border border-white/20" />

        {/* Branding content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-2xl">hub</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Nexus SaaS</h1>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Enterprise Platform</p>
            </div>
          </div>

          {/* Hero Text */}
          <div className="max-w-md">
            <h2 className="text-4xl font-black tracking-tight leading-tight">
              Unify your
              <br />
              business operations
            </h2>
            <p className="mt-4 text-white/80 text-lg font-medium leading-relaxed">
              Projects, CRM, Finance, HR, and Inventory — all in one powerful, connected platform.
            </p>

            {/* Feature highlights */}
            <div className="mt-8 space-y-3">
              {["Multi-tenant architecture", "Role-based access control", "Real-time analytics"].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-white/90 text-lg">check_circle</span>
                  <span className="text-white/90 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-white/50 text-xs">© 2025 Nexus SaaS. All rights reserved.</p>
        </div>
      </div>

      {/* Right Panel — Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo (hidden on desktop) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="size-12 bg-[#e9590c] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#e9590c]/20">
              <span className="material-symbols-outlined text-2xl">hub</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white font-display">Nexus SaaS</h1>
              <p className="text-[#e9590c] text-xs font-semibold uppercase tracking-wider">Enterprise</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-[#24272d] rounded-3xl p-10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-800">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                Welcome back
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                Sign in to access your workspace
              </p>
            </div>

            <form action={dispatch} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <span className="material-symbols-outlined text-xl">mail</span>
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#e9590c]/20 transition-all placeholder:text-slate-400"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="admin@nexus.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <span className="material-symbols-outlined text-xl">lock</span>
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none text-sm font-medium text-slate-900 dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-[#e9590c]/20 transition-all placeholder:text-slate-400"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm font-bold bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-800 animate-in fade-in slide-in-from-top-1 duration-200">
                  <span className="material-symbols-outlined text-lg">error</span>
                  {errorMessage}
                </div>
              )}

              <LoginButton />
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">or continue with</span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-bold text-slate-600 dark:text-slate-300">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-bold text-slate-600 dark:text-slate-300">
                <span className="material-symbols-outlined text-lg">domain</span>
                Microsoft
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-bold text-slate-600 dark:text-slate-300">
                <span className="material-symbols-outlined text-lg">key</span>
                SSO
              </button>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <span className="text-[#e9590c] font-bold cursor-pointer hover:underline">Contact Support</span>
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-slate-600 cursor-pointer">Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
