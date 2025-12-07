import { Shell } from "@/components/layout/Shell";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  CheckSquare,
  Clock,
  DollarSign,
  Users,
} from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard";

export default async function Home() {
  const stats = await getDashboardStats();

  const recentActivity = [
    { id: 1, action: "New project created", time: "2h ago", type: "project" },
    { id: 2, action: "Invoice #1234 paid", time: "4h ago", type: "finance" },
    { id: 3, action: "Meeting scheduled", time: "6h ago", type: "calendar" },
  ];

  return (
    <Shell>
      <div className="min-h-screen w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-[#37352f] tracking-tight">Dashboard</h1>
          <p className="text-[#9B9A97]">Welcome back to Nexus. Here&apos;s what&apos;s happening today.</p>
        </div>

        {/* Stats Grid */}
        <DashboardGrid stats={stats} />

        {/* Bento Grid Section */}
        <BentoGrid className="max-w-full mx-0">
          <BentoGridItem
            title="Project Management"
            description="Manage your projects with our premium Kanban board."
            header={
              <div className="flex flex-1 w-full h-full min-h-24 rounded-md bg-muted border border-border items-center justify-center">
                 <div className="h-20 w-3/4 bg-card rounded-sm shadow-sm border border-border" />
              </div>
            }
            icon={<CheckSquare className="h-4 w-4 text-[#9B9A97]" />}
            className="md:col-span-2"
          />
          <BentoGridItem
            title="Recent Activity"
            description={
              <div className="flex flex-col gap-3 mt-2">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm text-foreground border-b border-border last:border-0 pb-2 last:pb-0"
                  >
                    <span>{item.action}</span>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
            }
            header={
               <div className="h-2 w-full" /> 
            }
            icon={<Clock className="h-4 w-4 text-[#9B9A97]" />}
            className="md:col-span-1"
          />
          <BentoGridItem
            title="Financial Overview"
            description="Track your income and expenses with ease."
            header={
              <div className="flex flex-1 w-full h-full min-h-24 rounded-md bg-muted border border-border relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-indigo-500/5 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 h-12 bg-card rounded-sm shadow-sm border border-border" />
              </div>
            }
            icon={<DollarSign className="h-4 w-4 text-[#9B9A97]" />}
            className="md:col-span-1"
          />
          <BentoGridItem
            title="Team Collaboration"
            description="Collaborate with your team in real-time."
            header={
              <div className="flex flex-1 w-full h-full min-h-24 rounded-md bg-muted border border-border items-center justify-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200" />
                  <div className="h-8 w-8 rounded-full bg-purple-100 border border-purple-200 -ml-4" />
                  <div className="h-8 w-8 rounded-full bg-pink-100 border border-pink-200 -ml-4" />
              </div>
            }
            icon={<Users className="h-4 w-4 text-[#9B9A97]" />}
            className="md:col-span-2"
          />
        </BentoGrid>
      </div>
    </Shell>
  );
}
