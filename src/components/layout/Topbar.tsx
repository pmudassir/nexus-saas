"use client";

import { Bell, Menu } from "lucide-react";

export function Topbar() {

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 px-6 border-b border-border bg-background/50 backdrop-blur-sm">
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-accent rounded-sm">
                <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center text-sm">
                <span className="text-foreground font-display font-medium hover:text-primary cursor-pointer transition-colors flex items-center gap-2">
                    N
                </span>
                <span className="mx-2 text-muted-foreground/30 text-xs">/</span>
                <span className="text-foreground font-medium">Dashboard</span>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <a href="mailto:support@nexus-saas.com" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent rounded-md transition-colors border border-border">
                <span>Feedback</span>
            </a>
            <button className="p-2 text-muted-foreground hover:bg-accent hover:text-foreground rounded-md transition-all relative group">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-2 ring-background" />
            </button>
        </div>
      </div>
    </header>
  );
}
