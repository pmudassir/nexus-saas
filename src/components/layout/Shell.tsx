import { SidebarProvider } from './SidebarProvider';
import { Topbar } from './Topbar';
import { PageTransition } from './PageTransition';
import { CommandMenu } from '@/components/ui/command-menu';

interface ShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function Shell({ children, sidebar }: ShellProps) {
  return (
    <div className="flex min-h-screen bg-[#f8f6f5] dark:bg-[#1a1c20] text-foreground overflow-hidden font-sans selection:bg-[#e9590c]/30 relative">
      <CommandMenu />
      <div className="relative z-10 flex w-full h-screen overflow-hidden">
        {sidebar === undefined ? <SidebarProvider /> : sidebar}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="h-full w-full max-w-[1600px] mx-auto px-4 md:px-10 py-2 scroll-p-6">
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
