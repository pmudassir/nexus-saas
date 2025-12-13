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
      <DialogContent className="p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-white/50 text-foreground shadow-soft-2xl max-w-2xl rounded-4xl">
        <DialogTitle className="sr-only">Command Menu</DialogTitle>
        <div className="flex items-center px-6 border-b border-gray-100/50">
          <Search className="mr-3 h-6 w-6 shrink-0 text-gray-400" />
          <input
            className="flex h-20 w-full rounded-md bg-transparent py-3 text-2xl outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-50 font-display font-bold text-foreground"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="max-h-[350px] overflow-y-auto p-4">
            <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
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
                        className="w-full flex items-center gap-3 px-4 py-3 text-base rounded-2xl hover:bg-gray-50 hover:text-foreground transition-all text-left group border border-transparent hover:border-gray-100"
                    >
                        <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                        <span className="font-medium text-muted-foreground group-hover:text-foreground">{item.label}</span>
                    </button>
                ))}
            </div>
            
            <div className="px-3 py-2 mt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Actions
            </div>
            <div className="space-y-1">
                 <button
                    onClick={() => runCommand(() => router.push('/projects'))}
                    className="w-full flex items-center gap-3 px-4 py-3 text-base rounded-2xl hover:bg-gray-50 hover:text-foreground transition-all text-left group border border-transparent hover:border-gray-100"
                >
                    <div className="h-5 w-5 border border-muted-foreground/30 rounded-full flex items-center justify-center text-[10px] group-hover:border-orange-600 group-hover:text-orange-600">+</div>
                    <span className="font-medium text-muted-foreground group-hover:text-foreground">Create New Project</span>
                </button>
                 <button
                    onClick={() => runCommand(() => router.push('/builder'))}
                    className="w-full flex items-center gap-3 px-4 py-3 text-base rounded-2xl hover:bg-gray-50 hover:text-foreground transition-all text-left group border border-transparent hover:border-gray-100"
                >
                    <Globe className="h-5 w-5 text-muted-foreground group-hover:text-orange-600 transition-colors" />
                    <span className="font-medium text-muted-foreground group-hover:text-foreground">Open Site Builder</span>
                </button>
            </div>
        </div>
        <div className="py-3 px-6 border-t border-gray-100/50 bg-gray-50/50 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <span>Press <kbd className="font-sans bg-white border border-gray-200 px-1.5 py-0.5 rounded-md text-foreground shadow-sm">esc</kbd> to close</span>
            <span>Nexus Command</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
