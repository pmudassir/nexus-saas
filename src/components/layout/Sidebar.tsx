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
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "CRM", href: "/crm", icon: Users },
  { name: "Finance", href: "/finance", icon: CreditCard },
  { name: "Inventory", href: "/inventory", icon: Box },
  { name: "HR", href: "/hr", icon: Layers },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col w-72 h-screen sticky top-0 p-4 z-50">
      <div className="flex-1 flex flex-col rounded-3xl glass-panel shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header */}
        <div className="flex h-24 items-center px-8 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-500 group-hover:scale-105">
              <div className="absolute inset-0 rounded-2xl bg-white/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-white font-bold text-2xl relative z-10">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                Nexus
              </span>
              <span className="text-xs text-slate-400 font-medium tracking-wide">ENTERPRISE</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-8 px-4 space-y-1 custom-scrollbar">
          <nav className="grid gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 overflow-hidden",
                    isActive
                      ? "text-white shadow-lg shadow-indigo-500/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-xl" />
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                  )}
                  
                  <item.icon
                    className={cn(
                      "relative z-10 h-5 w-5 transition-all duration-300",
                      isActive
                        ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]"
                        : "text-slate-500 group-hover:text-indigo-300 group-hover:scale-110"
                    )}
                  />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3 rounded-2xl p-3 hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/5">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 animate-pulse opacity-50" />
              <div className="relative h-10 w-10 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center overflow-hidden">
                <span className="text-xs font-bold text-white">AD</span>
              </div>
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">Admin User</span>
              <span className="text-xs text-slate-500 truncate">admin@nexus.com</span>
            </div>
            <Settings className="w-4 h-4 text-slate-500 ml-auto opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
