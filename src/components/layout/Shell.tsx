import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white text-slate-900 overflow-hidden font-sans">
      <div className="relative z-10 flex w-full h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
          <Topbar />
          <main className="flex-1 overflow-y-auto scroll-smooth">
             {/* Removed container padding to allow full-width designs if needed, relying on page content to pad */}
            <div className="h-full w-full animate-enter">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
