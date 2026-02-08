"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Home,
  FolderKanban,
  Users,
  FileText,
  Settings,
  ListTodo,
  Briefcase,
  BarChart3,
  Package,
  Zap,
  X,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Tasks", href: "/tasks", icon: ListTodo },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "CRM / Contacts", href: "/crm", icon: Users },
  { name: "Leads", href: "/crm/leads", icon: Briefcase },
  { name: "Invoices", href: "/finance/invoices", icon: FileText },
  { name: "Employees", href: "/hr/employees", icon: Users },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Automation", href: "/automation", icon: Zap },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-lg">
        <Command className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center border-b border-gray-100 px-4">
            <Command.Input
              placeholder="Search or jump to..."
              className="flex-1 py-4 text-base outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="px-2 py-2">
              {navigation.map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.name}
                  onSelect={() => runCommand(item.href)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium text-foreground hover:bg-gray-100 data-[selected=true]:bg-gray-100"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.name}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <div className="border-t border-gray-100 px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
            <span>
              Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">↵</kbd> to select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">esc</kbd> to close
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}
