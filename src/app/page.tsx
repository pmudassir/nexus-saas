"use client";

import { Shell } from "@/components/layout/Shell";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/moving-border";
import {
  DollarSign,
  Users,
  CheckSquare,
  TrendingUp,
  Activity,
  Clock,
  ArrowRight,
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
      <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 antialiased selection:bg-indigo-500/30">
        {/* Ambient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-aurora opacity-30" />
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent)]" />
        </div>

        <div className="relative z-10 flex flex-col gap-8 p-6">
          {/* Header Section with Sparkles */}
          <div className="relative h-[20rem] w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
            <div className="w-full absolute inset-0 h-screen">
              <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#FFFFFF"
              />
            </div>
            <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white relative z-20">
              Nexus SaaS
            </h1>
            <p className="text-neutral-300 max-w-lg mx-auto my-2 text-sm text-center relative z-20">
              The ultra-premium workspace for the modern era.
            </p>
            <div className="mt-4 relative z-20">
              <Button
                borderRadius="1.75rem"
                className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SpotlightCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-white">$45,231.89</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+20.1% from last month</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <CheckSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Active Projects</p>
                  <h3 className="text-2xl font-bold text-white">12</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+2 new this week</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Total Clients</p>
                  <h3 className="text-2xl font-bold text-white">24</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+4 new clients</span>
              </div>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Task Completion</p>
                  <h3 className="text-2xl font-bold text-white">84%</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-emerald-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+12% completion rate</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Bento Grid Section */}
          <BentoGrid className="max-w-full mx-0">
            <BentoGridItem
              title="Project Management"
              description="Manage your projects with our premium Kanban board."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />
              }
              icon={<CheckSquare className="h-4 w-4 text-neutral-500" />}
              className="md:col-span-2"
            />
            <BentoGridItem
              title="Recent Activity"
              description={
                <div className="flex flex-col gap-2 mt-2">
                  {recentActivity.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs text-zinc-500"
                    >
                      <span>{item.action}</span>
                      <span>{item.time}</span>
                    </div>
                  ))}
                </div>
              }
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />
              }
              icon={<Clock className="h-4 w-4 text-neutral-500" />}
              className="md:col-span-1"
            />
            <BentoGridItem
              title="Financial Overview"
              description="Track your income and expenses with ease."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />
              }
              icon={<DollarSign className="h-4 w-4 text-neutral-500" />}
              className="md:col-span-1"
            />
            <BentoGridItem
              title="Team Collaboration"
              description="Collaborate with your team in real-time."
              header={
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />
              }
              icon={<Users className="h-4 w-4 text-neutral-500" />}
              className="md:col-span-2"
            />
          </BentoGrid>
        </div>
      </div>
    </Shell>
  );
}
