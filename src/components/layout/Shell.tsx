import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white text-[#37352f] overflow-hidden font-sans selection:bg-[#2EAADC]/20">
      <div className="relative z-10 flex w-full h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
          <Topbar />
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="h-full w-full max-w-[1200px] mx-auto px-8 py-8 animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
