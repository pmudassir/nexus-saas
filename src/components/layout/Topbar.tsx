"use client";

import { Bell, Search, Menu, HelpCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export function Topbar() {
  const pathname = usePathname();
  
  // Simple breadcrumb logic
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.length > 0 
    ? pathSegments.map(segment => segment.charAt(0).toUpperCase() + segment.slice(1)) 
    : ['Dashboard'];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 px-6 bg-white border-b border-slate-200/60">
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <button className="md:hidden text-slate-500 hover:text-slate-700 transition-colors">
                <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center text-sm text-slate-500">
                <span className="hover:text-slate-900 cursor-pointer transition-colors">Nexus</span>
                <span className="mx-2 text-slate-300">/</span>
                <span className="font-medium text-slate-900">{breadcrumbs[breadcrumbs.length - 1]}</span>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center text-sm text-slate-400 mr-4">
                <span className="mr-2">Last updated now</span>
            </div>
            
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-all">
                <span>Share</span>
            </button>
            
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-all">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
             <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-all">
                <HelpCircle className="h-4 w-4" />
            </button>
        </div>
      </div>
    </header>
  );
}
