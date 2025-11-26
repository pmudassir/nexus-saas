"use client";

import { Shell } from "@/components/layout/Shell";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  Users,
  CheckSquare,
  TrendingUp,
  Activity,
  Clock,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
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
          <p className="text-[#9B9A97]">Welcome back to Nexus. Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Revenue" 
            value="$45,231.89" 
            trend="+20.1%" 
            trendUp={true}
            icon={DollarSign}
          />
          <StatCard 
            title="Active Projects" 
            value="12" 
            trend="+2" 
            trendUp={true}
            icon={CheckSquare}
          />
          <StatCard 
            title="Total Clients" 
            value="24" 
            trend="+4" 
            trendUp={true}
            icon={Users}
          />
          <StatCard 
            title="Task Completion" 
            value="84%" 
            trend="+12%" 
            trendUp={true}
            icon={Activity}
          />
        </div>

        {/* Bento Grid Section */}
        <BentoGrid className="max-w-full mx-0">
          <BentoGridItem
            title="Project Management"
            description="Manage your projects with our premium Kanban board."
            header={
              <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-md bg-[#F7F7F5] border border-[#E9E9E8] flex items-center justify-center">
                 <div className="h-20 w-3/4 bg-white rounded-sm shadow-sm border border-[#E9E9E8]" />
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
                    className="flex items-center justify-between text-sm text-[#37352f] border-b border-[#E9E9E8] last:border-0 pb-2 last:pb-0"
                  >
                    <span>{item.action}</span>
                    <span className="text-xs text-[#9B9A97]">{item.time}</span>
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
              <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-md bg-[#F7F7F5] border border-[#E9E9E8] relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-indigo-500/5 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 h-12 bg-white rounded-sm shadow-sm border border-[#E9E9E8]" />
              </div>
            }
            icon={<DollarSign className="h-4 w-4 text-[#9B9A97]" />}
            className="md:col-span-1"
          />
          <BentoGridItem
            title="Team Collaboration"
            description="Collaborate with your team in real-time."
            header={
              <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-md bg-[#F7F7F5] border border-[#E9E9E8] flex items-center justify-center gap-2">
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

function StatCard({ title, value, trend, trendUp, icon: Icon }: any) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="p-1.5 rounded-sm bg-[rgba(235,236,252,1)] text-indigo-600">
          <Icon className="h-4 w-4" />
        </div>
        <button className="text-[#9B9A97] hover:text-[#37352f]">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div>
        <p className="text-sm font-medium text-[#9B9A97]">{title}</p>
        <h3 className="text-2xl font-bold text-[#37352f] mt-1">{value}</h3>
      </div>
      <div className="mt-2 flex items-center text-xs font-medium">
        <span className={cn("flex items-center", trendUp ? "text-emerald-600" : "text-rose-600")}>
          <TrendingUp className="mr-1 h-3 w-3" />
          {trend}
        </span>
        <span className="text-[#9B9A97] ml-2">from last month</span>
      </div>
    </Card>
  );
}
