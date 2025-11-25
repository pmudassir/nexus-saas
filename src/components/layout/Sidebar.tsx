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
    <div className="hidden md:flex flex-col w-64 h-screen sticky top-0 p-4">
      <div className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex h-20 items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-white to-zinc-400 flex items-center justify-center shadow-lg shadow-white/10">
              <span className="text-black font-bold text-xl">N</span>
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              Nexus
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="grid gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-white text-black shadow-lg shadow-white/10 translate-x-1"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive
                        ? "text-black"
                        : "text-zinc-400 group-hover:text-white"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 border border-white/10" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Admin User</span>
              <span className="text-xs text-zinc-500">admin@nexus.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
