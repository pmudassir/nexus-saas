"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CreditCard,
  Settings,
  BarChart3,
  Layers,
  Box,
  ChevronsLeft,
  Search,
  Plus,
  MoreHorizontal
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "CRM", href: "/crm", icon: Users },
  { name: "Finance", href: "/finance", icon: CreditCard },
  { name: "Inventory", href: "/inventory", icon: Box },
  { name: "HR", href: "/hr", icon: Layers },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col w-64 h-[calc(100vh-2rem)] m-4 sticky top-4 rounded-2xl glass-panel border border-white/20 dark:border-white/10 z-50 text-foreground transition-all duration-300">
      {/* Header / Workspace Switcher */}
      <div className="flex flex-col px-4 py-4 gap-4">
        <div className="flex items-center justify-between px-2 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group h-12 border border-transparent hover:border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-display font-bold text-lg">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-sm tracking-tight">Nexus SaaS</span>
              <span className="text-[10px] text-muted-foreground">Premium Plan</span>
            </div>
          </div>
          <ChevronsLeft className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-1">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left group">
                <Search className="w-4 h-4 group-hover:text-indigo-500 transition-colors" />
                <span className="font-medium">Search</span>
                <kbd className="ml-auto text-[10px] text-muted-foreground font-sans border border-border rounded px-1.5 bg-background/50">⌘K</kbd>
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left group">
                <Plus className="w-4 h-4 group-hover:text-indigo-500 transition-colors" />
                <span className="font-medium">New Page</span>
            </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 custom-scrollbar">
        <div>
            <div className="px-3 mb-2">
                <span className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest font-display">Workspace</span>
            </div>
            <nav className="space-y-1">
            {navigation.map((item) => {
                let isActive = false;
                if (item.href === '/') {
                isActive = pathname === '/';
                } else {
                isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                }
                
                return (
                <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-500/20"
                        : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground hover:translate-x-0.5"
                    )}
                >
                    <item.icon
                    className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground group-hover:text-foreground"
                    )}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                    )}
                </Link>
                );
            })}
            </nav>
        </div>
        
        <div>
            <div className="px-3 mb-2">
                <span className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest font-display">Tools</span>
            </div>
            <nav className="space-y-1">
                <Link href="/settings" className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-all duration-200 hover:translate-x-0.5">
                    <Settings className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    <span>Settings</span>
                </Link>
            </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/20">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate text-foreground font-display">Admin User</div>
            <div className="text-xs text-muted-foreground truncate">admin@nexus.com</div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </div>
  );
}
