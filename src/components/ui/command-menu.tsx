"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUIStore } from "@/lib/ui-store";
import { Search, Calculator, User, Settings, FileText, LayoutDashboard, Globe } from "lucide-react";

export function CommandMenu() {
  const router = useRouter();
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true); // Toggle logic handled by store or just open
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setSearchOpen]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setSearchOpen(false);
    command();
  }, [setSearchOpen]);

  return (
    <Dialog open={isSearchOpen} onOpenChange={setSearchOpen}>
      <DialogContent className="p-0 overflow-hidden bg-background border-border text-foreground shadow-2xl max-w-2xl">
        <DialogTitle className="sr-only">Command Menu</DialogTitle>
        <div className="flex items-center px-4 border-b border-white/10">
          <Search className="mr-2 h-5 w-5 shrink-0 opacity-50 text-indigo-500" />
          <input
            className="flex h-14 w-full rounded-md bg-transparent py-3 text-lg outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 font-display"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Suggestions
            </div>
            <div className="space-y-1">
                {[
                    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
                    { icon: FileText, label: "Projects", href: "/projects" },
                    { icon: User, label: "CRM", href: "/crm" },
                    { icon: Calculator, label: "Finance", href: "/finance" },
                    { icon: Settings, label: "Settings", href: "/settings" },
                ].filter(item => item.label.toLowerCase().includes(query.toLowerCase())).map((item) => (
                    <button
                        key={item.href}
                        onClick={() => runCommand(() => router.push(item.href))}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-white/10 hover:text-indigo-400 transition-colors text-left group"
                    >
                        <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </div>
            
            <div className="px-2 py-1.5 mt-2 text-xs font-semibold text-muted-foreground">
                Actions
            </div>
            <div className="space-y-1">
                 <button
                    onClick={() => runCommand(() => router.push('/projects'))}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-white/10 hover:text-indigo-400 transition-colors text-left group"
                >
                    <div className="h-4 w-4 border border-muted-foreground/30 rounded flex items-center justify-center text-[10px] group-hover:border-indigo-500/50">+</div>
                    <span className="font-medium">Create New Project</span>
                </button>
                 <button
                    onClick={() => runCommand(() => router.push('/builder'))}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-white/10 hover:text-indigo-400 transition-colors text-left group"
                >
                    <Globe className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                    <span className="font-medium">Open Site Builder</span>
                </button>
            </div>
        </div>
        <div className="py-2 px-4 border-t border-white/10 bg-white/5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Press <kbd className="font-sans bg-white/10 px-1 rounded">esc</kbd> to close</span>
            <span>Nexus Command</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
