"use client";

import { usePathname } from "next/navigation";
import { useUIStore } from "@/lib/ui-store";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard Overview", subtitle: "Welcome back. Here's your performance summary." },
  "/projects": { title: "Projects", subtitle: "Manage and track your active projects." },
  "/tasks": { title: "My Tasks", subtitle: "Your personal task board and assignments." },
  "/crm": { title: "CRM", subtitle: "Manage contacts, leads, and relationships." },
  "/crm/today": { title: "Follow-ups", subtitle: "Today's follow-ups and scheduled actions." },
  "/finance": { title: "Finance", subtitle: "Financial overview, invoices, and transactions." },
  "/inventory": { title: "Inventory", subtitle: "Stock management and tracking." },
  "/hr": { title: "HR", subtitle: "Team directory and human resources." },
  "/analytics": { title: "Analytics", subtitle: "Performance insights and data analysis." },
  "/admin": { title: "Admin Panel", subtitle: "Platform administration and tenant management." },
  "/settings": { title: "Settings", subtitle: "Configure your workspace and preferences." },
};

export function Topbar() {
  const pathname = usePathname();
  const { toggleSearch } = useUIStore();

  // Find matching page title
  const pageInfo = PAGE_TITLES[pathname] || {
    title: pathname.split("/").filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" / ") || "Dashboard",
    subtitle: "",
  };

  return (
    <header className="sticky top-0 bg-[#f8f6f5]/80 dark:bg-[#1a1c20]/80 backdrop-blur-md z-10 px-6 md:px-10 py-6">
      <div className="flex justify-between items-center">
        {/* Left: Page title */}
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display">
            {pageInfo.title}
          </h2>
          {pageInfo.subtitle && (
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5">
              {pageInfo.subtitle}
            </p>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            onClick={toggleSearch}
            className="hidden lg:flex items-center gap-2 bg-white dark:bg-zinc-800 border-none rounded-full text-sm w-56 shadow-sm px-4 py-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">search</span>
            <span className="font-medium text-xs">Search data...</span>
            <kbd className="ml-auto text-[10px] text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1 bg-slate-50 dark:bg-slate-800">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <button className="p-2.5 text-slate-500 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 rounded-full transition-all relative shadow-sm border border-slate-100 dark:border-zinc-700">
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#e9590c] ring-2 ring-white dark:ring-zinc-800" />
          </button>

          {/* Feedback */}
          <a
            href="mailto:support@nexus-saas.com"
            className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#e9590c] hover:bg-[#e9590c]/90 rounded-full transition-all shadow-lg shadow-[#e9590c]/20 hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span>Feedback</span>
          </a>
        </div>
      </div>
    </header>
  );
}
