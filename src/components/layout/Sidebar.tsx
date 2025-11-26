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
  Plus
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
    <div className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-[#F7F7F5] border-r border-slate-200/60 z-50">
      {/* Header / Workspace Switcher */}
      <div className="flex flex-col px-3 py-4 gap-2">
        <div className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-200/50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-500/20">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="font-semibold text-sm text-slate-700 group-hover:text-slate-900">Nexus SaaS</span>
          </div>
          <ChevronsLeft className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-1 px-1">
            <button className="flex-1 flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-slate-500 bg-white border border-slate-200/60 rounded-md shadow-sm hover:text-slate-700 hover:border-slate-300 transition-all text-left">
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
                <kbd className="ml-auto text-[10px] text-slate-400 font-sans">⌘K</kbd>
            </button>
            <button className="flex items-center justify-center p-1.5 text-slate-500 bg-white border border-slate-200/60 rounded-md shadow-sm hover:text-indigo-600 hover:border-indigo-200 transition-all">
                <Plus className="w-3.5 h-3.5" />
            </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 custom-scrollbar">
        <div className="px-2 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Overview</span>
        </div>
        <nav className="grid gap-0.5">
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
                  "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50"
                    : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900"
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-6 px-2 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tools</span>
        </div>
         <nav className="grid gap-0.5">
            <Link href="/settings" className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-all duration-200">
                <Settings className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                <span>Settings</span>
            </Link>
         </nav>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-slate-200/60 bg-[#F7F7F5]">
        <div className="flex items-center gap-2.5 rounded-md p-2 hover:bg-slate-200/50 transition-all cursor-pointer group">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-100 to-violet-100 border border-slate-200 flex items-center justify-center text-indigo-700 font-medium text-xs">
            AD
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-slate-700 truncate group-hover:text-slate-900">Admin User</span>
            <span className="text-[11px] text-slate-500 truncate">admin@nexus.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
