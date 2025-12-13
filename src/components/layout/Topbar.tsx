"use client";

import { Bell, Menu } from "lucide-react";

export function Topbar() {

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 px-6 bg-transparent">
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-white/50 rounded-xl">
                <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center text-sm">
                <span className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center font-display font-bold text-xs hover:scale-110 transition-transform cursor-pointer shadow-md">
                    N
                </span>
                <span className="mx-3 text-muted-foreground/30 text-xl font-light">/</span>
                <span className="text-foreground font-bold font-display tracking-tight">Dashboard</span>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <a href="mailto:support@nexus-saas.com" className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-foreground bg-white hover:bg-gray-50 rounded-full transition-all border border-gray-100 shadow-soft hover:shadow-soft-lg">
                <span>Feedback</span>
            </a>
            <button className="p-2.5 text-muted-foreground bg-white hover:bg-gray-50 hover:text-foreground rounded-full transition-all relative group border border-transparent hover:border-gray-100 shadow-sm hover:shadow-soft">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
            </button>
        </div>
      </div>
    </header>
  );
}
