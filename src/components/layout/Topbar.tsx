"use client";

import { Bell, Search, Menu } from "lucide-react";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 px-8 bg-transparent">
      <div className="flex-1 flex items-center gap-4 rounded-2xl glass-panel px-4 py-2 shadow-lg shadow-black/20">
        <button className="md:hidden text-slate-400 hover:text-white transition-colors">
          <Menu className="h-6 w-6" />
        </button>
        <div className="w-full flex-1">
          <form>
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-xl bg-white/5 border border-transparent focus:border-indigo-500/50 pl-10 pr-4 py-2 text-sm text-white outline-none focus:bg-white/10 transition-all placeholder:text-slate-500"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center gap-3 border-l border-white/10 pl-3">
          <button className="relative rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all hover:scale-105 active:scale-95">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-950 animate-pulse" />
          </button>
        </div>
      </div>
    </header>
  );
}
