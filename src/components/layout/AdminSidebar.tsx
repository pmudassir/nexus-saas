'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Building2,
  DollarSign,
  CreditCard,
  ToggleRight,
  Shield,
  LogOut,
  ChevronsLeft,
} from 'lucide-react';

const adminNavigation = [
  { name: 'Tenants', href: '/admin', icon: Building2 },
  { name: 'Plans', href: '/admin/plans', icon: CreditCard },
  { name: 'Features', href: '/admin/features', icon: ToggleRight },
  { name: 'Billing', href: '/admin/billing', icon: DollarSign },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col w-64 h-[calc(100vh-2rem)] m-4 rounded-3xl bg-white border border-transparent shadow-soft z-50 text-foreground transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col px-4 py-4 gap-4">
        <div className="flex items-center justify-between px-2 py-2 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group h-14 border border-transparent hover:border-gray-100/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-tight text-foreground">Nexus Admin</span>
              <span className="text-[10px] font-medium text-red-600">Super Admin</span>
            </div>
          </div>
          <ChevronsLeft className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        <div>
          <div className="px-3 mb-2">
            <span className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest font-display">Platform</span>
          </div>
          <nav className="space-y-0.5">
            {adminNavigation.map((item) => {
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-red-50 text-red-700 font-semibold'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive ? 'text-red-600' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md p-2 hover:bg-accent transition-colors cursor-pointer group text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4" />
          <span>Back to App</span>
        </Link>
      </div>
    </div>
  );
}
