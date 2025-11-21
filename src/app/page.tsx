import { Shell } from "@/components/layout/Shell";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";

export default function Home() {
  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back to your workspace. Here&apos;s what&apos;s happening
            today.
          </p>
        </div>
        <DashboardGrid />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="min-h-[300px] rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
            <div className="h-6 w-32 rounded bg-white/10 mb-4" />
          </div>
          <div className="min-h-[300px] rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
            <div className="h-6 w-32 rounded bg-white/10 mb-4" />
          </div>
        </div>
      </div>
    </Shell>
  );
}
