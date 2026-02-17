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
  CheckSquare,
  CalendarCheck,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useUIStore } from "@/lib/ui-store";
import type { SidebarContext } from "./SidebarProvider";
import type { LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/auth";

// Icon map for dynamic rendering
const ICON_MAP: Record<string, LucideIcon> = {
  Briefcase,
  CheckSquare,
  Users,
  CalendarCheck,
  CreditCard,
  Box,
  Layers,
  BarChart3,
  Globe,
};

// Feature key to nav items mapping
const FEATURE_NAV_ITEMS: Record<string, { name: string; href: string; icon: string }[]> = {
  projects: [
    { name: 'Projects', href: '/projects', icon: 'Briefcase' },
    { name: 'My Tasks', href: '/tasks', icon: 'CheckSquare' },
  ],
  crm: [
    { name: 'CRM', href: '/crm', icon: 'Users' },
    { name: 'Follow-ups', href: '/crm/today', icon: 'CalendarCheck' },
  ],
  finance: [
    { name: 'Finance', href: '/finance', icon: 'CreditCard' },
  ],
  inventory: [
    { name: 'Inventory', href: '/inventory', icon: 'Box' },
  ],
  hr: [
    { name: 'HR', href: '/hr', icon: 'Layers' },
  ],
  analytics: [
    { name: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  ],
};

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

function buildNavigation(allowedFeatures: string[]): NavItem[] {
  // Dashboard is always shown
  const items: NavItem[] = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  ];

  for (const featureKey of allowedFeatures) {
    const navItems = FEATURE_NAV_ITEMS[featureKey];
    if (navItems) {
      for (const item of navItems) {
        const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
        items.push({ name: item.name, href: item.href, icon: IconComponent });
      }
    }
  }

  return items;
}

export function Sidebar({ context }: { context: SidebarContext }) {
  const pathname = usePathname();
  const { toggleSearch } = useUIStore();

  const navigation = buildNavigation(context.allowedFeatures);

  // Role display label
  const roleLabel = context.customRoleName
    || (context.tenantRole === 'TENANT_ADMIN' ? 'Admin' : 'Member');

  // User initials
  const initials = context.userName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div className="hidden md:flex flex-col w-64 h-[calc(100vh-2rem)] m-4 rounded-3xl bg-white border border-transparent shadow-soft z-50 text-foreground transition-all duration-300">
      {/* Header / Workspace Switcher */}
      <div className="flex flex-col px-4 py-4 gap-4">
        <div className="flex items-center justify-between px-2 py-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group h-14 border border-transparent hover:border-gray-100/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center shadow-lg shadow-black/20">
              <span className="text-background font-display font-bold text-xl">
                {context.tenantName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-tight text-foreground truncate max-w-[120px]">
                {context.tenantName}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">{roleLabel}</span>
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
          {context.allowedFeatures.includes('website_builder') && (
            <Link href="/builder" className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-gray-50 rounded-xl transition-all text-left group">
              <Globe className="w-4 h-4 group-hover:text-foreground transition-colors" />
              <span className="font-medium">Site Builder</span>
            </Link>
          )}
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
            {context.isSuperAdmin && (
              <Link href="/admin" className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200">
                <ShieldCheck className="h-4 w-4 text-red-500" />
                <span>Admin Panel</span>
              </Link>
            )}
            {(context.tenantRole === 'TENANT_ADMIN' || context.isSuperAdmin) && (
              <Link href="/settings" className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200">
                <Settings className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                <span>Settings</span>
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 rounded-md p-2 hover:bg-accent transition-colors cursor-pointer group outline-none text-left">
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-foreground font-bold text-xs ring-1 ring-border">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate text-foreground font-display">{context.userName}</div>
                <div className="text-xs text-muted-foreground truncate">{context.userEmail}</div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right" className="w-56 mb-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
