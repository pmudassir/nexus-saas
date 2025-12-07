import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-indigo-500/30 relative">
      {/* Cosmic Background Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 dark:bg-violet-500/20 blur-[120px] animate-float [animation-delay:2s]" />
      </div>

      <div className="relative z-10 flex w-full h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-transparent">
          <Topbar />
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="h-full w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8 animate-enter">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
