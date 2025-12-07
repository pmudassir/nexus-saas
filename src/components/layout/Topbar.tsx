"use client";

import { Bell, Menu, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

export function Topbar() {
  const pathname = usePathname();
  
  // Simple breadcrumb logic
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.length > 0 
    ? pathSegments.map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)) 
    : ['Dashboard'];

  return (
    <header className="sticky top-4 z-40 flex h-14 items-center gap-4 px-6 mx-6 my-4 rounded-xl glass-panel">
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg">
                <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center text-sm">
                <span className="text-foreground font-display font-medium hover:text-indigo-500 cursor-pointer transition-colors flex items-center gap-2">
                    <span className="text-xl leading-none">✨</span>
                    Nexus
                </span>
                {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                        <span className="mx-2 text-muted-foreground/50 text-xs">/</span>
                        <span className="text-foreground font-medium">{crumb}</span>
                        {index === breadcrumbs.length - 1 && (
                          <span className="ml-2 px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-wider">
                            Beta
                          </span>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center text-xs text-muted-foreground mr-4 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                <span>System Operational</span>
            </div>
            
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/5">
                <span>Share</span>
            </button>
            
            <button className="p-2 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-indigo-500 rounded-lg transition-all relative group">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-zinc-900" />
            </button>
             <button className="p-2 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground rounded-lg transition-colors">
                <MoreHorizontal className="h-5 w-5" />
            </button>
        </div>
      </div>
    </header>
  );
}
