"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f6f5] dark:bg-[#1a1c20] relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-[20%] left-[20%] w-96 h-96 rounded-full bg-rose-200/20 dark:bg-rose-900/10 blur-[100px]" />
      <div className="absolute bottom-[20%] right-[20%] w-80 h-80 rounded-full bg-[#e9590c]/5 blur-[100px]" />

      <div className="text-center max-w-md px-6 relative z-10">
        <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-rose-500">warning</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3 font-display tracking-tight">
          Something went wrong
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 mb-6 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-full inline-block">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-[#e9590c] text-white rounded-full font-bold hover:bg-[#e9590c]/90 transition-all shadow-lg shadow-[#e9590c]/20"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Try again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
