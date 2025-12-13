import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { PageTransition } from "./PageTransition";
import { CommandMenu } from "@/components/ui/command-menu";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-foreground overflow-hidden font-sans selection:bg-orange-500/30 relative">
      <CommandMenu />
      <div className="relative z-10 flex w-full h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="h-full w-full max-w-[1600px] mx-auto px-4 md:px-8 py-6 scroll-p-6">
              <PageTransition>
                {children}
              </PageTransition>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
