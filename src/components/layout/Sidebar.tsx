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
  MoreHorizontal,
  Globe,
  CheckSquare
} from "lucide-react";
import { useUIStore } from "@/lib/ui-store";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "My Tasks", href: "/tasks", icon: CheckSquare },
  { name: "CRM", href: "/crm", icon: Users },
  { name: "Finance", href: "/finance", icon: CreditCard },
  { name: "Inventory", href: "/inventory", icon: Box },
  { name: "HR", href: "/hr", icon: Layers },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { toggleSearch } = useUIStore();

  return (
    <div className="hidden md:flex flex-col w-64 h-[calc(100vh-2rem)] m-4 rounded-3xl bg-white border border-transparent shadow-soft z-50 text-foreground transition-all duration-300">
      {/* Header / Workspace Switcher */}
      <div className="flex flex-col px-4 py-4 gap-4">
        <div className="flex items-center justify-between px-2 py-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group h-14 border border-transparent hover:border-gray-100/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center shadow-lg shadow-black/20">
              <span className="text-background font-display font-bold text-xl">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-tight text-foreground">Nexus SaaS</span>
              <span className="text-[10px] font-medium text-muted-foreground">Premium Plan</span>
            </div>
          </div>
          <ChevronsLeft className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-1">
            <button 
              onClick={toggleSearch}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 rounded-xl transition-all text-left group"
            >
                <Search className="w-4 h-4 group-hover:text-foreground transition-colors" />
                <span className="font-medium">Search</span>
                <kbd className="ml-auto text-[10px] text-muted-foreground font-sans border border-gray-200 rounded-md px-1.5 bg-white shadow-sm">⌘K</kbd>
            </button>
            <Link href="/builder" className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 rounded-xl transition-all text-left group">
                <Globe className="w-4 h-4 group-hover:text-foreground transition-colors" />
                <span className="font-medium">Site Builder</span>
            </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        <div>
            <div className="px-3 mb-2">
                <span className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest font-display">Workspace</span>
            </div>
            <nav className="space-y-0.5">
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
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                        ? "bg-accent text-foreground font-semibold"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                >
                    <item.icon
                    className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                    />
                    <span>{item.name}</span>
                </Link>
                );
            })}
            </nav>
        </div>
        
        <div>
            <div className="px-3 mb-2">
                <span className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest font-display">Tools</span>
            </div>
            <nav className="space-y-0.5">
                <Link href="/settings" className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200">
                    <Settings className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    <span>Settings</span>
                </Link>
            </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 rounded-md p-2 hover:bg-accent transition-colors cursor-pointer group">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-foreground font-bold text-xs ring-1 ring-border">
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
