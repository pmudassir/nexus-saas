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
    <header className="sticky top-0 z-30 flex h-11 items-center gap-4 px-4 bg-background border-b border-border">
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors">
                <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center text-sm">
                <span className="text-foreground hover:underline cursor-pointer transition-colors flex items-center gap-1">
                    <span className="text-lg leading-none">📄</span>
                    Nexus
                </span>
                {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center">
                        <span className="mx-1.5 text-muted-foreground text-xs">/</span>
                        <span className="text-foreground font-medium">{crumb}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex items-center gap-1">
            <div className="hidden md:flex items-center text-xs text-muted-foreground mr-3">
                <span>Edited just now</span>
            </div>
            
            <button className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-foreground hover:bg-black/5 rounded-sm transition-colors">
                <span>Share</span>
            </button>
            
            <button className="p-1 text-muted-foreground hover:bg-black/5 hover:text-foreground rounded-sm transition-colors">
                <Bell className="h-4 w-4" />
            </button>
             <button className="p-1 text-muted-foreground hover:bg-black/5 hover:text-foreground rounded-sm transition-colors">
                <MoreHorizontal className="h-4 w-4" />
            </button>
        </div>
      </div>
    </header>
  );
}
