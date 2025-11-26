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
    <div className="hidden md:flex flex-col w-60 h-screen sticky top-0 bg-[#F7F7F5] border-r border-[#E9E9E8] z-50 text-[#37352f]">
      {/* Header / Workspace Switcher */}
      <div className="flex flex-col px-3 py-3 gap-2">
        <div className="flex items-center justify-between px-2 py-1 rounded-sm hover:bg-[rgba(55,53,47,0.08)] transition-colors cursor-pointer group h-8">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-sm bg-indigo-600 flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-[10px]">N</span>
            </div>
            <span className="font-medium text-sm truncate">Nexus SaaS</span>
          </div>
          <ChevronsLeft className="w-4 h-4 text-[#9B9A97] opacity-0 group-hover:opacity-100 transition-all" />
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-0.5">
            <button className="w-full flex items-center gap-2 px-2 py-1 text-sm text-[#5F5E5B] hover:bg-[rgba(55,53,47,0.08)] rounded-sm transition-colors text-left h-7">
                <Search className="w-4 h-4 text-[#9B9A97]" />
                <span className="font-medium">Search</span>
                <kbd className="ml-auto text-[10px] text-[#9B9A97] font-sans border border-[#E9E9E8] rounded px-1 bg-white">⌘K</kbd>
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-1 text-sm text-[#5F5E5B] hover:bg-[rgba(55,53,47,0.08)] rounded-sm transition-colors text-left h-7">
                <Plus className="w-4 h-4 text-[#9B9A97]" />
                <span className="font-medium">New Page</span>
            </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 custom-scrollbar">
        <div>
            <div className="px-2 py-1 mb-1">
                <span className="text-[11px] font-semibold text-[#9B9A97] uppercase tracking-wider">Workspace</span>
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
                    "group flex items-center gap-2 rounded-sm px-2 py-1 text-sm font-medium transition-colors duration-100 h-7",
                    isActive
                        ? "bg-[rgba(55,53,47,0.08)] text-[#37352f]"
                        : "text-[#5F5E5B] hover:bg-[rgba(55,53,47,0.08)] hover:text-[#37352f]"
                    )}
                >
                    <item.icon
                    className={cn(
                        "h-4 w-4 transition-colors",
                        isActive ? "text-indigo-600" : "text-[#9B9A97] group-hover:text-[#5F5E5B]"
                    )}
                    />
                    <span>{item.name}</span>
                </Link>
                );
            })}
            </nav>
        </div>
        
        <div>
            <div className="px-2 py-1 mb-1">
                <span className="text-[11px] font-semibold text-[#9B9A97] uppercase tracking-wider">Tools</span>
            </div>
            <nav className="space-y-0.5">
                <Link href="/settings" className="group flex items-center gap-2 rounded-sm px-2 py-1 text-sm font-medium text-[#5F5E5B] hover:bg-[rgba(55,53,47,0.08)] hover:text-[#37352f] transition-colors duration-100 h-7">
                    <Settings className="h-4 w-4 text-[#9B9A97] group-hover:text-[#5F5E5B]" />
                    <span>Settings</span>
                </Link>
            </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-2 border-t border-[#E9E9E8]">
        <div className="flex items-center gap-2 rounded-sm p-1 hover:bg-[rgba(55,53,47,0.08)] transition-colors cursor-pointer group">
          <div className="h-6 w-6 rounded-sm bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[10px]">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-[#37352f]">Admin User</div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-[#9B9A97]" />
        </div>
      </div>
    </div>
  );
}
