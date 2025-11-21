import { Shell } from "@/components/layout/Shell";
import {
  RevenueChart,
  ProjectStatusChart,
} from "@/components/analytics/Charts";
import { Widget } from "@/components/dashboard/Widget";
import { TrendingUp, Users, Activity, BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <Shell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Deep dive into your business performance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Widget
            title="Conversion Rate"
            description="+2.4% from last month"
            icon={<TrendingUp className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">12.5%</div>
          </Widget>
          <Widget
            title="Active Users"
            description="+120 new users"
            icon={<Users className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">1,234</div>
          </Widget>
          <Widget
            title="Avg. Session"
            description="-10s from last month"
            icon={<Activity className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">4m 32s</div>
          </Widget>
          <Widget
            title="Bounce Rate"
            description="-5% improvement"
            icon={<BarChart3 className="h-5 w-5" />}
          >
            <div className="text-2xl font-bold">42%</div>
          </Widget>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
            <h3 className="font-semibold mb-6">Revenue vs Expenses</h3>
            <RevenueChart />
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-md">
            <h3 className="font-semibold mb-6">Project Distribution</h3>
            <ProjectStatusChart />
          </div>
        </div>
      </div>
    </Shell>
  );
}
