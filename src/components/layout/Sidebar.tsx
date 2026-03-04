"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/ui-store";
import type { SidebarContext } from "./SidebarProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/auth";

// Material Symbols icon map → icon name strings
const ICON_MAP: Record<string, string> = {
  Briefcase: "work",
  CheckSquare: "task_alt",
  Users: "group",
  CalendarCheck: "event_available",
  CreditCard: "payments",
  Box: "inventory_2",
  Layers: "badge",
  BarChart3: "monitoring",
  Globe: "language",
};

// Feature key to nav items mapping — same structure as before
const FEATURE_NAV_ITEMS: Record<string, { name: string; href: string; icon: string }[]> = {
  projects: [
    { name: "Projects", href: "/projects", icon: "Briefcase" },
    { name: "My Tasks", href: "/tasks", icon: "CheckSquare" },
  ],
  crm: [
    { name: "CRM", href: "/crm", icon: "Users" },
    { name: "Follow-ups", href: "/crm/today", icon: "CalendarCheck" },
  ],
  finance: [
    { name: "Finance", href: "/finance", icon: "CreditCard" },
  ],
  inventory: [
    { name: "Inventory", href: "/inventory", icon: "Box" },
  ],
  hr: [
    { name: "HR", href: "/hr", icon: "Layers" },
  ],
  analytics: [
    { name: "Analytics", href: "/analytics", icon: "BarChart3" },
  ],
};

type NavItem = {
  name: string;
  href: string;
  materialIcon: string;
};

function buildNavigation(allowedFeatures: string[]): NavItem[] {
  const items: NavItem[] = [
    { name: "Dashboard", href: "/", materialIcon: "dashboard" },
  ];

  for (const featureKey of allowedFeatures) {
    const navItems = FEATURE_NAV_ITEMS[featureKey];
    if (navItems) {
      for (const item of navItems) {
        const materialIcon = ICON_MAP[item.icon] || "widgets";
        items.push({ name: item.name, href: item.href, materialIcon });
      }
    }
  }

  return items;
}

export function Sidebar({ context }: { context: SidebarContext }) {
  const pathname = usePathname();
  const { toggleSearch } = useUIStore();

  const navigation = buildNavigation(context.allowedFeatures);

  const roleLabel = context.customRoleName
    || (context.tenantRole === "TENANT_ADMIN" ? "Admin" : "Member");

  const initials = context.userName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-zinc-900 h-full shadow-soft-lg border-r border-[#e9590c]/5 z-20">
      {/* Logo / Brand */}
      <div className="p-8 flex items-center gap-3">
        <div className="size-10 bg-[#e9590c] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#e9590c]/20">
          <span className="material-symbols-outlined">hub</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-slate-900 dark:text-white font-bold text-lg leading-tight font-display">
            {context.tenantName}
          </h1>
          <p className="text-[#e9590c] text-xs font-semibold uppercase tracking-wider">
            {roleLabel}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-2">
        <button
          onClick={toggleSearch}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-slate-400 hover:bg-[#e9590c]/5 hover:text-slate-600 dark:hover:text-slate-300 transition-all text-left"
        >
          <span className="material-symbols-outlined text-xl">search</span>
          <span className="text-sm font-medium">Search</span>
          <kbd className="ml-auto text-[10px] text-slate-400 font-sans border border-slate-200 dark:border-slate-700 rounded-md px-1.5 bg-white dark:bg-slate-800 shadow-sm">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 py-2 no-scrollbar">
        {navigation.map((item) => {
          let isActive = false;
          if (item.href === "/") {
            isActive = pathname === "/";
          } else {
            isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-full transition-all text-sm font-semibold",
                isActive
                  ? "active-nav shadow-lg shadow-[#e9590c]/20"
                  : "text-slate-500 dark:text-slate-400 hover:bg-[#e9590c]/10 hover:text-[#e9590c]"
              )}
            >
              <span className="material-symbols-outlined">{item.materialIcon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Builder link */}
        {context.allowedFeatures.includes("website_builder") && (
          <Link
            href="/builder"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-full transition-all text-sm font-semibold",
              pathname.startsWith("/builder")
                ? "active-nav shadow-lg shadow-[#e9590c]/20"
                : "text-slate-500 dark:text-slate-400 hover:bg-[#e9590c]/10 hover:text-[#e9590c]"
            )}
          >
            <span className="material-symbols-outlined">language</span>
            <span>Site Builder</span>
          </Link>
        )}

        {/* Admin & Settings */}
        {context.isSuperAdmin && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-full transition-all text-sm font-semibold",
              pathname.startsWith("/admin")
                ? "active-nav shadow-lg shadow-[#e9590c]/20"
                : "text-rose-500 dark:text-rose-400 hover:bg-rose-500/10"
            )}
          >
            <span className="material-symbols-outlined">admin_panel_settings</span>
            <span>Admin Panel</span>
          </Link>
        )}

        {(context.tenantRole === "TENANT_ADMIN"
          || context.isSuperAdmin
          || context.allowedPermissions.includes("settings.users.manage")
          || context.allowedPermissions.includes("settings.tenant.read")
          || context.allowedPermissions.includes("settings.tenant.update")) && (
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-full transition-all text-sm font-semibold",
              pathname.startsWith("/settings")
                ? "active-nav shadow-lg shadow-[#e9590c]/20"
                : "text-slate-500 dark:text-slate-400 hover:bg-[#e9590c]/10 hover:text-[#e9590c]"
            )}
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </Link>
        )}
      </nav>

      {/* Bottom section: Usage + Actions */}
      <div className="p-6">
        {/* Usage Quota */}
        <div className="bg-[#e9590c]/5 rounded-xl p-4 mb-4 border border-[#e9590c]/10">
          <p className="text-xs font-bold text-[#e9590c] uppercase mb-1">Current Usage</p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mb-2 overflow-hidden">
            <div className="bg-[#e9590c] h-full w-[75%] rounded-full" />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            75% of monthly quota used
          </p>
        </div>

        {/* Upgrade Button */}
        <button className="w-full bg-[#e9590c] text-white py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[#e9590c]/20">
          Upgrade Plan
        </button>

        {/* Support + Logout */}
        <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6 space-y-1">
          <button className="flex w-full items-center gap-3 px-4 py-2 text-slate-500 hover:text-[#e9590c] transition-colors rounded-full">
            <span className="material-symbols-outlined text-xl">help</span>
            <span className="text-sm font-medium">Support</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-500 transition-colors rounded-full outline-none">
                <span className="material-symbols-outlined text-xl">logout</span>
                <span className="text-sm font-medium">Log out</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56 mb-2">
              <DropdownMenuLabel>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#e9590c]/10 flex items-center justify-center text-[#e9590c] font-bold text-xs">
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{context.userName}</span>
                    <span className="text-xs text-slate-400">{context.userEmail}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-700">
                <span className="material-symbols-outlined mr-2 text-lg">logout</span>
                <span>Confirm Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
