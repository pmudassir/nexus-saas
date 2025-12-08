import { Shell } from "@/components/layout/Shell";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { RevenueChart, ProjectStatusChart } from "@/components/analytics/Charts";
import {
  CheckSquare,
  Clock,
  DollarSign,
  Users,
  ArrowUpRight
} from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const stats = await getDashboardStats();

  return (
    <Shell>
      <div className="min-h-screen w-full space-y-8 pb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-display font-bold text-foreground tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome back to <span className="text-indigo-500 font-semibold">Nexus</span>. Here&apos;s your daily overview.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="gap-2">
                Export Report
             </Button>
             <Button className="gap-2 shadow-indigo-500/20">
                <ArrowUpRight className="h-4 w-4" />
                New Project
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardGrid stats={stats} />

        {/* Bento Grid Section */}
        <BentoGrid className="max-w-full mx-0">
          <BentoGridItem
            title="Revenue Overview"
            description="Monthly revenue vs expenses analysis."
            header={
              <div className="flex flex-1 w-full h-full min-h-[200px] rounded-lg bg-muted/30 items-center justify-center p-2 relative overflow-hidden">
                 <RevenueChart />
              </div>
            }
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            className="md:col-span-2"
          />
          
          <BentoGridItem
            title="Recent Activity"
            description="Latest team actions and updates."
            header={
               <div className="flex flex-1 w-full h-full min-h-[200px] p-2">
                  <RecentActivity />
               </div>
            }
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            className="md:col-span-1"
          />
          
          <BentoGridItem
            title="Project Completion"
            description="Overall progress across active projects."
            header={
              <div className="flex flex-1 w-full h-full min-h-[200px] rounded-lg bg-muted/30 items-center justify-center p-2 relative">
                <ProjectStatusChart />
              </div>
            }
            icon={<CheckSquare className="h-4 w-4 text-muted-foreground" />}
            className="md:col-span-1"
          />
          
          <BentoGridItem
            title="Team Collaboration"
            description="Real-time workspace connectivity."
            header={
              <div className="flex flex-1 w-full h-full min-h-[150px] rounded-lg bg-muted/30 items-center justify-center gap-4 relative overflow-hidden">
                  <div className="flex -space-x-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-10 w-10 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white shadow-sm transform hover:scale-105 hover:z-10 transition-all duration-200 bg-linear-to-br ${
                        [
                          'from-zinc-400 to-zinc-500',
                          'from-zinc-500 to-zinc-600',
                          'from-zinc-600 to-zinc-700',
                          'from-zinc-700 to-zinc-800',
                          'from-zinc-800 to-zinc-900'
                        ][i]
                      }`}>
                         {['JD', 'AS', 'MR', 'DK', 'PL'][i]}
                      </div>
                    ))}
                    <div className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground hover:bg-accent transition-colors cursor-pointer">
                      +4
                    </div>
                  </div>
              </div>
            }
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            className="md:col-span-2"
          />
        </BentoGrid>
      </div>
    </Shell>
  );
}
